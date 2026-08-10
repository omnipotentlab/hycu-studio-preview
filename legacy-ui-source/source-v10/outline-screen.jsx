// ----- Outline — 렌더 전 중간 산출물. 마크다운 문서 느낌의 실시간 생성·편집 화면 -----
// 진입 즉시 슬라이드 구성이 스트리밍 생성되고, 제목·세부 텍스트를 인라인 편집한다.
// 각 슬라이드는 콘텐츠에 적합한 표현 포맷(표·순서도·차트 등)을 기본 채택하며
// 사용자가 셀렉터로 언제든 변경·제거할 수 있다.

const OUTLINE_PHASE_META = {
  'A':  { c: '#0091B8', ko: '분석' },
  'D':  { c: '#00B5E2', ko: '설계' },
  'Dv': { c: '#22A06B', ko: '개발' },
  'I':  { c: '#E58E40', ko: '실행' },
  'E':  { c: '#E5484D', ko: '평가' },
  '—':  { c: '#A6ADB6', ko: '표지' },
};

const OUTLINE_FORMATS = ['텍스트', '표', '칸반보드', '다이어그램', '순서도', '도식', '차트', '퀴즈 카드', '이미지', '없음'];

// 가상 생성 콘텐츠 — 슬라이드별 세부 불릿 + 기본 채택 포맷(콘텐츠 적합 기준)
const OUTLINE_CONTENT = {
  1:  { format: '텍스트', why: '표지 — 시각 요소 불필요', bullets: ['과목: 시장조사론 (CMK010) · 5주차 02교시', '발표자: 김현경 교수 · 한양사이버대학교 경영학부', '학습 시간 50분 · 슬라이드 28매'] },
  2:  { format: '퀴즈 카드', why: '사전 진단 문항 제시', bullets: ['진단 4문항: 설문 응답 경험 · 점수화 방식 · "5점 만점"의 의미 · 일관성 개념', '정답 공개 없이 응답 분포만 확인 — 수업 후 재응답과 비교', '소요 3분 · 익명 응답'] },
  3:  { format: '텍스트', why: '목표 목록 — 텍스트가 가장 명확', bullets: ['측정 수준(명목·서열·등간·비율) 4가지를 구분하여 설명할 수 있다', 'Likert 척도와 의미차별 척도의 설계 원리를 도식화할 수 있다', 'Cronbach α 계수로 내적 일관성 신뢰도를 평가할 수 있다', '시장조사 설문에 신뢰도·타당도 개념을 적용할 수 있다'] },
  4:  { format: '순서도', why: '시간 흐름의 단계 표현', bullets: ['도입(5분) 진단·목표 → 개념(20분) 측정 수준·척도 유형', '심화(15분) 신뢰도·타당도·Cronbach α → 정리(10분) 활동·형성평가', '각 단계 종료 시 체크포인트 질문 1개'] },
  5:  { format: '도식', why: '추상 개념→수치 변환 구조', bullets: ['척도 = 추상적 구성개념(태도·만족)을 숫자로 변환하는 규칙 체계', '개념 정의 → 조작적 정의 → 측정 문항 → 수치의 4단 변환 구조', '예: "브랜드 선호"라는 개념이 5점 점수가 되기까지'] },
  6:  { format: '표', why: '4개 유형의 속성 비교', bullets: ['명목: 분류만 가능 (성별·지역) — 최빈값', '서열: 순위 비교 (선호 순위) — 중앙값', '등간: 간격 동일, 절대영점 없음 (온도·Likert 합산) — 평균', '비율: 절대영점 존재 (매출·연령) — 모든 연산', '유형별 허용 통계량을 열로 대비'] },
  7:  { format: '다이어그램', why: '다항목 합산 구조 시각화', bullets: ['Likert(1932): 진술문에 대한 동의 정도를 5점으로 응답', '문항 여러 개의 점수를 합산해 하나의 태도 점수 산출', '전제: 각 문항이 같은 구성개념을 측정한다 (→ 신뢰도 검증 필요)'] },
  8:  { format: '표', why: '두 개념의 축별 대비', bullets: ['신뢰도 = 반복 측정의 일관성 (같은 자로 여러 번 재기)', '타당도 = 측정 대상의 정확성 (맞는 자로 재기)', '신뢰도 높음 ≠ 타당도 보장 — 4분면 사례로 대비', '조사 실무: 신뢰도는 통계로, 타당도는 설계로 확보'] },
  9:  { format: '텍스트', why: '작성 원칙 목록', bullets: ['진술문은 한 문장에 하나의 태도만 담는다 (이중 질문 금지)', '긍정·부정 문항을 섞어 묵종 편향을 상쇄', '5점/7점 선택 기준: 응답자 변별력과 분석 목적', '역채점 문항은 합산 전 반드시 재코딩'] },
  10: { format: '도식', why: '양극단 배치 구조', bullets: ['양극 형용사 쌍 (저렴한—비싼 · 신뢰가는—의심스러운) 7점 배치', '브랜드 이미지 프로파일을 선으로 연결해 시각화', 'Likert와의 차이: 진술 동의가 아니라 이미지 위치 선택'] },
  11: { format: '차트', why: '기준값 구간 시각화', bullets: ['Cronbach α = 항목 간 상관과 항목 수의 함수', '해석 기준: 0.9↑ 우수 · 0.8↑ 양호 · 0.7↑ 수용 · 0.6↓ 재검토', 'α는 단일차원성을 보장하지 않는다 — 요인분석 병행', '항목 제거 시 α 변화(item-if-deleted)로 불량 문항 탐지'] },
  12: { format: '도식', why: '오차 분해 구조', bullets: ['관측값 = 진점수 + 체계적 오차 + 무작위 오차', '체계적 오차 → 타당도 훼손 (편향된 문항·유도 질문)', '무작위 오차 → 신뢰도 훼손 (피로·상황 요인)', '오차원별 통제 전략을 화살표로 연결'] },
  13: { format: '차트', why: '항목 수-신뢰도 곡선', bullets: ['Spearman-Brown: 항목 수를 늘리면 신뢰도가 상승', '단, 체감 구간 존재 — 항목 6~8개 이후 상승 둔화', '응답 부담과 신뢰도의 트레이드오프 곡선 제시'] },
  14: { format: '다이어그램', why: '전략 분기 구조', bullets: ['단일 문항의 한계: 오차 노출·개념 포괄 불가', '다항목 전략: 하위 차원별 2~3문항 → 합산 척도', '기존 검증 척도(published scale) 재사용 우선 원칙'] },
  15: { format: '차트', why: '메타분석 수치 비교', bullets: ['메타분석: 다항목 척도가 단일 문항 대비 예측 타당도 우위', '실무 의사결정: NPS 단일 문항 vs 만족도 다항목의 용도 구분', '조사 목적(추적 vs 진단)에 따른 척도 선택 가이드'] },
  16: { format: '텍스트', why: '실습 지시문', bullets: ['과제: "배달앱 만족도" 측정 5점 Likert 문항 3개 작성', '조건: 이중 질문 금지 · 부정 문항 1개 포함', '10분 작성 → 옆 학습자와 교환 검토 → 대표 사례 공유'] },
  17: { format: '표', why: '형용사 쌍 정리', bullets: ['과제: 우리 학교 브랜드 이미지 측정 형용사 쌍 5개 도출', '쌍 구성 검증: 진짜 반대 개념인가, 한쪽으로 유도되지 않는가', '도출 쌍을 표로 취합해 중복·편향 검토'] },
  18: { format: '칸반보드', why: '의견 그룹핑 토론', bullets: ['토론: 중심화 경향·묵종 응답은 왜 생기고 어떻게 줄이나', '보드 3열: 원인 / 설계로 줄이기 / 분석으로 보정하기', '의견 카드를 열별로 이동하며 정리'] },
  19: { format: '퀴즈 카드', why: '4지선다 형성평가', bullets: ['문항: 다음 변수(만족도 순위·매출액·지역·온도)의 측정 수준은?', '4지선다 + 즉시 정답 풀이', '오답 선택지별 왜 틀렸는지 해설'] },
  20: { format: '퀴즈 카드', why: '4지선다 형성평가', bullets: ['문항: 제시된 설문 문항이 Likert인지 의미차별인지 구분', '함정: 형용사 쌍이 있으나 동의 척도인 혼합 사례 포함'] },
  21: { format: '퀴즈 카드', why: '시나리오 분석 문항', bullets: ['시나리오: α=0.62인 6문항 척도, 어떻게 개선할까', '보기: 항목 추가 / 불량 문항 제거 / 표본 확대 / 그대로 사용', '정답 다중 — 판단 근거 서술 유도'] },
  22: { format: '텍스트', why: '핵심 요약', bullets: ['측정 수준 4유형이 허용 통계를 결정한다', '척도 설계(Likert·의미차별)는 편향 통제가 핵심이다', '신뢰도는 Cronbach α로 진단하되 타당도와 혼동하지 않는다'] },
  23: { format: '표', why: '오개념-교정 대비', bullets: ['오개념: "신뢰도가 높으면 타당한 측정이다" → 교정: 일관되게 틀릴 수 있다', '오개념: "α는 높을수록 좋다" → 교정: 0.95↑는 문항 중복 신호', '오개념 vs 교정을 2열 표로 대비'] },
  24: { format: '텍스트', why: '참고 자료 목록', bullets: ['Churchill(1979) 척도 개발 패러다임 논문', 'DeVellis, Scale Development 4판 — 실무 장 추천', 'K-MOOC 심리측정론 5·6강 연계 시청'] },
  25: { format: '텍스트', why: 'APA 형식 문헌 목록', bullets: ['Likert, R. (1932). A technique for the measurement of attitudes.', 'Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests.', 'Malhotra, N. K. (2020). Marketing Research (7th ed.), Ch.9'] },
  26: { format: '텍스트', why: '예고 안내', bullets: ['06교시: 설문 문항 작성의 원칙', '오늘 배운 척도 유형이 문항 작성 규칙과 어떻게 연결되는지', '예습 질문: "만족하십니까?"는 왜 나쁜 문항인가'] },
  27: { format: '텍스트', why: '과제 안내', bullets: ['과제: 실습에서 작성한 Likert 문항 3개 + 설계 근거 1쪽', '제출: LMS 과제함 · 1주 이내', '평가 기준: 이중 질문 여부 · 편향 통제 · 척도 수준 적합성'] },
  28: { format: '텍스트', why: '마무리 인사', bullets: ['수고하셨습니다 — 다음 교시에 만나요', '질문은 LMS Q&A 또는 AI 튜터로'] },
};

