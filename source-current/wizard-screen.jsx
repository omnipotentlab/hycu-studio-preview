// ----- Wizard (per-session lecture material; starts at Step 2 after course-setup) -----
const Wizard = ({ onScreen }) => {
  const [step, setStep] = React.useState(2);

  // Reset scroll when step changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);
  const [drag, setDrag] = React.useState(false);
  const [files, setFiles] = React.useState([
    { name: 'AI리터러시_생성형AI_강의안.docx', size: '142 KB', type: 'docx', status: 'parsed', tokens: 8420 },
    { name: 'NIST_AI_RMF_1.0.pdf', size: '1.2 MB', type: 'pdf', status: 'parsed', tokens: 5210 },
    { name: 'scaling_basics.pptx', size: '3.4 MB', type: 'pptx', status: 'parsed', tokens: 3140 },
  ]);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const newFiles = Array.from(e.dataTransfer.files).map(f => ({
      name: f.name, size: (f.size/1024).toFixed(1)+' KB',
      type: f.name.split('.').pop().toLowerCase(),
      status: 'parsing', tokens: 0
    }));
    setFiles([...files, ...newFiles]);
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.status === 'parsing' ? {...f, status:'parsed', tokens: Math.floor(Math.random()*8000)+1000} : f));
    }, 1500);
  };

  return (
    <div className="content">
      {/* 교안 설정 내부 세부 단계 — 상단 ProcessNav의 2번째 단계 안에서만 이동한다 */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
        {[{n:2,l:'학습자료 · 학습목표'},{n:3,l:'슬라이드 구성 · 톤'},{n:4,l:'최종 확인'}].map(t => {
          const on = step === t.n;
          return (
            <button key={t.n} onClick={() => setStep(t.n)} style={{
              display:'inline-flex',alignItems:'center',gap:8,padding:'9px 16px',cursor:'pointer',fontFamily:'inherit',
              background: on ? 'var(--ink-deep, #0E1116)' : 'white',
              color: on ? 'white' : 'var(--admin-muted)',
              border: on ? '1px solid var(--ink-deep, #0E1116)' : '1px solid var(--admin-line)',
              borderRadius:999, fontSize:13, fontWeight:600, letterSpacing:'-0.01em'}}>
              <span style={{width:18,height:18,borderRadius:'50%',display:'grid',placeItems:'center',fontSize:10.5,fontWeight:700,background: on ? 'var(--hycu-cyan)' : 'var(--admin-bg)',color: on ? 'white' : 'var(--admin-faint)'}}>{t.n-1}</span>
              {t.l}
            </button>
          );
        })}
        <span style={{marginLeft:'auto',fontSize:12,color:'var(--admin-faint)'}}>AI 리터러시 · 3주차</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div className="card" style={{padding:28}}>
          {step === 2 && <WizStepMaterial files={files} setFiles={setFiles} drag={drag} setDrag={setDrag} onDrop={onDrop}/>}
          {step === 3 && <WizStep4 mode="single"/>}
          {step === 4 && <WizStep5 onScreen={onScreen}/>}

          <div style={{display:'flex',justifyContent:'space-between',marginTop:32,paddingTop:20,borderTop:'1px solid var(--admin-line)'}}>
            <button className="btn btn-ghost" onClick={() => setStep(Math.max(2, step-1))} disabled={step === 2} style={{opacity: step===2 ? 0.4 : 1}}>
              <Icon name="chevronLeft" size={14}/> 이전 항목
            </button>
            {step < 4 && (
              <button className="btn btn-primary" onClick={() => setStep(step+1)}>
                다음 항목 <Icon name="chevronRight" size={14}/>
              </button>
            )}
            {step === 4 && (
              <span style={{fontSize:12,color:'var(--admin-muted)',alignSelf:'center'}}>하단 "다음 · 아웃라인 생성"으로 진행합니다 · 아웃라인은 버튼으로 시작</span>
            )}
          </div>
        </div>

        <WizSidebar step={step}/>
      </div>
    </div>
  );
};

