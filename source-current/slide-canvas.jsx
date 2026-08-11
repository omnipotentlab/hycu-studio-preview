// HYCU Slide Canvas — faithful renderer of the design system
// Renders 1920x1080 slide that can be scaled with CSS transform

const ADDIE_STAGES = [
  { key: 'A', label: 'A' },
  { key: 'D', label: 'D' },
  { key: 'Dv', label: 'D' },
  { key: 'I', label: 'I' },
  { key: 'E', label: 'E' },
];

const PhaseFromLetter = (p) => {
  const idx = { 'A': 0, 'D': 1, 'Dv': 2, 'I': 3, 'E': 4 }[p];
  return idx ?? -1;
};

// Master header — common across body slides
const SlideHeader = ({ chapter, subchapter, phase }) => {
  const activeIdx = PhaseFromLetter(phase);
  return (
    <>
      <div className="header"></div>
      <div className="logo">
        <div className="mark">H</div>
        <div className="name">HYCU<div className="sub">한양사이버대학교</div></div>
      </div>
      <div className="chapter-indicator">
        <span className="ch">{chapter?.split(' ')[0]}</span>
        <span>{chapter?.split(' ').slice(1).join(' ')}</span>
        {subchapter && <><span className="arrow">▸</span><span>{subchapter}</span></>}
      </div>
      <div className="addie">
        {ADDIE_STAGES.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`stage ${i === activeIdx ? 'active' : i < activeIdx ? 'done' : ''}`}>
              <div className="node"></div>
              <div className="label">{s.label}</div>
            </div>
            {i < 4 && <div className={`conn ${i < activeIdx ? 'done' : ''}`}></div>}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const SlideFooter = ({ subject, week, n, total }) => {
  const pct = (n / total) * 100;
  return (
    <div className="footer">
      <div className="track"></div>
      <div className="progress" style={{ width: pct + '%' }}></div>
      <div className="meta">{subject}<span className="arrow">▸</span>{week}주차<span className="arrow">▸</span>HYCU</div>
      <div className="pageno">{String(n).padStart(2,'0')} / {total}</div>
    </div>
  );
};

const InstructorZone = ({ live }) => (
  <div className={`instructor-zone ${live ? 'live' : ''}`}>
    {live ? (
      <div style={{textAlign:'center'}}>
        <div style={{width:120,height:120,borderRadius:'50%',background:'linear-gradient(135deg,#3a5a7a,#5a7a9a)',margin:'0 auto 18px',display:'grid',placeItems:'center',color:'#fff',fontSize:48,fontFamily:'HYCUGothicM'}}>김</div>
        <div className="font-gothic-m" style={{fontSize:18,color:'#0091B8',fontWeight:600}}>홍길동 교수</div>
        <div className="font-gothic-l" style={{fontSize:14,color:'#5A6473',marginTop:4}}>크로마키 합성 영상</div>
        <div style={{marginTop:24,padding:'8px 14px',background:'rgba(0,181,226,0.1)',borderRadius:999,display:'inline-flex',alignItems:'center',gap:8,fontSize:13,color:'#0091B8',fontFamily:'HYCUGothicM'}}>
          <span style={{width:8,height:8,background:'#E5484D',borderRadius:'50%'}}></span>REC · 28:14
        </div>
      </div>
    ) : (
      <div style={{textAlign:'center'}}>
        <div style={{width:110,height:110,borderRadius:'50%',background:'linear-gradient(135deg,#E8EEF3,#D5DEE7)',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#8A96A5',fontSize:42,fontFamily:'HYCUGothicM'}}>김</div>
        <div className="font-gothic-m" style={{fontSize:16,color:'#5A6473',fontWeight:600}}>홍길동 교수</div>
        <div className="font-gothic-l" style={{fontSize:12.5,color:'#9AA4B0',marginTop:3}}>교수자 영상 영역</div>
      </div>
    )}
  </div>
);

// Slide title block
const SlideTitle = ({ title, subtitle }) => (
  <div className="title-block">
    <div className="accent"></div>
    <h1 className="title">{title}</h1>
    {subtitle && <div className="subtitle">{subtitle}</div>}
  </div>
);

// === Layouts per slide type ===

const CoverSlide = ({ slide, deck }) => (
  <>
    <div className="logo">
      <div className="mark">H</div>
      <div className="name">HYCU<div className="sub">한양사이버대학교</div></div>
    </div>
    <div style={{position:'absolute',left:80,top:280,width:1080}}>
      <div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0091B8',letterSpacing:'0.04em',fontWeight:600}}>
        {deck.subject.toUpperCase()} · {deck.course} · {deck.week}주차 · 02교시
      </div>
      <h1 style={{fontFamily:'HYCUMyungJoB',fontSize:80,fontWeight:700,letterSpacing:'-0.025em',lineHeight:1.15,color:'#0E1116',margin:'24px 0 0'}}>
        {slide.title}
      </h1>
      <div style={{width:128,height:6,background:'#00B5E2',margin:'40px 0 28px'}}></div>
      <div style={{fontFamily:'HYCUMyungJoL',fontSize:30,letterSpacing:'-0.01em',lineHeight:1.4,color:'#3F4753'}}>
        {slide.subtitle}
      </div>
      <div style={{marginTop:88,fontFamily:'HYCUGothicM',fontSize:18,color:'#1E2530',fontWeight:500}}>
        {deck.professor}
      </div>
      <div style={{fontFamily:'HYCUGothicL',fontSize:16,color:'#5A6473',marginTop:4}}>
        {deck.affiliation}
      </div>
    </div>
    {/* Instructor zone for cover (no ADDIE) */}
  </>
);

const ObjectivesSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{display:'grid', gridTemplateColumns: '1fr', gap:24, width: 880}}>
        <div className="obj-card">
          <div className="head">
            <span style={{display:'inline-grid',placeItems:'center',width:28,height:28,background:'#00B5E2',borderRadius:6,color:'white'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </span>
            학습 목표
          </div>
          <ul>
            {slide.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:0,marginTop:8}}>
          <div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0091B8',marginRight:14,padding:'6px 0',letterSpacing:'0.02em',textTransform:'uppercase',fontWeight:600}}>핵심 키워드</div>
          {slide.keywords.map((k, i) => (
            <span key={i} className={`chip ${i < 2 ? 'active' : ''}`}>{k}</span>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:14}}>
          <div className="summary-card">
            <div className="head">학습 시간 안내</div>
            <div className="body" style={{display:'flex',alignItems:'center',gap:14,marginTop:6}}>
              <div style={{fontFamily:'HYCUGothicM',fontSize:32,color:'#0E1116',fontWeight:600}}>50<span style={{fontSize:16,color:'#5A6473',marginLeft:4}}>분</span></div>
              <div style={{flex:1,fontSize:13,color:'#5A6473'}}>도입 5 · 전개 35 · 정리 10</div>
            </div>
          </div>
          <div className="check-card">
            <div className="head">✓ 잠깐, 점검해 봅시다</div>
            <div className="body">지금까지 "측정한다"는 표현을 어떤 의미로 써왔나요? 한 문장으로 정의해 보세요.</div>
          </div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const ConceptSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:20,width:880}}>
        <div className="body-text" style={{fontFamily:'HYCUGothicL',fontSize:18,lineHeight:1.7,color:'#1E2530'}}>
          {slide.body}
        </div>

        {slide.quote && (
          <div className="quote-block" style={{background:'#F5F7FA',borderLeft:'4px solid #00B5E2',borderRadius:8,padding:'24px 28px'}}>
            <div style={{fontFamily:'HYCUMyungJoL',fontSize:24,lineHeight:1.45,color:'#0E1116',letterSpacing:'-0.01em'}}>
              "{slide.quote.text}"
            </div>
            <div style={{fontFamily:'HYCUGothicL',fontSize:13,color:'#5A6473',marginTop:12}}>
              {slide.quote.source}
            </div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14,marginTop:8}}>
          {slide.summary && (
            <div className="summary-card">
              <div className="head">핵심 정리</div>
              <div className="body">{slide.summary}</div>
            </div>
          )}
          {slide.checkpoint && (
            <div className="check-card">
              <div className="head">✓ 잠깐, 점검해 봅시다</div>
              <div className="body">{slide.checkpoint}</div>
            </div>
          )}
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const ConceptDiagramSlide = ({ slide, deck, instructorLive }) => {
  const types = [
    { name: '규칙 기반 시스템', desc: '사람이 정한 규칙대로만 동작 (초기 챗봇)', icon: '§', en: 'Rule-based' },
    { name: '머신러닝', desc: '데이터에서 패턴을 학습해 판단 (스팸 분류)', icon: '∑', en: 'Machine Learning' },
    { name: '딥러닝', desc: '다층 신경망으로 복잡한 패턴 학습 (이미지 인식)', icon: '◇', en: 'Deep Learning' },
    { name: '생성형 AI', desc: '학습한 패턴으로 새 결과를 직접 생성 (텍스트·이미지)', icon: '✦', en: 'Generative AI' },
  ];
  return (
    <>
      <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
      <SlideTitle title={slide.title} subtitle={slide.subtitle} />
      <div className="body">
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:18,width:880}}>
          {types.map((t, i) => (
            <div key={i} style={{background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:'22px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(0,181,226,0.12)',color:'#0091B8',fontSize:30,display:'grid',placeItems:'center',fontFamily:'serif'}}>{t.icon}</div>
                <div>
                  <div style={{fontFamily:'HYCUGothicM',fontSize:20,color:'#0E1116',fontWeight:600}}>{t.name}</div>
                  <div style={{fontFamily:'HYCUGothicL',fontSize:12,color:'#7A8390',letterSpacing:'0.04em'}}>{t.en} level</div>
                </div>
              </div>
              <div style={{fontFamily:'HYCUGothicL',fontSize:15,color:'#3F4753',lineHeight:1.55}}>{t.desc}</div>
            </div>
          ))}
        </div>
        <div style={{position:'absolute',left:0,bottom:30,display:'flex',gap:14}}>
          <div className="summary-card" style={{width:540}}>
            <div className="head">핵심 정리</div>
            <div className="body">규칙 기반에서 생성형 AI로 갈수록 사람이 직접 정하는 규칙은 줄고, 데이터에서 스스로 패턴을 찾는 비중이 커진다. 지금의 생성형 AI는 이 발전의 가장 최근 단계다.</div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignContent:'center'}}>
            {['패턴 학습', '입력 결합', '결과 생성', '반복 개선'].map(k => (
              <span key={k} className="chip">{k}</span>
            ))}
          </div>
        </div>
      </div>
      <InstructorZone live={instructorLive} />
      <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
    </>
  );
};

const ModelDiagramSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        {/* Diagram */}
        <div style={{position:'relative',height:340,background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:24}}>
          {/* Central executive */}
          <div style={{position:'absolute',left:'50%',top:24,transform:'translateX(-50%)',width:280,padding:'14px 18px',background:'#00B5E2',color:'white',borderRadius:12,textAlign:'center',fontFamily:'HYCUGothicM',fontSize:17,fontWeight:600,boxShadow:'0 4px 16px rgba(0,181,226,0.25)'}}>
            좋은 프롬프트
            <div style={{fontFamily:'HYCUGothicL',fontSize:12,fontWeight:400,marginTop:3,opacity:0.9}}>목표·맥락·자료·제약·형식을 한 번에 설계</div>
          </div>
          {/* Lines */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
            <line x1="50%" y1="84" x2="18%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
            <line x1="50%" y1="84" x2="50%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
            <line x1="50%" y1="84" x2="82%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
          </svg>
          {/* Three subsystems */}
          {[
            { x: '4%', label: '목표·맥락', en: 'Goal & Context', desc: '무엇을 왜 원하는가' },
            { x: '36%', label: '자료·제약', en: 'Data & Constraints', desc: '참고자료와 지켜야 할 조건' },
            { x: '68%', label: '출력 형식', en: 'Output Format', desc: '결과를 어떤 형태로 받을지' },
          ].map((s, i) => (
            <div key={i} style={{position:'absolute',left:s.x,top:200,width:'28%',padding:'14px 16px',background:'white',border:'1.5px solid #00B5E2',borderRadius:10,textAlign:'center'}}>
              <div style={{fontFamily:'HYCUGothicM',fontSize:15,color:'#0E1116',fontWeight:600}}>{s.label}</div>
              <div style={{fontFamily:'HYCUGothicL',fontSize:11,color:'#7A8390',margin:'2px 0 6px',letterSpacing:'0.02em'}}>{s.en}</div>
              <div style={{fontFamily:'HYCUGothicL',fontSize:13,color:'#5A6473'}}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14,marginTop:18}}>
          <div className="summary-card">
            <div className="head">핵심 정리</div>
            <div className="body">{slide.summary}</div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignContent:'center'}}>
            {slide.keywords?.map(k => <span key={k} className="chip">{k}</span>)}
          </div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const ComparisonSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:'white',border:'1px solid #E9ECF0',borderRadius:12,overflow:'hidden'}}>
          {/* Header */}
          <div style={{padding:'18px 20px',background:'rgba(0,181,226,0.12)',fontFamily:'HYCUGothicM',fontSize:14,color:'#5A6473'}}>구분</div>
          <div style={{padding:'18px 20px',background:'rgba(0,181,226,0.12)',fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',fontWeight:600,borderLeft:'1px solid #E9ECF0'}}>AI가 하는 일</div>
          <div style={{padding:'18px 20px',background:'rgba(0,181,226,0.12)',fontFamily:'HYCUGothicM',fontSize:18,color:'#0091B8',fontWeight:600,borderLeft:'1px solid #E9ECF0'}}>사람이 하는 일</div>
          {[
            ['핵심 역할', '빠르게 초안·후보를 생성한다', '맥락에 맞는지 판단한다'],
            ['속도', '즉시, 대량으로 생성 가능', '검토에는 시간이 필요하다'],
            ['오류 특성', '그럴듯하지만 틀릴 수 있다(환각)', '틀린 부분을 알아볼 수 있다'],
            ['확인 방법', '근거·출처를 함께 요청한다', '원문·사실과 대조해 검증한다'],
            ['최종 책임', 'AI는 결과를 책임지지 않는다', '사용·배포의 책임은 사람에게 있다'],
          ].map((row, i) => (
            <React.Fragment key={i}>
              <div style={{padding:'14px 20px',fontFamily:'HYCUGothicM',fontSize:14,color:'#5A6473',background: i%2 ? '#F5F7FA':'white',borderTop:'1px solid #E9ECF0'}}>{row[0]}</div>
              <div style={{padding:'14px 20px',fontFamily:'HYCUGothicL',fontSize:15,color:'#1E2530',borderLeft:'1px solid #E9ECF0',background: i%2 ? '#F5F7FA':'white',borderTop:'1px solid #E9ECF0'}}>{row[1]}</div>
              <div style={{padding:'14px 20px',fontFamily:'HYCUGothicL',fontSize:15,color:'#0E1116',fontWeight:500,borderLeft:'1px solid #E9ECF0',background: i%2 ? '#F5F7FA':'white',borderTop:'1px solid #E9ECF0'}}>{row[2]}</div>
            </React.Fragment>
          ))}
        </div>
        <div className="summary-card" style={{marginTop:14}}>
          <div className="head">핵심 정리</div>
          <div className="body">AI는 속도, 사람은 판단 — 이 둘은 대체 관계가 아니라 역할 분담이다. AI가 빨리 만들어도 사람이 검증하지 않으면 오류가 그대로 결과물에 남는다.</div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const ActivitySlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
          <div style={{background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:20}}>
            <div style={{fontFamily:'HYCUGothicM',fontSize:11,color:'#0091B8',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600}}>활동 안내</div>
            <div style={{fontFamily:'HYCUGothicM',fontSize:22,color:'#0E1116',marginTop:6,fontWeight:600}}>업무 하나를 AI 협업으로 재설계</div>
            <div style={{fontFamily:'HYCUGothicL',fontSize:16,color:'#3F4753',marginTop:10,lineHeight:1.6}}>
              본인의 실제 업무 하나를 골라 <strong style={{color:'#0091B8'}}>목표·맥락·자료·제약·형식</strong>을 갖춘 프롬프트로 작성합니다.
              AI가 만든 결과를 어떻게 검증할지도 함께 정합니다.
            </div>
          </div>
          <div style={{background:'#F5F7FA',borderRadius:12,padding:20}}>
            <div style={{fontFamily:'HYCUGothicM',fontSize:11,color:'#5A6473',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600}}>진행 정보</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
              <div><div style={{fontSize:11,color:'#7A8390'}}>소요 시간</div><div style={{fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',marginTop:2,fontWeight:600}}>7분</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>단계</div><div style={{fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',marginTop:2,fontWeight:600}}>5단계</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>도구</div><div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0E1116',marginTop:2,fontWeight:500}}>AI 튜터 실습 모듈</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>산출물</div><div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0E1116',marginTop:2,fontWeight:500}}>프롬프트 1개 + 검증 계획</div></div>
            </div>
          </div>
        </div>
        {/* Stimulus row */}
        <div style={{background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:'24px 20px'}}>
          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            {['목표', '맥락', '자료', '제약', '형식'].map((c,i) => {
              const isMatch = i === 4;
              return (
                <div key={i} style={{width:110,height:74,borderRadius:12,background:isMatch?'rgba(0,181,226,0.12)':'#F5F7FA',border:isMatch?'2px solid #00B5E2':'1px solid #E9ECF0',display:'grid',placeItems:'center',fontFamily:'HYCUGothicM',fontSize:16,color:isMatch?'#0091B8':'#1E2530'}}>
                  {c}
                </div>
              );
            })}
          </div>
          <div style={{textAlign:'center',marginTop:16,fontFamily:'HYCUGothicL',fontSize:14,color:'#5A6473'}}>
            다섯 요소를 순서대로 채워 <strong style={{color:'#0091B8',fontFamily:'HYCUGothicM'}}>하나의 완성된 프롬프트</strong>로 만듭니다
          </div>
        </div>
        <div className="check-card" style={{marginTop:14}}>
          <div className="head">✓ 활동 후 토론 질문</div>
          <div className="body">AI가 내놓은 결과 중 어느 부분을 그대로 쓸 수 있고, 어느 부분은 반드시 사람이 다시 확인해야 하나요?</div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const QuizSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        <div style={{background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:'22px 24px'}}>
          <div style={{fontFamily:'HYCUGothicM',fontSize:11,color:'#0091B8',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600}}>문항 1 · 다지선다</div>
          <div style={{fontFamily:'HYCUGothicM',fontSize:22,color:'#0E1116',marginTop:8,fontWeight:600,lineHeight:1.4}}>
            업무용 AI 챗봇에 입력해도 비교적 안전한 것은?
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:18}}>
            {[
              { l: 'A', t: '고객의 실명·연락처가 포함된 상담 기록' },
              { l: 'B', t: '사내 미공개 재무 수치' },
              { l: 'C', t: '개인정보를 가린(익명화한) 업무 요약문', correct: true },
              { l: 'D', t: '회사 비밀번호·API 키' },
            ].map(c => (
              <div key={c.l} style={{display:'flex',gap:12,alignItems:'center',padding:'12px 14px',border:`1.5px solid ${c.correct?'#00B5E2':'#E9ECF0'}`,borderRadius:8,background:c.correct?'rgba(0,181,226,0.04)':'white'}}>
                <div style={{width:26,height:26,borderRadius:'50%',border:`1.5px solid ${c.correct?'#00B5E2':'#D5DBE2'}`,display:'grid',placeItems:'center',fontFamily:'HYCUGothicM',fontSize:13,color:c.correct?'#0091B8':'#5A6473',background:c.correct?'rgba(0,181,226,0.1)':'white'}}>
                  {c.l}
                </div>
                <div style={{fontFamily:'HYCUGothicL',fontSize:15,color:'#1E2530'}}>{c.t}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div className="check-card">
            <div className="head">정답 풀이 (강의 중 가림)</div>
            <div className="body">실명·연락처·재무정보·비밀번호는 외부 AI 서버로 전송되는 순간 통제권을 잃습니다. 업무에 AI를 쓰려면 먼저 개인정보·기밀을 가리는 습관이 필요합니다.</div>
          </div>
          <div className="summary-card">
            <div className="head">학습 목표 연결</div>
            <div className="body">목표 ④ 개인정보와 저작권을 고려해 사람과 AI의 역할을 나눌 수 있다</div>
          </div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const PlaceholderSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880,height:540,background:'repeating-linear-gradient(135deg,#F5F7FA,#F5F7FA 12px,#FAFBFC 12px,#FAFBFC 24px)',borderRadius:12,display:'grid',placeItems:'center',border:'1px solid #E9ECF0'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'ui-monospace,monospace',fontSize:13,color:'#7A8390',letterSpacing:'0.08em'}}>SLIDE BODY · AI 생성 대기</div>
          <div style={{fontFamily:'HYCUGothicL',fontSize:15,color:'#5A6473',marginTop:6}}>본문 영역 1320 × 670 px · 콘텐츠 자동 채움</div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const SummarySlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title="이번 교시 핵심 정리" subtitle="구조화된 요청·근거 검증·사람의 책임" />
    <div className="body">
      <div style={{width:880}}>
        {[
          { n: '01', t: '구조화된 요청이 결과를 결정한다', d: '목표·맥락·자료·제약·형식 다섯 요소를 갖춘 프롬프트가 AI의 추측을 줄이고 원하는 결과에 가깝게 만든다.' },
          { n: '02', t: 'AI 결과는 근거로 검증한다', d: 'AI는 그럴듯하지만 틀린 답(환각)을 낼 수 있다. 출처·원문과 대조해 확인 가능한 주장만 신뢰한다.' },
          { n: '03', t: '최종 책임은 사람에게 있다', d: 'AI는 속도와 초안을 제공하지만, 사용·배포에 대한 판단과 책임은 항상 사람이 진다.' },
        ].map(s => (
          <div key={s.n} style={{display:'flex',gap:18,padding:'18px 20px',background:'white',border:'1px solid #E9ECF0',borderRadius:12,marginBottom:12}}>
            <div style={{fontFamily:'HYCUMyungJoB',fontSize:32,color:'#00B5E2',width:60,fontWeight:700}}>{s.n}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',fontWeight:600}}>{s.t}</div>
              <div style={{fontFamily:'HYCUGothicL',fontSize:15,color:'#3F4753',marginTop:4,lineHeight:1.55}}>{s.d}</div>
            </div>
          </div>
        ))}
        <div style={{background:'#F5F7FA',borderLeft:'4px solid #00B5E2',borderRadius:8,padding:'18px 22px',marginTop:8}}>
          <div style={{fontFamily:'HYCUMyungJoL',fontSize:20,lineHeight:1.5,color:'#0E1116',letterSpacing:'-0.005em'}}>
            "다음 교시에는 오늘 배운 프롬프트 설계를 바탕으로, 여러 단계를 스스로 수행하는 AI 에이전트를 살펴봅니다."
          </div>
          <div style={{fontFamily:'HYCUGothicL',fontSize:13,color:'#5A6473',marginTop:8}}>— 다음 교시 예고: Ch.06 ▸ AI 에이전트와 자동화</div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const RoadmapSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        <div style={{display:'flex',alignItems:'stretch',gap:0,marginBottom:28}}>
          {[
            { n: 1, ph: 'A', name: '도입·진단', t: '5분', desc: '학습 전 진단 질문' },
            { n: 2, ph: 'D', name: '학습 목표', t: '3분', desc: '4개 목표 + 키워드' },
            { n: 3, ph: 'Dv', name: '개념 전개', t: '32분', desc: '생성형 AI 원리 → 프롬프트 설계 → 검증' },
            { n: 4, ph: 'I', name: '활동·실습', t: '8분', desc: 'AI 협업 프롬프트 실습' },
            { n: 5, ph: 'E', name: '평가·정리', t: '2분', desc: '형성평가 3문항' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div style={{flex:1,background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:'18px 14px',textAlign:'center',position:'relative'}}>
                <div style={{width:40,height:40,borderRadius:'50%',border:'2px solid #00B5E2',background:'white',color:'#0091B8',fontFamily:'HYCUGothicM',fontSize:16,display:'grid',placeItems:'center',margin:'0 auto 10px',fontWeight:600}}>{s.n}</div>
                <div style={{fontFamily:'HYCUGothicM',fontSize:11,color:'#0091B8',letterSpacing:'0.08em',fontWeight:600}}>{s.ph}</div>
                <div style={{fontFamily:'HYCUGothicM',fontSize:15,color:'#0E1116',marginTop:4,fontWeight:600}}>{s.name}</div>
                <div style={{fontFamily:'HYCUGothicL',fontSize:12,color:'#7A8390',marginTop:2}}>{s.t}</div>
                <div style={{fontFamily:'HYCUGothicL',fontSize:11.5,color:'#5A6473',marginTop:8,lineHeight:1.45}}>{s.desc}</div>
              </div>
              {i < arr.length-1 && (
                <div style={{display:'grid',placeItems:'center',padding:'0 4px',color:'#A6ADB6'}}>›</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div className="summary-card">
            <div className="head">학습 흐름 원칙</div>
            <div className="body">개념(이론) → 활동(체험) → 평가(메타인지)의 3단계 순환을 통해 깊은 학습을 유도합니다. 각 단계는 ADDIE 모형의 한 페이즈에 매핑됩니다.</div>
          </div>
          <div className="check-card">
            <div className="head">✓ 학습 목표 다시보기</div>
            <div className="body">목표 ①·② 는 개념 전개에서, ③ 은 활동에서, ④ 는 평가에서 달성됩니다.</div>
          </div>
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

const AnalysisSlide = ({ slide, deck, instructorLive }) => (
  <>
    <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
    <SlideTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="body">
      <div style={{width:880}}>
        <div style={{background:'#F5F7FA',borderLeft:'4px solid #00B5E2',borderRadius:8,padding:'28px 32px',marginBottom:18}}>
          <div style={{fontFamily:'HYCUMyungJoL',fontSize:30,lineHeight:1.45,color:'#0E1116',letterSpacing:'-0.01em'}}>
            "AI에게 시키기 전에, 나는 이 일을 왜·어떻게 맡기려는가?"
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[
            { q: '이 업무를 AI에게 맡겨도 되는가?', a: '정형성·창의성·위험도로 판단' },
            { q: 'AI가 만든 결과를 믿을 수 있는가?', a: '근거·출처 대조 검증 필요' },
            { q: '다르게 물으면 다른 답이 나오는가?', a: '프롬프트 구조에 따라 결과가 달라짐' },
            { q: '어디까지 사람이 확인해야 하는가?', a: '최종 판단과 책임은 항상 사람의 몫' },
          ].map((p, i) => (
            <div key={i} style={{background:'white',border:'1px solid #E9ECF0',borderRadius:10,padding:'14px 18px'}}>
              <div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0E1116',fontWeight:600}}>{p.q}</div>
              <div style={{fontFamily:'HYCUGothicL',fontSize:13,color:'#5A6473',marginTop:4}}>{p.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <InstructorZone live={instructorLive} />
    <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
  </>
);

// === Content-driven layouts — placeholder 슬라이드 전량을 실제 콘텐츠로 렌더 ===
// 각 슬라이드는 포맷(불릿·표·차트·순서도·도식·칸반·퀴즈 등)별 레이아웃으로 그려진다.
// 편집 레이어 규약: 블록 = .ct-item, 편집 가능 텍스트 = .ct-text

const CT = {
  gm: 'HYCUGothicM', gl: 'HYCUGothicL', ink: '#0E1116', mut: '#5A6473',
  cyan: '#00B5E2', deep: '#0091B8', line: '#E9ECF0',
};

const SLIDE_BODIES = {
  9:  { kind: 'bullets', items: [
        '요청은 구체적으로 — "잘 써줘"보다 "무엇을 위해 어떤 형식으로"',
        '필요한 맥락(배경·독자·상황)을 함께 제공한다',
        '지켜야 할 제약(분량·톤·금지사항)을 미리 명시한다',
        '한 번에 완성하려 하지 말고 결과를 보며 반복 개선한다',
      ], note: '좋은 프롬프트 네 가지 원칙' },
  10: { kind: 'table', head: ['업무 특성', 'AI 활용 정도', '이유'], rows: [
        ['정형적 반복 업무', '높음 — 대부분 위임', '규칙이 명확해 결과 검증이 쉽다'],
        ['창의적 기획 업무', '중간 — 초안 생성 보조', '방향 설정은 사람, 확장은 AI'],
        ['고위험 판단 업무', '낮음 — 참고 자료 수준', '오류 시 파급력이 커 사람 판단 필수'],
      ], note: '정형성·창의성·위험도로 활용 범위를 정한다' },
  11: { kind: 'kanban', cols: [
        { t: 'AI에게 맡기기', c: '#0091B8', cards: ['반복 초안 작성', '자료 요약', '형식 변환'] },
        { t: '함께 하기', c: '#6A4FB7', cards: ['아이디어 확장', '초안 다듬기', '대안 비교'] },
        { t: '사람이 유지', c: '#2FA76A', cards: ['최종 판단', '책임 있는 결정', '민감정보 처리'] },
      ], note: '속도보다 검토 가능성과 책임 소재를 먼저 본다' },
  12: { kind: 'flow', steps: ['목표·맥락', '자료·제약', '생성 결과', '검증된 결과'], ops: ['+', '→', '→'],
        note: '입력이 명확할수록, 검증을 거칠수록 결과 품질이 올라간다' },
  13: { kind: 'chart', unit: '결과 품질', bars: [
        { label: '초안', v: 55, c: '#C9CFD7' },
        { label: '1차 피드백 후', v: 72, c: '#7DD3E8' },
        { label: '2차 피드백 후', v: 85, c: '#00B5E2' },
        { label: '3차 피드백 후', v: 90, c: '#0091B8' },
      ], note: '짧은 반복 루프 — 몇 차례 개선 후엔 상승폭이 줄어든다' },
  14: { kind: 'tree', root: 'AI 활용', mids: ['탐색', '생성', '자동화'], leaf: '단계마다 사람의 검토 지점을 둔다',
        note: '탐색(정보 수집) → 생성(초안 작성) → 자동화(반복 업무 연결)' },
  15: { kind: 'table', head: ['', 'AI의 강점', '사람의 강점'], rows: [
        ['속도', '즉시·대량 생성', '느리지만 신중'],
        ['일관성', '지치지 않고 반복', '맥락에 따라 유연'],
        ['판단', '패턴 기반 추정', '책임 있는 최종 결정'],
        ['한계', '근거 없이도 그럴듯하게 답함', '모르면 모른다고 말할 수 있음'],
      ], note: '반복과 초안은 AI, 판단과 책임은 사람' },
  17: { kind: 'pairs', pairs: [
        ['보고서 써줘','3분기 매출보고서 초안, 표 포함 A4 2장'], ['정리해줘','회의록에서 결정사항만 불릿 5개로'], ['더 좋게','더 간결하게, 전문용어 줄여서'], ['빨리 해줘','핵심만 3줄로 먼저'], ['알아서 해줘','참고자료 첨부, 톤은 격식체로'],
      ], note: '활동 — 모호한 요청을 목표·맥락·제약·형식으로 다시 쓴다' },
  18: { kind: 'kanban', cols: [
        { t: '입력 전', c: '#6A4FB7', cards: ['개인정보·기밀 가리기', '출처 필요 여부 확인'] },
        { t: '생성 중', c: '#0091B8', cards: ['근거 요청하기', '단계별로 확인하기'] },
        { t: '출력 후', c: '#2FA76A', cards: ['사실 대조 검증', '최종 책임자 확인'] },
      ], note: '토론 — AI 활용 위험을 단계별로 줄이는 방법' },
  20: { kind: 'quiz', q: '다음 중 좋은 프롬프트의 조건을 가장 잘 갖춘 것은?', opts: [
        '"이거 잘 써줘"',
        '"3분기 매출 데이터를 바탕으로, 경영진 대상 A4 1장 요약보고서를 격식체로 작성해줘"',
        '"보고서"',
        '"아무거나 만들어줘"',
      ], answer: 1, note: '형성평가 2 — 좋은 프롬프트의 조건' },
  21: { kind: 'quiz', q: 'AI가 그럴듯하지만 근거 없는 답(환각)을 냈을 때, 적절한 대응은? (복수 정답)', opts: [
        '출처를 요청해 원문과 대조한다',
        '결과를 그대로 사용한다',
        '다른 질문으로 다시 확인해본다',
        '더 확신에 찬 답이면 믿는다',
      ], answer: 0, answer2: 2, note: '형성평가 3 — 그럴듯한 오류를 발견했을 때의 대응' },
  23: { kind: 'table', head: ['오개념', '교정'], rows: [
        ['AI 답은 항상 정답이다', '학습 패턴 기반 추정 — 근거 검증 필요'],
        ['AI는 중립적이다', '학습 데이터의 편향을 그대로 반영할 수 있다'],
        ['AI에 맡기면 사람 책임이 없다', '결과 사용의 최종 책임은 사람에게 있다'],
      ], note: '오개념 점검' },
  24: { kind: 'cards', items: [
        { t: 'NIST AI RMF', d: 'AI 위험관리 프레임워크 — 실무 적용 참고' },
        { t: 'UNESCO 생성형 AI 교육 지침', d: '교육 현장 활용 원칙' },
        { t: 'AI 튜터 심화 세션', d: '"내 업무에 맞는 프롬프트 직접 설계해보기"' },
        { t: '사내 AI 활용 가이드', d: '조직 내 승인된 도구·데이터 범위 확인' },
      ], note: '심화 학습 안내' },
  25: { kind: 'refs', items: [
        'NIST (2023). AI Risk Management Framework (AI RMF 1.0).',
        'UNESCO (2023). Guidance for generative AI in education and research.',
        'OpenAI, Anthropic 등 (2024–2026). 모델 사용 정책 및 안전 가이드 문서.',
        '한국지능정보사회진흥원 (NIA). AI 윤리·활용 안내서.',
      ], note: 'References' },
  26: { kind: 'cards', items: [
        { t: '다음 교시 예고', d: 'AI 에이전트 — 여러 단계를 스스로 수행하는 AI' },
        { t: '연결 고리', d: '오늘 배운 프롬프트 설계가 에이전트 지시의 기초가 된다' },
        { t: '예습 질문', d: '"한 번의 요청으로 여러 단계를 처리하게 하려면?"' },
      ], note: '다음 교시 예고' },
  27: { kind: 'checklist', items: [
        '실습에서 작성한 프롬프트 1개 정리',
        '설계 근거(목표·맥락·자료·제약·형식) 1쪽 작성',
        'LMS 과제함 제출 — 1주 이내',
        '평가 기준: 다섯 요소 포함 여부 · 검증 계획 유무',
      ], note: '과제 안내' },
  28: { kind: 'center', big: '수고하셨습니다', small: '질문은 LMS Q&A 또는 AI 튜터로 — 다음 교시엔 AI 에이전트를 다룹니다' },
};

const CtNote = ({ text }) => text ? (
  <div className="ct-text" style={{position:'absolute',left:0,bottom:0,fontFamily:CT.gl,fontSize:17,color:CT.mut}}>
    <span style={{color:CT.deep,fontFamily:CT.gm}}>※ </span>{text}
  </div>
) : null;

const CtBullets = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:10}}>
    {b.items.map((t,i) => (
      <div key={i} className="ct-item" style={{display:'flex',gap:20,alignItems:'flex-start',marginBottom:34}}>
        <div style={{width:34,height:34,borderRadius:8,background:'rgba(0,181,226,0.10)',color:CT.deep,display:'grid',placeItems:'center',fontFamily:CT.gm,fontSize:16,fontWeight:700,flexShrink:0}}>{i+1}</div>
        <div className="ct-text" style={{fontFamily:CT.gl,fontSize:26,color:CT.ink,lineHeight:1.5,paddingTop:2}}>{t}</div>
      </div>
    ))}
    <CtNote text={b.note} />
  </div>
);

const CtCards = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:10}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
      {b.items.map((c,i) => (
        <div key={i} className="ct-item" style={{background:'white',border:`1px solid ${CT.line}`,borderLeft:`5px solid ${CT.cyan}`,borderRadius:12,padding:'26px 30px'}}>
          <div className="ct-text" style={{fontFamily:CT.gm,fontSize:23,color:CT.ink,fontWeight:600}}>{c.t}</div>
          <div className="ct-text" style={{fontFamily:CT.gl,fontSize:19,color:CT.mut,marginTop:8,lineHeight:1.5}}>{c.d}</div>
        </div>
      ))}
    </div>
    <CtNote text={b.note} />
  </div>
);

const CtChecklist = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:10}}>
    {b.items.map((t,i) => (
      <div key={i} className="ct-item" style={{display:'flex',gap:18,alignItems:'center',background:'white',border:`1px solid ${CT.line}`,borderRadius:12,padding:'20px 26px',marginBottom:16}}>
        <div style={{width:30,height:30,borderRadius:8,border:`2px solid ${CT.cyan}`,color:CT.cyan,display:'grid',placeItems:'center',fontFamily:CT.gm,fontSize:16,flexShrink:0}}>✓</div>
        <div className="ct-text" style={{fontFamily:CT.gl,fontSize:23,color:CT.ink}}>{t}</div>
      </div>
    ))}
    <CtNote text={b.note} />
  </div>
);

const CtTable = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:6}}>
    <table style={{width:'100%',borderCollapse:'collapse',background:'white',borderRadius:12,overflow:'hidden'}}>
      <thead><tr>
        {b.head.map((h,i) => (
          <th key={i} className="ct-text" style={{fontFamily:CT.gm,fontSize:20,color:'white',background:CT.deep,padding:'16px 22px',textAlign:'left',fontWeight:600}}>{h}</th>
        ))}
      </tr></thead>
      <tbody>
        {b.rows.map((r,i) => (
          <tr key={i} style={{background: i%2 ? '#F7FAFC' : 'white'}}>
            {r.map((c,j) => (
              <td key={j} className="ct-text" style={{fontFamily: j===0 ? CT.gm : CT.gl,fontSize:20,color: j===0 ? CT.ink : '#3F4753',padding:'16px 22px',borderTop:`1px solid ${CT.line}`,fontWeight: j===0?600:400}}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <CtNote text={b.note} />
  </div>
);

const CtKanban = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:6}}>
    <div style={{display:'grid',gridTemplateColumns:`repeat(${b.cols.length},1fr)`,gap:20}}>
      {b.cols.map((col,i) => (
        <div key={i} className="ct-item" style={{background:'#F7FAFC',border:`1px solid ${CT.line}`,borderTop:`4px solid ${col.c}`,borderRadius:12,padding:'18px 16px',minHeight:420}}>
          <div className="ct-text" style={{fontFamily:CT.gm,fontSize:21,color:col.c,fontWeight:700,marginBottom:14}}>{col.t}</div>
          {col.cards.map((c,j) => (
            <div key={j} style={{background:'white',border:`1px solid ${CT.line}`,borderRadius:9,padding:'14px 16px',marginBottom:10,boxShadow:'0 1px 2px rgba(14,17,22,0.04)'}}>
              <span className="ct-text" style={{fontFamily:CT.gl,fontSize:19,color:CT.ink}}>{c}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
    <CtNote text={b.note} />
  </div>
);

const CtChart = ({ b }) => {
  const max = Math.max(...b.bars.map(x => x.v));
  return (
    <div style={{position:'relative',width:1240,height:600,paddingTop:16}}>
      {b.bars.map((bar,i) => (
        <div key={i} className="ct-item" style={{display:'flex',alignItems:'center',gap:20,marginBottom:26}}>
          <div className="ct-text" style={{width:280,fontFamily:CT.gm,fontSize:20,color:CT.ink,textAlign:'right',flexShrink:0}}>{bar.label}</div>
          <div style={{flex:1,height:40,background:'#F1F4F7',borderRadius:8,overflow:'hidden'}}>
            <div style={{width:(bar.v/max*100)+'%',height:'100%',background:bar.c,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:14}}>
              <span style={{fontFamily:CT.gm,fontSize:16,color:'white',fontWeight:700}}>{bar.v}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="ct-text" style={{fontFamily:CT.gl,fontSize:15,color:CT.mut,marginTop:-6}}>단위: {b.unit} (예시 수치)</div>
      <CtNote text={b.note} />
    </div>
  );
};

const CtFlow = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600}}>
    <div style={{display:'flex',alignItems:'center',gap:14,marginTop:150,justifyContent:'center'}}>
      {b.steps.map((s,i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{fontFamily:CT.gm,fontSize:34,color:CT.deep,flexShrink:0}}>{b.ops[i-1]}</div>}
          <div className="ct-item" style={{background: i===0 ? CT.deep : 'white',border:`2px solid ${i===0 ? CT.deep : CT.line}`,borderRadius:14,padding:'30px 34px',textAlign:'center'}}>
            <span className="ct-text" style={{fontFamily:CT.gm,fontSize:25,color: i===0 ? 'white' : CT.ink,fontWeight:600}}>{s}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
    <CtNote text={b.note} />
  </div>
);

const CtPairs = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:12}}>
    {b.pairs.map(([l,r],i) => (
      <div key={i} className="ct-item" style={{display:'flex',alignItems:'center',gap:26,marginBottom:30}}>
        <div className="ct-text" style={{width:230,fontFamily:CT.gm,fontSize:22,color:CT.ink,textAlign:'right'}}>{l}</div>
        <div style={{flex:1,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 8px',borderBottom:`1px solid ${CT.line}`,height:40}}>
          {[0,1,2,3,4,5,6].map(d => (
            <span key={d} style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${d===2+i%3 ? CT.deep : '#C9CFD7'}`,background: d===2+i%3 ? CT.cyan : 'white'}}></span>
          ))}
        </div>
        <div className="ct-text" style={{width:230,fontFamily:CT.gm,fontSize:22,color:CT.ink}}>{r}</div>
      </div>
    ))}
    <CtNote text={b.note} />
  </div>
);

const CtTree = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,textAlign:'center'}}>
    <div className="ct-item" style={{display:'inline-block',background:CT.deep,color:'white',borderRadius:12,padding:'22px 44px',marginTop:26}}>
      <span className="ct-text" style={{fontFamily:CT.gm,fontSize:26,fontWeight:700}}>{b.root}</span>
    </div>
    <div style={{width:2,height:34,background:'#C9CFD7',margin:'0 auto'}}></div>
    <div style={{display:'flex',justifyContent:'center',gap:26}}>
      {b.mids.map((m,i) => (
        <div key={i} className="ct-item" style={{background:'white',border:`2px solid ${CT.cyan}`,borderRadius:12,padding:'18px 30px'}}>
          <span className="ct-text" style={{fontFamily:CT.gm,fontSize:22,color:CT.ink}}>{m}</span>
        </div>
      ))}
    </div>
    <div style={{width:2,height:34,background:'#C9CFD7',margin:'0 auto'}}></div>
    <div className="ct-item" style={{display:'inline-block',background:'#F7FAFC',border:`1px dashed #C9CFD7`,borderRadius:12,padding:'16px 34px'}}>
      <span className="ct-text" style={{fontFamily:CT.gl,fontSize:20,color:CT.mut}}>{b.leaf}</span>
    </div>
    <CtNote text={b.note} />
  </div>
);

const CtQuiz = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:4}}>
    <div className="ct-item" style={{background:'white',border:`1px solid ${CT.line}`,borderLeft:`5px solid ${CT.cyan}`,borderRadius:12,padding:'24px 30px',marginBottom:22}}>
      <span className="ct-text" style={{fontFamily:CT.gm,fontSize:25,color:CT.ink,fontWeight:600}}>Q. {b.q}</span>
    </div>
    {b.opts.map((o,i) => {
      const on = i === b.answer || i === b.answer2;
      return (
        <div key={i} className="ct-item" style={{display:'flex',gap:16,alignItems:'center',background: on ? 'rgba(0,181,226,0.07)' : 'white',border:`1.5px solid ${on ? CT.cyan : CT.line}`,borderRadius:10,padding:'16px 22px',marginBottom:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',border:`2px solid ${on ? CT.deep : '#C9CFD7'}`,color: on ? 'white' : CT.mut,background: on ? CT.deep : 'white',display:'grid',placeItems:'center',fontFamily:CT.gm,fontSize:16,fontWeight:700,flexShrink:0}}>{String.fromCharCode(9312+i)}</div>
          <span className="ct-text" style={{fontFamily:CT.gl,fontSize:21,color:CT.ink}}>{o}</span>
        </div>
      );
    })}
    <CtNote text={b.note} />
  </div>
);

const CtRefs = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,paddingTop:14}}>
    {b.items.map((t,i) => (
      <div key={i} className="ct-item" style={{display:'flex',gap:18,alignItems:'flex-start',marginBottom:30,paddingBottom:24,borderBottom:`1px solid ${CT.line}`}}>
        <span style={{fontFamily:'ui-monospace,monospace',fontSize:17,color:CT.deep,flexShrink:0,paddingTop:3}}>[{i+1}]</span>
        <span className="ct-text" style={{fontFamily:CT.gl,fontSize:22,color:'#3F4753',lineHeight:1.6}}>{t}</span>
      </div>
    ))}
    <CtNote text={b.note} />
  </div>
);

const CtCenter = ({ b }) => (
  <div style={{position:'relative',width:1240,height:600,display:'grid',placeItems:'center'}}>
    <div style={{textAlign:'center'}}>
      <div className="ct-text" style={{fontFamily:'HYCUMyungJoB',fontSize:76,color:CT.ink,fontWeight:700,letterSpacing:'-0.02em'}}>{b.big}</div>
      <div style={{width:110,height:5,background:CT.cyan,margin:'34px auto'}}></div>
      <div className="ct-text" style={{fontFamily:CT.gl,fontSize:26,color:CT.mut}}>{b.small}</div>
    </div>
  </div>
);

const CT_KINDS = {
  bullets: CtBullets, cards: CtCards, checklist: CtChecklist, table: CtTable,
  kanban: CtKanban, chart: CtChart, flow: CtFlow, pairs: CtPairs, tree: CtTree,
  quiz: CtQuiz, refs: CtRefs, center: CtCenter,
};

const ContentSlide = ({ slide, deck, instructorLive }) => {
  const b = SLIDE_BODIES[slide.n];
  if (!b) return <PlaceholderSlide slide={slide} deck={deck} instructorLive={instructorLive} />;
  const Body = CT_KINDS[b.kind] || CtBullets;
  return (
    <>
      <SlideHeader chapter={deck.chapter} subchapter={deck.subchapter} phase={slide.phase} />
      <SlideTitle title={slide.title} subtitle={slide.subtitle} />
      <div className="body">
        <Body b={b} />
      </div>
      <InstructorZone live={instructorLive} />
      <SlideFooter subject={deck.subject} week={deck.week} n={slide.n} total={deck.totalSlides} />
    </>
  );
};

// Dispatcher
const HYCUSlide = ({ slide, deck, instructorLive = false }) => {
  const map = {
    cover: CoverSlide,
    objectives: ObjectivesSlide,
    analysis: AnalysisSlide,
    roadmap: RoadmapSlide,
    concept: slide.n === 6 ? ConceptDiagramSlide : (slide.n === 7 ? ModelDiagramSlide : ConceptSlide),
    comparison: ComparisonSlide,
    activity: ActivitySlide,
    quiz: QuizSlide,
    summary: SummarySlide,
    placeholder: ContentSlide,
  };
  const Comp = map[slide.type] || PlaceholderSlide;
  return (
    <div className="slide-canvas">
      <Comp slide={slide} deck={deck} instructorLive={instructorLive} />
    </div>
  );
};

// Scaled wrapper
const ScaledSlide = ({ slide, deck, instructorLive, scale = 0.5, frame = false }) => {
  const w = 1920 * scale;
  const h = 1080 * scale;
  const inner = <div style={{width:w,height:h,position:'relative',overflow:'hidden'}}><div style={{transform:`scale(${scale})`,transformOrigin:'top left',width:1920,height:1080}}><HYCUSlide slide={slide} deck={deck} instructorLive={instructorLive} /></div></div>;
  return frame ? <div className="canvas-stage" style={{width:w,height:h}}>{inner}</div> : inner;
};

window.HYCUSlide = HYCUSlide;
window.ScaledSlide = ScaledSlide;
