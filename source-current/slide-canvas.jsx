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
    { name: '명목 척도', desc: '범주를 구분 (성별·지역·브랜드)', icon: '#', en: 'Nominal' },
    { name: '서열 척도', desc: '순위만 의미 (선호 순위)', icon: '≤', en: 'Ordinal' },
    { name: '등간 척도', desc: '간격이 동일 (Likert 1~5점)', icon: '↔', en: 'Interval' },
    { name: '비율 척도', desc: '절대 영점 존재 (구매 금액)', icon: '◎', en: 'Ratio' },
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
            <div className="body">측정 수준은 위계적이며, 상위 수준일수록 더 많은 통계 분석이 가능하다. 분석 목적에 맞는 척도 선택이 데이터 품질의 출발점이다.</div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignContent:'center'}}>
            {['평균 계산', 't-검정', '상관분석', '회귀분석'].map(k => (
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
            Likert 척도 (5-point)
            <div style={{fontFamily:'HYCUGothicL',fontSize:12,fontWeight:400,marginTop:3,opacity:0.9}}>동의 정도 · 다항목 합산 · 신뢰도 강화</div>
          </div>
          {/* Lines */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
            <line x1="50%" y1="84" x2="18%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
            <line x1="50%" y1="84" x2="50%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
            <line x1="50%" y1="84" x2="82%" y2="200" stroke="#D5DBE2" strokeWidth="2"/>
          </svg>
          {/* Three subsystems */}
          {[
            { x: '4%', label: '의미차별 척도', en: 'Semantic Differential', desc: '양극 형용사 쌍' },
            { x: '36%', label: 'Stapel 척도', en: 'Stapel Scale', desc: '단극 10점 평가' },
            { x: '68%', label: 'Guttman 척도', en: 'Guttman Scale', desc: '누적 응답 구조' },
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
          <div style={{padding:'18px 20px',background:'rgba(0,181,226,0.12)',fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',fontWeight:600,borderLeft:'1px solid #E9ECF0'}}>신뢰도</div>
          <div style={{padding:'18px 20px',background:'rgba(0,181,226,0.12)',fontFamily:'HYCUGothicM',fontSize:18,color:'#0091B8',fontWeight:600,borderLeft:'1px solid #E9ECF0'}}>타당도</div>
          {[
            ['핵심 질문', '얼마나 일관되게 측정하는가', '얼마나 정확하게 측정하는가'],
            ['평가 대상', '측정의 안정성·재현성', '측정의 의미·진실성'],
            ['대표 지표', 'Cronbach α ≥ 0.7', '내용·기준·구성 타당도'],
            ['평가 방법', '재검사·반분·내적 일관성', '요인분석·MTMM'],
            ['관계', '타당도의 필요조건', '신뢰도가 높아도 미충족 가능'],
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
          <div className="body">신뢰도와 타당도는 별개의 개념이다. 신뢰도가 높아도 측정 대상이 잘못 정의되면 타당도가 낮을 수 있다. 신뢰도는 타당도의 필요조건이지만 충분조건은 아니다.</div>
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
            <div style={{fontFamily:'HYCUGothicM',fontSize:22,color:'#0E1116',marginTop:6,fontWeight:600}}>Likert 척도 설계 실습</div>
            <div style={{fontFamily:'HYCUGothicL',fontSize:16,color:'#3F4753',marginTop:10,lineHeight:1.6}}>
              브랜드 만족도를 측정하는 <strong style={{color:'#0091B8'}}>5개 문항</strong>을 작성합니다.
              동일 개념을 다양한 표현으로 측정해 신뢰도를 확보합니다.
            </div>
          </div>
          <div style={{background:'#F5F7FA',borderRadius:12,padding:20}}>
            <div style={{fontFamily:'HYCUGothicM',fontSize:11,color:'#5A6473',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600}}>진행 정보</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
              <div><div style={{fontSize:11,color:'#7A8390'}}>소요 시간</div><div style={{fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',marginTop:2,fontWeight:600}}>5분</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>난이도</div><div style={{fontFamily:'HYCUGothicM',fontSize:18,color:'#0E1116',marginTop:2,fontWeight:600}}>5-point</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>도구</div><div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0E1116',marginTop:2,fontWeight:500}}>LMS 활동 모듈</div></div>
              <div><div style={{fontSize:11,color:'#7A8390'}}>산출물</div><div style={{fontFamily:'HYCUGothicM',fontSize:14,color:'#0E1116',marginTop:2,fontWeight:500}}>문항 5개 + 척도</div></div>
            </div>
          </div>
        </div>
        {/* Stimulus row */}
        <div style={{background:'white',border:'1px solid #E9ECF0',borderRadius:12,padding:'24px 20px'}}>
          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            {['1','2','3','4','5'].map((c,i) => {
              const isMatch = c === '4';
              return (
                <div key={i} style={{width:74,height:74,borderRadius:12,background:isMatch?'rgba(0,181,226,0.12)':'#F5F7FA',border:isMatch?'2px solid #00B5E2':'1px solid #E9ECF0',display:'grid',placeItems:'center',fontFamily:'HYCUMyungJoB',fontSize:34,color:isMatch?'#0091B8':'#1E2530'}}>
                  {c}
                </div>
              );
            })}
          </div>
          <div style={{textAlign:'center',marginTop:16,fontFamily:'HYCUGothicL',fontSize:14,color:'#5A6473'}}>
            ← <strong>전혀 그렇지 않다</strong> · 보통이다 · <strong style={{color:'#0091B8',fontFamily:'HYCUGothicM'}}>매우 그렇다</strong> →
          </div>
        </div>
        <div className="check-card" style={{marginTop:14}}>
          <div className="head">✓ 활동 후 토론 질문</div>
          <div className="body">「이 브랜드를 친구에게 추천하고 싶다」와 「이 브랜드는 좋은 브랜드이다」는 동일 개념을 측정하나요, 다른 개념인가요? Cronbach α는 어떻게 달라질까요?</div>
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
            응답자에게 음료 브랜드 5개의 선호 순위를 매기게 하여 1~5위로 응답을 받았다. 이 데이터의 측정 수준은?
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:18}}>
            {[
              { l: 'A', t: '명목 척도 (Nominal scale)' },
              { l: 'B', t: '서열 척도 (Ordinal scale)', correct: true },
              { l: 'C', t: '등간 척도 (Interval scale)' },
              { l: 'D', t: '비율 척도 (Ratio scale)' },
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
            <div className="body">순위는 대소 관계만 의미하며, 1위와 2위의 간격이 2위와 3위의 간격과 같다고 보장할 수 없습니다. 평균 계산이 부적절한 이유입니다.</div>
          </div>
          <div className="summary-card">
            <div className="head">학습 목표 연결</div>
            <div className="body">목표 ① 측정 수준 4가지를 구분 — 서열 척도의 사례 식별 능력</div>
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
    <SlideTitle title="이번 교시 핵심 정리" subtitle="기억해야 할 3가지" />
    <div className="body">
      <div style={{width:880}}>
        {[
          { n: '01', t: '측정 수준이 분석 방법을 결정한다', d: '명목·서열·등간·비율의 4가지 수준은 위계적이며, 상위 수준일수록 평균·분산 등 더 풍부한 통계 분석이 가능하다.' },
          { n: '02', t: '신뢰도와 타당도는 별개의 개념이다', d: '신뢰도는 측정의 일관성, 타당도는 측정의 진실성. 신뢰도는 타당도의 필요조건이지만 충분조건은 아니다.' },
          { n: '03', t: 'Likert 척도는 다항목 합산이 핵심이다', d: '단일 문항보다 여러 문항의 합산이 신뢰도를 높이며, Cronbach α ≥ 0.7을 기준으로 척도의 내적 일관성을 평가한다.' },
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
            "다음 교시에는 이 측정 도구로 수집한 자료를 어떻게 설문지로 설계하는지를 살펴봅니다."
          </div>
          <div style={{fontFamily:'HYCUGothicL',fontSize:13,color:'#5A6473',marginTop:8}}>— 다음 교시 예고: 06교시 ▸ 설문지 설계와 질문 구성</div>
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
            { n: 3, ph: 'Dv', name: '개념 전개', t: '32분', desc: '측정 수준 → 척도 설계 → 신뢰도' },
            { n: 4, ph: 'I', name: '활동·실습', t: '8분', desc: 'Likert 설계 실습' },
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
            "시장을 제대로 이해하려면, 무엇을 어떻게 측정해야 할까?"
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[
            { q: '브랜드 선호도를 어떻게 숫자로 표현할까?', a: 'Likert 척도 같은 등간 측정' },
            { q: '설문 결과를 믿을 수 있을까?', a: '신뢰도 · 타당도 검증 필요' },
            { q: '다른 표현으로 물으면 다른 결과가 나올까?', a: '표현 타당도 · 재구성 검증' },
            { q: '몇 개의 문항으로 측정해야 할까?', a: '다항목 설계 · Cronbach α ≥ 0.7' },
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
        '진술문은 한 문장에 하나의 태도만 담는다 — 이중 질문 금지',
        '긍정·부정 문항을 섞어 묵종 편향을 상쇄한다',
        '5점 vs 7점: 응답자 변별력과 분석 목적으로 결정',
        '역채점 문항은 합산 전 반드시 재코딩',
      ], note: 'Likert 문항 작성 4원칙' },
  10: { kind: 'pairs', pairs: [
        ['저렴한','비싼'], ['신뢰가는','의심스러운'], ['세련된','촌스러운'], ['친근한','거리감 있는'], ['혁신적인','보수적인'],
      ], note: '양극 형용사 7점 배치 — 브랜드 이미지 프로파일' },
  11: { kind: 'chart', unit: 'Cronbach α', bars: [
        { label: '0.9 이상 · 우수', v: 95, c: '#0091B8' },
        { label: '0.8 이상 · 양호', v: 85, c: '#00B5E2' },
        { label: '0.7 이상 · 수용 가능', v: 72, c: '#7DD3E8' },
        { label: '0.6 미만 · 재검토', v: 55, c: '#C9CFD7' },
      ], note: 'α는 단일차원성을 보장하지 않는다 — 요인분석 병행' },
  12: { kind: 'flow', steps: ['관측값', '진점수', '체계적 오차', '무작위 오차'], ops: ['=', '+', '+'],
        note: '체계적 오차 → 타당도 훼손 · 무작위 오차 → 신뢰도 훼손' },
  13: { kind: 'chart', unit: '신뢰도', bars: [
        { label: '2문항', v: 55, c: '#C9CFD7' },
        { label: '4문항', v: 72, c: '#7DD3E8' },
        { label: '6문항', v: 82, c: '#00B5E2' },
        { label: '8문항', v: 86, c: '#0091B8' },
        { label: '10문항', v: 88, c: '#0091B8' },
      ], note: 'Spearman-Brown — 6~8문항 이후 상승 둔화, 응답 부담과 트레이드오프' },
  14: { kind: 'tree', root: '고객 만족 (구성개념)', mids: ['제품 만족', '서비스 만족', '가격 만족'], leaf: '차원별 2~3문항 → 합산 척도',
        note: '기존 검증 척도(published scale) 재사용 우선' },
  15: { kind: 'table', head: ['', 'NPS 단일 문항', '다항목 만족도'], rows: [
        ['용도', '간편 추적 · 벤치마크', '진단 · 원인 분석'],
        ['예측 타당도', '보통', '높음 (메타분석 우위)'],
        ['응답 부담', '매우 낮음', '중간'],
        ['개선 인사이트', '제한적', '차원별 도출 가능'],
      ], note: '조사 목적(추적 vs 진단)에 따라 척도를 선택한다' },
  17: { kind: 'table', head: ['#', '긍정 극', '부정 극', '검증 포인트'], rows: [
        ['1', '전통 있는', '역사가 짧은', '진짜 반대 개념인가'],
        ['2', '실용적인', '이론적인', '한쪽으로 유도되지 않는가'],
        ['3', '개방적인', '폐쇄적인', '중복 쌍은 없는가'],
        ['4', '따뜻한', '차가운', '측정 목적과 맞는가'],
      ], note: '활동 — 우리 학교 브랜드 이미지 형용사 쌍 도출' },
  18: { kind: 'kanban', cols: [
        { t: '원인', c: '#6A4FB7', cards: ['판단 회피 심리', '문항 피로', '사회적 바람직성'] },
        { t: '설계로 줄이기', c: '#0091B8', cards: ['짝수 척도 검토', '문항 수 절감', '역문항 배치'] },
        { t: '분석으로 보정', c: '#2FA76A', cards: ['응답 패턴 필터링', '표준화 점수 사용'] },
      ], note: '토론 — 중심화 경향·묵종 응답' },
  20: { kind: 'quiz', q: '다음 중 의미차별 척도에 해당하는 문항은?', opts: [
        '이 브랜드에 만족한다 — 매우 동의 ~ 매우 비동의',
        '이 브랜드는… 저렴한 ①②③④⑤⑥⑦ 비싼',
        '이 브랜드를 추천할 의향은 0~10점 중?',
        '가장 선호하는 브랜드 순위를 매기시오',
      ], answer: 1, note: '형성평가 2 — 척도 유형의 구분' },
  21: { kind: 'quiz', q: 'α=0.62인 6문항 척도, 적절한 개선 조치는? (복수 정답)', opts: [
        '같은 개념의 문항을 추가한다',
        'item-if-deleted로 불량 문항을 제거한다',
        '표본 수를 늘린다',
        '그대로 사용한다',
      ], answer: 0, answer2: 1, note: '형성평가 3 — Cronbach α 시나리오' },
  23: { kind: 'table', head: ['오개념', '교정'], rows: [
        ['신뢰도가 높으면 타당한 측정이다', '일관되게 틀릴 수 있다 — 별개 개념'],
        ['α는 높을수록 좋다', '0.95 이상은 문항 중복 신호'],
        ['문항이 많을수록 좋은 척도다', '응답 부담 → 무성의 응답 증가'],
      ], note: '오개념 점검' },
  24: { kind: 'cards', items: [
        { t: 'Churchill (1979)', d: '척도 개발 패러다임 — 고전 논문' },
        { t: 'DeVellis, Scale Development 4판', d: '실무 장(章) 중심 추천' },
        { t: 'K-MOOC 심리측정론', d: '5·6강 연계 시청' },
        { t: 'AI 튜터 심화 세션', d: '"Cronbach α 직접 계산해보기"' },
      ], note: '심화 학습 안내' },
  25: { kind: 'refs', items: [
        'Likert, R. (1932). A technique for the measurement of attitudes. Archives of Psychology.',
        'Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. Psychometrika.',
        'Malhotra, N. K. (2020). Marketing Research: An Applied Orientation (7th ed.), Ch.9.',
        'Churchill, G. A. (1979). A paradigm for developing better measures. JMR.',
      ], note: 'References' },
  26: { kind: 'cards', items: [
        { t: '06교시 예고', d: '설문 문항 작성의 원칙' },
        { t: '연결 고리', d: '오늘의 척도 유형이 문항 작성 규칙을 결정한다' },
        { t: '예습 질문', d: '"만족하십니까?"는 왜 나쁜 문항인가' },
      ], note: '다음 교시 예고' },
  27: { kind: 'checklist', items: [
        '실습에서 작성한 Likert 문항 3개 정리',
        '문항별 설계 근거 1쪽 작성',
        'LMS 과제함 제출 — 1주 이내',
        '평가 기준: 이중 질문 · 편향 통제 · 척도 수준 적합성',
      ], note: '과제 안내' },
  28: { kind: 'center', big: '수고하셨습니다', small: '질문은 LMS Q&A 또는 AI 튜터로 — 다음 교시에 만나요' },
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