// Mock 교과목 기획서 — AI 리터러시 (AIG101) · 13주차 × 3교시 = 39교시
const COURSE_PLAN = {
  course: 'AI 리터러시', code: 'AIG101', professor: '홍길동 교수', duration: '50분',
  totalWeeks: 13, periodsPerWeek: 3,
  weeks: [
    { w: 1,  sessions: [
      { s:1, chapter:'Ch.01 AI 리터러시란 무엇인가', topic:'01-01 왜 지금 AI 리터러시인가', desc:'업무·학습 전반에 AI가 들어오면서 요구되는 기초 소양을 조망한다.', objectives:[] },
      { s:2, chapter:'Ch.01 AI 리터러시란 무엇인가', topic:'01-02 AI 도구 생태계 개관', desc:'챗봇·이미지·코드·에이전트 등 주요 AI 도구 유형을 분류한다.', objectives:[] },
      { s:3, chapter:'Ch.01 AI 리터러시란 무엇인가', topic:'01-03 활용 사례 스캔', desc:'업무·연구·창작 분야의 실제 AI 활용 사례를 검토한다.', objectives:[] },
    ]},
    { w: 2,  sessions: [
      { s:1, chapter:'Ch.02 인공지능의 원리와 발전', topic:'02-01 지능→머신러닝→딥러닝→생성형 AI', desc:'개념 계보를 따라 오늘날 생성형 AI에 이르는 흐름을 정리한다.', objectives:[] },
      { s:2, chapter:'Ch.02 인공지능의 원리와 발전', topic:'02-02 학습과 추론의 차이', desc:'모델이 학습하는 과정과 결과를 생성하는 과정을 구분한다.', objectives:[] },
      { s:3, chapter:'Ch.02 인공지능의 원리와 발전', topic:'02-03 한계와 착각(환각) 사례', desc:'AI가 그럴듯하지만 틀린 답을 내는 상황을 사례로 확인한다.', objectives:[] },
    ]},
    { w: 3,  sessions: [
      { s:1, chapter:'Ch.03 데이터와 알고리즘의 기초', topic:'03-01 데이터가 모델을 만드는 방식', desc:'학습 데이터의 품질이 결과 품질에 미치는 영향을 설명한다.', objectives:[] },
      { s:2, chapter:'Ch.03 데이터와 알고리즘의 기초', topic:'03-02 편향과 대표성 문제', desc:'데이터 편향이 AI 출력에 어떻게 반영되는지 분석한다.', objectives:[] },
      { s:3, chapter:'Ch.03 데이터와 알고리즘의 기초', topic:'03-03 사례로 보는 데이터 편향', desc:'실제 편향 사례를 찾아보고 원인을 토론한다.', objectives:[] },
    ]},
    { w: 4,  sessions: [
      { s:1, chapter:'Ch.04 생성형 AI 개관', topic:'04-01 텍스트·이미지·코드 생성 모델 비교', desc:'모달리티별 생성형 AI의 대표 모델과 특징을 비교한다.', objectives:[] },
      { s:2, chapter:'Ch.04 생성형 AI 개관', topic:'04-02 파운데이션 모델과 파인튜닝', desc:'범용 모델을 특정 업무에 맞게 조정하는 방식을 이해한다.', objectives:[] },
      { s:3, chapter:'Ch.04 생성형 AI 개관', topic:'04-03 도구 선택 실습', desc:'과제 유형에 맞는 AI 도구를 직접 선택·비교해본다.', objectives:[] },
    ]},
    { w: 5,  sessions: [
      { s:1, chapter:'Ch.05 생성형 AI와 협업', topic:'05-01 AI와 함께 일하는 방식', desc:'AI를 업무 파트너로 두었을 때 역할 분담의 기본 원칙을 정리한다.', objectives:[] },
      { s:2, chapter:'Ch.05 생성형 AI와 협업', topic:'05-02 생성형 AI의 이해와 업무 활용', desc:'생성형 AI의 원리와 프롬프트 설계, 결과 검증.', objectives:[
        { lvl:'이해', t:'생성형 AI가 입력을 바탕으로 결과를 만드는 원리를 설명할 수 있다', src:'강의안 §3.1' },
        { lvl:'분석', t:'목표·맥락·자료·제약·형식을 포함한 프롬프트를 설계할 수 있다', src:'NIST AI RMF' },
        { lvl:'평가', t:'AI 출력의 근거를 원문과 대조해 신뢰 가능한 주장과 그렇지 않은 주장을 구분할 수 있다', src:'강의안 §3.3' },
        { lvl:'적용', t:'개인정보와 저작권을 고려해 사람과 AI의 역할을 나눌 수 있다', src:'AI 추론' },
      ]},
      { s:3, chapter:'Ch.05 생성형 AI와 협업', topic:'05-03 프롬프트 설계 실습', desc:'업무 문서 초안을 다섯 요소 프롬프트로 직접 작성한다.', objectives:[] },
    ]},
    { w: 6,  sessions: [
      { s:1, chapter:'Ch.06 프롬프트 엔지니어링 심화', topic:'06-01 프롬프트 작성의 원칙', desc:'모호함·과도한 위임·검증 누락을 피하는 원칙을 정리한다.', objectives:[] },
      { s:2, chapter:'Ch.06 프롬프트 엔지니어링 심화', topic:'06-02 대화형 개선과 반복 설계', desc:'한 번에 완성하지 않고 대화로 다듬어가는 설계 전략.', objectives:[] },
      { s:3, chapter:'Ch.06 프롬프트 엔지니어링 심화', topic:'06-03 프롬프트 개선 실습', desc:'주어진 초안 프롬프트를 단계적으로 개선한다.', objectives:[] },
    ]},
    { w: 7,  sessions: [
      { s:1, chapter:'Ch.07 중간 정리', topic:'07-01 전반부 핵심 개념 정리', desc:'1~6주차 핵심 개념 종합.', objectives:[] },
      { s:2, chapter:'Ch.07 중간 정리', topic:'07-02 사례 토론', desc:'실제 업무 현장의 AI 활용·오용 사례 토론.', objectives:[] },
      { s:3, chapter:'Ch.07 중간 정리', topic:'07-03 중간 평가 안내', desc:'중간 평가 범위와 방식 안내.', objectives:[] },
    ]},
    { w: 8,  sessions: [
      { s:1, chapter:'Ch.08 AI 결과 검증과 근거 확인', topic:'08-01 근거 기반 검증의 원칙', desc:'출처와 대조해 확인 가능한 주장만 신뢰하는 절차를 익힌다.', objectives:[] },
      { s:2, chapter:'Ch.08 AI 결과 검증과 근거 확인', topic:'08-02 환각 탐지 체크리스트', desc:'AI 출력에서 근거 없는 서술을 걸러내는 점검표를 작성한다.', objectives:[] },
      { s:3, chapter:'Ch.08 AI 결과 검증과 근거 확인', topic:'08-03 검증 실습', desc:'AI가 생성한 보고서 초안을 원문과 대조해 검증한다.', objectives:[] },
    ]},
    { w: 9,  sessions: [
      { s:1, chapter:'Ch.09 AI 윤리와 저작권', topic:'09-01 개인정보와 저작권 기본 원칙', desc:'AI 입력·출력 단계에서 지켜야 할 법적·윤리적 원칙.', objectives:[] },
      { s:2, chapter:'Ch.09 AI 윤리와 저작권', topic:'09-02 AI 사용 공개와 책임 소재', desc:'생성물에 AI 사용을 공개하는 기준과 책임 범위.', objectives:[] },
      { s:3, chapter:'Ch.09 AI 윤리와 저작권', topic:'09-03 윤리 사례 토론', desc:'국내외 AI 윤리 이슈 사례 분석.', objectives:[] },
    ]},
    { w: 10, sessions: [
      { s:1, chapter:'Ch.10 AI 에이전트와 자동화', topic:'10-01 프롬프트에서 에이전트로', desc:'한 번의 프롬프트가 여러 단계 작업으로 확장되는 원리.', objectives:[] },
      { s:2, chapter:'Ch.10 AI 에이전트와 자동화', topic:'10-02 도구 연결과 워크플로 설계', desc:'AI가 외부 도구를 호출해 업무를 자동화하는 구조.', objectives:[] },
      { s:3, chapter:'Ch.10 AI 에이전트와 자동화', topic:'10-03 자동화 설계 실습', desc:'반복 업무 하나를 에이전트 워크플로로 설계해본다.', objectives:[] },
    ]},
    { w: 11, sessions: [
      { s:1, chapter:'Ch.11 업무 적용 사례', topic:'11-01 보고서·문서 작성 자동화', desc:'문서 초안·요약·교정에 AI를 적용하는 방식.', objectives:[] },
      { s:2, chapter:'Ch.11 업무 적용 사례', topic:'11-02 데이터 분석 보조', desc:'AI로 데이터 탐색·요약·시각화를 보조하는 방식.', objectives:[] },
      { s:3, chapter:'Ch.11 업무 적용 사례', topic:'11-03 업무 적용 실습', desc:'자신의 업무 과제 하나에 AI를 적용해본다.', objectives:[] },
    ]},
    { w: 12, sessions: [
      { s:1, chapter:'Ch.12 산업별 활용 사례', topic:'12-01 교육 분야 AI 활용 사례', desc:'교안 생성·개인화 학습 등 교육 분야 적용 사례.', objectives:[] },
      { s:2, chapter:'Ch.12 산업별 활용 사례', topic:'12-02 산업 전반 활용 사례', desc:'제조·의료·서비스 등 산업별 AI 활용 사례 비교.', objectives:[] },
      { s:3, chapter:'Ch.12 산업별 활용 사례', topic:'12-03 사례 비교 토론', desc:'산업별 사례 비교와 시사점 토론.', objectives:[] },
    ]},
    { w: 13, sessions: [
      { s:1, chapter:'Ch.13 종합 정리', topic:'13-01 학기 종합 정리', desc:'전체 13주차 핵심 개념 종합.', objectives:[] },
      { s:2, chapter:'Ch.13 종합 정리', topic:'13-02 기말 평가 안내', desc:'기말 평가 범위와 방식 안내.', objectives:[] },
      { s:3, chapter:'Ch.13 종합 정리', topic:'13-03 후속 학습 가이드', desc:'심화 학습 자료와 후속 교과목 안내.', objectives:[] },
    ]},
  ]};

