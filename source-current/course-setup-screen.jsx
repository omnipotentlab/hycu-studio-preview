// ----- Step 1: Course Info — analytics-driven (HYCU style) -----
// Full replacement: search existing course → view analytics → pick lecture type

// 학사시스템(LCMS)에서 SSO 세션으로 동기화된 담당 교과목 — 사용자가 입력하지 않고 불러오기만 함
const LINKED_COURSES = [
  { name: 'AI 리터러시',   code: 'AIG101', term: '2학년 2학기', room: '3-3-3', weeks: 15, done: 2, dept: '공통교육과', state: '개발중' },
  { name: '브랜드경영전략', code: 'CMK008', term: '3학년 1학기', room: '3-3-0', weeks: 15, done: 0, dept: '공통교육과', state: '신규' },
  { name: '소비자행동론',   code: 'CMI021', term: '2학년 2학기', room: '3-3-0', weeks: 15, done: 15, dept: '공통교육과', state: '재개발' },
];

const CourseSetup = ({ onScreen }) => {
  const [idx, setIdx] = React.useState(0);
  const [week, setWeek] = React.useState(3);
  const [syncing, setSyncing] = React.useState(false);
  const course = LINKED_COURSES[idx];
  const [lectureType, setLectureType] = React.useState('media');
  const [tab, setTab] = React.useState('info'); // 'info' | 'content-dev'

  const resync = () => { setSyncing(true); setTimeout(() => setSyncing(false), 1100); };

  // Reset scroll when tab changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [tab]);

  const TabBtn = ({ id, label }) => {
    const active = tab === id;
    return (
      <button onClick={() => setTab(id)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: active ? 'white' : 'transparent',
        padding: '10px 18px',
        border: active ? '1px solid var(--admin-line)' : '1px solid transparent',
        borderBottom: active ? '1px solid white' : '1px solid transparent',
        borderRadius: '8px 8px 0 0', position: 'relative', top: 1, cursor: 'pointer',
        fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:14, fontWeight: active ? 700 : 600,
        color: active ? 'var(--admin-ink)' : 'var(--admin-muted)'}}>
        <span style={{width: 3, height: 14, background: active ? 'var(--hycu-cyan-deep)' : 'transparent', borderRadius: 1}}></span>
        {label}
      </button>
    );
  };

  return (
    <div className="content">
      {/* Section tabs */}
      <div style={{marginTop: 18, marginBottom: 14}}>
        <div style={{display: 'flex', gap: 4}}>
          <TabBtn id="info" label="교과목 정보"/>
          <TabBtn id="content-dev" label="콘텐츠 개발 정보"/>
        </div>
        <div style={{height: 1, background: 'var(--admin-line)', position: 'relative', top: -1}}></div>
      </div>

      {tab === 'content-dev' ? (
        <ContentDev/>
      ) : (<>

      {/* 학사시스템 연동 — 교과목은 검색하는 것이 아니라 학사에서 불러온다 */}
      <div className="card" style={{padding:0, marginBottom:18, overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 18px',background:'linear-gradient(90deg, rgba(0,181,226,0.08), rgba(0,181,226,0.02))',borderBottom:'1px solid var(--admin-line)'}}>
          <span style={{width:26,height:26,borderRadius:7,background:'var(--hycu-cyan-deep)',color:'white',display:'grid',placeItems:'center',flexShrink:0}}><Icon name="link" size={13}/></span>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13.5,fontWeight:700,color:'var(--admin-ink)'}}>학사시스템(LCMS) 연동됨</div>
          <span style={{padding:'3px 9px',background:'rgba(47,167,106,0.12)',color:'#22804F',borderRadius:20,fontSize:11,fontWeight:700,display:'inline-flex',alignItems:'center',gap:5}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#2FA76A'}}></span>SSO 세션 유효
          </span>
          <span style={{fontSize:12,color:'var(--admin-muted)'}}>홍길동 교수 · {course.dept}</span>
          <div style={{flex:1}}></div>
          <span style={{fontSize:11.5,color:'var(--admin-faint)'}}>마지막 동기화 {syncing ? '진행 중…' : '방금 전'}</span>
          <button onClick={resync} style={{padding:'6px 12px',background:'white',border:'1px solid var(--admin-line)',borderRadius:6,fontFamily:'inherit',fontSize:12,fontWeight:600,color:'var(--admin-charcoal)',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>
            <span style={{display:'inline-flex',animation: syncing ? 'spin 0.8s linear infinite' : 'none'}}><Icon name="refresh" size={12}/></span> 다시 불러오기
          </button>
        </div>
        <div style={{padding:'16px 18px', display:'grid', gridTemplateColumns:'1fr 220px', gap:18, alignItems:'start'}}>
          <div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:600,marginBottom:8,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>담당 교과목 · 학사 동기화 {LINKED_COURSES.length}건</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {LINKED_COURSES.map((c, i) => {
                const on = i === idx;
                return (
                  <button key={c.code} onClick={() => setIdx(i)} style={{
                    display:'flex',alignItems:'center',gap:10,padding:'11px 14px',cursor:'pointer',textAlign:'left',
                    background: on ? 'rgba(0,181,226,0.07)' : 'white',
                    border: on ? '1.5px solid var(--hycu-cyan)' : '1px solid var(--admin-line)',
                    borderRadius:8, fontFamily:'inherit'}}>
                    <span style={{width:12,height:12,borderRadius:'50%',flexShrink:0,border: on ? '4px solid var(--hycu-cyan-deep)' : '1.5px solid var(--admin-line)',background:'white'}}></span>
                    <span>
                      <span style={{display:'block',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13.5,fontWeight: on?700:600,color:'var(--admin-ink)'}}>{c.name}</span>
                      <span style={{display:'block',fontSize:11,color:'var(--admin-muted)',marginTop:2,fontFamily:'ui-monospace,monospace'}}>{c.code} · {c.state} · {c.done}/{c.weeks}주차</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:600,marginBottom:8,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>생성할 주차</div>
            <select value={week} onChange={e => setWeek(Number(e.target.value))} style={{width:'100%',padding:'11px 12px',border:'1px solid var(--admin-line)',borderRadius:8,fontFamily:'inherit',fontSize:13.5,fontWeight:600,color:'var(--admin-ink)',background:'white',cursor:'pointer'}}>
              {Array.from({length: course.weeks}).map((_, i) => (
                <option key={i} value={i+1}>{i+1}주차{i < course.done ? ' — 생성완료' : ''}</option>
              ))}
            </select>
            <div style={{marginTop:8,fontSize:11.5,color:'var(--admin-faint)',lineHeight:1.5}}>주차 설계는 학사시스템 · 주차별 설계서에서 불러옵니다.</div>
          </div>
        </div>
      </div>

      {/* Row 1: three info cards */}
      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr', gap: 14, marginBottom: 18}}>
        <CourseBasicCard course={course}/>
        <CQICard/>
        <LectureTypeCard value={lectureType} setValue={setLectureType}/>
      </div>

      {/* Row 1 info cards only — analytics & HIPER-M removed for Phase 1 */}
      </>)}

      {/* 화면 내 탭 이동만 — 단계 이동은 하단 ProcessFooter가 단독으로 다룬다 */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--admin-line)'}}>
        <button className="btn btn-ghost" onClick={() => onScreen('dashboard')}>
          <Icon name="chevronLeft" size={14}/> 취소
        </button>
        {tab === 'info' ? (
          <button className="btn btn-primary" onClick={() => setTab('content-dev')}>
            콘텐츠 개발 정보 탭 <Icon name="chevronRight" size={14}/>
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={() => setTab('info')}>
            <Icon name="chevronLeft" size={14}/> 교과목 정보 탭
          </button>
        )}
      </div>
    </div>
  );
};

// ===== Card title with cyan side-bar (HYCU style) =====
const CardTitle = ({ children }) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16}}>
    <span style={{width: 3, height: 16, background: 'var(--hycu-cyan-deep)', borderRadius: 1}}></span>
    <h3 style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, margin: 0, fontWeight: 700, color: 'var(--admin-ink)'}}>{children}</h3>
  </div>
);

// ===== Course basic info card =====
const CourseBasicCard = ({ course }) => (
  <div className="card" style={{padding: 20}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16}}>
      <span style={{width: 3, height: 16, background: 'var(--hycu-cyan-deep)', borderRadius: 1}}></span>
      <h3 style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, margin: 0, fontWeight: 700, color: 'var(--admin-ink)'}}>교과목 기본 정보</h3>
      <span style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',background:'var(--admin-bg)',border:'1px solid var(--admin-line)',borderRadius:20,fontSize:10.5,fontWeight:700,color:'var(--admin-muted)'}}>
        <Icon name="lock" size={10}/> 학사 연동
      </span>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', marginBottom: 14}}>
      <Field2 label="과목명" value={course.name} mono={false}/>
      <div></div>
      <Field2 label="학수번호" value={course.code}/>
      <Field2 label="학년-학기" value={course.term}/>
      <Field2Underline label="학강실" value={course.room}/>
      <div></div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px dashed var(--admin-line)'}}>
      <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 11, color: 'var(--admin-muted)', fontWeight: 600, letterSpacing: '0.02em'}}>교과목기획서</span>
      <button style={btnLink}>교과목 기획서 열기</button>
    </div>
  </div>
);

