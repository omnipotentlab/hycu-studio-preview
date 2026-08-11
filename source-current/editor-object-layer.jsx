// ----- 슬라이드 오브젝트 편집 레이어 -----
// 실제 1920×1080 슬라이드 렌더 위에 오브젝트 선택/이동/크기조절/텍스트 편집 오버레이를 얹는다.
// 오브젝트는 렌더된 DOM에서 측정하므로, 슬라이드 디자인과 편집 대상이 항상 일치한다.

const OBJ_SPECS = [
  { sel: '.header',              label: '마스터 헤더', locked: true },
  { sel: '.logo',                label: 'HYCU 로고', locked: true },
  { sel: '.chapter-indicator',   label: '단원 표시', locked: true },
  { sel: '.addie',               label: 'ADDIE 레일', locked: true },
  { sel: '.title-block .accent', label: '액센트 바' },
  { sel: '.title-block .title',  label: '슬라이드 제목', text: true },
  { sel: '.title-block .subtitle', label: '부제목', text: true },
  { sel: '.obj-card',            label: '학습 목표 카드' },
  { sel: '.chip',                label: '키워드 칩', text: true },
  { sel: '.body-text',           label: '본문 텍스트', text: true },
  { sel: '.quote-block',         label: '인용 블록' },
  { sel: '.summary-card',        label: '요약 카드' },
  { sel: '.check-card',          label: '점검 카드' },
  { sel: '.ct-item',             label: '콘텐츠 블록' },
  { sel: '.ct-text',             label: '콘텐츠 텍스트', text: true },
  { sel: '.instructor-zone',     label: '교수자 크로마키 영역', locked: true },
  { sel: '.footer',              label: '진도 바 · 페이지', locked: true },
];

// 렌더된 슬라이드에서 편집 대상 오브젝트를 수집한다.
const collectObjects = (root) => {
  if (!root) return [];
  const out = [];
  const seen = new Map();
  OBJ_SPECS.forEach(spec => {
    root.querySelectorAll(spec.sel).forEach((el, i) => {
      const existing = seen.get(el);
      if (existing) {
        existing.text = existing.text || !!spec.text;
        existing.locked = existing.locked || !!spec.locked;
        if (spec.text) existing.label = spec.label;
        return;
      }
      const many = root.querySelectorAll(spec.sel).length > 1;
      const object = {
        id: `${spec.sel}#${i}`,
        label: many ? `${spec.label} ${i + 1}` : spec.label,
        locked: !!spec.locked,
        text: !!spec.text,
        el,
      };
      seen.set(el, object);
      out.push(object);
    });
  });
  return out;
};

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
window.EDITOR_OBJECT_BOUNDS = window.EDITOR_OBJECT_BOUNDS || {};
window.sanitizeEditorEdit = (slideNumber, id, current = {}, patch = {}) => {
  const bounds = window.EDITOR_OBJECT_BOUNDS[`${slideNumber}:${id}`];
  const next = { ...current, ...patch };
  const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  if (!bounds) {
    next.dx = clamp(number(next.dx), -1920, 1920);
    next.dy = clamp(number(next.dy), -1080, 1080);
    next.dw = clamp(number(next.dw), -1896, 1920);
    return next;
  }
  next.dx = clamp(number(next.dx), -bounds.x, 1920 - bounds.x - bounds.w);
  next.dy = clamp(number(next.dy), -bounds.y, 1080 - bounds.y - bounds.h);
  next.dw = clamp(number(next.dw), 240 - bounds.w, 1920 - bounds.x - next.dx - bounds.w);
  return next;
};

window.fitEditorElement = (root, element, edit, scale = 1) => {
  const rootBox = root.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  const fitted = { ...edit };
  if (box.left < rootBox.left) fitted.dx += (rootBox.left - box.left) / scale;
  if (box.right > rootBox.right) fitted.dx -= (box.right - rootBox.right) / scale;
  if (box.top < rootBox.top) fitted.dy += (rootBox.top - box.top) / scale;
  if (box.bottom > rootBox.bottom) fitted.dy -= (box.bottom - rootBox.bottom) / scale;
  return fitted;
};