const SessionMatrixModal = ({ plan, status, statusLabel, statusColor, weekIdx, sessIdx, onPick, onClose }) => {
  const counts = Object.values(status).reduce((a, s) => { a[s] = (a[s]||0)+1; return a; }, {});
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,22,30,0.55)',display:'grid',placeItems:'center',zIndex:200,padding:24}}>
      <div onClick={(e) => e.stopPropagation()} style={{background:'white',borderRadius:14,width:'min(960px,100%)',maxHeight:'88vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,0.25)'}}>
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--admin-line)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:17,fontWeight:600,color:'var(--admin-ink)'}}>교시별 콘텐츠 정보</div>
            <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:3}}>{plan.course} · {plan.code} · 전체 {plan.weeks.length}주차 · 13주차</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:11,padding:'4px 10px',borderRadius:999,background:'rgba(34,160,107,0.12)',color:'#166B4A',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>완료 {counts.done||0}</span>
            <span style={{fontSize:11,padding:'4px 10px',borderRadius:999,background:'rgba(242,153,74,0.14)',color:'#9C5B1F',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>진행 {counts.wip||0}</span>
            <span style={{fontSize:11,padding:'4px 10px',borderRadius:999,background:'#EEF1F5',color:'#6B7280',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>미설정 {counts.todo||0}</span>
            <button className="btn btn-quiet" onClick={onClose} style={{marginLeft:8}}><Icon name="x" size={14}/></button>
          </div>
        </div>
        <div style={{padding:'8px 24px 24px',overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{textAlign:'left',color:'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,textTransform:'uppercase',letterSpacing:'0.06em'}}>
                <th style={{padding:'12px 8px',fontWeight:600,width:60}}>주차</th>
                <th style={{padding:'12px 8px',fontWeight:600,width:60}}>교시</th>
                <th style={{padding:'12px 8px',fontWeight:600}}>챕터 · 세부 주제</th>
                <th style={{padding:'12px 8px',fontWeight:600,width:120}}>상태</th>
                <th style={{padding:'12px 8px',fontWeight:600,width:120}}></th>
              </tr>
            </thead>
            <tbody>
              {plan.weeks.flatMap((w, wi) => w.sessions.map((s, si) => {
                const isCurrent = wi === weekIdx && si === sessIdx;
                const st = status[`${w.w}-${s.s}`] || 'todo';
                const c = statusColor[st];
                return (
                  <tr key={`${wi}-${si}`} style={{borderTop:'1px solid var(--admin-line)',background: isCurrent ? 'rgba(0,181,226,0.05)' : 'transparent'}}>
                    <td style={{padding:'12px 8px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,color:'var(--admin-ink)'}}>{w.w}주차</td>
                    <td style={{padding:'12px 8px',color:'var(--admin-ink)'}}>{String(s.s).padStart(2,'0')}차시</td>
                    <td style={{padding:'12px 8px'}}>
                      <div style={{color:'var(--admin-ink)',fontWeight:500}}>{s.topic}</div>
                      <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>{s.chapter}</div>
                    </td>
                    <td style={{padding:'12px 8px'}}>
                      <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:11,padding:'3px 9px',borderRadius:999,background:c.bg,color:c.fg,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>
                        <span style={{width:5,height:5,borderRadius:'50%',background:c.dot}}></span>{statusLabel[st]}
                      </span>
                    </td>
                    <td style={{padding:'12px 8px',textAlign:'right'}}>
                      {isCurrent ? <span style={{fontSize:11,color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>편집 중</span>
                        : <button className="btn btn-ghost" style={{fontSize:12,padding:'5px 11px'}} onClick={() => onPick(wi, si)}>편집 <Icon name="chevronRight" size={11}/></button>}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
        <div style={{padding:'14px 24px',borderTop:'1px solid var(--admin-line)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--admin-bg)'}}>
          <div style={{fontSize:12,color:'var(--admin-muted)'}}>행을 클릭해 해당 교시 설정으로 이동합니다.</div>
          <button className="btn btn-quiet" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

// Combined Step 2: 교시 정보 + 자료 업로드 + 학습 목표
const WizStepMaterial = ({ files, setFiles, drag, setDrag, onDrop }) => {
  const [weekIdx, setWeekIdx] = React.useState(4); // 5주차
  const [sessIdx, setSessIdx] = React.useState(1); // 02교시
  const [duration, setDuration] = React.useState('25');
  const [periods, setPeriods] = React.useState('3');
  const [showAll, setShowAll] = React.useState(false);
  const [regenerating, setRegenerating] = React.useState(false);
  const [regenKey, setRegenKey] = React.useState(0);
  // mock session status (key: w-s)
  const sessionStatus = {
    '1-1':'done','1-2':'done','2-1':'done','2-2':'done',
    '3-1':'done','3-2':'wip','4-1':'wip','4-2':'wip',
    '5-1':'done','5-2':'editing','6-1':'todo','6-2':'todo',
    '7-1':'todo','7-2':'todo','8-1':'todo','8-2':'todo'};
  const statusLabel = { done:'설정 완료', editing:'편집 중', wip:'진행 중', todo:'미설정' };
  const statusColor = { done:{bg:'rgba(34,160,107,0.12)',fg:'#166B4A',dot:'#22A06B'}, editing:{bg:'rgba(0,181,226,0.12)',fg:'#006B86',dot:'#00B5E2'}, wip:{bg:'rgba(242,153,74,0.14)',fg:'#9C5B1F',dot:'#F2994A'}, todo:{bg:'#EEF1F5',fg:'#6B7280',dot:'#9CA3AF'} };
  const week = COURSE_PLAN.weeks[weekIdx];
  const session = week.sessions[Math.min(sessIdx, week.sessions.length - 1)];
  const onWeek = (v) => { setWeekIdx(+v); setSessIdx(0); };
  return (
  <div>
    <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>교안 제작 설정</h2>
    <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 26px'}}>이번 교시의 정보를 입력하고, 참고 자료와 학습 목표를 정리합니다.</p>

    {window.SectionHead && <window.SectionHead n="01" title="교시 정보"/>}

    {/* 교과목 기획서 연동 배너 */}
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'linear-gradient(90deg, rgba(0,181,226,0.08), rgba(0,181,226,0.015))',border:'1px solid rgba(0,181,226,0.28)',borderRadius:10,marginBottom:14}}>
      <div style={{width:32,height:32,borderRadius:8,background:'var(--hycu-cyan)',color:'white',display:'grid',placeItems:'center',flexShrink:0}}>
        <Icon name="file" size={15}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,color:'var(--admin-ink)',fontWeight:600}}>교과목 기획서에서 정보를 불러옴</div>
          <span style={{fontSize:10,padding:'2px 7px',borderRadius:999,background:'rgba(34,160,107,0.12)',color:'#166B4A',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}><span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:'#22A06B',marginRight:5,verticalAlign:'middle'}}></span>연동됨</span>
        </div>
        <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:2}}>{COURSE_PLAN.course} · {COURSE_PLAN.code} · 전체 {COURSE_PLAN.weeks.length}주차 · 교수자 {COURSE_PLAN.professor}</div>
      </div>
      <button className="btn btn-ghost" style={{fontSize:12}}><Icon name="file" size={12}/>기획서 열기</button>
    </div>

    {/* current session indicator */}
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'var(--admin-bg)',border:'1px solid var(--admin-line)',borderRadius:10,marginBottom:14}}>
      <div style={{width:28,height:28,borderRadius:8,background:'white',border:'1px solid var(--admin-line)',display:'grid',placeItems:'center'}}><Icon name="file" size={13}/></div>
      <div>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,color:'var(--admin-ink)',fontWeight:600}}>현재 편집 중: <span style={{color:'var(--hycu-cyan-deep)'}}>{week.w}주차 · {String(session.s).padStart(2,'0')}교시</span></div>
        <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:1}}>아래에서 주차·교시를 선택해 이번 교시의 교안을 구성합니다.</div>
      </div>
    </div>

    {/* 교과목 기획서 연동 배너 (moved above) */}
    <div style={{display:'none'}}></div>

    {/* 주차·교시·강의시간 한 줄 */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:14}}>
      <SelectField label="주차" value={weekIdx} onChange={onWeek}
        options={COURSE_PLAN.weeks.map((w, i) => ({ v: i, l: `${w.w}주차` }))}/>
      <SelectField label="교시" value={sessIdx} onChange={(v) => setSessIdx(+v)}
        options={week.sessions.map((s, i) => ({ v: i, l: `${String(s.s).padStart(2,'0')}교시` }))}/>
      <SelectField label="강의 시간 (1교시당 분량)" value={duration} onChange={(v) => setDuration(v)}
        options={[{v:'10',l:'10분'},{v:'25',l:'25분'},{v:'50',l:'50분'},{v:'75',l:'75분'}]}/>
    </div>

    {/* 자동 채움 필드 */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}}>
      <Field key={'c-'+weekIdx+'-'+sessIdx} label="챕터명" value={session.chapter} wide auto/>
      <Field key={'t-'+weekIdx+'-'+sessIdx} label="세부 주제 (교시명)" value={session.topic} wide auto/>

      <div style={{gridColumn:'span 2'}}>
        <Field key={'d-'+weekIdx+'-'+sessIdx} label="교시 한 줄 설명" value={session.desc} wide multiline auto/>
      </div>
    </div>

    {window.SectionHead && <window.SectionHead n="02" title="참고 자료 업로드"/>}
    <p style={{color:'var(--admin-muted)',fontSize:13,margin:'-6px 0 14px'}}>강의안 · 논문 · 기존 PPT · 녹음 · YouTube 링크를 추가하면 AI가 모두 참고합니다.</p>
    <div className={`dropzone ${drag?'over':''}`}
      onDragOver={(e) => {e.preventDefault(); setDrag(true);}}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}>
      <Icon name="upload" size={26} style={{color: drag ? 'var(--hycu-cyan)' : 'var(--admin-muted)'}}/>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,marginTop:8,color:'var(--admin-ink)',fontWeight:500}}>
        {drag ? '여기에 놓아주세요' : '파일을 끌어다 놓거나 클릭해서 업로드'}
      </div>
      <div style={{color:'var(--admin-muted)',fontSize:12,marginTop:3}}>DOCX · PDF · PPTX · MP3·MP4 (STT) · 한글(HWP) · 최대 200 MB</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:12}}>
      <button className="btn btn-ghost" style={{justifyContent:'flex-start',padding:'10px 14px'}}>
        <Icon name="youtube" size={15}/>
        <div style={{textAlign:'left'}}>
          <div>YouTube 링크 추가</div>
          <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:400}}>자동 자막 추출 · STT</div>
        </div>
      </button>
      <button className="btn btn-ghost" style={{justifyContent:'flex-start',padding:'10px 14px'}}>
        <Icon name="type" size={15}/>
        <div style={{textAlign:'left'}}>
          <div>텍스트 직접 붙여넣기</div>
          <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:400}}>강의 개요 · 메모</div>
        </div>
      </button>
    </div>
    <div style={{marginTop:16,marginBottom:24}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>업로드된 자료 <span style={{color:'var(--admin-muted)',fontWeight:400,marginLeft:6}}>{files.length}건 · {files.reduce((s,f)=>s+f.tokens,0).toLocaleString()} tokens</span></div>
        <button className="btn btn-quiet">전체 삭제</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {files.map((f, i) => {
          const ico = { docx: 'file', pdf: 'file', pptx: 'file', mp3: 'mic', mp4: 'play', txt: 'file' };
          return (
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'var(--admin-bg)',borderRadius:8,border:'1px solid var(--admin-line)'}}>
              <div style={{width:32,height:32,borderRadius:8,background:'white',border:'1px solid var(--admin-line)',display:'grid',placeItems:'center',color:'var(--admin-muted)'}}>
                <Icon name={ico[f.type] || 'file'} size={14}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,color:'var(--admin-ink)',fontWeight:500}}>{f.name}</div>
                <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>{f.size} · {f.tokens > 0 ? f.tokens.toLocaleString()+' tokens' : 'parsing...'}</div>
              </div>
              <span className={`pill ${f.status === 'parsed' ? 'published' : 'gen'}`}>
                <span className="dot"></span>{f.status === 'parsed' ? '분석 완료' : '분석 중'}
              </span>
              <button className="btn btn-quiet" onClick={() => setFiles(files.filter((_,j) => j !== i))}><Icon name="x" size={13}/></button>
            </div>
          );
        })}
      </div>
    </div>

    {window.SectionHead && <window.SectionHead n="03" title="학습 목표"/>}
    <div style={{display:'flex',gap:8,marginBottom:14,padding:'10px 14px',background:'rgba(0,181,226,0.06)',borderRadius:8,border:'1px solid rgba(0,181,226,0.2)',alignItems:'flex-start'}}>
      <Icon name="sparkles" size={15} style={{color:'#0091B8',flexShrink:0,marginTop:2}}/>
      <div style={{fontSize:12,color:'var(--admin-ink)',lineHeight:1.5,flex:1}}>
        <strong style={{color:'#0091B8'}}>교과목 기획서에서 불러옴</strong> · 현재 차시({week.w}주차 · {String(session.s).padStart(2,'0')}교시)의 학습 목표입니다. Bloom's Taxonomy 인지 영역에 따라 이해·분석·평가·적용 수준이 균형있게 배치됩니다.
      </div>
      <button className="btn btn-ghost" style={{fontSize:12,flexShrink:0}}
        onClick={() => { setRegenerating(true); setTimeout(() => { setRegenerating(false); setRegenKey(k=>k+1); }, 1200); }}>
        <Icon name="sparkles" size={12} style={regenerating?{opacity:0.5}:{}}/>
        {regenerating ? '생성 중...' : 'AI로 다시 생성'}
      </button>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:8}} key={`obj-${weekIdx}-${sessIdx}-${regenKey}`}>
      {(session.objectives || []).map((o, i) => (
        <div key={i} style={{display:'flex',gap:12,padding:'12px 14px',background:'white',border:'1px solid var(--admin-line)',borderRadius:10,opacity:regenerating?0.5:1,transition:'opacity 0.2s'}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'var(--hycu-cyan)',color:'white',display:'grid',placeItems:'center',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600,flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:'var(--admin-ink)',lineHeight:1.5}}>{o.t}</div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:5}}>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:999,background:'rgba(0,145,184,0.12)',color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>{o.lvl}</span>
              <span style={{fontSize:11,color:'var(--admin-muted)'}}>출처: {o.src}</span>
            </div>
          </div>
          <button className="btn btn-quiet"><Icon name="edit" size={13}/></button>
        </div>
      ))}
      <button className="btn btn-ghost" style={{justifyContent:'center'}}>
        <Icon name="plus" size={13}/> 학습 목표 추가
      </button>
    </div>
  </div>
  );
};

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,fontWeight:600}}>{label}</div>
    <div style={{position:'relative'}}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{width:'100%',border:'1px solid var(--admin-line)',borderRadius:8,padding:'10px 36px 10px 12px',fontFamily:'inherit',fontSize:14,color:'var(--admin-ink)',background:'white',appearance:'none',cursor:'pointer'}}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 12 12" style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--admin-muted)'}}>
        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const Field = ({ label, value, hint, wide, multiline, auto }) => (
  <div style={{gridColumn: wide ? 'span 2' : 'auto'}}>
    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>{label}</div>
      {auto && <span style={{fontSize:9,padding:'1px 6px',borderRadius:999,background:'rgba(0,145,184,0.1)',color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,letterSpacing:'0.04em'}}>AUTO</span>}
    </div>
    {multiline ? (
      <textarea defaultValue={value} style={{width:'100%',border:'1px solid var(--admin-line)',borderRadius:8,padding:'10px 12px',fontFamily:'inherit',fontSize:14,color:'var(--admin-ink)',minHeight:64,resize:'vertical',background:'white'}}/>
    ) : (
      <input defaultValue={value} style={{width:'100%',border:'1px solid var(--admin-line)',borderRadius:8,padding:'10px 12px',fontFamily:'inherit',fontSize:14,color:'var(--admin-ink)',background:'white'}}/>
    )}
    {hint && <div style={{fontSize:11,color:'var(--admin-faint)',marginTop:4}}>{hint}</div>}
  </div>
);

