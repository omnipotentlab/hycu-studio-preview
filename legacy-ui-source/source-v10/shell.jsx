// Sidebar + Topbar shell
// 교안 생성은 하나의 연속된 프로세스다. 사이드바는 최상위 3개 탭만 가지고,
// 프로세스 단계는 상단 ProcessNav가 단독으로 책임진다.
const PROCESS = [
  { id: 'course-setup', label: '교과목 정보', sub: '학사 연동 · 기획서 · CQI' },
  { id: 'wizard',       label: '교안 설정',   sub: '학습자료 · 구성 · 톤' },
  { id: 'outline',      label: '아웃라인 생성', sub: '실시간 생성 · 검토 · 편집' },
  { id: 'rendering',    label: '슬라이드 렌더', sub: '디자인 적용' },
  { id: 'editor',       label: '편집',        sub: '슬라이드 수정' },
  { id: 'inspection',   label: '검수',        sub: '전체 규칙 검사' },
  { id: 'preview',      label: '미리보기',    sub: '최종 확인' },
  { id: 'export',       label: '내보내기',       sub: 'PPTX · PDF · SCORM · MP4' },
];
const PROCESS_ALIAS = { addie: 'editor', review: 'editor', chroma: 'preview' };
const processIndex = (screen) => PROCESS.findIndex(p => p.id === (PROCESS_ALIAS[screen] || screen));