const OUTLINE_FORMAT_HINT = {
  '표': '행×열 비교 표로 렌더됩니다',
  '칸반보드': '열 단위 카드 보드로 렌더됩니다',
  '다이어그램': '개념 관계 다이어그램으로 렌더됩니다',
  '순서도': '단계 화살표 순서도로 렌더됩니다',
  '도식': '구조 도식으로 렌더됩니다',
  '차트': '수치 차트로 렌더됩니다',
  '퀴즈 카드': '문항 카드로 렌더됩니다',
  '이미지': '생성 이미지가 배치됩니다',
  '텍스트': '텍스트 중심으로 렌더됩니다',
  '없음': '시각 요소 없이 본문만 배치됩니다',
};

const OUTLINE_FORMAT_CANDIDATES = {
  '표': ['표','다이어그램','텍스트'],
  '순서도': ['순서도','다이어그램','텍스트'],
  '차트': ['차트','표','텍스트'],
  '칸반보드': ['칸반보드','표','텍스트'],
  '퀴즈 카드': ['퀴즈 카드','텍스트'],
  '도식': ['도식','다이어그램','텍스트'],
  '다이어그램': ['다이어그램','도식','텍스트'],
  '텍스트': ['텍스트','이미지'],
  '이미지': ['이미지','텍스트'],
};