const Field2 = ({ label, value }) => (
  <div>
    <div style={{fontSize: 11, color: 'var(--admin-muted)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 600, marginBottom: 5}}>{label}</div>
    <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--admin-ink)'}}>{value}</div>
  </div>
);
const Field2Underline = ({ label, value }) => (
  <div>
    <div style={{fontSize: 11, color: 'var(--admin-muted)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 600, marginBottom: 5, textDecoration: 'underline', textUnderlineOffset: 3}}>{label}</div>
    <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--admin-ink)'}}>{value}</div>
  </div>
);

const btnLink = {
  marginLeft: 'auto', padding: '7px 14px', background: 'white',
  border: '1px solid var(--hycu-cyan)', color: 'var(--hycu-cyan-deep)',
  borderRadius: 5, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:12, fontWeight: 600, cursor: 'pointer'};

// ===== CQI report card =====
const CQICard = () => (
  <div className="card" style={{padding: 20}}>
    <CardTitle>콘텐츠 CQI보고서</CardTitle>
    <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14}}>
      <CQIRow label="학습자 요구 사항" lines={['실습 사례 확충', '평가 피드백 강화']}/>
      <CQIRow label="교수자 요구사항" lines={['최신 AI 도구 사례 반영', '실무 프롬프트 예제 추가']}/>
      <CQIRow label="개선 사항" lines={['7주차 분량 재조정', '퀴즈 난이도 표준화']}/>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px dashed var(--admin-line)'}}>
      <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 11, color: 'var(--admin-muted)', fontWeight: 600}}>콘텐츠CQI보고서</span>
      <button style={btnLink}>콘텐츠CQI보고서 열기</button>
    </div>
  </div>
);

