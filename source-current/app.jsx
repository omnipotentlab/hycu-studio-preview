// App wiring for the HYCU AI Studio UI kit — 독립 서비스로 동작한다.
// 학사시스템(LCMS)은 SSO 인증과 교과목 데이터 연동용 백엔드일 뿐, UI는 이 서비스가 단독으로 소유한다.

function App() {
  const [authed, setAuthed] = React.useState(false);
  const [screen, setScreenRaw] = React.useState('course-setup');
  const [view, setView] = React.useState(null);
  const [deck, setDeck] = React.useState(window.CURRENT_DECK);
  const [currentSlide, setCurrentSlide] = React.useState(4);
  const [progress, setProgress] = React.useState(0);
  const [gridMode, setGridMode] = React.useState('grid');
  const [navCollapsed, setNavCollapsed] = React.useState(false);

  const onScreen = (s, v = null) => {
    setView(s === 'dashboard' ? v : null);
    setScreenRaw(s);
    if (s === 'rendering') setProgress(0);
    window.scrollTo(0, 0);
  };

  // 학사 연동(SSO) 로그인 직후 — 대시보드를 거치지 않고 바로 교안 생성(Step 1)으로 진입
  if (!authed) return <LoginScreen onLogin={() => { setAuthed(true); onScreen('course-setup'); }} />;


  let body = null;
  switch (screen) {
    case 'dashboard':
      body = <Dashboard onScreen={onScreen} lectures={window.LECTURES} gridMode={gridMode} setGridMode={setGridMode} view={view} />; break;
    case 'library':
      body = <Library onScreen={onScreen} lectures={window.LECTURES} />; break;
    case 'course-setup':
      body = <CourseSetup onScreen={onScreen} />; break;
    case 'wizard':
      body = <Wizard onScreen={onScreen} />; break;
    case 'outline':
      body = <OutlineScreen deck={deck} setDeck={setDeck} onScreen={onScreen} />; break;
    case 'rendering':
      body = <Generating onScreen={onScreen} deck={deck} progress={progress} setProgress={setProgress} progressStyle="bar" />; break;
    case 'inspection':
      body = <InspectionScreen deck={deck} onScreen={onScreen} />; break;
    case 'addie':
      body = <AddieMapping deck={deck} onScreen={onScreen} />; break;
    case 'editor':
    case 'review':
      body = <Editor deck={deck} setDeck={setDeck} onScreen={onScreen} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} gridStyle="grid" />; break;
    case 'preview':
      body = <Preview deck={deck} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} onScreen={onScreen} chroma={false} />; break;
    case 'chroma':
      body = <Chroma deck={deck} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} onScreen={onScreen} chroma={true} instructorPos="br" instructorScale={1} />; break;
    case 'export':
      body = <ExportScreen onScreen={onScreen} deck={deck} exportFormat="pptx" />; break;
    default:
      body = <Dashboard onScreen={onScreen} lectures={window.LECTURES} gridMode={gridMode} setGridMode={setGridMode} view={view} />;
  }

  return (
    <div className={'app-shell' + (navCollapsed ? ' nav-collapsed' : '')} data-screen-label={screen}>
      <Sidebar screen={screen} setScreen={onScreen} deckProgress={Math.floor(progress)} onLogout={() => setAuthed(false)} collapsed={navCollapsed} />
      <div className="main">
        <Topbar screen={screen} deck={deck} onScreen={onScreen} onToggleNav={() => setNavCollapsed(c => !c)} />
        <ProcessNav screen={screen} />
        {body}
        <ProcessFooter screen={screen} onScreen={onScreen} />
        <style>{`
          .app-shell[data-screen-label="export"] .content,.app-shell[data-screen-label="preview"] .content{padding-bottom:110px!important}
          @media (min-width:761px) and (max-width:1366px){
            .app-shell{--sidebar-w:60px!important}
            .app-shell .sidebar .brand{padding:16px 0 14px!important;justify-content:center!important}
            .app-shell .sidebar .brand>div:not(.logo),.app-shell .sidebar .nav-section,.app-shell .sidebar .nav-item>span,.app-shell .sidebar .me>div:not(.avatar),.app-shell .sidebar .me>button{display:none!important}
            .app-shell .sidebar nav{padding:12px 8px!important}
            .app-shell .sidebar .nav-item{justify-content:center!important;padding:11px 0!important}
            .app-shell .sidebar .me{justify-content:center!important;padding:12px 0!important}
            .app-shell .process-footer{left:60px!important}
          }
          @media (max-width:900px){
            .app-shell .topbar .search,.app-shell .topbar .status-sso{display:none!important}
            .app-shell .process-nav{justify-content:center!important}
            .app-shell .process-nav .process-step:not(.active),.app-shell .process-nav .process-connector{display:none!important}
          }
          @media (max-width:760px){
            .app-shell{--sidebar-w:0px!important;grid-template-columns:1fr!important}
            .app-shell .sidebar{display:none!important}
            .app-shell .topbar{padding:10px 14px!important;gap:8px!important}
            .app-shell .topbar .search,.app-shell .topbar .icon-btn,.app-shell .topbar .status-sso{display:none!important}
            .app-shell .topbar .crumbs{display:none!important}
            .app-shell .topbar .title{font-size:15px!important}
            .app-shell .process-nav{padding:0 10px!important}
            .app-shell .content{padding-left:14px!important;padding-right:14px!important}
            .app-shell .process-footer{left:0!important;padding:10px 12px!important;gap:8px!important}
            .app-shell .process-footer>div{display:none!important}
            .app-shell .process-footer .btn{font-size:10.5px!important;padding:8px 10px!important;white-space:nowrap!important}
          }
        `}</style>
      </div>
    </div>
  );
}

window.App = App;
