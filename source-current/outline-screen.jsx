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
  1: { format: '이미지', why: '생성 이미지를 AI 전환의 핵심 장면으로 활용', bullets: ['과목: AI 리터러시 (AIG101) · 3주차', '주제: 생성형 AI의 이해와 업무 활용', '생성 이미지: 데이터·모델·사람이 연결되는 AI 전환 장면'] },
  2: { format: '퀴즈 카드', why: 'AI 사용 경험과 판단 기준을 사전 진단', bullets: ['AI 사용 경험 · 생성 원리 · 결과 검증 · 사람의 역할', '정답보다 현재 판단 기준을 확인', '소요 3분 · 수업 후 다시 비교'] },
  3: { format: '텍스트', why: '네 가지 학습 성과를 명확히 제시', bullets: ['생성형 AI가 결과를 만드는 원리를 설명한다', '다섯 요소를 포함한 프롬프트를 설계한다', '근거 중심으로 AI 결과를 검증한다', '개인정보·저작권을 고려해 역할을 나눈다'] },
  4: { format: '순서도', why: '50분 학습 경로를 단계로 표현', bullets: ['이해 10분 → 설계 15분 → 실습 15분 → 확인 10분', '생성 원리에서 실제 업무 협업까지 확장', '각 단계마다 사람의 검토 지점 확인'] },
  5: { format: '도식', why: '입력에서 출력까지의 생성 구조', bullets: ['학습된 패턴 + 현재 입력 → 생성 모델 → 새로운 결과', 'AI 결과는 검색된 정답이 아니라 확률적 예측', '사실의 정확성은 별도 검증이 필요'] },
  6: { format: '다이어그램', why: 'AI 역할의 발전 단계를 비교', bullets: ['규칙 기반 → 머신러닝 → 딥러닝 → 생성형 AI', '분류·예측에서 텍스트·이미지·코드 생성으로 확장', '생성 능력과 사실 판단 능력은 구분'] },
  7: { format: '다이어그램', why: '프롬프트의 다섯 요소를 한 흐름으로 표현', bullets: ['목표 · 맥락 · 자료 · 제약 · 출력 형식', '예시: 신입 구성원 대상 AI 보안 안내문', '평가 기준이 들어가야 결과를 검토하기 쉬움'] },
  8: { format: '표', why: 'AI와 사람의 강점을 대비', bullets: ['AI: 빠른 생성·대안 확장·반복 처리', '사람: 근거 검증·맥락 판단·최종 책임', '좋은 협업 = 속도 + 검토 가능성'] },
  9: { format: '텍스트', why: '프롬프트 작성 원칙을 행동 문장으로 제시', bullets: ['요청을 구체적으로', '맥락과 자료를 충분히', '제약과 출력 형식을 명시', '피드백과 검증으로 반복 개선'] },
  10: { format: '도식', why: '업무 특성을 연속선으로 진단', bullets: ['반복적↔새로운 · 정형적↔비정형적', '저위험↔고위험 · 근거 명확↔판단 의존', '오른쪽으로 갈수록 사람의 승인 수준 강화'] },
  11: { format: '차트', why: '업무별 역할 적합도를 비교', bullets: ['반복 작업 정리와 초안 생성은 AI 활용도가 높음', '분석은 AI 보조와 사람 해석을 결합', '최종 승인은 사람이 담당'] },
  12: { format: '도식', why: '결과 품질을 결정하는 요소를 식으로 표현', bullets: ['좋은 결과 = 명확한 목표 + 충분한 맥락 + 검증 루프', '입력이 선명할수록 수정 비용 감소', '검증이 없으면 그럴듯한 오류가 남음'] },
  13: { format: '차트', why: '반복 개선의 체감 효과를 개념 곡선으로 표현', bullets: ['초안 → 피드백 → 수정 → 검증 → 최종 정리', '초기 반복에서 방향이 크게 개선', '후반 반복은 사실과 표현을 정교화'] },
  14: { format: '다이어그램', why: 'AI 활용의 세 갈래와 검토 지점 표현', bullets: ['탐색과 요약 · 초안과 아이디어 · 반복 업무 자동화', '자동화가 커질수록 권한과 중단 조건이 중요', '모든 경로의 끝에 사람의 승인 배치'] },
  15: { format: '표', why: 'AI와 사람의 역할을 업무 요소별로 비교', bullets: ['정보 처리 · 콘텐츠 생성 · 분석 지원 · 실행 책임', 'AI는 대량 처리와 대안 생성에 강점', '사람은 출처·원인·영향·책임 판단'] },
  16: { format: '순서도', why: '실습 절차를 네 단계로 안내', bullets: ['실제 업무 선택 → 역할 분담 → 요청 설계 → 검증 계획', '반복되는 과제를 하나 선택', '10분 작성 후 동료 검토'] },
  17: { format: '표', why: '모호한 요청과 구조화된 요청을 직접 대비', bullets: ['회의록·메일·자료 조사·아이디어 요청 사례', '목적·대상·제약·근거·비교 형식을 보강', '결과를 평가할 수 있는 기준 포함'] },
  18: { format: '칸반보드', why: '위험 관리 시점을 단계별로 그룹화', bullets: ['입력 전: 개인정보·권한 확인', '생성 중: 출처·가정·대안 요청', '출력 후: 원문 대조·편향 점검·최종 승인'] },
  19: { format: '퀴즈 카드', why: '개인정보 입력 위험을 즉시 확인', bullets: ['외부 AI에 입력하면 안 되는 정보 찾기', '개인정보 포함 고객 명단이 정답', '공개 자료와 민감 정보 구분'] },
  20: { format: '퀴즈 카드', why: '좋은 프롬프트의 구조를 선택', bullets: ['목표·대상·개수·길이·근거 기준이 포함된 요청', '모호하거나 일방적인 요청과 비교', '정답의 검토 가능성을 해설'] },
  21: { format: '퀴즈 카드', why: '그럴듯한 오류에 대응하는 복수 선택', bullets: ['공식 원문에서 확인', '불확실한 부분을 표시하고 재검증', '모델 간 동의가 아니라 출처로 판단'] },
  22: { format: '텍스트', why: '핵심 원칙 세 가지를 압축', bullets: ['구조화된 요청', '근거 중심 검증', '사람의 판단과 책임'] },
  23: { format: '표', why: 'AI 오해와 현실 기준을 대비', bullets: ['항상 정답 → 자연스러움과 정확성은 다름', '항상 중립 → 데이터와 요청의 영향을 받음', '완전 자동화 → 영향이 클수록 승인 필요'] },
  24: { format: '텍스트', why: '원리·위험관리·교육 활용 자료 안내', bullets: ['Attention Is All You Need', 'NIST AI RMF 1.0', 'UNESCO 생성형 AI 교육 지침', 'AI 튜터 실습'] },
  25: { format: '텍스트', why: '검증 가능한 핵심 문헌 제시', bullets: ['Vaswani et al. (2017)', 'Bommasani et al. (2021)', 'NIST AI RMF 1.0 (2023)', 'UNESCO Guidance for Generative AI (2023)'] },
  26: { format: '텍스트', why: '다음 교시와의 학습 연결 제시', bullets: ['다음 주제: AI 에이전트와 업무 자동화', '한 번의 생성에서 여러 단계 실행으로 확장', '예습: 도구 권한과 중단 조건'] },
  27: { format: '텍스트', why: 'AI 협업 과제의 제출 기준 안내', bullets: ['실제 업무와 기대 결과 정의', 'AI와 사람의 역할 구분', '프롬프트와 검증 근거 첨부', '개인정보·저작권·오류 대응 기준 포함'] },
  28: { format: '이미지', why: '생성 이미지로 AI 협업의 두 역할을 마무리', bullets: ['AI는 사고를 확장하는 파트너', '생성은 AI와 함께, 판단과 책임은 사람이', '생성 이미지: 반복 실행과 창의적 탐구의 대비'] },
};