const FormatPreview = ({ format, reason, title }) => {
  const cell = {background:'var(--admin-line)',borderRadius:3,minHeight:10};
  const accent = {background:'var(--hycu-cyan-soft)',border:'1px solid var(--hycu-cyan)',borderRadius:4};
  let visual;
  if (format === '표') {
    visual = <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>{['개념','특징','적용',...Array(6).fill('')].map((label,i)=><span key={i} style={i<3?{...accent,minHeight:18,padding:'3px 4px',fontSize:8,textAlign:'center',color:'var(--hycu-cyan-deep)',fontWeight:700}:cell}>{label}</span>)}</div>;
  } else if (format === '칸반보드') {
    visual = <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>{['원인','설계','분석'].map((l,i)=><div key={l} style={{padding:5,border:'1px solid var(--admin-line)',borderRadius:5,background:'white'}}><b style={{display:'block',fontSize:8,color:'var(--admin-muted)',marginBottom:4}}>{l}</b><span style={{display:'block',...cell,marginBottom:3}}></span><span style={{display:'block',...cell,width:i===1?'72%':'88%'}}></span></div>)}</div>;
  } else if (format === '순서도') {
    visual = <div style={{display:'flex',alignItems:'center',gap:5}}>{['수집','계산','산출','결정'].map((l,i)=><React.Fragment key={l}><span style={{...accent,flex:1,padding:'9px 4px',fontSize:8,textAlign:'center',color:'var(--hycu-cyan-deep)',fontWeight:700}}>{l}</span>{i<3?<span style={{color:'var(--admin-faint)',fontSize:13}}>›</span>:null}</React.Fragment>)}</div>;
  } else if (format === '차트') {
    visual = <div style={{height:54,display:'flex',alignItems:'flex-end',justifyContent:'center',gap:8,borderBottom:'1px solid var(--admin-line-strong)'}}>{[32,48,25,40,52].map((h,i)=><span key={i} style={{width:18,height:h,background:i===1?'var(--hycu-cyan)':'var(--admin-line-strong)',borderRadius:'4px 4px 0 0'}}></span>)}</div>;
  } else if (format === '도식' || format === '다이어그램') {
    visual = <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',alignItems:'center',gap:6}}>{['개념','문항','점수'].map((l,i)=><React.Fragment key={l}><span style={{...accent,padding:'13px 5px',fontSize:8,textAlign:'center',color:'var(--hycu-cyan-deep)',fontWeight:700}}>{l}</span>{i<2?<span style={{color:'var(--admin-faint)'}}>→</span>:null}</React.Fragment>)}</div>;
  } else if (format === '퀴즈 카드') {
    visual = <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>{['A','B','C','D'].map((l,i)=><span key={l} style={{...(i===1?accent:{border:'1px solid var(--admin-line)',background:'white'}),padding:'7px',borderRadius:5,fontSize:8,color:'var(--admin-muted)'}}>{l} · 선택지</span>)}</div>;
  } else if (format === '이미지') {
    visual = <div style={{height:58,border:'1px solid var(--admin-line)',borderRadius:6,display:'grid',placeItems:'center',background:'linear-gradient(135deg,var(--admin-bg),var(--hycu-cyan-soft))'}}><Icon name="file" size={18} style={{color:'var(--hycu-cyan-deep)'}}/></div>;
  } else if (format === '없음') {
    visual = <div style={{height:44,display:'grid',placeItems:'center',border:'1px dashed var(--admin-line-strong)',borderRadius:6,fontSize:10,color:'var(--admin-muted)'}}>시각 요소 없음 · 본문 중심</div>;
  } else {
    visual = <div style={{display:'grid',gap:6}}><span style={{...cell,width:'88%',height:10}}></span><span style={{...cell,width:'100%',height:8}}></span><span style={{...cell,width:'74%',height:8}}></span></div>;
  }
  return (
    <div aria-label={`${format} 포맷 미리보기: ${reason}`} style={{marginTop:12,border:'1px solid var(--admin-line)',borderRadius:8,overflow:'hidden',background:'var(--admin-bg)'}}>
      <div style={{padding:'7px 10px',borderBottom:'1px solid var(--admin-line)',fontSize:10.5,color:'var(--admin-muted)',lineHeight:1.45}}>
        <b style={{color:'var(--hycu-cyan-deep)',fontWeight:700}}>[{format}]</b> {title} · {reason}
      </div>
      <div style={{padding:'12px 14px',background:'white'}}>{visual}</div>
    </div>
  );
};