const CQIRow = ({ label, lines }) => (
  <div>
    <div style={{fontSize: 11, color: 'var(--admin-muted)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 600, marginBottom: 4}}>{label}</div>
    <div style={{
      fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--admin-ink)',
      lineHeight: 1.55}}>{lines.join(' / ')}</div>
  </div>
);

// ===== Lecture type selector =====
const LectureTypeCard = ({ value, setValue }) => {
  const types = [
    { id: 'mc',   label: 'MC' },
    { id: 'eb',   label: '전자칠판' },
    { id: 'media',label: '미디어월' },
    { id: 'set',  label: '세트 스튜디오' },
  ];
  return (
    <div className="card" style={{padding: 20}}>
      <CardTitle>메인 강의유형 선택</CardTitle>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {types.map(t => {
          const active = value === t.id;
          return (
            <button key={t.id} onClick={() => setValue(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', textAlign: 'left',
              background: active ? 'rgba(0,181,226,0.07)' : 'white',
              border: active ? '1.5px solid var(--hycu-cyan)' : '1px solid var(--admin-line)',
              borderRadius: 6, cursor: 'pointer'}}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                border: active ? '4px solid var(--hycu-cyan-deep)' : '1.5px solid var(--admin-muted)',
                background: 'white', flexShrink: 0}}></span>
              <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:14, fontWeight: active ? 700 : 500, color: 'var(--admin-ink)'}}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===== Analytics grid =====
// Magazine layout: 3 rows × 4 cols, narrative findings rail on right (rowSpan 3)
// Row 1: trends (enroll | grade | dropout)
// Row 2: satisfaction (wide, span 2) | engagement KPIs
// Row 3: demographics (gender | age) | summary
const AnalyticsGrid = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr)) 1.2fr',
    gridAutoRows: 'minmax(220px, auto)',
    gap: 14}}>
    <Tile><EnrollChart/></Tile>
    <Tile><GradeChart/></Tile>
    <Tile><DropoutChart/></Tile>
    <Tile style={{gridRow: 'span 3', padding: 0, background: 'transparent', border: 'none'}}><FindingsPanel/></Tile>

    <Tile style={{gridColumn: 'span 2'}}><SatisfactionPanel/></Tile>
    <Tile><EngagementKPIs/></Tile>

    <Tile><GenderChart/></Tile>
    <Tile><AgeChart/></Tile>
    <Tile><SummaryPanel/></Tile>
  </div>
);

const Tile = ({ children, style }) => (
  <div style={{
    background: 'white', border: '1px solid var(--admin-line)', borderRadius: 8,
    padding: 14, display: 'flex', flexDirection: 'column',
    ...style}}>{children}</div>
);

const TileTitle = ({ children, value }) => (
  <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, gap: 8}}>
    <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--admin-ink)'}}>{children}</div>
    {value && <div style={{fontSize: 12, color: 'var(--admin-muted)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', whiteSpace: 'nowrap'}}>{value}</div>}
  </div>
);

// ----- Enrollment line chart -----
const EnrollChart = () => {
  const a = [520, 482, 465];
  const b = [420, 389, 372];
  return (
    <>
      <TileTitle value="단위: 명">수강인원 추이</TileTitle>
      <LegendRow items={[
        { c: '#0091B8', l: '수강신청자' },
        { c: '#7DD8EE', l: '최종수료자', dashed: true },
      ]}/>
      <LineChart series={[
        { data: a, color: '#0091B8', label: '수강신청자' },
        { data: b, color: '#7DD8EE', label: '최종수료자', dashed: true },
      ]} xLabels={['2021', '2022', '2023']} yMax={600} height={120}/>
    </>
  );
};

// ----- Grade distribution -----
const GradeChart = () => (
  <>
    <TileTitle value={<>평균 / 표준편차</>}>성적 분포</TileTitle>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 6}}>
      <MiniStat n="78.6" unit="점" sub="평균"/>
      <MiniStat n="12.4" unit="" sub="표준편차" small/>
    </div>
    <BarChart values={[5, 14, 33, 32, 16]} labels={['0-59', '60-69', '70-79', '80-89', '90-100']}
      colorIndex={2} suffix="%" height={88}/>
  </>
);

