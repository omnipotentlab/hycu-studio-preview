// ----- 교안 라이브러리 -----
// 단위는 "생성된 교안(버전)". 하나의 수업(교시)에 대해 여러 번의 생성 시도가 쌓이고,
// 라이브러리는 그 시도들을 수업별로 묶어서 보여준다.

const LIB_COURSES = [
  { code: 'AIG101', name: 'AI 리터러시',     term: '2026-2학기', current: true },
  { code: 'CBA003', name: '마케팅원론',     term: '2026-2학기' },
  { code: 'CMI021', name: '소비자행동론',   term: '2026-2학기' },
  { code: 'CMK008', name: '브랜드경영전략', term: '2026-1학기' },
];

const LIB_STATUS = {
  published: { l: '발행',      dot: '#22A06B', bg: 'rgba(34,160,107,0.12)', fg: '#166B4A' },
  review:    { l: '검토 대기', dot: '#F7B400', bg: 'rgba(247,180,0,0.14)',  fg: '#9A6B00' },
  editing:   { l: '편집 중',   dot: '#00B5E2', bg: 'rgba(0,181,226,0.12)',  fg: '#006B86' },
  archived:  { l: '보관',      dot: '#9CA3AF', bg: '#EEF1F5',               fg: '#6B7280' },
};