const WizStep2 = ({ files, setFiles, drag, setDrag, onDrop }) => {
  const ico = { docx: 'file', pdf: 'file', pptx: 'file', mp3: 'mic', mp4: 'play', txt: 'file' };
  return (
    <div>
      <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>참고 자료 업로드</h2>
      <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 22px'}}>강의안 · 논문 · 기존 PPT · 녹음 · YouTube 링크를 추가하면 AI가 모두 참고합니다.</p>

      <div className={`dropzone ${drag?'over':''}`}
        onDragOver={(e) => {e.preventDefault(); setDrag(true);}}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}>
        <Icon name="upload" size={28} style={{color: drag ? 'var(--hycu-cyan)' : 'var(--admin-muted)'}}/>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:15,marginTop:10,color:'var(--admin-ink)',fontWeight:500}}>
          {drag ? '여기에 놓아주세요' : '파일을 끌어다 놓거나 클릭해서 업로드'}
        </div>
        <div style={{color:'var(--admin-muted)',fontSize:12,marginTop:4}}>DOCX · PDF · PPTX · MP3·MP4 (STT) · 한글(HWP) · 최대 200 MB</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:14}}>
        <button className="btn btn-ghost" style={{justifyContent:'flex-start',padding:'12px 14px'}}>
          <Icon name="youtube" size={16}/>
          <div style={{textAlign:'left'}}>
            <div>YouTube 링크 추가</div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:400}}>자동 자막 추출 · STT</div>
          </div>
        </button>
        <button className="btn btn-ghost" style={{justifyContent:'flex-start',padding:'12px 14px'}}>
          <Icon name="type" size={16}/>
          <div style={{textAlign:'left'}}>
            <div>텍스트 직접 붙여넣기</div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontWeight:400}}>강의 개요 · 메모</div>
          </div>
        </button>
      </div>

      <div style={{marginTop:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>업로드된 자료 <span style={{color:'var(--admin-muted)',fontWeight:400,marginLeft:6}}>{files.length}건 · {files.reduce((s,f)=>s+f.tokens,0).toLocaleString()} tokens</span></div>
          <button className="btn btn-quiet">전체 삭제</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {files.map((f, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'var(--admin-bg)',borderRadius:8,border:'1px solid var(--admin-line)'}}>
              <div style={{width:36,height:36,borderRadius:8,background:'white',border:'1px solid var(--admin-line)',display:'grid',placeItems:'center',color:'var(--admin-muted)'}}>
                <Icon name={ico[f.type] || 'file'} size={16}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,color:'var(--admin-ink)',fontWeight:500}}>{f.name}</div>
                <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>{f.size} · {f.tokens > 0 ? f.tokens.toLocaleString()+' tokens' : 'parsing...'}</div>
              </div>
              <span className={`pill ${f.status === 'parsed' ? 'published' : 'gen'}`}>
                <span className="dot"></span>{f.status === 'parsed' ? '분석 완료' : '분석 중'}
              </span>
              <button className="btn btn-quiet" onClick={() => setFiles(files.filter((_,j) => j !== i))}><Icon name="x" size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WizStep3 = () => (
  <div>
    <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>학습 목표 (AI 추출 결과)</h2>
    <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 22px'}}>업로드한 자료에서 AI가 추출한 학습 목표입니다. 자유롭게 편집하세요.</p>

    <div style={{display:'flex',gap:8,marginBottom:16,padding:'10px 14px',background:'rgba(0,181,226,0.06)',borderRadius:8,border:'1px solid rgba(0,181,226,0.2)'}}>
      <Icon name="sparkles" size={16} style={{color:'#0091B8',flexShrink:0,marginTop:2}}/>
      <div style={{fontSize:13,color:'var(--admin-ink)',lineHeight:1.5}}>
        <strong style={{color:'#0091B8'}}>Bloom's Taxonomy</strong>의 인지 영역에 따라 분석·이해·적용·평가 수준을 균형있게 배치했습니다. 각 목표는 슬라이드 그룹에 자동 매핑됩니다.
      </div>
    </div>

    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {[
        { lvl: '이해', color: '#1971C2', t: '생성형 AI가 입력을 바탕으로 결과를 만드는 원리를 설명할 수 있다', src: '강의안 §3.1' },
        { lvl: '분석', color: '#6A4FB7', t: '목표·맥락·자료·제약·형식을 포함한 프롬프트를 설계할 수 있다', src: 'NIST AI RMF' },
        { lvl: '평가', color: '#C25C19', t: 'AI 결과의 오류와 한계를 근거 중심으로 검증할 수 있다', src: '강의안 §3.3' },
        { lvl: '적용', color: '#2FA76A', t: '개인정보와 저작권을 고려해 사람과 AI의 역할을 나눌 수 있다', src: 'AI 추론' },
      ].map((o, i) => (
        <div key={i} style={{display:'flex',gap:12,padding:'14px 16px',background:'white',border:'1px solid var(--admin-line)',borderRadius:10}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:'var(--hycu-cyan)',color:'white',display:'grid',placeItems:'center',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:'var(--admin-ink)',lineHeight:1.5}}>{o.t}</div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:999,background:o.color+'20',color:o.color,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>{o.lvl}</span>
              <span style={{fontSize:11,color:'var(--admin-muted)'}}>출처: {o.src}</span>
            </div>
          </div>
          <button className="btn btn-quiet"><Icon name="edit" size={14}/></button>
        </div>
      ))}
      <button className="btn btn-ghost" style={{justifyContent:'center'}}>
        <Icon name="plus" size={14}/> 학습 목표 추가
      </button>
    </div>
  </div>
);

