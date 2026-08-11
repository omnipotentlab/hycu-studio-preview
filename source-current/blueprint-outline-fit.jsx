const BPOutlineFit = ({ format, children }) => {
  const frameRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    let frame = 0;
    let stopped = false;
    const measure = () => {
      if (stopped || !frameRef.current || !contentRef.current) return;
      const availableWidth = frameRef.current.clientWidth;
      const availableHeight = frameRef.current.clientHeight;
      const requiredWidth = Math.max(contentRef.current.scrollWidth, contentRef.current.offsetWidth);
      const requiredHeight = Math.max(contentRef.current.scrollHeight, contentRef.current.offsetHeight);
      const next = Math.min(1, availableWidth / Math.max(1, requiredWidth), availableHeight / Math.max(1, requiredHeight));
      setScale(current => Math.abs(current - next) > .001 ? next : current);
    };
    const queueMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => requestAnimationFrame(measure));
    };
    queueMeasure();
    document.fonts?.ready.then(queueMeasure);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(queueMeasure) : null;
    observer?.observe(contentRef.current);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [format, children]);
  return (
    <div ref={frameRef} className="bp-outline-fit" data-outline-format={format} data-outline-scale={scale.toFixed(3)}>
      <div ref={contentRef} className="bp-outline-fit-content" style={{transform:`scale(${scale})`}}>{children}</div>
    </div>
  );
};