// 수업(교시) → 생성 시도(교안 버전) 목록
const LIB_SESSIONS = {
  AIG101: [
    { w: 3, s: 1, title: '조사 프로세스 7단계', attempts: [
      { v: 3, at: '2026-08-02 14:22', slides: 31, status: 'published', opt: '표준 톤 · 30매 · ADDIE 전체', note: '실습 사례 2건 추가, 7단계 도식 교체', langs: ['KO','EN','ZH'], by: 'AI 생성 + 직접 편집', dur: '4분 12초' },
      { v: 2, at: '2026-07-28 09:10', slides: 28, status: 'archived',  opt: '간결 톤 · 25매 · ADDIE 전체', note: '분량 축소본 — 도입부 반복 지적', langs: ['KO','EN'], by: 'AI 생성', dur: '3분 48초' },
      { v: 1, at: '2026-07-21 16:40', slides: 26, status: 'archived',  opt: '표준 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '4분 02초' },
    ]},
    { w: 4, s: 1, title: '1차 자료 수집법', attempts: [
      { v: 2, at: '2026-08-01 11:05', slides: 29, status: 'review',   opt: '표준 톤 · 30매 · ADDIE 전체', note: '정량·정성 비교표 보강', langs: ['KO','EN'], by: 'AI 생성', dur: '4분 30초' },
      { v: 1, at: '2026-07-30 15:44', slides: 27, status: 'archived', opt: '표준 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '3분 55초' },
    ]},
    { w: 5, s: 1, title: '생성형 AI의 이해와 업무 활용', attempts: [
      { v: 1, at: '2026-08-03 09:31', slides: 30, status: 'editing', opt: '심화 톤 · 30매 · ADDIE 전체', note: 'NIST AI RMF 참고자료 반영', langs: ['KO'], by: 'AI 생성', dur: '5분 08초' },
    ]},
    { w: 2, s: 1, title: '데이터에서 패턴을 배우는 과정', attempts: [
      { v: 2, at: '2026-07-19 13:02', slides: 28, status: 'published', opt: '표준 톤 · 30매 · ADDIE 전체', note: '2026 사례로 갱신', langs: ['KO','EN','ZH','VI'], by: 'AI 생성 + 직접 편집', dur: '4분 18초' },
      { v: 1, at: '2026-07-14 10:20', slides: 25, status: 'archived',  opt: '표준 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '3분 40초' },
    ]},
    { w: 1, s: 1, title: 'AI 리터러시란 무엇인가', attempts: [
      { v: 1, at: '2026-07-10 09:00', slides: 27, status: 'published', opt: '표준 톤 · 25매 · 기본', note: '학기 첫 교안', langs: ['KO','EN'], by: 'AI 생성', dur: '3분 52초' },
    ]},
  ],
  CBA003: [
    { w: 7, s: 1, title: '제품 수명주기와 신제품 개발', attempts: [
      { v: 2, at: '2026-07-31 10:12', slides: 30, status: 'published', opt: '표준 톤 · 30매 · ADDIE 전체', note: '신제품 사례 교체', langs: ['KO','EN'], by: 'AI 생성 + 직접 편집', dur: '4분 21초' },
      { v: 1, at: '2026-07-24 14:03', slides: 27, status: 'archived',  opt: '표준 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '3분 47초' },
    ]},
    { w: 6, s: 1, title: 'STP 전략의 이해', attempts: [
      { v: 1, at: '2026-07-20 09:48', slides: 28, status: 'review', opt: '간결 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '3분 30초' },
    ]},
  ],
  CMI021: [
    { w: 9, s: 1, title: '관여도와 구매 의사결정', attempts: [
      { v: 3, at: '2026-08-01 16:40', slides: 32, status: 'published', opt: '심화 톤 · 30매 · ADDIE 전체', note: 'FCB Grid 도식 추가', langs: ['KO','EN','ZH'], by: 'AI 생성 + 직접 편집', dur: '5분 02초' },
      { v: 2, at: '2026-07-27 11:22', slides: 29, status: 'archived', opt: '표준 톤 · 30매 · ADDIE 전체', note: '사례 비중 과다 지적', langs: ['KO','EN'], by: 'AI 생성', dur: '4분 44초' },
      { v: 1, at: '2026-07-22 08:55', slides: 26, status: 'archived', opt: '표준 톤 · 25매 · 기본', note: '초기 생성본', langs: ['KO'], by: 'AI 생성', dur: '3분 58초' },
    ]},
  ],
  CMK008: [
    { w: 12, s: 1, title: '브랜드 자산 측정 모델', attempts: [
      { v: 1, at: '2026-05-14 13:05', slides: 29, status: 'published', opt: '표준 톤 · 30매 · ADDIE 전체', note: '지난 학기 최종본', langs: ['KO','EN'], by: 'AI 생성 + 직접 편집', dur: '4분 09초' },
    ]},
  ],
};

const Library = ({ onScreen }) => {
  const [courseCode, setCourseCode] = React.useState('AIG101');
  const [filter, setFilter] = React.useState('all');
  const [open, setOpen] = React.useState({});

  const course = LIB_COURSES.find(c => c.code === courseCode) || LIB_COURSES[0];
  const sessions = (LIB_SESSIONS[courseCode] || []).slice().sort((a, b) => b.w - a.w);
  const totalDecks = sessions.reduce((n, s) => n + s.attempts.length, 0);
  const avgTries = sessions.length ? (totalDecks / sessions.length).toFixed(1) : '0';
  const multi = sessions.filter(s => s.attempts.length > 1).length;

  const visible = sessions.filter(s =>
    filter === 'all' ? true : s.attempts.some(a => a.status === filter));

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <h1>교안 라이브러리</h1>
          <div className="sub">지금까지 생성한 교안 {totalDecks}건 · 수업 {sessions.length}개 · 수업당 평균 {avgTries}회 생성</div>
        </div>
        <div className="actions">
          <button className="btn btn-ghost"><Icon name="download" size={14}/> 전체 PPTX 다운로드</button>
          <button className="btn btn-cyan" onClick={() => onScreen('course-setup')}><Icon name="sparkles" size={14}/> 새 교안 생성</button>
        </div>
      </div>

      {/* 과목 선택 — 학사 연동된 담당 교과목 */}
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:14}}>
        {LIB_COURSES.map(c => {
          const on = c.code === courseCode;
          const n = (LIB_SESSIONS[c.code] || []).reduce((t, s) => t + s.attempts.length, 0);
          return (
            <button key={c.code} onClick={() => setCourseCode(c.code)} style={{
              display:'inline-flex',alignItems:'center',gap:9,padding:'9px 15px',cursor:'pointer',fontFamily:'inherit',
              background: on ? 'white' : 'transparent',
              border: on ? '1.5px solid var(--hycu-cyan)' : '1px solid var(--admin-line)',
              borderRadius:10, boxShadow: on ? '0 2px 8px -4px rgba(0,145,184,0.4)' : 'none'}}>
              <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13.5,fontWeight: on?700:600,color:'var(--admin-ink)'}}>{c.name}</span>
              <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,color:'var(--admin-muted)'}}>{c.code}</span>
              <span style={{padding:'1px 7px',borderRadius:999,background: on?'var(--hycu-cyan)':'var(--admin-bg)',color: on?'white':'var(--admin-muted)',fontSize:10.5,fontWeight:700}}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* 상태 필터 */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <div style={{display:'flex',gap:6,background:'white',padding:4,border:'1px solid var(--admin-line)',borderRadius:10}}>
          {['all','published','review','editing','archived'].map(k => (
            <button key={k} onClick={() => setFilter(k)} style={{
              border:0, background: filter===k?'var(--ink-deep, #0E1116)':'transparent', color: filter===k?'white':'var(--admin-muted)',
              padding:'6px 12px', borderRadius:8, fontSize:12, fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight:600, cursor:'pointer'}}>
              {k === 'all' ? '전체' : LIB_STATUS[k].l}
            </button>
          ))}
        </div>
        <div style={{flex:1}}></div>
        <div style={{fontSize:12,color:'var(--admin-muted)'}}>재생성 이력이 있는 수업 <b style={{color:'var(--hycu-cyan-deep)',fontWeight:700}}>{multi}개</b></div>
      </div>

      {/* 수업별 교안 버전 스택 */}
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {visible.map(s => {
          const key = `${s.w}-${s.s}`;
          const expanded = open[key] === true;
          const latest = s.attempts[0];
          const info = LIB_STATUS[latest.status];
          return (
            <div key={key} className="card" style={{padding:0,overflow:'hidden'}}>
              {/* 수업 헤더 */}
              <div onClick={() => setOpen(o => ({...o, [key]: !expanded}))} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderBottom: expanded ? '1px solid var(--admin-line)' : 'none',cursor:'pointer'}}>
                <span style={{padding:'5px 11px',background:'var(--admin-bg)',borderRadius:7,fontFamily:'ui-monospace,monospace',fontSize:12,fontWeight:700,color:'var(--admin-charcoal)',whiteSpace:'nowrap'}}>{s.w}주차 {String(s.s).padStart(2,'0')}교시</span>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:15,fontWeight:700,color:'var(--admin-ink)',letterSpacing:'-0.01em'}}>{s.title}</div>
                  <div style={{fontSize:11.5,color:'var(--admin-muted)',marginTop:2}}>생성 {s.attempts.length}회 · 최신 v{latest.v} · {latest.at}</div>
                </div>
                <div style={{flex:1}}></div>
                <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'4px 10px',borderRadius:999,background:info.bg,color:info.fg,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,whiteSpace:'nowrap'}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:info.dot}}></span>{info.l}
                </span>
                <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); onScreen('course-setup'); }} style={{whiteSpace:'nowrap'}}><Icon name="refresh" size={13}/> 재생성</button>
                <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onScreen('editor'); }} style={{whiteSpace:'nowrap'}}>최신본 열기</button>
                <span style={{display:'flex',alignItems:'center',gap:5,paddingLeft:10,marginLeft:2,borderLeft:'1px solid var(--admin-line)',color:'var(--admin-muted)',fontSize:11.5,fontWeight:600,whiteSpace:'nowrap'}}>
                  {expanded ? '접기' : `버전 ${s.attempts.length}`}
                  <span style={{display:'grid',placeItems:'center',width:20,height:20,transform: expanded ? 'rotate(180deg)' : 'none',transition:'transform 0.15s'}}><Icon name="chevronDown" size={13}/></span>
                </span>
              </div>

              {/* 생성 시도(버전) 목록 */}
              {expanded && (
                <div>
                  {s.attempts.map((a, i) => {
                    const ai = LIB_STATUS[a.status];
                    const isLatest = i === 0;
                    return (
                      <div key={a.v} style={{
                        display:'grid',gridTemplateColumns:'86px 168px 1fr auto',gap:16,alignItems:'center',
                        padding:'13px 18px', borderTop: i ? '1px solid var(--admin-line-soft)' : 'none',
                        background: isLatest ? 'rgba(0,181,226,0.04)' : 'white'}}>
                        {/* 버전 */}
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{width:8,height:8,borderRadius:'50%',background: isLatest?'var(--hycu-cyan-deep)':'var(--admin-line)',flexShrink:0}}></span>
                          <span style={{fontFamily:'ui-monospace,monospace',fontSize:13,fontWeight:700,color: isLatest?'var(--hycu-cyan-deep)':'var(--admin-muted)'}}>v{a.v}</span>
                          {isLatest && <span style={{fontSize:9.5,padding:'1px 6px',borderRadius:3,background:'var(--hycu-cyan)',color:'white',fontWeight:700,letterSpacing:'0.04em'}}>최신</span>}
                        </div>
                        {/* 생성 시각 / 소요 */}
                        <div>
                          <div style={{fontFamily:'ui-monospace,monospace',fontSize:12,color:'var(--admin-ink)'}}>{a.at}</div>
                          <div style={{fontSize:11,color:'var(--admin-faint)',marginTop:2}}>{a.by} · {a.dur}</div>
                        </div>
                        {/* 생성 조건 / 메모 */}
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:12.5,color:'var(--admin-ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.note}</div>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4,flexWrap:'wrap'}}>
                            <span style={{fontSize:11,color:'var(--admin-muted)',background:'var(--admin-bg)',padding:'2px 8px',borderRadius:4}}>{a.opt}</span>
                            <span style={{fontSize:11,color:'var(--admin-muted)'}}>{a.slides}매</span>
                            <div style={{display:'flex',gap:3}}>
                              {a.langs.map(l => (
                                <span key={l} style={{fontSize:9,padding:'1.5px 5px',borderRadius:3,background:l==='KO'?'var(--hycu-cyan)':'var(--admin-bg)',color:l==='KO'?'white':'var(--admin-muted)',fontFamily:'ui-monospace,monospace',fontWeight:700,letterSpacing:'0.04em'}}>{l}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* 상태 + 액션 */}
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'3px 9px',borderRadius:999,background:ai.bg,color:ai.fg,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,whiteSpace:'nowrap'}}>
                            <span style={{width:5,height:5,borderRadius:'50%',background:ai.dot}}></span>{ai.l}
                          </span>
                          <button onClick={() => onScreen('preview')} title="미리보기" style={libIconBtn}><Icon name="eye" size={12}/></button>
                          <button onClick={() => onScreen('editor')} title="편집 · 검수 열기" style={libIconBtn}><Icon name="edit" size={12}/></button>
                          <button title="이 버전으로 복제해 재생성" style={libIconBtn}><Icon name="duplicate" size={12}/></button>
                          <button title="PPTX 다운로드" style={libIconBtn}><Icon name="download" size={12}/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const libIconBtn = {
  width: 28, height: 28, display: 'grid', placeItems: 'center',
  background: 'white', border: '1px solid var(--admin-line)', borderRadius: 7,
  color: 'var(--admin-muted)', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
};

window.Library = Library;
