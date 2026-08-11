// ----- 슬라이드 편집 워크벤치 -----
// 편집과 검수는 하나의 작업이다: 캔버스 하나에서 편집하고, 검수 결과는 우측 독과
// 하단 필름스트립 상태 점으로 같은 화면에서 확인한다. AI 채팅은 우측에서 슬라이드 인.

const SLIDE_STATUS = {
  ok:    { l: '정상', dot: '#22A06B', bg: 'rgba(34,160,107,0.1)',  fg: '#166B4A' },
  warn:  { l: '주의', dot: '#F2994A', bg: 'rgba(242,153,74,0.14)', fg: '#9C5B1F' },
  error: { l: '오류', dot: '#E5484D', bg: 'rgba(229,72,77,0.12)',  fg: '#B12126' },
};
const REVIEW_MAP = { 3: 'warn', 4: 'error', 11: 'warn', 19: 'error' };

const REVIEW_ISSUES = [
  { sev: 'error', n: 4,  title: '최신성 오류',      body: '2019년 조사 데이터를 인용하고 있습니다. 현재 기준과 차이가 있을 수 있습니다.', action: '최신(2024) 수치로 교체' },
  { sev: 'warn',  n: 3,  title: '출처 미기재',      body: '삽입된 인용문에 이미지 출처가 명시되지 않았습니다.', action: '출처 자동 추가' },
  { sev: 'warn',  n: 11, title: '학습 목표 미연결', body: '학습 목표 #3 (근거 중심 검증)이 어떤 슬라이드에서도 다뤄지지 않습니다.', action: '슬라이드 자동 보강' },
  { sev: 'error', n: 19, title: '본문 영역 초과',   body: '정답 풀이 블록이 본문 안전 영역(670px)을 7px 초과합니다.', action: '자동 리플로우' },
];

const REVIEW_SOURCES = [
  { n: 1, slide: 4,  cite: 'Coca-Cola 신제품 실패 사례 (2025, Marketing Week)', mode: 'auto' },
  { n: 2, slide: 7,  cite: '마케팅 조사 분석 모형 — Malhotra (2020), p.48', mode: 'auto' },
  { n: 3, slide: 9,  cite: '단계·기술·인과조사 비교표 — 한국마케팅학회 (2023)', mode: 'auto' },
  { n: 4, slide: 12, cite: '출처 미확인 — 교수자 직접 입력 필요', mode: 'manual' },
];