const EditableStage = ({ slide, deck, scale, edits, setEdit, selected, setSelected }) => {
  const hostRef = React.useRef(null);
  const [objs, setObjs] = React.useState([]);
  const [boxes, setBoxes] = React.useState({});
  const dragRef = React.useRef(null);

  // 렌더 후: 편집값을 실제 엘리먼트에 적용하고 오버레이 박스를 다시 측정한다.
  React.useLayoutEffect(() => {
    const root = hostRef.current && hostRef.current.querySelector('.slide-canvas');
    if (!root) return;
    const list = collectObjects(root);
    const nextBoxes = {};
    const rootBox = root.getBoundingClientRect();
    list.forEach(o => {
      if (o.text && o.el.__originalTextSlide !== slide.n) {
        o.el.__originalText = o.el.innerText;
        o.el.__originalTextSlide = slide.n;
      }
      o.el.style.transform = '';
      o.el.style.width = '';
      if (o.text && o.el.innerText !== o.el.__originalText) o.el.innerText = o.el.__originalText;
      const baseBox = o.el.getBoundingClientRect();
      window.EDITOR_OBJECT_BOUNDS[`${slide.n}:${o.id}`] = {
        x: (baseBox.left - rootBox.left) / scale,
        y: (baseBox.top - rootBox.top) / scale,
        w: baseBox.width / scale,
        h: baseBox.height / scale,
      };
      const e = window.sanitizeEditorEdit(slide.n, o.id, {}, edits[o.id] || {});
      o.el.style.transform = (e.dx || e.dy) ? `translate(${e.dx || 0}px, ${e.dy || 0}px)` : '';
      if (e.dw || e.dh) o.el.style.width = `${o.el.offsetWidth + (e.dw || 0)}px`;
      if (o.text) {
        const text = e.text != null ? e.text : o.el.__originalText;
        if (o.el.innerText !== text) o.el.innerText = text;
      }
      const fitted = window.fitEditorElement(root, o.el, e, scale);
      if (fitted.dx !== e.dx || fitted.dy !== e.dy) {
        o.el.style.transform = `translate(${fitted.dx || 0}px, ${fitted.dy || 0}px)`;
        if (edits[o.id]) setEdit(o.id, { dx: fitted.dx, dy: fitted.dy, dw: fitted.dw });
      }
      const box = o.el.getBoundingClientRect();
      nextBoxes[o.id] = {
        x: (box.left - rootBox.left) / scale,
        y: (box.top - rootBox.top) / scale,
        w: box.width / scale,
        h: box.height / scale,
      };
    });
    setObjs(list);
    setBoxes(nextBoxes);
  }, [slide, deck, scale, edits]);

  const startDrag = (o, mode) => (ev) => {
    if (o.locked) { ev.stopPropagation(); setSelected(o.id); return; }
    ev.preventDefault();
    ev.stopPropagation();
    setSelected(o.id);
    const e0 = edits[o.id] || {};
    dragRef.current = { id: o.id, mode, sx: ev.clientX, sy: ev.clientY, dx: e0.dx || 0, dy: e0.dy || 0, dw: e0.dw || 0 };
    const move = (m) => {
      const d = dragRef.current;
      if (!d) return;
      const gx = Math.round((m.clientX - d.sx) / scale);
      const gy = Math.round((m.clientY - d.sy) / scale);
      if (d.mode === 'move') setEdit(d.id, { dx: d.dx + gx, dy: d.dy + gy });
      else setEdit(d.id, { dw: d.dw + gx });
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const editText = (o) => (ev) => {
    if (!o.text) return;
    ev.stopPropagation();
    const el = o.el;
    el.setAttribute('contenteditable', 'true');
    el.style.outline = '2px solid #00B5E2';
    el.focus();
    const done = () => {
      el.removeAttribute('contenteditable');
      el.style.outline = '';
      setEdit(o.id, { text: el.innerText });
      el.removeEventListener('blur', done);
    };
    el.addEventListener('blur', done);
  };

  const W = 1920 * scale, H = 1080 * scale;

  return (
    <div className="canvas-stage" style={{width:W,height:H,position:'relative'}} onPointerDown={() => setSelected(null)}>
      <div ref={hostRef} style={{width:W,height:H,position:'relative',overflow:'hidden'}}>
        <div style={{transform:`scale(${scale})`,transformOrigin:'top left',width:1920,height:1080}}>
          <HYCUSlide key={slide.n} slide={slide} deck={deck} applyEdits={false} />
        </div>
      </div>
      {/* 오브젝트 오버레이 */}
      <div style={{position:'absolute',inset:0}}>
        {objs.map(o => {
          const b = boxes[o.id];
          if (!b || b.w < 4 || b.h < 2) return null;
          const on = selected === o.id;
          return (
            <div key={o.id}
              data-object-id={o.id}
              className={`obj-box${on ? ' sel' : ''}${o.locked ? ' locked' : ''}`}
              onPointerDown={startDrag(o, 'move')}
              onDoubleClick={editText(o)}
              style={{left:b.x*scale,top:b.y*scale,width:b.w*scale,height:b.h*scale}}>
              {on && <span className="obj-tag" style={{background: o.locked ? '#78828F' : '#00B5E2'}}>{o.label}{o.locked ? ' · 잠김' : ''}</span>}
              {on && !o.locked && (
                <>
                  <span className="obj-handle" style={{left:-5,top:-5}}></span>
                  <span className="obj-handle" style={{right:-5,top:-5}}></span>
                  <span className="obj-handle" style={{left:-5,bottom:-5}}></span>
                  <span className="obj-handle" style={{right:-5,bottom:-5,cursor:'ew-resize'}} onPointerDown={startDrag(o, 'resize')}></span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

window.EditableStage = EditableStage;
window.collectObjects = collectObjects;
window.OBJ_LABELS = {};
window.LOCKED_OBJ_IDS = new Set();
OBJ_SPECS.forEach(s => {
  for (let i = 0; i < 12; i++) {
    const id = `${s.sel}#${i}`;
    window.OBJ_LABELS[id] = i === 0 ? s.label : `${s.label} ${i + 1}`;
    if (s.locked) window.LOCKED_OBJ_IDS.add(id);
  }
});