const WizStep4 = ({ mode = 'single' }) => {
  const [length, setLength] = React.useState(28);
  const [tone, setTone] = React.useState('balanced');
  const [tab, setTab] = React.useState('common'); // 'common' | 'matrix'
  return (
    <div>
      <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>슬라이드 구성 설정</h2>
      <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 22px'}}>{mode==='bulk' ? '13주차 전체에 적용될 공통 설정과 교시별 분량을 조정합니다.' : 'AI가 생성할 슬라이드의 분량과 학습 Flow 단계 분배를 설정합니다.'}</p>

      {mode==='bulk' && (
        <div style={{display:'inline-flex',background:'var(--admin-bg)',borderRadius:8,padding:3,marginBottom:18}}>
          {[
            {k:'common', l:'공통 설정',     hint:'13주차 모두 동일'},
            {k:'matrix', l:'교시별 분량 매트릭스', hint:'교시별 override'},
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{padding:'7px 14px',border:'none',cursor:'pointer',borderRadius:6,background:tab===t.k?'white':'transparent',color:tab===t.k?'var(--admin-ink)':'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,boxShadow:tab===t.k?'0 1px 2px rgba(0,0,0,0.06)':'none',display:'inline-flex',alignItems:'center',gap:7}}>
              {t.l}
              <span style={{fontSize:10,color:'var(--admin-muted)',fontWeight:500}}>· {t.hint}</span>
            </button>
          ))}
        </div>
      )}

      {mode==='bulk' && tab==='matrix' ? <BulkMatrixView/> : (
      <>
      <div style={{padding:'18px 20px',background:'var(--admin-bg)',borderRadius:10,marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>총 슬라이드 분량</div>
          <div style={{fontFamily:'ui-monospace,monospace',fontSize:13,color:'var(--admin-ink)'}}>{length}매 · 약 {Math.round(length*1.7)}분</div>
        </div>
        <input type="range" min="20" max="40" value={length} onChange={e => setLength(+e.target.value)} style={{width:'100%',accentColor:'var(--hycu-cyan)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--admin-faint)',marginTop:4}}>
          <span>20매 · 짧게</span><span style={{color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>30매 · 권장</span><span>40매 · 깊게</span>
        </div>
      </div>

      <div style={{marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>학습 Flow 단계별 분배 <span style={{color:'var(--admin-muted)',fontWeight:500,fontSize:12,marginLeft:6}}>준비 · 학습 · 정리 흐름에 맞춰 슬라이드가 자동 배분됩니다</span></div>
          <span style={{fontSize:11,padding:'2px 8px',borderRadius:999,background:'rgba(0,181,226,0.1)',color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,letterSpacing:'0.04em'}}>AI 추천</span>
        </div>
        {/* 학습 Flow 3단계 분배 바 */}
        <div style={{display:'flex',gap:2,height:54,borderRadius:8,overflow:'hidden',background:'var(--admin-line)'}}>
          {[
            { k: '준비하기', num: '01', n: 4,  c: '#0091B8', addie: ['A','D'] },
            { k: '학습하기', num: '02', n: 21, c: '#1B2C3F', addie: ['Dv','I','E'] },
            { k: '정리하기', num: '03', n: 3,  c: '#5A6B7E', addie: ['E','A'] },
          ].map(s => (
            <div key={s.k} title={`${s.k} · ${s.n}매`} style={{flex:s.n,background:s.c,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',gap:3,padding:'6px'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:6}}>
                <span style={{fontFamily:'ui-monospace,monospace',fontSize:10,opacity:0.7,fontWeight:700}}>{s.num}</span>
                <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,letterSpacing:'-0.01em'}}>{s.k} · {s.n}매</span>
              </div>
              <div style={{display:'flex',gap:3}}>
                {s.addie.map(k => {
                  const ai = (window.ADDIE_INFO || {})[k];
                  if (!ai) return null;
                  return <span key={k} title={`${ai.full} · ${ai.ko}`} style={{
                    fontFamily:'ui-monospace,monospace',fontSize:9,fontWeight:700,
                    padding:'1.5px 5px',borderRadius:3,lineHeight:1,
                    background:'rgba(255,255,255,0.18)',color:'white',border:'1px solid rgba(255,255,255,0.3)'
                  }}>{ai.label}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
        {/* 보조: ADDIE 분배 (작게) */}
        <div style={{marginTop:10,padding:'10px 14px',background:'var(--admin-bg)',borderRadius:8,border:'1px solid var(--admin-line)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,letterSpacing:'0.02em'}}>참고 — ADDIE 분배</div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'ui-monospace,monospace'}}>학습 Flow 매핑 자동 산출</div>
          </div>
          <div style={{display:'flex',gap:1,height:6,borderRadius:999,overflow:'hidden',background:'white',border:'1px solid var(--admin-line)'}}>
            {[
              { k: 'A',  n: 1  }, { k: 'D',  n: 3  }, { k: 'Dv', n: 18 }, { k: 'I',  n: 3  }, { k: 'E',  n: 3  },
            ].map(s => {
              const ai = (window.ADDIE_INFO || {})[s.k];
              return <div key={s.k} style={{flex:s.n,background:ai.color}}></div>;
            })}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:10}}>
            {[
              { k: 'A',  n: 1  }, { k: 'D',  n: 3  }, { k: 'Dv', n: 18 }, { k: 'I',  n: 3  }, { k: 'E',  n: 3  },
            ].map(s => {
              const ai = (window.ADDIE_INFO || {})[s.k];
              return (
                <div key={s.k} style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:ai.color}}></span>
                  <span style={{fontWeight:700,color:'var(--admin-ink)'}}>{ai.label}</span>
                  <span style={{color:'var(--admin-muted)',fontFamily:'ui-monospace,monospace'}}>{s.n}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:8}}>
          학습하기 단계 비중이 75%로, 50분 강의에서 권장 균형입니다 · 슬라이드 에디터에서 교시별로 재조정 가능
        </div>
      </div>

      <div style={{marginBottom:18}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600,marginBottom:10}}>설명 톤</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[
            { id: 'concise', label: '간결', desc: '핵심 위주, 짧은 문장' },
            { id: 'balanced', label: '균형', desc: '학부생 표준 톤' },
            { id: 'narrative', label: '서사적', desc: '명조체 도입·인용 풍부' },
          ].map(t => (
            <button key={t.id} onClick={() => setTone(t.id)} style={{
              border: tone===t.id?'2px solid var(--hycu-cyan)':'1px solid var(--admin-line)',
              background: tone===t.id?'rgba(0,181,226,0.04)':'white',
              padding:'12px 14px',borderRadius:10,textAlign:'left',cursor:'pointer'
            }}>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,color:'var(--admin-ink)',fontWeight:600}}>{t.label}</div>
              <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>자동 생성 항목 <span style={{color:'var(--admin-muted)',fontWeight:500,fontSize:12,marginLeft:6}}>각 항목이 어느 학습 Flow 단계에 들어가는지 표시됩니다</span></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            { l: '학습 목표 슬라이드',         d: true,  flow: '준비', a: 'D'  },
            { l: '핵심 키워드 칩',              d: true,  flow: '준비', a: 'D'  },
            { l: '핵심 정리 카드',              d: true,  flow: '정리', a: 'E'  },
            { l: '체크포인트 박스',             d: true,  flow: '학습', a: 'E'  },
            { l: '형성평가 문항 (3문)',         d: true,  flow: '학습', a: 'E'  },
            { l: '교수자 스크립트(내레이션)',    d: true,  flow: '학습', a: 'Dv' },
            { l: '인용·도입 명조 카피',         d: true,  flow: '준비', a: 'A'  },
            { l: '도식·다이어그램 제안',        d: false, flow: '학습', a: 'Dv' },
          ].map((o, i) => {
            const flowColor = { '준비':'#0091B8','학습':'#1B2C3F','정리':'#5A6B7E' }[o.flow] || 'var(--admin-muted)';
            const ai = (window.ADDIE_INFO || {})[o.a];
            return (
              <label key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'white',border:'1px solid var(--admin-line)',borderRadius:8,cursor:'pointer'}}>
                <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${o.d?'var(--hycu-cyan)':'var(--admin-line-strong)'}`,background:o.d?'var(--hycu-cyan)':'white',display:'grid',placeItems:'center',color:'white',flexShrink:0}}>
                  {o.d && <Icon name="check" size={11}/>}
                </div>
                <span style={{flex:1,fontSize:13,color:'var(--admin-ink)'}}>{o.l}</span>
                <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'2px 8px',borderRadius:999,background:`${flowColor}15`,color:flowColor,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,border:`1px solid ${flowColor}33`}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:flowColor}}></span>{o.flow}
                </span>
                {ai && (
                  <span title={`${ai.full} · ${ai.ko}`} style={{
                    display:'inline-flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'ui-monospace,monospace',fontSize:9,fontWeight:700,
                    padding:'2px 5px',borderRadius:3,lineHeight:1,
                    background:`${ai.color}10`,color:ai.color,border:`1px solid ${ai.color}33`,opacity:0.8
                  }}>{ai.label}</span>
                )}
              </label>
            );
          })}
        </div>

        {/* 학습 Flow 커버리지 요약 */}
        <div style={{marginTop:14,padding:'12px 14px',background:'var(--admin-bg)',borderRadius:8,border:'1px solid var(--admin-line)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,color:'var(--admin-ink)'}}>자동 생성 항목의 학습 Flow 커버리지</div>
            <div style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'ui-monospace,monospace'}}>활성 7 / 비활성 1</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',fontSize:11}}>
            {[
              { flow: '준비', n: 3, c: '#0091B8' },
              { flow: '학습', n: 3, c: '#1B2C3F' },
              { flow: '정리', n: 1, c: '#5A6B7E' },
            ].map(s => (
              <div key={s.flow} style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:999,background:`${s.c}10`,border:`1px solid ${s.c}33`}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:s.c}}></span>
                <span style={{fontWeight:700,color:s.c}}>{s.flow}하기</span>
                <span style={{fontFamily:'ui-monospace,monospace',color:'var(--admin-muted)'}}>· {s.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

const BulkMatrixView = () => {
  const sessions = Array.from({length: 39}, (_, i) => {
    const w = Math.floor(i/3) + 1;
    const s = (i%3) + 1;
    const base = { w, s, label: `${w}주차 ${String(s).padStart(2,'0')}교시`, prep: 4, learn: 21, wrap: 3 };
    if (i === 4) { base.prep = 5; base.learn = 22; base.wrap = 3; }  // 3-1
    if (i === 9) { base.prep = 4; base.learn = 18; base.wrap = 3; }  // 5-2 less
    if (i === 14) { base.prep = 3; base.learn = 16; base.wrap = 3; } // 8-1
    base.total = base.prep + base.learn + base.wrap;
    base.override = (base.prep + base.learn + base.wrap) !== 28;
    return base;
  });
  const totalSlides = sessions.reduce((a, s) => a + s.total, 0);
  const overrides = sessions.filter(s => s.override).length;
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        <SummaryStat label="총 슬라이드" value={`${totalSlides}매`} sub={`평균 ${(totalSlides/16).toFixed(1)}매/차시`}/>
        <SummaryStat label="override" value={`${overrides}건`} sub={overrides===0?'모두 표준':'표준에서 벗어난 차시'} hi={overrides>0}/>
        <SummaryStat label="예상 총 분량" value={`${Math.round(totalSlides*1.7)}분`} sub="콘텐츠 총 시간"/>
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr style={{background:'var(--admin-bg)',borderBottom:'1px solid var(--admin-line)'}}>
              {['교시','챕터','준비','학습','정리','총 매수',''].map((h, i) => (
                <th key={i} style={{padding:'10px 12px',textAlign:i>=2&&i<=5?'center':'left',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:700,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((r, i) => (
              <tr key={i} style={{borderTop:i?'1px solid var(--admin-line-soft)':'none',background: r.override ? 'rgba(0,181,226,0.04)' : 'transparent'}}>
                <td style={{padding:'10px 12px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,color:'var(--admin-ink)'}}>
                  {r.label}
                  {r.override && <span style={{marginLeft:8,fontSize:10,padding:'1px 6px',borderRadius:3,background:'var(--hycu-cyan)',color:'white',fontWeight:700,letterSpacing:'0.04em'}}>OVERRIDE</span>}
                </td>
                <td style={{padding:'10px 12px',color:'var(--admin-charcoal)',fontSize:12}}>Ch.0{r.w} · 0{r.s}차시</td>
                <td style={{padding:'10px 12px',textAlign:'center'}}>
                  <span style={{display:'inline-block',minWidth:32,padding:'4px 8px',background:'#0091B815',color:'#0091B8',borderRadius:4,fontFamily:'ui-monospace,monospace',fontSize:11,fontWeight:700}}>{r.prep}</span>
                </td>
                <td style={{padding:'10px 12px',textAlign:'center'}}>
                  <span style={{display:'inline-block',minWidth:32,padding:'4px 8px',background:'#1B2C3F15',color:'#1B2C3F',borderRadius:4,fontFamily:'ui-monospace,monospace',fontSize:11,fontWeight:700}}>{r.learn}</span>
                </td>
                <td style={{padding:'10px 12px',textAlign:'center'}}>
                  <span style={{display:'inline-block',minWidth:32,padding:'4px 8px',background:'#5A6B7E15',color:'#5A6B7E',borderRadius:4,fontFamily:'ui-monospace,monospace',fontSize:11,fontWeight:700}}>{r.wrap}</span>
                </td>
                <td style={{padding:'10px 12px',textAlign:'center',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,color:r.override?'var(--hycu-cyan-deep)':'var(--admin-ink)'}}>{r.total}매</td>
                <td style={{padding:'10px 12px',textAlign:'right'}}>
                  <button className="btn btn-quiet" style={{fontSize:11}}>조정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:14,display:'flex',gap:10,alignItems:'center'}}>
        <button className="btn btn-ghost" style={{fontSize:12}}><Icon name="refresh" size={12}/> 모두 표준값으로 되돌리기</button>
        <button className="btn btn-ghost" style={{fontSize:12}}><Icon name="sparkles" size={12}/> AI로 무게 자동 조정</button>
        <div style={{flex:1}}></div>
        <div style={{fontSize:11,color:'var(--admin-muted)'}}>
          <span style={{display:'inline-block',width:10,height:10,background:'rgba(0,181,226,0.18)',borderRadius:2,verticalAlign:'middle',marginRight:6}}></span>
          override 교시 강조
        </div>
      </div>
    </div>
  );
};

const WizBulkStep = ({ onScreen }) => {
  const [parallel, setParallel] = React.useState(5);
  const [sampleFirst, setSampleFirst] = React.useState(true);
  const sessions = Array.from({length: 39}, (_, i) => {
    const w = Math.floor(i/3) + 1;
    const s = (i%3) + 1;
    return { id: `${w}-${s}`, label: `${w}주차 ${String(s).padStart(2,'0')}교시`, status: i === 0 ? 'done' : i < 4 ? 'running' : 'queued' };
  });
  const statusInfo = {
    queued:  { l: '대기',     c: '#9CA3AF' },
    running: { l: '진행 중',   c: '#0091B8' },
    done:    { l: '완료',     c: '#166B4A' },
    review:  { l: '검토 대기', c: '#9C5B1F' }};
  const totalCost = 16 * 340;
  const estMin = Math.ceil(16 * 4 / parallel);
  return (
    <div>
      <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>일괄 생성 큐 보드</h2>
      <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 22px'}}>13주차를 한 번에 생성합니다. 진행 중인 교시는 실시간으로 확인할 수 있습니다.</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:10,marginBottom:18}}>
        <SummaryStat label="전체 차시" value="16" sub="AI 리터러시"/>
        <SummaryStat label="예상 시간" value={`${estMin}분`} sub={`동시 ${parallel} 병렬`} hi/>
        <SummaryStat label="예상 슬라이드" value="488매" sub="평균 30.5매/차시"/>
      </div>

      <div style={{padding:'14px 16px',background:'var(--admin-bg)',borderRadius:10,marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,color:'var(--admin-ink)'}}>동시 생성 수</div>
          <div style={{fontFamily:'ui-monospace,monospace',fontSize:12,color:'var(--admin-ink)'}}>{parallel} 동시 · {estMin}분</div>
        </div>
        <input type="range" min="1" max="5" value={parallel} onChange={e => setParallel(+e.target.value)} style={{width:'100%',accentColor:'var(--hycu-cyan)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--admin-muted)',marginTop:4}}>
          <span>1 (64분)</span><span>3 (22분)</span><span style={{color:'var(--hycu-cyan-deep)',fontWeight:700}}>5 (13분 권장)</span>
        </div>
      </div>

      <label style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'white',border:`1.5px solid ${sampleFirst?'var(--hycu-cyan)':'var(--admin-line)'}`,borderRadius:10,marginBottom:18,cursor:'pointer'}}>
        <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${sampleFirst?'var(--hycu-cyan)':'var(--admin-line-strong)'}`,background:sampleFirst?'var(--hycu-cyan)':'white',display:'grid',placeItems:'center',color:'white',flexShrink:0}} onClick={() => setSampleFirst(!sampleFirst)}>
          {sampleFirst && <Icon name="check" size={11}/>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,color:'var(--admin-ink)'}}>샘플 교시 우선 검토</div>
          <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:2}}>첫 교시를 먼저 생성하고 톤·품질을 검토한 뒤 나머지 15교시를 진행합니다 (권장)</div>
        </div>
        <span style={{fontSize:11,padding:'3px 9px',borderRadius:999,background:'rgba(0,181,226,0.12)',color:'var(--hycu-cyan-deep)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700}}>품질 안전망</span>
      </label>

      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:700,marginBottom:10,color:'var(--admin-ink)'}}>교시 큐</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:10}}>
        {['queued','running','done','review'].map(st => {
          const info = statusInfo[st];
          const rows = sessions.filter(s => s.status === st);
          return (
            <div key={st} style={{background:'var(--admin-bg)',borderRadius:10,padding:10,minHeight:200,border:'1px solid var(--admin-line)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,padding:'4px 4px 8px',borderBottom:`2px solid ${info.c}33`}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:info.c}}></span>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,color:info.c}}>{info.l}</div>
                </div>
                <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,color:'var(--admin-muted)'}}>{rows.length}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {rows.map(r => (
                  <div key={r.id} style={{padding:'8px 10px',background:'white',border:'1px solid var(--admin-line)',borderRadius:6,fontSize:12}}>
                    <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,color:'var(--admin-ink)'}}>{r.label}</div>
                    {r.status === 'running' && (
                      <div style={{marginTop:5,height:3,background:'var(--admin-line)',borderRadius:999,overflow:'hidden'}}>
                        <div style={{width:'40%',height:'100%',background:info.c,borderRadius:999}}></div>
                      </div>
                    )}
                    {r.status === 'done' && <div style={{fontSize:10,color:'var(--admin-muted)',marginTop:2}}>✓ 28매 · 2분 32초</div>}
                  </div>
                ))}
                {rows.length === 0 && <div style={{padding:'14px 8px',textAlign:'center',color:'var(--admin-muted)',fontSize:11}}>비어있음</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:18,padding:'14px 16px',background:'rgba(0,181,226,0.06)',border:'1px solid rgba(0,181,226,0.2)',borderRadius:10,display:'flex',gap:12,alignItems:'flex-start'}}>
        <Icon name="sparkles" size={18} style={{color:'#0091B8',flexShrink:0,marginTop:1}}/>
        <div style={{flex:1,fontSize:13,color:'var(--admin-ink)',lineHeight:1.55}}>
          모든 교시는 <strong>HYCU 디자인 시스템 v1.0</strong>을 자동 준수하며, 학습 Flow(준비·학습·정리) 분배가 균일하게 적용됩니다. 생성 도중 다른 화면으로 이동해도 백그라운드에서 계속 진행되며 완료 시 알림으로 안내합니다.
        </div>
        <button className="btn btn-ghost" style={{fontSize:12,flexShrink:0}} onClick={() => onScreen('dashboard')}>
          <Icon name="minus" size={12}/> 백그라운드로
        </button>
      </div>
    </div>
  );
};

const SummaryStat = ({ label, value, sub, hi }) => (
  <div style={{padding:'14px 16px',background:hi?'linear-gradient(135deg, var(--hycu-cyan), var(--hycu-cyan-deep))':'white',border:hi?'none':'1px solid var(--admin-line)',borderRadius:10,color:hi?'white':'inherit'}}>
    <div style={{fontSize:11,color:hi?'rgba(255,255,255,0.75)':'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}</div>
    <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:22,fontWeight:800,color:hi?'white':'var(--admin-ink)',marginTop:4,letterSpacing:'-0.02em'}}>{value}</div>
    <div style={{fontSize:11,color:hi?'rgba(255,255,255,0.75)':'var(--admin-muted)',marginTop:2}}>{sub}</div>
  </div>
);

const WizStep5 = ({ onScreen }) => (
  <div>
    <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:20,margin:'0 0 6px',fontWeight:600}}>최종 확인</h2>
    <p style={{color:'var(--admin-muted)',fontSize:13,margin:'0 0 22px'}}>AI 생성을 시작하면 약 4분 후 28매의 초안 슬라이드가 준비됩니다.</p>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      {[
        ['과목', 'AI 리터러시 · AIG101'],
        ['교시', '5주차 · 02교시 · 50분'],
        ['주제', '생성형 AI의 이해와 업무 활용'],
        ['참고 자료', '3건 · 16,770 tokens'],
        ['학습 목표', '4개 (Bloom 균형 배치)'],
        ['슬라이드 분량', '28매 (Dev 18매 중심)'],
        ['톤', '균형 · 학부생 표준'],
        ['예상 비용', '약 ₩340 (모델 사용료)'],
      ].map(([k,v], i) => (
        <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'12px 14px',background:'var(--admin-bg)',borderRadius:8}}>
          <div style={{fontSize:12,color:'var(--admin-muted)'}}>{k}</div>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,color:'var(--admin-ink)',fontWeight:500}}>{v}</div>
        </div>
      ))}
    </div>

    <div style={{marginTop:18,padding:'14px 16px',background:'rgba(0,181,226,0.06)',border:'1px solid rgba(0,181,226,0.2)',borderRadius:10,display:'flex',gap:12}}>
      <Icon name="sparkles" size={20} style={{color:'#0091B8',flexShrink:0,marginTop:2}}/>
      <div style={{fontSize:13,color:'var(--admin-ink)',lineHeight:1.55}}>
        모든 슬라이드는 <strong>HYCU 디자인 시스템 v1.0</strong>의 마스터 좌표·시안 액센트·교수자 안전 영역(480×540px)을 자동 준수합니다. 생성 후 슬라이드 에디터에서 텍스트와 다이어그램을 직접 편집할 수 있습니다.
      </div>
    </div>
  </div>
);

const WizSidebar = ({ step }) => {
  // step is 2, 3, or 4 — map to local index 0/1/2
  const idx = step - 2;
  const stages = ['Analysis · Design', 'Design · Development', 'Implementation'];
  const titles = ['자료·목표 정리', '구성 설계', '실행 준비'];
  const descs = [
    '업로드한 자료의 토픽 분포를 분석하고, Bloom\'s Taxonomy 기준으로 학습 목표의 인지 수준을 분류합니다.',
    'ADDIE 단계 비율과 슬라이드 분량을 균형 있게 배치합니다.',
    '생성 직전 마지막 검토. 모든 설정이 마스터 슬라이드 규칙을 준수합니다.',
  ];
  return (
  <div style={{display:'flex',flexDirection:'column',gap:14}}>
    <div className="card" style={{padding:18}}>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--hycu-cyan-deep)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600,marginBottom:8}}>
        ADDIE Stage · {stages[idx]}
      </div>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,color:'var(--admin-ink)',marginBottom:6,fontWeight:600}}>
        {titles[idx]}
      </div>
      <p style={{fontSize:12,color:'var(--admin-muted)',lineHeight:1.55,margin:0}}>
        {descs[idx]}
      </p>
    </div>

    <div className="card" style={{padding:18}}>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600,marginBottom:10}}>참고 — 디자인 시스템</div>
      <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:12}}>
        {[
          ['16:9 고정', '1920×1080'],
          ['HYCU 폰트', '4종 전용'],
          ['시안 액센트', '#00B5E2'],
          ['교수자 영역', '480×540 우하단'],
          ['ADDIE 인디케이터', '우상단'],
        ].map(([k,v], i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{color:'var(--admin-muted)'}}>{k}</span>
            <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',color:'var(--admin-ink)',fontWeight:500}}>{v}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="card" style={{padding:18,background:'#0E1116',color:'white',borderColor:'#0E1116'}}>
      <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#00B5E2',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600,marginBottom:8}}>예상 처리</div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1B1F25',fontSize:12}}>
        <span style={{color:'#9AA2AD'}}>구조 분석</span><span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>~ 30초</span>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1B1F25',fontSize:12}}>
        <span style={{color:'#9AA2AD'}}>슬라이드 생성</span><span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>~ 3분</span>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',fontSize:12}}>
        <span style={{color:'#9AA2AD'}}>레이아웃 적용</span><span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>~ 1분</span>
      </div>
    </div>
  </div>
  );
};

window.Wizard = Wizard;