const OUTLINE_FORMAT_HINT = {
  '표': '행×열 비교 표로 렌더됩니다',
  '칸반보드': '열 단위 카드 보드로 렌더됩니다',
  '다이어그램': '개념 관계 다이어그램으로 렌더됩니다',
  '순서도': '단계 화살표 순서도로 렌더됩니다',
  '도식': '구조 도식으로 렌더됩니다',
  '차트': '수치 차트로 렌더됩니다',
  '퀴즈 카드': '문항 카드로 렌더됩니다',
  '이미지': '외부 파일 없이 네이티브 일러스트레이션으로 렌더됩니다',
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
  } else if (format === '도식') {
    visual = <div style={{display:'grid',gap:5}}>{['INPUT · 개념','STRUCTURE · 문항','OUTCOME · 점수'].map((label,index)=><span key={label} style={{...accent,padding:'5px 8px',marginLeft:index*18,fontSize:8,color:'var(--hycu-cyan-deep)',fontWeight:700}}>{label}</span>)}</div>;
  } else if (format === '다이어그램') {
    visual = <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',alignItems:'center',gap:6}}>{['개념','관계','적용'].map((l,i)=><React.Fragment key={l}><span style={{...accent,padding:'13px 5px',fontSize:8,textAlign:'center',color:'var(--hycu-cyan-deep)',fontWeight:700}}>{l}</span>{i<2?<span style={{color:'var(--admin-faint)'}}>↔</span>:null}</React.Fragment>)}</div>;
  } else if (format === '퀴즈 카드') {
    visual = <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>{['A','B','C','D'].map((l,i)=><span key={l} style={{...(i===1?accent:{border:'1px solid var(--admin-line)',background:'white'}),padding:'7px',borderRadius:5,fontSize:8,color:'var(--admin-muted)'}}>{l} · 선택지</span>)}</div>;
  } else if (format === '이미지') {
    visual = <div style={{height:58,border:'1px solid var(--admin-line)',borderRadius:6,display:'grid',placeItems:'center',background:'var(--hycu-cyan-soft)'}}><Icon name="file" size={18} style={{color:'var(--hycu-cyan-deep)'}}/></div>;
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
    const defaultLines = [...(slide.subtitle?[slide.subtitle]:[]),...((slide.objectives||content.bullets)||[])];
    const lines = slide.outlineEdited ? (slide.objectives || defaultLines) : defaultLines;
    return [slide.n,{title:slide.title,body:lines.join('\n'),format:slide.formatOverride || content.format}];
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
    const effectiveBody = patch.body === undefined ? drafts[n]?.body : patch.body;
    setDrafts(prev => ({...prev,[n]:{...prev[n],...patch}}));
    if (setDeck && (patch.title !== undefined || patch.body !== undefined || patch.format !== undefined)) {
      setDeck(prev => ({...prev,slides:prev.slides.map(s => s.n===n ? {
        ...s,
        title:patch.title===undefined?s.title:patch.title,
        objectives:effectiveBody===undefined?s.objectives:effectiveBody.split('\n').filter(Boolean),
        formatOverride:patch.format===undefined?(drafts[n]?.format || s.formatOverride || '텍스트'):patch.format,
        outlineEdited:true,
      } : s)}));
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
      const quotedTitleMatch = text.match(/제목(?:을|은)?\s*["“‘']([^"”’']+)["”’']\s*(?:(?:으로|로)\s*(?:바꿔|변경|수정))?/);
      const colonTitleMatch = quotedTitleMatch ? null : text.match(/제목\s*[:：]\s*([^,，\n]+)/);
      let titleDirective = quotedTitleMatch?.[0] || colonTitleMatch?.[0] || '';
      let requestedTitle = (quotedTitleMatch?.[1] || colonTitleMatch?.[1] || '').trim();
      if (!requestedTitle) {
        const prefixMatch = text.match(/제목(?:을|은)?[ \t]+/);
        if (prefixMatch) {
          const titleStart = prefixMatch.index + prefixMatch[0].length;
          const tail = text.slice(titleStart);
          const suffix = ['바꿔','변경','수정']
            .flatMap(value => {
              const candidates = [];
              let index = tail.indexOf(value);
              while (index >= 0) {
                candidates.push({value,index});
                index = tail.indexOf(value,index + value.length);
              }
              return candidates;
            })
            .sort((a,b) => a.index - b.index)
            .find(candidate => {
              const beforeAction = tail.slice(0,candidate.index).trimEnd();
              return beforeAction.endsWith('으로') || beforeAction.endsWith('로');
            });
          if (suffix) {
            const beforeAction = tail.slice(0,suffix.index).trimEnd();
            const particle = beforeAction.endsWith('으로') ? '으로' : '로';
            requestedTitle = beforeAction.slice(0,-particle.length).trim();
            titleDirective = text.slice(prefixMatch.index,titleStart + suffix.index + suffix.value.length);
          }
        }
      }
      const remainingText = titleDirective ? text.replace(titleDirective, ' ') : text;
      if (requestedTitle) { patch.title=requestedTitle; action='제목을 변경'; }
      if (remainingText.includes('비교표') || remainingText.includes('표로')) { patch.format='표'; action='포맷을 비교표로 변경'; }
      else if (remainingText.includes('순서도') || remainingText.includes('흐름')) { patch.format='순서도'; action='포맷을 순서도로 변경'; }
      else if (remainingText.includes('차트')) { patch.format='차트'; action='포맷을 차트로 변경'; }
      else if (remainingText.includes('다이어그램') || remainingText.includes('도식')) { patch.format='다이어그램'; action='포맷을 관계 다이어그램으로 변경'; }
      if (remainingText.includes('3줄')) { patch.body=current.body.split('\n').filter(Boolean).slice(0,3).join('\n'); action='본문을 핵심 3줄로 정리'; }
      else if (remainingText.includes('쉽게')) { patch.body=current.body+'\n학습자 관점 요약: 핵심 개념을 실제 조사 사례와 연결해 쉽게 설명합니다.'; action='쉬운 설명을 본문에 추가'; }
      else if (!patch.format && !patch.title) { patch.body=current.body+'\nAI 보완: '+text; }
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