// 단계 이동은 하단 ProcessFooter의 이전/다음 버튼으로만 순차진행한다.
// 상단 ProcessNav는 현재 진행 상황만 보여주는 지표이며 클릭해도 이동하지 않는다.
const ProcessNav = ({ screen }) => {
  const cur = processIndex(screen);
  const navRef = React.useRef(null);
  React.useEffect(() => {
    const keepCurrentVisible = () => window.requestAnimationFrame(() => navRef.current?.querySelector('[aria-current="step"]')?.scrollIntoView({block:'nearest',inline:'center'}));
    keepCurrentVisible();
    window.addEventListener('resize', keepCurrentVisible);
    return () => window.removeEventListener('resize', keepCurrentVisible);
  }, [screen]);
  if (cur < 0) return null;
  return (
    <div ref={navRef} className="process-nav" style={{display:'flex',alignItems:'stretch',gap:0,padding:'0 22px',background:'white',borderBottom:'1px solid var(--admin-line)',overflowX:'auto',flexShrink:0}}>
      {PROCESS.map((p, i) => {
        const state = i === cur ? 'active' : i < cur ? 'done' : 'todo';
        return (
          <React.Fragment key={p.id}>
            {i > 0 && <span className="process-connector" style={{alignSelf:'center',width:14,height:1,background: i <= cur ? 'var(--hycu-cyan)' : 'var(--admin-line)',flexShrink:0}}></span>}
            <div className={`process-step ${state}`} aria-current={state==='active' ? 'step' : undefined} style={{
              display:'flex',alignItems:'center',gap:9,padding:'13px 14px',
              borderBottom: state==='active' ? '2px solid var(--hycu-cyan-deep)' : '2px solid transparent',
              whiteSpace:'nowrap',flexShrink:0}}>
              <span style={{
                width:22,height:22,borderRadius:'50%',display:'grid',placeItems:'center',flexShrink:0,
                fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:700,
                background: state==='active' ? 'linear-gradient(135deg,var(--hycu-cyan),var(--hycu-cyan-deep))' : state==='done' ? 'rgba(0,181,226,0.12)' : 'var(--admin-bg)',
                color: state==='active' ? 'white' : state==='done' ? 'var(--hycu-cyan-deep)' : 'var(--admin-faint)',
                border: state==='todo' ? '1px solid var(--admin-line)' : 'none'}}>
                {state==='done' ? <Icon name="check" size={11}/> : i+1}
              </span>
              <span style={{textAlign:'left'}}>
                <span style={{display:'block',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight: state==='active'?700:600,color: state==='todo'?'var(--admin-muted)':'var(--admin-ink)',letterSpacing:'-0.01em'}}>{p.label}</span>
                <span style={{display:'block',fontSize:10.5,color: state==='active'?'var(--hycu-cyan-deep)':'var(--admin-faint)',marginTop:1}}>{p.sub}</span>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 하단 단계 이동 바 — 이전/다음으로 한 단계씩만 이동한다.
const ProcessFooter = ({ screen, onScreen }) => {
  const cur = processIndex(screen);
  if (cur < 0) return null;
  const prev = PROCESS[cur - 1], next = PROCESS[cur + 1];
  return (
    <div className="process-footer" style={{
      position:'fixed',left:'var(--sidebar-w, 232px)',right:0,bottom:0,zIndex:20,
      display:'flex',alignItems:'center',gap:16,padding:'12px 32px',
      background:'rgba(255,255,255,0.92)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',
      borderTop:'1px solid var(--admin-line)',boxShadow:'0 -6px 24px -18px rgba(14,17,22,0.4)',
      transition:'left 0.2s cubic-bezier(0.22,0.61,0.36,1)'}}>
      {prev ? (
        <button className="btn btn-ghost" onClick={() => onScreen(prev.id)}>
          <Icon name="chevronLeft" size={14}/> 이전 · {prev.label}
        </button>
      ) : <span style={{width:1}}></span>}
      <div style={{flex:1,textAlign:'center',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,color:'var(--admin-muted)'}}>
        <b style={{color:'var(--hycu-cyan-deep)',fontWeight:700}}>{cur + 1}</b> / {PROCESS.length} · {PROCESS[cur].label}
      </div>
      {next ? (
        <button className="btn btn-cyan" onClick={() => onScreen(next.id)}>
          다음 · {next.label} <Icon name="chevronRight" size={14}/>
        </button>
      ) : (
        <button className="btn" style={{background:'#1B7F3F',color:'white',fontWeight:700}} onClick={() => onScreen('library')}>
          <Icon name="check" size={14}/> 교안 생성 완료
        </button>
      )}
    </div>
  );
};

const Sidebar = ({ screen, setScreen, deckProgress, onLogout, collapsed, onToggle }) => {
  const items = [
    { sec: '워크스페이스' },
    { id: 'dashboard', label: '대시보드', icon: 'home' },
    { id: 'course-setup', label: '교안 생성', icon: 'sparkles', accent: true, match: (s) => processIndex(s) >= 0 },
    { id: 'library', label: '교안 라이브러리', icon: 'folder' },
  ];
  return (
    <aside className="sidebar">
      <div className="brand" title={collapsed ? 'HYCU AI Studio' : undefined}>
        <div className="logo">H</div>
        <div>
          <div className="title">HYCU AI Studio</div>
          <div className="sub" style={{fontSize:10.5,color:'var(--hycu-cyan)',fontWeight:600,letterSpacing:'0.04em',marginTop:1}}>AI 교안생성 플랫폼</div>
        </div>
      </div>
      <nav>
        {items.map((it, i) => {
          if (it.sec) return <div key={i} className="nav-section">{it.sec}</div>;
          const active = it.match ? it.match(screen) : screen === it.id;
          return (
            <button key={it.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setScreen(it.id)} title={collapsed ? it.label : undefined}>
              <Icon name={it.icon} size={16}/>
              <span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
              {it.accent && <span className="dot" style={{background:'#00B5E2',boxShadow:'0 0 0 3px rgba(0,181,226,0.18)'}}></span>}
              {!it.accent && !it.badge && active && <span className="dot"></span>}
            </button>
          );
        })}
      </nav>
      <div className="me">
        <div className="avatar">김현경</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="name">김현경 교수</div>
          <div className="role">융합경영대학 · 마케팅학과</div>
        </div>
        <button onClick={onLogout} title="로그아웃" style={{background:'transparent',border:'none',padding:6,borderRadius:6,color:'#6E7785',cursor:'pointer',display:'grid',placeItems:'center'}}
          onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#16191F'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#6E7785'; e.currentTarget.style.background = 'transparent'; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

const Topbar = ({ screen, deck, onScreen, onToggleNav }) => {
  const inProcess = processIndex(screen) >= 0;
  const titles = {
    dashboard: { crumbs: ['워크스페이스'], title: '대시보드' },
    courses: { crumbs: ['워크스페이스'], title: '내 강의' },
    library: { crumbs: ['교안 라이브러리'], title: '생성된 교안' },
    'course-setup': { crumbs: ['교안 생성'], title: '교과목 정보' },
    wizard: { crumbs: ['교안 생성'], title: '교안 설정' },
    outline: { crumbs: ['교안 생성', deck.subject], title: '아웃라인 검토' },
    generating: { crumbs: ['교안 생성', deck.subject], title: 'AI 자동생성 진행' },
    addie: { crumbs: ['교안 생성', deck.chapter], title: 'ADDIE 단계 매핑' },
    editor: { crumbs: ['교안 생성', deck.chapter], title: deck.subchapter + ' · 편집 · 검수' },
    review: { crumbs: ['교안 생성', deck.chapter], title: deck.subchapter + ' · 편집 · 검수' },
    preview: { crumbs: ['교안 생성', deck.chapter], title: '슬라이드 미리보기' },
    chroma: { crumbs: ['교안 생성'], title: '교수자 크로마키 시뮬레이터' },
    export: { crumbs: ['교안 생성', deck.subject], title: 'PPTX · PDF · SCORM · MP4 내보내기' }};
  const meta = titles[screen] || titles.dashboard;
  return (
    <div className="topbar">
      <button className="nav-toggle" onClick={onToggleNav} title="사이드바 접기/펼기">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div>
        <div className="crumbs">
          {meta.crumbs.map((c, i, a) => (
            <React.Fragment key={i}>
              <span>{c}</span>
              {i < a.length - 1 && <span className="sep">/</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="title">{meta.title}</div>
      </div>
      <div className="spacer"></div>
      <span className="status-sso" title="학사시스템 SSO 세션으로 교과목 데이터가 연동되어 있습니다" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 11px',background:'rgba(47,167,106,0.1)',border:'1px solid rgba(47,167,106,0.25)',borderRadius:20,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11.5,fontWeight:600,color:'#22804F',whiteSpace:'nowrap'}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:'#2FA76A'}}></span>학사시스템 연동됨
      </span>
      <div className="search">
        <Icon name="search" size={14}/>
        <input placeholder="강의·교시·키워드 검색" />
      </div>
      <button className="icon-btn"><Icon name="bell" size={16}/><span className="pip"></span></button>
      <button className="icon-btn"><Icon name="settings" size={16}/></button>
      {!inProcess && (
        <button className="btn btn-primary" onClick={() => onScreen('course-setup')}>
          <Icon name="plus" size={14}/> 새 교안
        </button>
      )}
    </div>
  );
};

window.ProcessNav = ProcessNav;
window.ProcessFooter = ProcessFooter;
window.processIndex = processIndex;
window.Sidebar = Sidebar;
window.Topbar = Topbar;