const BPOutlineEditedContent = ({ slide, deck, instructorLive }) => {
  const lines = (slide.objectives || []).filter(Boolean);
  const format = slide.formatOverride || '텍스트';
  let content;
  if (format === '표') {
    content = (
      <div className="bp-table-wrap ct-item">
        <table className="bp-table">
          <thead><tr><th className="ct-text">개념</th><th className="ct-text">특징</th><th className="ct-text">적용</th></tr></thead>
          <tbody>{lines.map((line, index) => <tr key={`${line}-${index}`}><td className="ct-text">{String(index + 1).padStart(2, '0')}</td><td className="ct-text">{line}</td><td className="ct-text">학습 활동과 연결</td></tr>)}</tbody>
        </table>
      </div>
    );
  } else if (format === '차트') {
    content = <div className="bp-bars">{lines.map((line, index) => <div className="ct-item bp-bar-row" key={`${line}-${index}`}><strong className="ct-text">{line}</strong><div className="bp-bar-track"><span className={`bp-bar-fill tone-${index % 2 ? 'cobalt' : 'cyan'}`} style={{width:`${Math.max(12, 88 - index * 8)}%`}}></span></div><b>{index + 1}</b></div>)}</div>;
  } else if (format === '순서도') {
    content = <div className="bp-outline-flow">{lines.map((line, index) => <div className="bp-outline-flow-step" key={`${line}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong className="ct-text">{line}</strong>{index < lines.length - 1 && <i aria-hidden="true">↓</i>}</div>)}</div>;
  } else if (format === '다이어그램') {
    content = <div className="bp-outline-network"><div className="ct-item bp-outline-network-hub"><span>CORE</span><strong className="ct-text">{slide.title}</strong></div><div className="bp-outline-network-items">{lines.map((line, index) => <BPNode key={`${line}-${index}`} index={index + 1} title={line} tone={index % 2 ? 'cobalt' : 'cyan'} />)}</div></div>;
  } else if (format === '도식') {
    content = <div className="bp-outline-schema">{lines.map((line, index) => <div className={`ct-item bp-outline-schema-row tone-${index % 2 ? 'cobalt' : 'cyan'}`} key={`${line}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong className="ct-text">{line}</strong><em>{index === 0 ? 'INPUT' : index === lines.length - 1 ? 'OUTCOME' : 'STRUCTURE'}</em></div>)}</div>;
  } else if (format === '칸반보드') {
    const columns = [0, 1, 2].map(column => lines.filter((_, index) => index % 3 === column));
    content = <div className="bp-kanban">{columns.map((items, index) => <div className={`ct-item bp-kanban-column tone-${index === 1 ? 'cobalt' : 'cyan'}`} key={index}><span>{String(index + 1).padStart(2, '0')}</span><strong className="ct-text">{['핵심', '검토', '적용'][index]}</strong>{items.map((line, itemIndex) => <p className="ct-text" key={`${line}-${itemIndex}`}>{line}</p>)}</div>)}</div>;
  } else if (format === '퀴즈 카드') {
    content = <BPQuiz question={lines[0] || slide.title} options={(lines.slice(1).length ? lines.slice(1) : ['핵심 개념을 확인합니다.']).map(line => line)} answers={[]} />;
  } else if (format === '이미지') {
    content = <div className="bp-outline-illustration"><div className="ct-item bp-outline-illustration-stage" role="img" aria-label={`${slide.title} 개념 일러스트레이션`}><div className="bp-outline-orbit orbit-one"></div><div className="bp-outline-orbit orbit-two"></div><div className="bp-outline-illustration-core"><span>NATIVE</span><strong className="ct-text">{slide.title}</strong></div></div><div className="bp-outline-illustration-legend">{lines.map((line,index)=><div className="ct-item" key={`${line}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><strong className="ct-text">{line}</strong></div>)}</div></div>;
  } else if (format === '없음') {
    content = <div className="ct-item" style={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',gap:18,borderLeft:'10px solid var(--bp-cyan)',paddingLeft:44}}>{lines.map((line,index)=><strong className="ct-text" style={{fontSize:28,lineHeight:1.35}} key={`${line}-${index}`}>{line}</strong>)}</div>;
  } else {
    content = <div className="bp-outline-text-list">{lines.map((line, index) => <div className={`ct-item tone-${index % 2 ? 'cobalt' : 'cyan'}`} key={`${line}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong className="ct-text">{line}</strong></div>)}</div>;
  }
  return <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note={`AI 아웃라인 반영 · ${format}`}><BPOutlineFit format={format}>{content}</BPOutlineFit></BPShell>;
};

const BPContentForSlide = ({ slide, deck, instructorLive }) => {
  if (slide.outlineEdited) return <BPOutlineEditedContent slide={slide} deck={deck} instructorLive={instructorLive} />;
  switch (slide.n) {
    case 1: return <BPCover slide={slide} deck={deck} />;
    case 2: return <BPDiagnostic slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 3: return <BPObjectives slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 4: return <BPRoadmap slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 5: return <BPConcept slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 6: return <BPLevels slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 7: return <BPLikert slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 8: return <BPComparison slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
      return <BPMidContent slide={slide} deck={deck} instructorLive={instructorLive} />;
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
      return <BPEndContent slide={slide} deck={deck} instructorLive={instructorLive} />;
    default:
      return <BPShell slide={slide} deck={deck} instructorLive={instructorLive}><BPPanel title={slide.title}>{slide.subtitle}</BPPanel></BPShell>;
  }
};

const BPBlueprintSlide = ({ slide, deck, instructorLive = false, applyEdits = true }) => {
  const rootRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!applyEdits || !rootRef.current) return;
    const originals = [];
    const applied = [];
    Object.entries(slide.editorEdits || {}).forEach(([id, edit]) => {
      const split = id.lastIndexOf('#');
      const selector = id.slice(0, split);
      const index = Number(id.slice(split + 1));
      const element = rootRef.current.querySelectorAll(selector)[index];
      if (!element) return;
      originals.push({
        element,
        transform: element.style.transform,
        width: element.style.width,
        restoreText: edit.text != null,
        text: edit.text != null ? element.innerText : null,
      });
      const rootBox = rootRef.current.getBoundingClientRect();
      const elementBox = element.getBoundingClientRect();
      const renderScale = rootBox.width / 1920 || 1;
      if (window.EDITOR_OBJECT_BOUNDS) window.EDITOR_OBJECT_BOUNDS[`${slide.n}:${id}`] = {
        x: (elementBox.left - rootBox.left) / renderScale,
        y: (elementBox.top - rootBox.top) / renderScale,
        w: elementBox.width / renderScale,
        h: elementBox.height / renderScale,
      };
      const safeEdit = window.sanitizeEditorEdit ? window.sanitizeEditorEdit(slide.n, id, {}, edit) : edit;
      element.style.transform = safeEdit.dx || safeEdit.dy ? `translate(${safeEdit.dx || 0}px, ${safeEdit.dy || 0}px)` : '';
      element.style.width = '';
      if (safeEdit.dw) element.style.width = `${element.offsetWidth + safeEdit.dw}px`;
      if (safeEdit.text != null) element.innerText = safeEdit.text;
      const fittedEdit = window.fitEditorElement ? window.fitEditorElement(rootRef.current, element, safeEdit, renderScale) : safeEdit;
      if (fittedEdit.dx !== safeEdit.dx || fittedEdit.dy !== safeEdit.dy) {
        element.style.transform = `translate(${fittedEdit.dx || 0}px, ${fittedEdit.dy || 0}px)`;
      }
      applied.push({ element, edit: fittedEdit });
    });
    let frame = 0;
    let stopped = false;
    const refit = () => {
      if (stopped || !rootRef.current) return;
      const renderScale = rootRef.current.getBoundingClientRect().width / 1920 || 1;
      applied.forEach(item => {
        if (!item.element.isConnected) return;
        const fitted = window.fitEditorElement ? window.fitEditorElement(rootRef.current, item.element, item.edit, renderScale) : item.edit;
        item.edit = fitted;
        item.element.style.transform = fitted.dx || fitted.dy ? `translate(${fitted.dx || 0}px, ${fitted.dy || 0}px)` : '';
      });
    };
    const queueRefit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => requestAnimationFrame(refit));
    };
    queueRefit();
    document.fonts?.ready.then(queueRefit);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(queueRefit) : null;
    applied.forEach(item => observer?.observe(item.element));
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      originals.forEach(original => {
      original.element.style.transform = original.transform;
      original.element.style.width = original.width;
      if (original.restoreText) original.element.innerText = original.text;
      });
    };
  }, [slide, applyEdits]);
  return (
    <div key={slide.n} ref={rootRef} className="slide-canvas bp-slide" data-slide-number={slide.n} data-slide-phase={slide.phase}>
      <BPContentForSlide slide={slide} deck={deck} instructorLive={instructorLive} />
      <BPSafeZone live={instructorLive} />
    </div>
  );
};

const BPScaledSlide = ({ slide, deck, instructorLive, chroma = false, showSafeZone = false, instructorPos = 'br', instructorScale = 1, scale = 0.5, frame = false }) => {
  const width = 1920 * scale;
  const height = 1080 * scale;
  const live = instructorLive || (chroma && showSafeZone ? { position: instructorPos, scale: instructorScale } : false);
  const content = (
    <div className="bp-scaled-slide" style={{width, height}}>
      <div style={{transform: `scale(${scale})`, transformOrigin: 'top left', width: 1920, height: 1080}}>
        <BPBlueprintSlide slide={slide} deck={deck} instructorLive={live} />
      </div>
    </div>
  );
  return frame ? <div className="canvas-stage" style={{width, height}}>{content}</div> : content;
};

window.HYCUSlide = BPBlueprintSlide;
window.ScaledSlide = BPScaledSlide;