// ----- Satisfaction -----
const SatisfactionPanel = () => {
  const items = [
    ['전반적 만족도', 4.3],
    ['강의내용', 4.2],
    ['강의구성', 4.4],
    ['교수자 전달력', 4.5],
    ['학습 도움도', 4.3],
  ];
  return (
    <>
      <TileTitle value="(평균)">강의 만족도</TileTitle>
      <div style={{display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'center', flex: 1}}>
        {/* Hero score block */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, paddingTop: 4}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 4}}>
            <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 56, fontWeight: 800, color: 'var(--admin-ink)', lineHeight: 0.95, letterSpacing: '-0.02em'}}>4.3</div>
            <div style={{fontSize: 16, color: 'var(--admin-muted)', fontWeight: 500}}>/ 5.0</div>
          </div>
          <Stars value={4.3}/>
          <div style={{fontSize:12, color: 'var(--admin-muted)', marginTop: 4, lineHeight: 1.5}}>최근 3년 평균<br/>응답자 1,367명</div>
        </div>
        {/* Bar list */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
          {items.map(([label, v]) => (
            <div key={label} style={{display: 'grid', gridTemplateColumns: '110px 1fr 34px', alignItems: 'center', gap: 10}}>
              <div style={{fontSize: 13, color: 'var(--admin-ink)', whiteSpace: 'nowrap'}}>{label}</div>
              <div style={{height: 7, background: 'var(--admin-bg)', borderRadius: 999, overflow: 'hidden'}}>
                <div style={{width: `${(v/5)*100}%`, height: '100%', background: 'var(--hycu-cyan-deep)', borderRadius: 999}}></div>
              </div>
              <div style={{fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: 'var(--admin-ink)', textAlign: 'right'}}>{v.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Stars = ({ value }) => {
  return (
    <div style={{display: 'flex', gap: 2}}>
      {[1,2,3,4,5].map(i => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`star-${i}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fill*100}%`} stopColor="#F5A623"/>
                <stop offset={`${fill*100}%`} stopColor="#E5E8EE"/>
              </linearGradient>
            </defs>
            <path d="M12 2l3 6.5 7 0.8-5.2 4.8 1.4 7-6.2-3.6-6.2 3.6 1.4-7L2 9.3l7-0.8z"
                  fill={`url(#star-${i})`}/>
          </svg>
        );
      })}
    </div>
  );
};

// ----- Gender -----
const GenderChart = () => {
  const m = 31, f = 44;
  const total = m + f;
  const mPct = ((m/total)*100).toFixed(1);
  const fPct = ((f/total)*100).toFixed(1);
  // bar geometry: viewBox 200x130; baseline y=115; max bar height 80 → maps v=44 to 75 height
  const maxV = 50;
  const baseY = 115;
  const maxH = 85;
  const barW = 52;
  const mH = (m/maxV)*maxH;
  const fH = (f/maxV)*maxH;
  const mX = 32, fX = 116;
  return (
    <>
      <TileTitle value="단위: 명">성별</TileTitle>
      <svg width="100%" viewBox="0 0 200 130" style={{overflow: 'visible'}} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g-male" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2A3D52"/>
            <stop offset="100%" stopColor="#1B2C3F"/>
          </linearGradient>
          <linearGradient id="g-female" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00B5E2"/>
            <stop offset="100%" stopColor="#0091B8"/>
          </linearGradient>
          {/* Male silhouette — head + shoulders */}
          <symbol id="ic-male" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="5"/>
            <path d="M3 30 Q3 16 12 16 Q21 16 21 30 Z"/>
          </symbol>
          {/* Female silhouette — head + triangular dress */}
          <symbol id="ic-female" viewBox="0 0 24 32">
            <circle cx="12" cy="7" r="5"/>
            <path d="M12 14 L20 30 L4 30 Z"/>
            <rect x="9" y="13" width="6" height="4" rx="1"/>
          </symbol>
        </defs>
        <line x1="0" x2="200" y1={baseY} y2={baseY} stroke="var(--admin-line)" strokeWidth="1"/>

        {/* Male bar */}
        <rect x={mX} y={baseY - mH} width={barW} height={mH} fill="url(#g-male)" rx="3"/>
        <text x={mX + barW/2} y={baseY - mH - 6} textAnchor="middle" fontSize="16" fontFamily="HYCUGothicM" fontWeight="800" fill="#1B2C3F">{m}</text>
        <text x={mX + barW/2} y={baseY + 13} textAnchor="middle" fontSize="12" fontFamily="HYCUGothicM" fontWeight="700" fill="var(--admin-ink)">남</text>

        {/* Female bar */}
        <rect x={fX} y={baseY - fH} width={barW} height={fH} fill="url(#g-female)" rx="3"/>
        <text x={fX + barW/2} y={baseY - fH - 6} textAnchor="middle" fontSize="16" fontFamily="HYCUGothicM" fontWeight="800" fill="#0091B8">{f}</text>
        <text x={fX + barW/2} y={baseY + 13} textAnchor="middle" fontSize="12" fontFamily="HYCUGothicM" fontWeight="700" fill="var(--admin-ink)">여</text>
      </svg>
    </>
  );
};

// ----- Age distribution -----
const AgeChart = () => {
  const data = [
    { age: '20대', v: 26, c: '#0091B8' },
    { age: '30대', v: 21, c: '#00B5E2' },
    { age: '40대', v: 15, c: '#7DD8EE' },
    { age: '50대', v: 13, c: '#F5A623' },
    { age: '60대', v: 0, c: '#5A6B7E' },
    { age: '70대', v: 0, c: '#1B2C3F' },
  ];
  const maxV = 30;
  return (
    <>
      <TileTitle value="단위: 명">연령</TileTitle>
      <svg width="100%" viewBox="0 0 240 130" style={{overflow: 'visible'}}>
        <line x1="0" x2="240" y1="105" y2="105" stroke="var(--admin-line)" strokeWidth="1"/>
        {data.map((d, i) => {
          const x = 10 + i * 38;
          const h = (d.v / maxV) * 85;
          return (
            <g key={d.age}>
              {d.v > 0 && <text x={x + 14} y={105 - h - 5} textAnchor="middle" fontSize="13" fontFamily="HYCUGothicM" fontWeight="700" fill={d.c}>{d.v}</text>}
              <rect x={x} y={105 - h} width="28" height={h} fill={d.c}/>
              <text x={x + 14} y="122" textAnchor="middle" fontSize="11" fill="var(--admin-muted)">{d.age}</text>
            </g>
          );
        })}
      </svg>
    </>
  );
};

// ----- Dropout / mid-term withdrawal -----
const DropoutChart = () => {
  const data = [11.2, 12.8, 13.9];
  return (
    <>
      <TileTitle>중간 이탈 현황</TileTitle>
      <div style={{fontSize: 11, color: 'var(--admin-muted)', marginBottom: 2}}>평균 중간 이탈률</div>
      <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--admin-ink)', marginBottom: 4, lineHeight: 1}}>12.6%</div>
      <LineChart series={[{ data, color: '#0091B8', label: '이탈률' }]}
        xLabels={['2021', '2022', '2023']} yMax={20} height={90}
        markers={data.map((v, i) => ({ label: `${v.toFixed(1)}%` }))}/>
    </>
  );
};

// ----- Engagement KPI 4-up -----
const EngagementKPIs = () => {
  const kpis = [
    { i: 'file',    l: '출석률',     v: '92.1%' },
    { i: 'play',    l: '강의 시청률', v: '88.7%' },
    { i: 'edit',    l: '과제 제출률',  v: '85.3%' },
    { i: 'message', l: '토론 참여율',  v: '34.2%' },
  ];
  return (
    <>
      <TileTitle value="(평균)">학습 참여도</TileTitle>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 8, flex: 1}}>
        {kpis.map(k => (
          <div key={k.l} style={{
            padding: '10px 12px', background: 'var(--admin-bg)', borderRadius: 6,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 70}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, height: 22}}>
              <span style={{width: 22, height: 22, background: 'var(--hycu-cyan)', borderRadius: 5, display: 'grid', placeItems: 'center', color: 'white', flexShrink: 0}}>
                <Icon name={k.i} size={12}/>
              </span>
              <span style={{fontSize: 12, color: 'var(--admin-muted)', whiteSpace: 'nowrap'}}>{k.l}</span>
            </div>
            <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 19, fontWeight: 700, color: 'var(--admin-ink)', marginTop: 6}}>{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// ----- 주요 학습 특성 요약 -----
const SummaryPanel = () => (
  <>
    <div style={{
      fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 14, fontWeight: 700,
      color: 'var(--admin-ink)', marginBottom: 12}}>주요 학습 특성 요약</div>
    <ul style={{
      margin: 0, padding: 0, listStyle: 'none',
      display: 'flex', flexDirection: 'column', gap: 10}}>
      {[
        '수강인원은 소속 감소 추세이나, 수료율은 상대적으로 한정적입니다.',
        '성적은 70~89점 구간에 65%가 분포되어 있으며, 평균은 78.6점입니다.',
        '강의 만족도는 전반적으로 높은 편이며, 특히 교수자 전달력에 대한 평가가 높습니다.',
        '중간 이탈은 3주차, 8주차에 주로 발생하는 경향이 있습니다.',
      ].map((t, i) => (
        <li key={i} style={{display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--admin-ink)'}}>
          <span style={{flexShrink: 0, color: 'var(--hycu-cyan-deep)', fontWeight: 700, marginTop: 1}}>•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  </>
);

// ----- Key findings panel -----
const FindingsPanel = () => {
  const findings = [
    { tag: '학습자 구성', body: '직장인 비중 72% — 30·40대 핵심 수요층 형성', delta: '+6%p' },
    { tag: '중간 이탈 패턴', body: '7주차 평가 전후 집중 발생 (평균 12.6%)', delta: null },
    { tag: '콘텐츠 선호도', body: '실습·사례형 콘텐츠 만족도 4.5/5.0', delta: '최상위' },
    { tag: '구조적 만족', body: '학습 도움도 4.3 / 강의구성 4.4 — 안정적', delta: null },
  ];
  const actions = [
    '실습·사례 콘텐츠 비중 30% → 45% 확대',
    '7주차 학습 분량 재조정 및 평가 피드백 강화',
    '직장인 학습자 대상 모바일 학습 동선 최적화',
  ];
  return (
    <div style={{
      background: 'var(--admin-ink)', color: 'white',
      padding: '22px 22px 20px', borderRadius: 8, height: '100%',
      display: 'flex', flexDirection: 'column', gap: 18,
      }}>
      {/* Header */}
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
          <div style={{width: 6, height: 6, borderRadius: '50%', background: '#7DD8EE', boxShadow: '0 0 0 4px rgba(125,216,238,0.18)'}}></div>
          <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: '#7DD8EE', letterSpacing: '0.14em', textTransform: 'uppercase'}}>Key Findings</div>
        </div>
        <div style={{fontSize:12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5}}>최근 3년 학습 데이터 종합 분석</div>
      </div>

      {/* Headline metric */}
      <div style={{padding: '14px 16px', background: 'rgba(125,216,238,0.08)', border: '1px solid rgba(125,216,238,0.2)', borderRadius: 6}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2}}>
          <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: '#7DD8EE', lineHeight: 1, letterSpacing: '-0.02em'}}>88<span style={{fontSize: 18, fontWeight: 700}}>%</span></div>
          <div style={{fontSize: 11, color: 'rgba(125,216,238,0.85)', fontWeight: 600, marginLeft: 'auto', background: 'rgba(125,216,238,0.18)', padding: '2px 7px', borderRadius: 4}}>전년 +6%p</div>
        </div>
        <div style={{fontSize: 12, color: '#D6DBE3', lineHeight: 1.5, marginTop: 4}}>실무 사례·실습형 콘텐츠 선호 응답률</div>
      </div>

      {/* Findings list */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', fontWeight: 700, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>FINDINGS</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
          {findings.map((f, i) => (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start'}}>
              <div style={{fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#7DD8EE', fontWeight: 700, paddingTop: 2}}>0{i+1}</div>
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap'}}>
                  <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'white'}}>{f.tag}</div>
                  {f.delta && <div style={{fontSize: 10, color: '#7DD8EE', background: 'rgba(125,216,238,0.14)', padding: '1px 6px', borderRadius: 3, fontWeight: 600}}>{f.delta}</div>}
                </div>
                <div style={{fontSize: 12, color: '#B8C2CC', lineHeight: 1.5}}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended actions */}
      <div style={{padding: '14px 14px 14px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6}}>
        <div style={{fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', fontWeight: 700, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', marginBottom: 10}}>RECOMMENDED ACTIONS</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {actions.map((a, i) => (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, alignItems: 'start'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" style={{marginTop: 2}}>
                <path d="M20 6L9 17l-5-5" stroke="#7DD8EE" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{fontSize: 12, color: '#D6DBE3', lineHeight: 1.5}}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer callout */}
      <div style={{
        padding: '12px 14px',
        background: 'linear-gradient(135deg, rgba(0,145,184,0.25), rgba(125,216,238,0.12))',
        borderLeft: '3px solid #7DD8EE',
        borderRadius: '0 6px 6px 0'}}>
        <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 12, fontWeight: 700, color: '#7DD8EE', marginBottom: 3, letterSpacing: '0.02em'}}>콘텐츠 개발 방향</div>
        <div style={{fontSize:12, color: '#E8EEF3', lineHeight: 1.55}}>실무 즉시 적용 가능한 실습 비중 확대 + 학습 부담 분산</div>
      </div>
    </div>
  );
};

// ===== HIPER-M =====
const HiperM = () => {
  const axes = [
    { key: 'M', name: 'Motivation', value: 4 },
    { key: 'H', name: 'Hybrid', value: 3 },
    { key: 'I', name: 'Interaction', value: 4 },
    { key: 'P', name: 'Presence', value: 4 },
    { key: 'E', name: 'Experience', value: 5 },
    { key: 'R', name: 'Reflection', value: 5 },
  ];
  const avg = (axes.reduce((s, a) => s + a.value, 0) / axes.length).toFixed(1);
  const values = axes.map(a => a.value);
  const minAxis = axes.reduce((m, a) => a.value < m.value ? a : m, axes[0]);
  const maxAxis = axes.reduce((m, a) => a.value > m.value ? a : m, axes[0]);
  const actions = [
    { tag: 'Hybrid 강화', body: '온라인 학습 → 오프라인 활동 연결 동선 설계로 약점 보완', priority: 'HIGH' },
    { tag: 'Interaction 확장', body: '실시간 Q&A·토론 콘텐츠 비중 +15%p 증가 검토', priority: 'MED' },
    { tag: 'Experience 유지', body: '실습·사례 콘텐츠의 강점을 신규 교시에도 일관 적용', priority: 'KEEP' },
  ];

  return (
    <div>
      {/* Compact header strip */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 16px', borderBottom: '1px solid var(--admin-line)', marginBottom: 16}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
            <div style={{fontSize:11, color: 'var(--admin-muted)', letterSpacing: '0.16em', fontWeight: 700, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>OVERALL</div>
            <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--admin-ink)', lineHeight: 1, letterSpacing: '-0.02em'}}>{avg}</div>
            <div style={{fontSize: 12, color: 'var(--admin-muted)', fontWeight: 500}}>/ 5.0</div>
          </div>
          <div style={{width: 1, height: 22, background: 'var(--admin-line)'}}></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: '#2FA76A', color: 'white', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 800, fontSize: 11}}>{maxAxis.key}</span>
            <span style={{fontSize:12, color: 'var(--admin-muted)'}}>Strongest</span>
            <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'var(--admin-ink)'}}>{maxAxis.name} {maxAxis.value}.0</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: '#F26B1C', color: 'white', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 800, fontSize: 11}}>{minAxis.key}</span>
            <span style={{fontSize:12, color: 'var(--admin-muted)'}}>Focus</span>
            <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'var(--admin-ink)'}}>{minAxis.name} {minAxis.value}.0</span>
          </div>
        </div>
        <div style={{fontSize: 11, color: 'var(--admin-muted)'}}>6축 종합 평가 · HIPER-M</div>
      </div>

      {/* Main: Axis breakdown + radar */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center'}}>
        {/* Left — axis cards */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {axes.map(a => {
            const pct = (a.value / 5) * 100;
            const tone = a.value >= 5 ? '#2FA76A' : a.value >= 4 ? 'var(--hycu-cyan-deep)' : '#F26B1C';
            return (
              <div key={a.key} style={{display: 'grid', gridTemplateColumns: '26px 1fr auto', alignItems: 'center', gap: 12, padding: '6px 2px'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 5, background: tone, color: 'white', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 800, fontSize: 12}}>{a.key}</span>
                <div style={{minWidth: 0}}>
                  <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'var(--admin-ink)', marginBottom: 4}}>{a.name}</div>
                  <div style={{height: 4, background: 'var(--admin-bg)', borderRadius: 999, overflow: 'hidden'}}>
                    <div style={{width: `${pct}%`, height: '100%', background: tone, borderRadius: 999}}></div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 2, minWidth: 32, justifyContent: 'flex-end'}}>
                  <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 14, fontWeight: 800, color: tone, lineHeight: 1}}>{a.value}</div>
                  <div style={{fontSize: 10, color: 'var(--admin-muted)'}}>/5</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right — radar */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Radar6 axes={axes.map(a => a.name)} values={values}/>
        </div>
      </div>

      {/* Bottom: Recommended Actions */}
      <div style={{marginTop: 18, padding: '14px 18px', background: 'var(--admin-ink)', borderRadius: 8, color: 'white'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
          <div style={{width: 5, height: 5, borderRadius: '50%', background: '#7DD8EE'}}></div>
          <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:11, fontWeight: 700, color: '#7DD8EE', letterSpacing: '0.16em', textTransform: 'uppercase'}}>Recommended Actions</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
          {actions.map((a, i) => {
            const pColor = a.priority === 'HIGH' ? '#F26B1C' : a.priority === 'MED' ? '#7DD8EE' : '#2FA76A';
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{fontSize: 9.5, color: pColor, background: `${pColor}22`, padding: '1px 6px', borderRadius: 3, fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>{a.priority}</div>
                  <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'white'}}>{a.tag}</div>
                </div>
                <div style={{fontSize:12, color: '#C5CDD6', lineHeight: 1.5}}>{a.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const hmTh = {
  border: '1px solid var(--admin-line)', padding: '6px 8px',
  background: 'var(--admin-bg)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif',
  fontSize: 11, fontWeight: 700, color: 'var(--admin-ink)'};
const hmTd = {
  border: '1px solid var(--admin-line)', padding: '7px 10px',
  fontSize: 12, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', color: 'var(--admin-ink)'};

// ===== Reusable chart primitives =====

const LineChart = ({ series, xLabels, yMax, height = 100, markers }) => {
  const W = 240, H = height, pad = { l: 22, r: 12, t: 18, b: 22 };
  const xs = xLabels.map((_, i) => pad.l + (i / (xLabels.length - 1)) * (W - pad.l - pad.r));
  const y = v => H - pad.b - (v / yMax) * (H - pad.t - pad.b);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
      {/* grid */}
      {[0, 0.5, 1].map((p, i) => (
        <line key={i} x1={pad.l} x2={W - pad.r} y1={y(p * yMax)} y2={y(p * yMax)} stroke="var(--admin-line)" strokeWidth="0.5" strokeDasharray="2 2"/>
      ))}
      {/* lines */}
      {series.map((s, i) => {
        const pts = s.data.map((v, k) => `${xs[k]},${y(v)}`).join(' ');
        return (
          <g key={i}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="1.8"
              strokeDasharray={s.dashed ? '3 3' : 'none'}/>
            {s.data.map((v, k) => (
              <circle key={k} cx={xs[k]} cy={y(v)} r="3" fill={s.color}/>
            ))}
            {/* value labels for primary series */}
            {i === 0 && s.data.map((v, k) => (
              <text key={k} x={xs[k]} y={y(v) - 8} textAnchor="middle" fontSize="12" fontFamily="HYCUGothicM" fontWeight="700" fill={s.color}>{v}</text>
            ))}
          </g>
        );
      })}
      {/* x labels */}
      {xLabels.map((l, i) => (
        <text key={l} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="11" fill="var(--admin-muted)">{l}</text>
      ))}
    </svg>
  );
};

const BarChart = ({ values, labels, height = 80, suffix = '' }) => {
  const W = 240, H = height, pad = { l: 4, r: 4, t: 20, b: 20 };
  const max = Math.max(...values, 1);
  const bw = (W - pad.l - pad.r) / values.length * 0.7;
  const gap = (W - pad.l - pad.r) / values.length * 0.3;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="var(--admin-line)" strokeWidth="0.5"/>
      {values.map((v, i) => {
        const x = pad.l + i * (bw + gap) + gap/2;
        const h = (v / max) * (H - pad.t - pad.b);
        const y = H - pad.b - h;
        return (
          <g key={i}>
            <text x={x + bw/2} y={y - 5} textAnchor="middle" fontSize="12" fontFamily="HYCUGothicM" fontWeight="700" fill="#0091B8">{v}{suffix}</text>
            <rect x={x} y={y} width={bw} height={h} fill="#7DD8EE"/>
            <text x={x + bw/2} y={H - 4} textAnchor="middle" fontSize="11" fill="var(--admin-muted)">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
};

const MiniStat = ({ n, unit, sub, small }) => (
  <div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 2}}>
      <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: small ? 18 : 22, fontWeight: 800, color: 'var(--admin-ink)', lineHeight: 1}}>{n}</span>
      {unit && <span style={{fontSize: 10, color: 'var(--admin-muted)'}}>{unit}</span>}
    </div>
    {sub && <div style={{fontSize: 10, color: 'var(--admin-muted)', marginTop: 2}}>{sub}</div>}
  </div>
);

const LegendRow = ({ items }) => (
  <div style={{display: 'flex', gap: 14, marginBottom: 6, fontSize:12, color: 'var(--admin-muted)'}}>
    {items.map((it, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 6}}>
        <span style={{
          width: 18, height: 3, background: it.dashed ? 'transparent' : it.c,
          borderTop: it.dashed ? `2px dashed ${it.c}` : 'none'
        }}></span>
        <span>{it.l}</span>
      </div>
    ))}
  </div>
);

// ===== Hexagonal radar =====
const Radar6 = ({ axes, values }) => {
  const cx = 130, cy = 130, R = 100;
  const angle = i => (Math.PI / 2) - (i * Math.PI / 3); // start top, clockwise
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy - r * Math.sin(angle(i))];

  const grid = [1, 2, 3, 4, 5].map(level => {
    const r = (level / 5) * R;
    const pts = axes.map((_, i) => pt(i, r).join(',')).join(' ');
    return <polygon key={level} points={pts} fill="none" stroke={level === 5 ? 'var(--admin-line)' : 'var(--admin-line)'} strokeWidth="0.6"/>;
  });

  const valuePts = values.map((v, i) => pt(i, (v / 5) * R).join(',')).join(' ');

  return (
    <svg width="260" height="260" viewBox="0 0 260 260" style={{margin: '0 auto', display: 'block', overflow: 'visible'}}>
      {grid}
      {axes.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--admin-line)" strokeWidth="0.6"/>;
      })}
      <polygon points={valuePts} fill="rgba(0,145,184,0.15)" stroke="var(--hycu-cyan-deep)" strokeWidth="1.6"/>
      {values.map((v, i) => {
        const [x, y] = pt(i, (v / 5) * R);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--hycu-cyan-deep)"/>;
      })}
      {axes.map((ax, i) => {
        const [x, y] = pt(i, R + 18);
        return <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontFamily="HYCUGothicM" fontWeight="600" fill="var(--admin-ink)">{ax}</text>;
      })}
    </svg>
  );
};