const OutlineCard = ({ slide, draft, selected, onSelect, onChange }) => {
  const ph = OUTLINE_PHASE_META[slide.phase] || OUTLINE_PHASE_META['—'];
  const content = OUTLINE_CONTENT[slide.n] || { format:'텍스트', why:'본문 중심', bullets:[] };
  const formatReason = draft.format === content.format ? content.why : ({
    '표':'핵심 개념·특징·적용을 행과 열로 비교',
    '순서도':'핵심 내용을 단계 순서와 화살표로 연결',
    '차트':'핵심 수치와 기준 구간의 차이를 비교',
    '다이어그램':'핵심 개념 사이의 관계를 구조로 설명',
    '도식':'핵심 내용의 구성과 연결 관계를 설명',
  }[draft.format] || OUTLINE_FORMAT_HINT[draft.format]);
  const [editing, setEditing] = React.useState(false);
  const [pickOpen, setPickOpen] = React.useState(false);
  const candidates = Array.from(new Set([...(OUTLINE_FORMAT_CANDIDATES[draft.format] || []), ...OUTLINE_FORMATS]));
  return (
    <article className="card" tabIndex="0" aria-current={selected?'true':undefined}
      onClick={onSelect} onKeyDown={e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); onSelect(); } }}
      style={{padding:'16px 18px',marginBottom:10,borderColor:selected?'var(--hycu-cyan)':'var(--admin-line)',boxShadow:selected?'0 0 0 2px var(--hycu-cyan-soft)':'none',outline:'none'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:selected?'var(--hycu-cyan-soft)':'var(--admin-bg)',border:'1px solid '+(selected?'var(--hycu-cyan)':'var(--admin-line)'),display:'grid',placeItems:'center',fontFamily:'ui-monospace,monospace',fontSize:12,fontWeight:700,color:selected?'var(--hycu-cyan-deep)':'var(--admin-ink)',flexShrink:0}}>
          {String(slide.n).padStart(2,'0')}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7,flexWrap:'wrap'}}>
            <span style={{fontSize:10.5,fontWeight:700,color:ph.c,background:ph.c+'1A',padding:'2px 8px',borderRadius:999}}>{slide.phase} · {ph.ko}</span>
            <span style={{fontSize:10.5,fontWeight:700,color:'var(--hycu-cyan-deep)',background:'var(--hycu-cyan-soft)',padding:'2px 8px',borderRadius:999}}>{draft.format}</span>
            <button aria-expanded={pickOpen} onClick={e => {e.stopPropagation();setPickOpen(o=>!o);}}
              style={{fontSize:10.5,fontWeight:600,color:'var(--admin-muted)',background:'transparent',border:'1px solid var(--admin-line)',padding:'3px 9px',borderRadius:999}}>포맷 변경</button>
            <div style={{flex:1}}></div>
            <button onClick={e => {e.stopPropagation();setEditing(v=>!v);}}
              style={{fontSize:11,fontWeight:700,color:editing?'white':'var(--hycu-cyan-deep)',background:editing?'var(--hycu-cyan-deep)':'var(--hycu-cyan-soft)',border:'1px solid var(--hycu-cyan)',padding:'4px 12px',borderRadius:999}}>
              {editing?'수정 완료':'텍스트 수정'}
            </button>
          </div>
          {pickOpen ? (
            <div onClick={e=>e.stopPropagation()} style={{display:'flex',gap:6,flexWrap:'wrap',margin:'2px 0 10px',padding:'10px',background:'var(--admin-bg)',border:'1px dashed var(--admin-line-strong)',borderRadius:8}}>
              {candidates.map(f => <button key={f} onClick={() => {onChange({format:f});setPickOpen(false);}}
                style={{fontSize:11,fontWeight:f===draft.format?700:500,color:f===draft.format?'white':'var(--admin-ink)',background:f===draft.format?'var(--hycu-cyan-deep)':'white',border:'1px solid var(--admin-line)',padding:'5px 10px',borderRadius:6}}>{f}</button>)}
            </div>
          ) : null}
          {editing ? (
            <div onClick={e=>e.stopPropagation()} style={{display:'grid',gap:8}}>
              <input aria-label={`슬라이드 ${slide.n} 제목`} value={draft.title} onChange={e=>onChange({title:e.target.value})}
                style={{width:'100%',border:'1px solid var(--hycu-cyan)',borderRadius:6,padding:'8px 10px',fontFamily:'inherit',fontSize:15,fontWeight:700,color:'var(--admin-ink)',outline:'none'}}/>
              <textarea aria-label={`슬라이드 ${slide.n} 본문`} value={draft.body} onChange={e=>onChange({body:e.target.value})} rows="5"
                style={{width:'100%',resize:'vertical',border:'1px solid var(--hycu-cyan)',borderRadius:6,padding:'8px 10px',fontFamily:'inherit',fontSize:12.5,color:'var(--admin-ink)',lineHeight:1.75,outline:'none'}}/>
            </div>
          ) : (
            <>
              <h3 style={{fontSize:15.5,fontWeight:700,color:'var(--admin-ink)',lineHeight:1.45,margin:'0 0 6px'}}>{draft.title}</h3>
              <div style={{fontSize:12.5,color:'var(--admin-charcoal)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{draft.body}</div>
            </>
          )}
          <FormatPreview format={draft.format} reason={formatReason} title={draft.title}/>
        </div>
      </div>
    </article>
  );
};

