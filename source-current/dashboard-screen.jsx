// === Dashboard (per spec: 이번 학기 개발 과목 + 내 담당 과목 + 최근활동) ===

const COURSES_2026_2 = [
  { id: 'AIG101', name: 'AI 리터러시', term: '2026-2', status: '개발중', cont: true },
];

const MY_COURSES = [
  { code: 'CBA003', name: '마케팅원론',              type: '전공',     credit: 3, lec: 3, lab: 0, level: 200, dev: '2024-1',     redev: 2028 },
  { code: 'CMI021', name: '소비자행동론',            type: '전공',     credit: 3, lec: 3, lab: 0, level: 200, dev: '2022-1',     redev: 2026 },
  { code: 'GMB000', name: '글로벌시대미디어채널전략', type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2025-1',     redev: 2029 },
  { code: 'GMB019', name: '상품및브랜드관리',        type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2024-1(*)',  redev: 2028 },
  { code: 'MBA001', name: '글로벌시대미디어채널전략', type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2025-1',     redev: 2029 },
  { code: 'MBA006', name: '상품및브랜드관리',        type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2024-1(*)',  redev: 2028 },
  { code: 'CMK005', name: '일상생활속마케팅',        type: '교양',     credit: 3, lec: 3, lab: 0, level: 100, dev: '2023-2(*)',  redev: 2027 },
  { code: 'CMK008', name: '브랜드경영전략',          type: '전공',     credit: 3, lec: 3, lab: 0, level: 300, dev: '2021-2',     redev: 2027 },
  { code: 'AIG101', name: 'AI 리터러시',              type: '전공',     credit: 3, lec: 3, lab: 0, level: 300, dev: '2021-2',     redev: 2025, active: true },
  { code: 'GMB006', name: '소비자행동연구',          type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2022-2',     redev: 2026 },
  { code: 'MBA004', name: '소비자행동연구',          type: '전공선택', credit: 3, lec: 3, lab: 0, level: null, dev: '2022-2',     redev: 2026 },
];

// ----- Dashboard -----
const Dashboard = ({ onScreen, lectures, gridMode, setGridMode, view }) => {
  if (view === 'courses') {
    return (
      <div className="content">
        <div className="page-heading">
          <div>
            <h1>내 강의</h1>
            <div className="sub">담당 과목 {MY_COURSES.length}개 · 재개발 도래 임박 {MY_COURSES.filter(c => c.redev <= 2026).length}개</div>
          </div>
          <div className="actions">
            <button className="btn btn-ghost"><Icon name="upload" size={14}/> CSV 가져오기</button>
            <button className="btn btn-cyan" onClick={() => onScreen('course-setup')}><Icon name="sparkles" size={14}/> AI로 새 교안 만들기</button>
          </div>
        </div>
        <CoursesTable rows={MY_COURSES} onScreen={onScreen}/>
      </div>
    );
  }
  const [filter, setFilter] = React.useState('all');
  const counts = {
    all: lectures.length,
    gen: lectures.filter(l => l.status === 'gen').length,
    review: lectures.filter(l => l.status === 'review').length,
    published: lectures.filter(l => l.status === 'published').length,
    draft: lectures.filter(l => l.status === 'draft').length};
  const statusLabel = { gen: '생성 중', review: '검토', published: '발행', draft: '초안' };

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <h1>안녕하세요, 홍길동 교수님</h1>
          <div className="sub">이번 학기 등록된 강의 6개 · AI 자동생성 평균 시간 4분 38초</div>
        </div>
        <div className="actions">
          <button className="btn btn-ghost"><Icon name="upload" size={14}/> 일괄 가져오기</button>
          <button className="btn btn-cyan" onClick={() => onScreen('course-setup')}><Icon name="sparkles" size={14}/> AI로 새 교안 만들기</button>
        </div>
      </div>

      <div className="stat-grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
        <Stat label="이번 학기 강의" value="6" delta="↑ 2" sub="지난 학기 대비" color="#00B5E2"/>
        <Stat label="총 슬라이드" value="178" delta="↑ 12 이번 주" sub="평균 30매/교시" color="#1971C2"/>
        <Stat label="AI 생성 시간 절감" value="62시간" delta="↑ 78%" sub="수동 대비" color="#2FA76A" highlight/>
      </div>

      <div style={{height:28}}></div>

      {/* === 이번 학기 개발 과목 === */}
      <SectionBanner label="이번 학기 개발 과목"/>
      <div style={{marginBottom:32}}>
        {COURSES_2026_2.map(c => (
          <div key={c.id} className="card" style={{
            display:'flex',alignItems:'center',gap:18,padding:'18px 22px',
            background:'linear-gradient(90deg, #0091B8 0%, #00B5E2 100%)',color:'white',border:0,
            boxShadow:'0 8px 24px -8px rgba(0,145,184,0.35)'
          }}>
            <span style={{padding:'6px 14px',background:'rgba(255,255,255,0.18)',borderRadius:6,fontFamily:'ui-monospace,monospace',fontSize:13,fontWeight:600,letterSpacing:'0.02em'}}>{c.term}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:17,fontWeight:600,letterSpacing:'-0.01em'}}>{c.name}</div>
              <div style={{fontSize:12,opacity:0.85,marginTop:2,fontFamily:'ui-monospace,monospace'}}>({c.id})</div>
            </div>
            <span style={{padding:'6px 14px',background:'rgba(255,255,255,0.95)',color:'#0091B8',borderRadius:6,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,display:'inline-flex',alignItems:'center',gap:6}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#0091B8',display:'inline-block'}}></span>
              {c.status}
            </span>
            <button onClick={() => onScreen('editor')} style={{
              padding:'10px 18px',background:'white',color:'#0091B8',border:0,borderRadius:8,
              fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,
              boxShadow:'0 2px 6px rgba(0,0,0,0.08)'
            }}>교안 이어하기 <Icon name="arrow" size={14}/></button>
          </div>
        ))}
      </div>

      {/* === 내 담당 과목 목록 + 최근활동 (2-column) === */}
      <div style={{display:'grid',gridTemplateColumns:'1.35fr 1fr',gap:24}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <SectionBanner label="내 담당 과목 목록" inline/>
            <button onClick={() => onScreen('editor')} style={{padding:'5px 12px',background:'transparent',color:'var(--hycu-cyan-deep)',border:'1px solid var(--hycu-cyan)',borderRadius:6,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,cursor:'pointer'}}>전체보기</button>
          </div>
          <CoursesTable rows={MY_COURSES} onScreen={onScreen}/>
        </div>
        <div>
          <SectionBanner label="최근활동"/>
          <div className="card" style={{padding:0,border:'1px solid var(--admin-line)',borderRadius:10,minHeight:400}}>
            <ActivityFeed/>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionBanner = ({ label, inline }) => (
  <div style={{
    display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px 7px 14px',
    background:'var(--ink-deep, #0E1116)',color:'white',
    borderRadius:6,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600,
    marginBottom: inline ? 0 : 12, letterSpacing:'-0.01em'
  }}>
    <span style={{width:3,height:14,background:'var(--hycu-cyan)',borderRadius:1.5,display:'inline-block'}}></span>
    {label}
  </div>
);

const CoursesTable = ({ rows, onScreen }) => {
  const typeColor = { '전공': 'var(--hycu-cyan-deep)', '전공선택': 'var(--admin-muted)', '교양': '#9A6B00' };
  return (
    <div className="card" style={{overflow:'hidden',padding:0}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead>
          <tr style={{background:'var(--admin-bg)',color:'var(--admin-charcoal)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em'}}>
            <th style={{padding:'10px 8px',textAlign:'left',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>학수번호</th>
            <th style={{padding:'10px 8px',textAlign:'left',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>교과목명</th>
            <th style={{padding:'10px 8px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>이수구분</th>
            <th style={{padding:'10px 4px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>학점</th>
            <th style={{padding:'10px 4px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>강의</th>
            <th style={{padding:'10px 4px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>실습</th>
            <th style={{padding:'10px 4px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)',lineHeight:1.2}}>레벨<br/>(학부)</th>
            <th style={{padding:'10px 8px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',borderRight:'1px solid var(--admin-line)'}}>개발연도</th>
            <th style={{padding:'10px 8px',textAlign:'center',borderBottom:'1px solid var(--admin-line)',lineHeight:1.2}}>재개발<br/>대상연도</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{
              background: r.active ? 'rgba(0,181,226,0.08)' : (i % 2 ? 'var(--admin-bg)' : 'white'),
              borderTop:'1px solid var(--admin-line-soft)',cursor:'pointer'
            }} onClick={() => onScreen('editor')}>
              <td style={{padding:'8px',fontFamily:'ui-monospace,monospace',fontWeight: r.active?700:500,color: r.active?'#0091B8':'var(--admin-ink)',borderRight:'1px solid var(--admin-line-soft)'}}>{r.code}</td>
              <td style={{padding:'8px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight: r.active?600:500,color:'var(--admin-ink)',borderRight:'1px solid var(--admin-line-soft)'}}>
                {r.name}{r.active && <span style={{marginLeft:6,padding:'1px 6px',background:'var(--hycu-cyan)',color:'white',borderRadius:3,fontSize:9,fontWeight:600,verticalAlign:'middle',letterSpacing:'0.04em'}}>현재</span>}
              </td>
              <td style={{padding:'8px',textAlign:'center',borderRight:'1px solid var(--admin-line-soft)'}}>
                <span style={{color:typeColor[r.type]||'var(--admin-muted)',fontWeight:500}}>{r.type}</span>
              </td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',borderRight:'1px solid var(--admin-line-soft)'}}>{r.credit}</td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',borderRight:'1px solid var(--admin-line-soft)'}}>{r.lec}</td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',color:r.lab===0?'var(--admin-faint)':'var(--admin-ink)',borderRight:'1px solid var(--admin-line-soft)'}}>{r.lab}</td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',color: r.level?'var(--admin-ink)':'var(--admin-faint)',borderRight:'1px solid var(--admin-line-soft)'}}>{r.level || '—'}</td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',borderRight:'1px solid var(--admin-line-soft)',color:'var(--admin-charcoal)'}}>{r.dev}</td>
              <td style={{padding:'8px',textAlign:'center',fontFamily:'ui-monospace,monospace',color: r.redev <= 2026 ? 'var(--hycu-cyan-deep)' : 'var(--admin-charcoal)', fontWeight: r.redev <= 2026 ? 700 : 400}}>{r.redev}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{padding:'10px 14px',background:'var(--admin-bg)',borderTop:'1px solid var(--admin-line)',display:'flex',alignItems:'center',gap:14,fontSize:11,color:'var(--admin-muted)'}}>
        <span><span style={{color:'var(--hycu-cyan-deep)',fontWeight:700}}>●</span> 재개발 도래</span>
        <span>(*) 부분 재개발</span>
        <div style={{flex:1}}></div>
        <span>총 {rows.length}개 과목</span>
      </div>
    </div>
  );
};

const Stat = ({ label, value, delta, sub, color, highlight }) => (
  <div className="stat" style={{background: highlight ? 'linear-gradient(135deg, #0E1116, #1B2129)' : undefined, borderColor: highlight ? '#0E1116' : undefined, color: highlight ? 'white' : undefined}}>
    <div className="label" style={{color: highlight ? 'rgba(255,255,255,0.6)' : undefined}}>{label}</div>
    <div className="value" style={{color: highlight ? 'white' : undefined}}>{value}</div>
    <div className="delta up" style={{color: highlight ? '#00B5E2' : color}}>{delta} <span style={{color:highlight?'rgba(255,255,255,0.5)':'var(--admin-muted)',marginLeft:6,fontWeight:400}}>{sub}</span></div>
    <div className="spark" style={{display:'flex',alignItems:'flex-end',gap:3,marginTop:14}}>
      {[3,4,3,5,4,6,5,7,6,8,7,9,8,10,9].map((h,i) => (
        <div key={i} style={{flex:1, height:h*2.6, background: highlight ? 'rgba(0,181,226,0.4)' : color, opacity: 0.25 + (i/15)*0.75, borderRadius:1}}></div>
      ))}
    </div>
  </div>
);

const ActivityFeed = () => {
  const events = [
    { ico: 'sparkles', tag: 'AI', msg: 'AI 리터러시 3주차 02교시 — 자동생성 완료 (28매)', t: '2분 전', accent: true },
    { ico: 'edit', tag: '편집', msg: '슬라이드 7 "조사설계" — 다이어그램 수정', t: '14분 전' },
    { ico: 'check', tag: '발행', msg: '마케팅원론 7주차 — LMS 발행됨', t: '2시간 전' },
    { ico: 'upload', tag: '업로드', msg: '참고자료 PDF 3건 추가 (Kotler 2022 외)', t: '3시간 전' },
    { ico: 'users', tag: '협업', msg: '조교 박서연이 7주차 검토 완료', t: '어제' },
    { ico: 'globe', tag: '번역', msg: '브랜드경영전략 5주차 — English 검수 대기', t: '어제' },
  ];
  return (
    <div>
      {events.map((e, i) => (
        <div key={i} style={{display:'flex',gap:14,padding:'14px 18px',borderTop: i?'1px solid var(--admin-line-soft)':'0',alignItems:'center'}}>
          <div style={{width:32,height:32,borderRadius:8,background: e.accent?'rgba(0,181,226,0.12)':'var(--admin-bg)',color: e.accent?'#0091B8':'var(--admin-muted)',display:'grid',placeItems:'center'}}>
            <Icon name={e.ico} size={14}/>
          </div>
          <div style={{flex:1}}>
            <span style={{fontSize:11,color:e.accent?'#0091B8':'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,letterSpacing:'0.04em',marginRight:10}}>{e.tag}</span>
            <span style={{color:'var(--admin-ink)',fontSize:13}}>{e.msg}</span>
          </div>
          <div style={{fontSize:11,color:'var(--admin-faint)'}}>{e.t}</div>
        </div>
      ))}
    </div>
  );
};

window.Dashboard = Dashboard;

// ===== 백그라운드 생성 알림 토스트 (글로벌) =====
const BgGenToast = ({ onResume }) => (
  <div style={{
    position:'fixed', right:24, bottom:24, zIndex:50,
    width:340, padding:'14px 16px',
    background:'var(--admin-ink)', color:'white',
    borderRadius:12, boxShadow:'0 20px 40px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,181,226,0.25)',
    fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',
    backgroundImage:'radial-gradient(circle at top right, rgba(0,181,226,0.2), transparent 60%)',
    animation:'toastSlideUp 0.4s ease'}}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
      <div style={{position:'relative',width:28,height:28,borderRadius:8,background:'rgba(0,181,226,0.18)',display:'grid',placeItems:'center',color:'#7DD8EE'}}>
        <Icon name="sparkles" size={14}/>
        <span style={{position:'absolute',top:-2,right:-2,width:8,height:8,borderRadius:'50%',background:'#22A06B',border:'2px solid #0E1116'}}></span>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:11,color:'#7DD8EE',fontWeight:700,letterSpacing:'0.08em'}}>일괄 생성 진행 중</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.65)',marginTop:1}}>AI 리터러시 · 백그라운드 작업</div>
      </div>
      <button onClick={() => onResume && onResume()} style={{padding:'4px 10px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',color:'white',borderRadius:6,fontSize:11,fontFamily:'inherit',fontWeight:700,cursor:'pointer'}}>보기</button>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,0.7)',marginBottom:6}}>
      <span>3 / 16 교시 완료</span>
      <span style={{fontFamily:'ui-monospace,monospace'}}>예상 8분 남음</span>
    </div>
    <div style={{height:5,background:'rgba(255,255,255,0.1)',borderRadius:999,overflow:'hidden'}}>
      <div style={{width:'19%',height:'100%',background:'linear-gradient(90deg, var(--hycu-cyan), #7DD8EE)',borderRadius:999,boxShadow:'0 0 8px rgba(0,181,226,0.6)'}}></div>
    </div>
    <style>{`
      @keyframes toastSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    `}</style>
  </div>
);

window.BgGenToast = BgGenToast;