// ===== Stepper (kept for wizard) =====
const Stepper = ({ current, onGo }) => {
  const steps = [
    { n: 1, label: '교과목 정보',     sub: '기획서 · CQI' },
    { n: 2, label: '교안 제작 설정',   sub: '교시·자료·학습 목표' },
    { n: 3, label: '슬라이드 구성 설정', sub: '분량·ADDIE·톤' },
    { n: 4, label: 'AI 생성',         sub: '최종 검토 후 실행' },
  ];
  const total = steps.length;
  const doneCount = current - 1;
  const progress = Math.min(100, Math.max(0, ((doneCount + (current <= total ? 0.5 : 0)) / total) * 100));

  return (
    <div style={{
      position:'relative',
      padding:'22px 28px',
      background:'linear-gradient(180deg, #FFFFFF 0%, #FBFCFD 100%)',
      border:'1px solid var(--admin-line)',
      borderRadius:16,
      boxShadow:'0 1px 0 rgba(15,22,30,0.02), 0 8px 24px -16px rgba(15,22,30,0.08)',
      marginBottom:18,
      overflow:'hidden'}}>
      {/* Faint cyan glow accent at top-right */}
      <div style={{position:'absolute',top:-60,right:-60,width:180,height:180,background:'radial-gradient(circle, rgba(0,181,226,0.08), transparent 70%)',pointerEvents:'none'}}></div>

      {/* Top meta row */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18,position:'relative'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--hycu-cyan-deep)',fontWeight:700,letterSpacing:'0.12em'}}>STEP {current} / {total}</span>
          <span style={{width:3,height:3,borderRadius:'50%',background:'var(--admin-line)'}}></span>
          <span style={{fontSize:12,color:'var(--admin-muted)'}}>{steps[current-1]?.label} · {steps[current-1]?.sub}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:120,height:4,borderRadius:999,background:'#EEF1F5',overflow:'hidden'}}>
            <div style={{width:`${progress}%`,height:'100%',background:'linear-gradient(90deg, var(--hycu-cyan), var(--hycu-cyan-deep))',borderRadius:999,transition:'width 0.4s ease'}}></div>
          </div>
          <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',fontWeight:600,fontVariantNumeric:'tabular-nums',minWidth:34,textAlign:'right'}}>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps row */}
      <div style={{position:'relative',display:'grid',gridTemplateColumns:`repeat(${total}, 1fr)`,gap:0}}>
        {/* Connector track (behind nodes) */}
        <div style={{position:'absolute',top:18,left:`calc(${100/(total*2)}%)`,right:`calc(${100/(total*2)}%)`,height:2,background:'#EEF1F5',borderRadius:999,zIndex:0}}></div>
        <div style={{position:'absolute',top:18,left:`calc(${100/(total*2)}%)`,width:`calc(${((doneCount)/(total-1))*(100 - (100/total))}%)`,height:2,background:'linear-gradient(90deg, var(--hycu-cyan), var(--hycu-cyan-deep))',borderRadius:999,zIndex:0,transition:'width 0.45s ease',boxShadow:'0 0 0 3px rgba(0,181,226,0.08)'}}></div>

        {steps.map((s) => {
          const state = current === s.n ? 'active' : current > s.n ? 'done' : 'todo';
          const interactive = !!onGo;
          return (
            <button key={s.n} type="button" onClick={() => onGo && onGo(s.n)}
              style={{
                position:'relative',zIndex:1,
                display:'flex',flexDirection:'column',alignItems:'center',gap:10,
                background:'transparent',border:'none',padding:'0 6px',cursor:interactive?'pointer':'default',
                font:'inherit',color:'inherit',textAlign:'center'}}>
              {/* Node */}
              <div style={{
                position:'relative',
                width:36,height:36,borderRadius:'50%',
                display:'grid',placeItems:'center',
                fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,
                background: state==='active' ? 'linear-gradient(135deg, var(--hycu-cyan), var(--hycu-cyan-deep))'
                          : state==='done'   ? 'white'
                          : '#FBFCFD',
                color: state==='active' ? 'white'
                     : state==='done'   ? 'var(--hycu-cyan-deep)'
                     : 'var(--admin-muted)',
                border: state==='active' ? '2px solid var(--hycu-cyan)'
                      : state==='done'   ? '2px solid var(--hycu-cyan)'
                      : '2px solid #E3E8EE',
                boxShadow: state==='active' ? '0 0 0 6px rgba(0,181,226,0.14), 0 8px 18px -6px rgba(0,145,184,0.45)'
                         : state==='done'   ? '0 1px 2px rgba(15,22,30,0.04)'
                         : 'none',
                transition:'all 0.25s ease'}}>
                {state==='done' ? <Icon name="check" size={15}/> : s.n}
                {state==='active' && (
                  <span style={{
                    position:'absolute',inset:-2,borderRadius:'50%',
                    boxShadow:'0 0 0 0 rgba(0,181,226,0.4)',
                    animation:'hycuStepPulse 2s ease-out infinite',
                    pointerEvents:'none'}}></span>
                )}
              </div>

              {/* Labels */}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,minHeight:34}}>
                <div style={{
                  fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600,
                  color: state==='todo' ? 'var(--admin-muted)' : 'var(--admin-ink)',
                  letterSpacing:'-0.005em'}}>{s.label}</div>
                <div style={{
                  fontSize:11,
                  color: state==='active' ? 'var(--hycu-cyan-deep)' : 'var(--admin-muted)',
                  fontWeight: state==='active' ? 600 : 400,
                  letterSpacing:'0.01em'}}>{s.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes hycuStepPulse {
          0%   { box-shadow: 0 0 0 0 rgba(0,181,226,0.35); }
          70%  { box-shadow: 0 0 0 12px rgba(0,181,226,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,181,226,0); }
        }
      `}</style>
    </div>
  );
};

// Section head kept for wizard (Step 2)
const SectionHead = ({ n, title }) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 14px'}}>
    <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 11, color: 'var(--hycu-cyan-deep)', fontWeight: 700, letterSpacing: '0.08em'}}>{n}</span>
    <h3 style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, margin: 0, fontWeight: 600, color: 'var(--admin-ink)'}}>{title}</h3>
    <div style={{flex: 1, height: 1, background: 'var(--admin-line)'}}></div>
  </div>
);

window.CourseSetup = CourseSetup;
window.Stepper = Stepper;
window.SectionHead = SectionHead;