const Editor = ({ deck, setDeck, onScreen, currentSlide, setCurrentSlide, gridStyle }) => {
  const slide = deck.slides[currentSlide];
  const [dock, setDock] = React.useState(() => window.innerWidth <= 760 ? null : 'inspect');   // null | inspect | review | chat
  const [inspector, setInspector] = React.useState('content');
  const [chatLog, setChatLog] = React.useState([
    { role: 'assistant', text: '슬라이드 04의 2019년 조사 데이터가 현재와 차이가 있을 수 있습니다. 최신 통계로 교체할까요?' },
    { role: 'user', text: '슬라이드 04 데이터를 2024년 최신 통계로 교체해줘' },
    { role: 'assistant', text: '2024 한국마케팅학회 통계로 교체했습니다. 본문 수치 3곳과 각주 [1]이 함께 갱신됩니다.', isAction: true },
  ]);
  const [chatInput, setChatInput] = React.useState('');
  const [selObj, setSelObj] = React.useState(null);
  const curEdits = slide.editorEdits || {};
  const setEdit = (id, patch) => {
    // \ub9c8\uc2a4\ud0c0 \uc624\ube0c\uc81d\ud2b8\ub294 \uc5b4\ub5a4 \uacbd\ub85c\ub85c\ub3c4 \uc774\ub3d9 \u00b7 \ud06c\uae30 \ubcc0\uacbd\uc744 \ud5c8\uc6a9\ud558\uc9c0 \uc54a\ub294\ub2e4 (\ub4dc\ub798\uadf8 \u00b7 \uc18d\uc131 \uc785\ub825 \ub3d9\uc77c).
    const filtered = (window.LOCKED_OBJ_IDS && window.LOCKED_OBJ_IDS.has(id))
      ? Object.fromEntries(Object.entries(patch).filter(([k]) => k === 'text'))
      : patch;
    const current = curEdits[id] || {};
    const p = window.sanitizeEditorEdit ? window.sanitizeEditorEdit(slide.n, id, current, filtered) : filtered;
    if (!Object.keys(p).length) return;
    setDeck(prev => ({
      ...prev,
      slides: prev.slides.map(item => item.n === slide.n ? {
        ...item,
        editorEdits: { ...(item.editorEdits || {}), [id]: { ...((item.editorEdits || {})[id] || {}), ...p } },
      } : item),
    }));
  };
  const isLocked = (id) => !!(window.LOCKED_OBJ_IDS && window.LOCKED_OBJ_IDS.has(id));
  const resetObj = (id) => setDeck(prev => ({
    ...prev,
    slides: prev.slides.map(item => {
      if (item.n !== slide.n) return item;
      const editorEdits = { ...(item.editorEdits || {}) };
      delete editorEdits[id];
      return { ...item, editorEdits };
    }),
  }));
  const editedCount = Object.keys(curEdits).length;
  React.useEffect(() => { setSelObj(null); }, [currentSlide]);
  React.useEffect(() => {
    const closeDockOnMobile = () => {
      if (window.innerWidth <= 760) setDock(null);
    };
    closeDockOnMobile();
    window.addEventListener('resize', closeDockOnMobile);
    return () => window.removeEventListener('resize', closeDockOnMobile);
  }, []);
  const stripRef = React.useRef(null);
  const stageWrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.46);

  // 캔버스는 가용 폭에 맞게 배율을 자동 조정한다 (독 여닫기 · 사이드바 접기 반응).
  React.useLayoutEffect(() => {
    const el = stageWrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const fit = () => {
      const w = el.clientWidth - 40;
      if (w > 60) setScale(Math.max(0.12, Math.min(0.56, w / 1920)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const statusOf = (n) => REVIEW_MAP[n] || 'ok';
  const errCount = deck.slides.filter(s => statusOf(s.n) === 'error').length;
  const warnCount = deck.slides.filter(s => statusOf(s.n) === 'warn').length;
  const curIssues = REVIEW_ISSUES.filter(r => r.n === slide.n);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatLog([...chatLog, { role: 'user', text: chatInput.trim() },
      { role: 'assistant', text: `요청을 슬라이드 ${String(slide.n).padStart(2, '0')}에 반영했습니다. 적용 전 변경 사항을 확인하세요.`, isAction: true }]);
    setChatInput('');
  };

  const goSlide = (i) => {
    setCurrentSlide(i);
    const el = stripRef.current && stripRef.current.children[i];
    if (el && el.parentElement) el.parentElement.scrollLeft = el.offsetLeft - 180;
  };

  const dockTab = (id, label, ic, badge) => {
    const on = dock === id;
    return (
      <button key={id} onClick={() => setDock(on ? null : id)} style={{
        display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',cursor:'pointer',fontFamily:'inherit',
        background: on ? 'var(--admin-ink)' : 'white', color: on ? 'white' : 'var(--admin-charcoal)',
        border: on ? '1px solid var(--admin-ink)' : '1px solid var(--admin-line)',
        borderRadius:8, fontSize:12, fontWeight:600}}>
        <Icon name={ic} size={12}/>{label}
        {badge > 0 && <span style={{padding:'0 6px',borderRadius:999,background: on ? 'rgba(255,255,255,0.2)' : 'rgba(229,72,77,0.12)',color: on ? 'white' : '#B12126',fontSize:10,fontWeight:700}}>{badge}</span>}
      </button>
    );
  };

  return (
    <div className="content" style={{padding:0,paddingBottom:80,maxWidth:'none',overflow:'hidden',display:'flex',flexDirection:'column',flex:'1 1 auto',minHeight:0}}>
      {/* 편집 툴바 — 편집 도구 + 검수 요약 + 우측 독 전환 */}
      <div style={{display:'flex',alignItems:'center',gap:6,padding:'9px 18px',borderBottom:'1px solid var(--admin-line)',background:'white',flexShrink:0,overflowX:'auto'}}>
        <button className="btn btn-quiet" title="되돌리기"><Icon name="undo" size={13}/></button>
        <button className="btn btn-quiet" title="다시 실행" style={{transform:'scaleX(-1)'}}><Icon name="undo" size={13}/></button>
        <span style={{width:1,height:18,background:'var(--admin-line)',margin:'0 4px'}}></span>
        <button className="btn btn-quiet"><Icon name="bold" size={13}/></button>
        <button className="btn btn-quiet"><Icon name="italic" size={13}/></button>
        <select className="btn btn-quiet" style={{padding:'6px 10px',border:'1px solid var(--admin-line)'}} defaultValue="HYCUGothicM">
          <option>HYCUGothicM</option>
          <option>HYCUGothicL</option>
          <option>HYCUMyungJoB</option>
          <option>HYCUMyungJoL</option>
        </select>
        <select className="btn btn-quiet" style={{padding:'6px 10px',border:'1px solid var(--admin-line)'}} defaultValue="40">
          {[15,17,18,20,22,28,32,40,56,72].map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{width:1,height:18,background:'var(--admin-line)',margin:'0 4px'}}></span>
        <button className="btn btn-quiet" title="이미지"><Icon name="image" size={13}/></button>
        <button className="btn btn-quiet" title="정렬 안내선"><Icon name="grid" size={13}/></button>
        <button className="btn btn-quiet" title="레이아웃"><Icon name="layout" size={13}/></button>
        <span className="pill" style={{background:'rgba(0,181,226,0.1)',color:'#0091B8',flexShrink:0,whiteSpace:'nowrap'}}>
          <Icon name="check" size={11}/> 마스터 좌표 잠김
        </span>
        <span style={{fontSize:11,color:'var(--admin-muted)',whiteSpace:'nowrap'}}>오브젝트 클릭 · 드래그 이동 · 더블클릭 텍스트 편집</span>
        <div style={{flex:1}}></div>
        {editedCount > 0 && <span className="pill" style={{background:'rgba(0,181,226,0.12)',color:'#006B86',flexShrink:0}}>수정 {editedCount}개</span>}
        <span style={{fontSize:11,color:'var(--admin-muted)',whiteSpace:'nowrap'}}>변경 사항 저장됨</span>
        <span style={{width:1,height:18,background:'var(--admin-line)',margin:'0 6px'}}></span>
        {dockTab('inspect', '속성', 'sliders', 0)}
        {dockTab('review', '검수', 'check', errCount + warnCount)}
        {dockTab('chat', 'AI 편집', 'sparkles', 0)}
      </div>

      <div style={{display:'flex',flex:1,minHeight:0}}>
        {/* 캔버스 + 하단 한 줄 필름스트립 */}
        <div style={{flex:1,display:'flex',flexDirection:'column',background:'var(--admin-bg)',minWidth:0}}>
          <div ref={stageWrapRef} style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'15px 20px',overflow:'auto',minHeight:0,minWidth:0}}>
            <div style={{position:'relative'}}>
              <EditableStage slide={slide} deck={deck} scale={scale} edits={curEdits} setEdit={setEdit} selected={selObj} setSelected={setSelObj}/>
              {statusOf(slide.n) !== 'ok' && (
                <div style={{position:'absolute',top:-1,left:-1,right:-1,bottom:-1,border:`2px solid ${SLIDE_STATUS[statusOf(slide.n)].dot}`,borderRadius:4,pointerEvents:'none'}}></div>
              )}
            </div>
          </div>

          {/* 현재 슬라이드 검수 알림 — 편집 중 같은 화면에서 바로 보인다 */}
          {curIssues.length > 0 && (
            <div style={{display:'flex',flexDirection:'column',gap:1,flexShrink:0}}>
              {curIssues.map((r, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 20px',background:SLIDE_STATUS[r.sev].bg,borderTop:`1px solid ${SLIDE_STATUS[r.sev].dot}33`}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:SLIDE_STATUS[r.sev].dot,flexShrink:0}}></span>
                  <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12.5,fontWeight:700,color:SLIDE_STATUS[r.sev].fg,whiteSpace:'nowrap'}}>{r.title}</span>
                  <span style={{fontSize:12,color:'var(--admin-charcoal)',flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.body}</span>
                  <button onClick={() => setDock('chat')} style={{padding:'4px 11px',background:'white',border:`1px solid ${SLIDE_STATUS[r.sev].dot}55`,borderRadius:6,fontSize:11,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,color:SLIDE_STATUS[r.sev].fg,cursor:'pointer',whiteSpace:'nowrap'}}>→ {r.action}</button>
                </div>
              ))}
            </div>
          )}

          {/* 필름스트립 — 한 줄 */}
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderTop:'1px solid var(--admin-line)',background:'white',flexShrink:0}}>
            <button className="btn btn-quiet" onClick={() => goSlide(Math.max(0, currentSlide-1))}><Icon name="chevronLeft" size={12}/></button>
            <div style={{flex:1,overflowX:'auto',overflowY:'hidden',minWidth:0}}>
              <div ref={stripRef} style={{display:'flex',gap:8,paddingBottom:2}}>
                {deck.slides.map((s, i) => {
                  const on = i === currentSlide;
                  const st = statusOf(s.n);
                  return (
                    <button key={s.n} onClick={() => goSlide(i)} title={`${String(s.n).padStart(2,'0')} ${s.title}`} style={{
                      position:'relative',flexShrink:0,width:104,padding:0,cursor:'pointer',
                      background:'white',borderRadius:5,
                      border: on ? '2px solid var(--hycu-cyan)' : '1px solid var(--admin-line)',
                      boxShadow: on ? '0 3px 10px -4px rgba(0,145,184,0.5)' : 'none'}}>
                      <div style={{position:'relative',aspectRatio:'16/9',overflow:'hidden',borderRadius:3}}>
                        <ScaledSlide slide={s} deck={deck} scale={0.052}/>
                      </div>
                      <span style={{position:'absolute',top:3,left:3,background:'rgba(14,17,22,0.72)',color:'white',fontSize:8.5,padding:'1px 4px',borderRadius:2,fontFamily:'ui-monospace,monospace',fontWeight:700}}>{String(s.n).padStart(2,'0')}</span>
                      {st !== 'ok' && <span style={{position:'absolute',top:4,right:4,width:7,height:7,borderRadius:'50%',background:SLIDE_STATUS[st].dot,boxShadow:'0 0 0 1.5px white'}}></span>}
                    </button>
                  );
                })}
                <button className="btn btn-ghost" style={{flexShrink:0,width:104,justifyContent:'center',fontSize:11}}>
                  <Icon name="plus" size={11}/> 추가
                </button>
              </div>
            </div>
            <button className="btn btn-quiet" onClick={() => goSlide(Math.min(deck.slides.length-1, currentSlide+1))}><Icon name="chevronRight" size={12}/></button>
            <span style={{width:1,height:20,background:'var(--admin-line)'}}></span>
            <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,color:'var(--admin-muted)',whiteSpace:'nowrap'}}>{currentSlide+1} / {deck.slides.length}</span>
            <span style={{fontSize:11,color:'var(--admin-faint)',whiteSpace:'nowrap'}}>1920×1080 · {Math.round(scale*100)}%</span>
          </div>
        </div>

        {/* 우측 독 — 속성 / 검수 / AI 편집. 열림/닫힘 전환 */}
        <div style={{
          width: dock ? 348 : 0, flexShrink:0, overflow:'hidden',
          borderLeft: dock ? '1px solid var(--admin-line)' : 'none',
          background:'white', display:'flex', flexDirection:'column', minHeight:0,
          transition:'width 0.22s cubic-bezier(0.22,0.61,0.36,1)'}}>
          <div style={{width:348,display:'flex',flexDirection:'column',flex:1,minHeight:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderBottom:'1px solid var(--admin-line)',flexShrink:0}}>
              <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,color:'var(--admin-ink)'}}>
                {dock === 'inspect' ? '슬라이드 속성' : dock === 'review' ? '검수' : 'AI 편집 어시스턴트'}
              </span>
              <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,color:'var(--admin-muted)'}}>SLIDE {String(slide.n).padStart(2,'0')}</span>
              <div style={{flex:1}}></div>
              <button onClick={() => setDock(null)} title="패널 닫기" style={{width:24,height:24,display:'grid',placeItems:'center',background:'transparent',border:'1px solid var(--admin-line)',borderRadius:6,cursor:'pointer',color:'var(--admin-muted)'}}>
                <Icon name="chevronRight" size={12}/>
              </button>
            </div>

            {dock === 'inspect' && (
              <>
                <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--admin-line)',flexShrink:0}}>
                  {[{id:'content',label:'내용'},{id:'style',label:'스타일'},{id:'script',label:'내레이션'}].map(t => (
                    <button key={t.id} onClick={() => setInspector(t.id)} style={{
                      flex:1,padding:'9px 6px',background:'transparent',border:0,
                      borderBottom: inspector===t.id ? '2px solid var(--hycu-cyan)' : '2px solid transparent',
                      color: inspector===t.id ? 'var(--admin-ink)' : 'var(--admin-muted)',
                      fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,cursor:'pointer'}}>{t.label}</button>
                  ))}
                </div>
                <div style={{overflow:'auto',flex:1,padding:14}}>
                  {inspector === 'content' && (
                    <div>
                      {selObj ? (
                        <ObjectPanel objId={selObj} locked={isLocked(selObj)} edits={curEdits[selObj] || {}} setEdit={setEdit} onReset={() => resetObj(selObj)} onClear={() => setSelObj(null)}/>
                      ) : (
                        <div style={{padding:'10px 12px',marginBottom:12,background:'var(--admin-bg)',border:'1px dashed var(--admin-line-strong)',borderRadius:8,fontSize:11.5,color:'var(--admin-muted)',lineHeight:1.5}}>
                          캔버스에서 오브젝트를 클릭하면 이 자리에서 위치 · 폭 · 텍스트를 조정할 수 있습니다.
                        </div>
                      )}
                      <Field label="슬라이드 제목" value={slide.title} wide/>
                      <div style={{height:10}}></div>
                      <Field label="부제목" value={slide.subtitle || ''} wide/>
                      <div style={{height:10}}></div>
                      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,fontWeight:600}}>본문 콘텐츠 ({slide.type})</div>
                      <textarea defaultValue={slide.bodyText || (slide.bullets || []).join('\n') || ''} style={{width:'100%',border:'1px solid var(--admin-line)',borderRadius:8,padding:10,fontSize:12,minHeight:120,fontFamily:'inherit',lineHeight:1.5}}/>
                      <button className="btn btn-ghost" onClick={() => setDock('chat')} style={{width:'100%',justifyContent:'center',marginTop:10}}>
                        <Icon name="sparkles" size={13}/> AI로 이 슬라이드 수정
                      </button>
                    </div>
                  )}
                  {inspector === 'style' && (
                    <div style={{fontSize:12}}>
                      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,fontWeight:600}}>레이아웃 템플릿</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
                        {[
                          { id:'concept', label:'개념 설명', sub:'60/40 분할' },
                          { id:'objective', label:'학습 목표', sub:'카드 + 칩' },
                          { id:'diagram', label:'다이어그램', sub:'4-up 카드' },
                          { id:'quiz', label:'형성평가', sub:'문항+선지' },
                          { id:'summary', label:'정리', sub:'큰 요약' },
                          { id:'cover', label:'표지', sub:'명조 헤드' },
                        ].map(l => (
                          <button key={l.id} style={{padding:'8px 10px',background: slide.layout === l.id ? 'rgba(0,181,226,0.08)' : 'white',border: slide.layout === l.id ? '1.5px solid var(--hycu-cyan)' : '1px solid var(--admin-line)',borderRadius:6,textAlign:'left',cursor:'pointer'}}>
                            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600}}>{l.label}</div>
                            <div style={{fontSize:10,color:'var(--admin-muted)',marginTop:1}}>{l.sub}</div>
                          </button>
                        ))}
                      </div>
                      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 8px',fontWeight:600}}>액센트</div>
                      <div style={{display:'flex',gap:6}}>
                        {['#00B5E2','#0091B8','#0E1116','#5A6473'].map(c => (
                          <div key={c} style={{flex:1,height:30,background:c,borderRadius:6,border:'1px solid var(--admin-line)'}}></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {inspector === 'script' && (
                    <div>
                      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,fontWeight:600}}>교수자 내레이션</div>
                      <textarea defaultValue={slide.script || '이 슬라이드에서는 생성형 AI와 사람이 역할을 나누는 기준을 소개합니다. AI는 초안과 대안을 빠르게 만들고, 사람은 근거와 맥락을 확인해 최종 판단을 맡는다는 점이 핵심입니다.'} style={{width:'100%',border:'1px solid var(--admin-line)',borderRadius:8,padding:10,fontSize:12,minHeight:150,fontFamily:'inherit',lineHeight:1.6}}/>
                      <div style={{display:'flex',gap:8,marginTop:8}}>
                        <span className="pill"><Icon name="clock" size={10}/> 약 1분 42초</span>
                        <span className="pill">한국어 자연체</span>
                      </div>
                      <button className="btn btn-ghost" style={{width:'100%',justifyContent:'center',marginTop:12}}>
                        <Icon name="sparkles" size={13}/> AI로 다시 작성
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {dock === 'review' && (
              <div style={{overflow:'auto',flex:1}}>
                <div style={{display:'flex',gap:6,padding:'12px 14px',borderBottom:'1px solid var(--admin-line-soft)'}}>
                  {[{k:'error',n:errCount},{k:'warn',n:warnCount},{k:'ok',n:deck.slides.length-errCount-warnCount}].map(c => (
                    <span key={c.k} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 11px',borderRadius:999,background:SLIDE_STATUS[c.k].bg,color:SLIDE_STATUS[c.k].fg,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11.5,fontWeight:700}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:SLIDE_STATUS[c.k].dot}}></span>{SLIDE_STATUS[c.k].l} {c.n}
                    </span>
                  ))}
                </div>
                <div style={{padding:'12px 14px 6px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:700,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>자동 검수 결과 {REVIEW_ISSUES.length}건</div>
                {REVIEW_ISSUES.map((r, i) => (
                  <div key={i} style={{padding:'11px 14px',borderTop:'1px solid var(--admin-line-soft)',background: r.n === slide.n ? 'rgba(0,181,226,0.05)' : 'white'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:SLIDE_STATUS[r.sev].dot}}></span>
                      <button onClick={() => { const i2 = deck.slides.findIndex(s => s.n === r.n); if (i2 >= 0) goSlide(i2); }} style={{background:'transparent',border:0,padding:0,cursor:'pointer',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,color:'var(--hycu-cyan-deep)',textDecoration:'underline',textUnderlineOffset:2}}>슬라이드 {String(r.n).padStart(2,'0')}</button>
                      <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,color:SLIDE_STATUS[r.sev].fg}}>{r.title}</span>
                    </div>
                    <div style={{fontSize:12,color:'var(--admin-charcoal)',lineHeight:1.5,marginBottom:6}}>{r.body}</div>
                    <button onClick={() => setDock('chat')} style={{padding:'4px 10px',background:'rgba(0,145,184,0.08)',border:'1px solid rgba(0,145,184,0.25)',borderRadius:6,fontSize:11,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,color:'var(--hycu-cyan-deep)',cursor:'pointer'}}>→ {r.action}</button>
                  </div>
                ))}
                <div style={{padding:'14px 14px 6px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:700,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',borderTop:'1px solid var(--admin-line)'}}>출처 자동 각주</div>
                {REVIEW_SOURCES.map(s => (
                  <div key={s.n} style={{display:'flex',gap:9,padding:'9px 14px',borderTop:'1px solid var(--admin-line-soft)',background: s.mode === 'manual' ? 'rgba(247,180,0,0.07)' : 'white'}}>
                    <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,fontWeight:700,color:'var(--hycu-cyan-deep)',flexShrink:0}}>[{s.n}]</span>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:11.5,color:'var(--admin-charcoal)',lineHeight:1.45}}>{s.cite}</div>
                      <div style={{fontSize:10.5,color:'var(--admin-faint)',marginTop:2}}>슬라이드 {String(s.slide).padStart(2,'0')} · {s.mode === 'manual' ? '수동 입력 필요' : '자동 수집'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dock === 'chat' && (
              <>
                <div style={{padding:'10px 14px',display:'flex',gap:6,flexWrap:'wrap',borderBottom:'1px solid var(--admin-line-soft)',flexShrink:0}}>
                  {['이 슬라이드 압축','최신성 검토','출처 추가','예시 1개 추가','쉬운 표현으로'].map(a => (
                    <button key={a} onClick={() => setChatInput(a)} style={{padding:'5px 11px',background:'var(--admin-bg)',border:'1px solid var(--admin-line)',borderRadius:999,fontSize:11,fontFamily:'inherit',color:'var(--admin-charcoal)',cursor:'pointer'}}>+ {a}</button>
                  ))}
                </div>
                <div style={{flex:1,padding:'14px',display:'flex',flexDirection:'column',gap:10,overflow:'auto',background:'#FAFBFC',minHeight:0}}>
                  {chatLog.map((m, i) => (
                    <div key={i} style={{alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth:'90%'}}>
                      <div style={{padding:'10px 13px',borderRadius:12,
                        background: m.role === 'user' ? 'var(--admin-ink)' : (m.isAction ? 'var(--hycu-cyan)' : 'white'),
                        color: m.role === 'user' || m.isAction ? 'white' : 'var(--admin-ink)',
                        border: m.role === 'user' || m.isAction ? 'none' : '1px solid var(--admin-line)',
                        fontSize:12.5,lineHeight:1.55}}>
                        {m.text}
                        {m.isAction && (
                          <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(255,255,255,0.22)',display:'flex',gap:8}}>
                            <button style={{padding:'4px 11px',background:'white',color:'var(--hycu-cyan-deep)',border:'none',borderRadius:6,fontSize:11,fontWeight:700,fontFamily:'inherit',cursor:'pointer'}}>적용</button>
                            <button style={{padding:'4px 11px',background:'transparent',color:'white',border:'1px solid rgba(255,255,255,0.3)',borderRadius:6,fontSize:11,fontWeight:600,fontFamily:'inherit',cursor:'pointer'}}>되돌리기</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{padding:'10px 12px',borderTop:'1px solid var(--admin-line)',display:'flex',gap:8,background:'white',flexShrink:0}}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder={`슬라이드 ${String(slide.n).padStart(2,'0')} 수정 요청…`} style={{flex:1,minWidth:0,padding:'9px 12px',border:'1px solid var(--admin-line)',borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none'}}/>
                  <button onClick={sendChat} style={{padding:'9px 16px',background:'var(--admin-ink)',color:'white',border:'none',borderRadius:8,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,cursor:'pointer',flexShrink:0}}>전송</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectPanel = ({ objId, locked, edits, setEdit, onReset, onClear }) => {
  const label = (window.OBJ_LABELS && window.OBJ_LABELS[objId]) || objId.split('#')[0];
  const num = (k, l) => (
    <label style={{display:'flex',flexDirection:'column',gap:4,opacity: locked ? 0.5 : 1}}>
      <span style={{fontSize:10,color:'var(--admin-muted)',fontWeight:600,letterSpacing:'0.04em'}}>{l}</span>
      <input type="number" value={edits[k] || 0} disabled={locked} onChange={e => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        setEdit(objId, { [k]: Number.isFinite(value) ? value : 0 });
      }}
        style={{width:'100%',padding:'7px 9px',border:'1px solid var(--admin-line)',borderRadius:7,fontSize:12,fontFamily:'ui-monospace,monospace',background: locked ? 'var(--admin-bg)' : 'white',cursor: locked ? 'not-allowed' : 'text'}}/>
    </label>
  );
  return (
    <div style={{marginBottom:14,padding:12,background: locked ? 'var(--admin-bg)' : 'rgba(0,181,226,0.05)',border: locked ? '1px solid var(--admin-line-strong)' : '1px solid rgba(0,181,226,0.25)',borderRadius:10}}>
      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}>
        <span style={{width:18,height:18,borderRadius:4,background: locked ? '#78828F' : 'var(--hycu-cyan)',color:'white',display:'grid',placeItems:'center'}}><Icon name={locked ? 'lock' : 'layout'} size={10}/></span>
        <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12.5,fontWeight:700,color:'var(--admin-ink)',flex:1}}>{label}</span>
        <button onClick={onClear} title="선택 해제" style={{background:'transparent',border:0,color:'var(--admin-muted)',cursor:'pointer',fontSize:11}}>✕</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7}}>
        {num('dx', 'X 이동')}
        {num('dy', 'Y 이동')}
        {num('dw', '폭 증감')}
      </div>
      {edits.text != null && !locked && (
        <div style={{marginTop:9}}>
          <div style={{fontSize:10,color:'var(--admin-muted)',fontWeight:600,marginBottom:4,letterSpacing:'0.04em'}}>텍스트</div>
          <textarea value={edits.text} onChange={e => setEdit(objId, { text: e.target.value })} style={{width:'100%',minHeight:56,border:'1px solid var(--admin-line)',borderRadius:7,padding:8,fontSize:12,fontFamily:'inherit',lineHeight:1.5}}/>
        </div>
      )}
      {locked ? (
        <div style={{marginTop:10,display:'flex',alignItems:'center',gap:7,fontSize:11.5,color:'var(--admin-charcoal)',lineHeight:1.45}}>
          <Icon name="lock" size={11}/> 마스타 잠김 — 이동하거나 폭을 바꿀 수 없습니다.
        </div>
      ) : (
        <>
          <div style={{display:'flex',gap:6,marginTop:10}}>
            <button onClick={onReset} className="btn btn-ghost" style={{flex:1,justifyContent:'center',fontSize:11.5}}><Icon name="refresh" size={11}/> 원본 위치로</button>
          </div>
          <div style={{marginTop:8,fontSize:10.5,color:'var(--admin-faint)',lineHeight:1.45}}>캔버스에서 드래그하면 이 값이 바뀝니다. 텍스트 오브젝트는 더붔클릭해 직접 수정합니다.</div>
        </>
      )}
    </div>
  );
};

window.Editor = Editor;