const OutlineSkeleton = () => (
  <div className="card" style={{padding:'14px 18px',marginBottom:8,opacity:0.7}}>
    <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
      <div style={{width:30,height:30,borderRadius:8,background:'var(--admin-bg)',border:'1px solid var(--admin-line)',flexShrink:0}}></div>
      <div style={{flex:1}}>
        <div style={{width:90,height:14,borderRadius:4,background:'var(--admin-line)',marginBottom:8,animation:'pulse 1.2s infinite'}}></div>
        <div style={{width:'62%',height:16,borderRadius:4,background:'var(--admin-line)',marginBottom:6,animation:'pulse 1.2s infinite'}}></div>
        <div style={{width:'84%',height:11,borderRadius:4,background:'var(--admin-bg)',border:'1px solid var(--admin-line)',marginBottom:5}}></div>
        <div style={{width:'70%',height:11,borderRadius:4,background:'var(--admin-bg)',border:'1px solid var(--admin-line)'}}></div>
      </div>
    </div>
  </div>
);

const OutlineScreen = ({ deck, setDeck, onScreen }) => {
  const total = deck.slides.length;
  const [started, setStarted] = React.useState(false);
  const [genCount, setGenCount] = React.useState(0);
  const [selectedSlide, setSelectedSlide] = React.useState(1);
  const [prompt, setPrompt] = React.useState('');
  const [applying, setApplying] = React.useState(false);
  const [messages, setMessages] = React.useState([{role:'assistant',text:'수정할 슬라이드를 선택한 뒤 원하는 변경을 말해 주세요. 포맷 변경과 제목·본문 수정을 함께 반영할 수 있습니다.'}]);
  const [drafts, setDrafts] = React.useState(() => Object.fromEntries(deck.slides.map(slide => {
    const content = OUTLINE_CONTENT[slide.n] || {format:'텍스트',bullets:[]};
    const lines = [...(slide.subtitle?[slide.subtitle]:[]),...((slide.objectives||content.bullets)||[])];
    return [slide.n,{title:slide.title,body:lines.join('\n'),format:content.format}];
  })));
  const generating = started && genCount < total;
  React.useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setGenCount(c => {
      if (c >= total) { clearInterval(id); return c; }
      return c + 1;
    }), 320);
    return () => clearInterval(id);
  }, [started]);
  if (!started) {
    return (
      <div className="content" style={{paddingBottom:96}}>
        <div className="card" style={{padding:'56px 24px',textAlign:'center'}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:10}}>Outline</div>
          <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:22,margin:'0 0 8px',fontWeight:600}}>아웃라인 생성 — {deck.chapter}</h2>
          <p style={{fontSize:13,color:'var(--admin-muted)',margin:'0 0 26px',lineHeight:1.7}}>
            교안 설정을 바탕으로 슬라이드 {total}매의 구성을 작성합니다.<br/>
            단계를 오갈 때 자동 실행되지 않습니다 — 준비되면 아래 버튼으로 시작하세요.
          </p>
          <button className="btn btn-cyan" style={{fontSize:14,padding:'12px 30px'}} onClick={() => setStarted(true)}>
            아웃라인 생성 시작
          </button>
        </div>
      </div>
    );
  }
  const updateDraft = (n, patch) => {
    setDrafts(prev => ({...prev,[n]:{...prev[n],...patch}}));
    if (setDeck && (patch.title !== undefined || patch.body !== undefined)) {
      setDeck(prev => ({...prev,slides:prev.slides.map(s => s.n===n ? {...s,title:patch.title===undefined?s.title:patch.title,objectives:patch.body===undefined?s.objectives:patch.body.split('\n').filter(Boolean)} : s)}));
    }
  };
  const applyAi = (value) => {
    const text = (value || prompt).trim();
    if (!text || applying || !drafts[selectedSlide]) return;
    setPrompt('');
    setMessages(m => [...m,{role:'user',text}]);
    setApplying(true);
    window.setTimeout(() => {
      const current = drafts[selectedSlide];
      let patch = {};
      let action = '본문을 보완';
      if (text.includes('비교표') || text.includes('표로')) { patch.format='표'; action='포맷을 비교표로 변경'; }
      else if (text.includes('순서도') || text.includes('흐름')) { patch.format='순서도'; action='포맷을 순서도로 변경'; }
      else if (text.includes('차트')) { patch.format='차트'; action='포맷을 차트로 변경'; }
      else if (text.includes('다이어그램') || text.includes('도식')) { patch.format='다이어그램'; action='포맷을 관계 다이어그램으로 변경'; }
      if (text.includes('3줄')) { patch.body=current.body.split('\n').filter(Boolean).slice(0,3).join('\n'); action='본문을 핵심 3줄로 정리'; }
      else if (text.includes('쉽게')) { patch.body=current.body+'\n학습자 관점 요약: 핵심 개념을 실제 조사 사례와 연결해 쉽게 설명합니다.'; action='쉬운 설명을 본문에 추가'; }
      else if (!patch.format) { patch.body=current.body+'\nAI 보완: '+text; }
      updateDraft(selectedSlide,patch);
      setMessages(m => [...m,{role:'assistant',text:`슬라이드 ${String(selectedSlide).padStart(2,'0')}의 ${action}했습니다. 왼쪽 아웃라인에서 바로 확인할 수 있습니다.`}]);
      setApplying(false);
    }, 320);
  };
  const shown = deck.slides.slice(0, genCount);
  const dist = {};
  shown.forEach(s => { dist[s.phase] = (dist[s.phase]||0)+1; });
  return (
    <div className="content" style={{paddingBottom:96,maxWidth:'none'}}>
      <div className="outline-summary" style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16,marginBottom:16}}>
        <div className="card" style={{padding:22}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>
            {generating ? 'Outline · 생성 중' : 'Outline'}
          </div>
          <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:21,margin:'0 0 6px',fontWeight:600,wordBreak:'keep-all'}}>
            {generating ? <>아웃라인 생성 중 — {deck.chapter} <span style={{fontFamily:'ui-monospace,monospace',fontSize:15,color:'var(--hycu-cyan-deep)'}}>{genCount}/{total}</span></> : <>아웃라인 검토 — {deck.chapter}</>}
          </h2>
          <p style={{fontSize:13,color:'var(--admin-muted)',margin:0,lineHeight:1.6,wordBreak:'keep-all'}}>
            {generating
              ? '교안 설정을 바탕으로 슬라이드 구성을 실시간으로 작성하고 있습니다. 각 슬라이드는 콘텐츠에 적합한 표현 포맷(표·순서도·차트 등)으로 자동 채택됩니다.'
              : <>슬라이드를 그리기 전에 구성을 확인·수정하는 단계입니다. 제목·본문은 클릭해서 바로 고칠 수 있고, 슬라이드별 표현 포맷은 하단 셀렉터에서 변경하거나 뺄 수 있습니다. 확인이 끝나면 하단 <b>다음 · 슬라이드 렌더</b>로 디자인 렌더에 커밋합니다.</>}
          </p>
          {generating ? (
            <div style={{height:5,background:'var(--admin-line)',borderRadius:3,overflow:'hidden',marginTop:14}}>
              <div style={{height:'100%',width:(genCount/total*100)+'%',background:'linear-gradient(90deg, #00B5E2, #0091B8)',transition:'width 0.3s'}}></div>
            </div>
          ) : null}
        </div>
        <div className="card" style={{padding:16}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,marginBottom:8,color:'var(--admin-ink)'}}>구성 요약</div>
          <div style={{fontSize:12,color:'var(--admin-muted)',lineHeight:1.8}}>
            슬라이드 {generating ? `${genCount} / ${total}` : `${total}매`} · {deck.duration}분<br/>ADDIE 분포
          </div>
          <div style={{display:'flex',height:8,borderRadius:4,overflow:'hidden',margin:'8px 0 6px'}}>
            {Object.entries(OUTLINE_PHASE_META).map(([k,m]) => dist[k] ? <div key={k} style={{flex:dist[k],background:m.c,transition:'flex 0.3s'}} title={`${k} ${dist[k]}`}></div> : null)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {Object.entries(dist).map(([k,n]) => (
              <span key={k} style={{fontSize:10.5,color:(OUTLINE_PHASE_META[k]||{}).c,fontWeight:700}}>{k} {n}</span>
            ))}
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid var(--admin-line)',fontSize:11,color:'var(--admin-muted)',lineHeight:1.7}}>
            포맷 자동 채택: 비교 콘텐츠 → 표 · 절차 → 순서도 · 수치 기준 → 차트 · 토론 → 칸반보드. 셀렉터로 변경 가능.
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 320px',gap:16,alignItems:'start'}} className="outline-workspace">
        <div>
          {shown.map(s => <OutlineCard key={s.n} slide={s} draft={drafts[s.n]} selected={selectedSlide===s.n}
            onSelect={()=>setSelectedSlide(s.n)} onChange={patch=>updateDraft(s.n,patch)} />)}
          {generating ? <OutlineSkeleton /> : null}
          {generating && genCount + 1 < total ? <OutlineSkeleton /> : null}
        </div>
        <aside className="card" style={{padding:0,position:'sticky',top:12,overflow:'hidden',boxShadow:'0 12px 28px -24px var(--admin-ink)'}}>
          <div style={{padding:'15px 16px',borderBottom:'1px solid var(--admin-line)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:'var(--hycu-cyan-soft)',color:'var(--hycu-cyan-deep)',display:'grid',placeItems:'center'}}><Icon name="sparkles" size={15}/></div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--admin-ink)'}}>아웃라인 AI 수정</div>
              <div style={{fontSize:10.5,color:'var(--admin-muted)',marginTop:1}}>선택 슬라이드 · {String(selectedSlide).padStart(2,'0')}</div>
            </div>
          </div>
          <div role="log" aria-live="polite" style={{height:310,overflowY:'auto',padding:14,background:'var(--admin-bg)',display:'flex',flexDirection:'column',gap:9}}>
            {messages.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start',maxWidth:'90%',padding:'9px 11px',borderRadius:m.role==='user'?'12px 12px 3px 12px':'12px 12px 12px 3px',background:m.role==='user'?'var(--ink-deep)':'white',color:m.role==='user'?'white':'var(--admin-charcoal)',border:m.role==='user'?'none':'1px solid var(--admin-line)',fontSize:11.5,lineHeight:1.55}}>{m.text}</div>)}
            {applying?<div style={{fontSize:11,color:'var(--admin-muted)'}}>선택한 아웃라인에 반영 중…</div>:null}
          </div>
          <div style={{padding:'12px 14px',borderTop:'1px solid var(--admin-line)'}}>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
              {['핵심 3줄로 정리','비교표로 변경','설명을 더 쉽게'].map(q=><button key={q} onClick={()=>applyAi(q)} disabled={applying}
                style={{padding:'4px 7px',border:'1px solid var(--admin-line)',borderRadius:6,background:'white',color:'var(--admin-muted)',fontSize:10.5}}>{q}</button>)}
            </div>
            <form onSubmit={e=>{e.preventDefault();applyAi();}}>
              <label htmlFor="outline-ai-prompt" style={{display:'block',fontSize:10.5,fontWeight:700,color:'var(--admin-muted)',marginBottom:6}}>AI에게 수정 요청</label>
              <textarea id="outline-ai-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} rows="3" placeholder="예: 이 슬라이드를 순서도로 바꾸고 설명을 더 쉽게 써줘"
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();applyAi();}}}
                style={{width:'100%',resize:'none',border:'1px solid var(--admin-line-strong)',borderRadius:8,padding:'9px 10px',fontFamily:'inherit',fontSize:11.5,lineHeight:1.5,outline:'none'}}/>
              <button className="btn btn-cyan" type="submit" disabled={!prompt.trim()||applying} style={{width:'100%',justifyContent:'center',marginTop:7}}>
                <Icon name="sparkles" size={12}/> 선택 슬라이드에 반영
              </button>
            </form>
          </div>
        </aside>
      </div>
      <style>{`
        @media (max-width:1100px){.outline-summary,.outline-workspace{grid-template-columns:1fr!important}.outline-workspace>aside{position:static!important;order:-1}}
        @media (max-width:760px){.outline-workspace article>div{gap:8px!important}.outline-workspace>aside [role="log"]{height:220px!important}}
        @media (prefers-reduced-motion:reduce){.outline-workspace *{transition:none!important;animation:none!important}}
      `}</style>
    </div>
  );
};

window.OutlineScreen = OutlineScreen;
