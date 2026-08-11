const BPQuiz = ({ question, options, answers }) => (
  <div className="bp-quiz">
    <div className="bp-quiz-question ct-item"><span>QUESTION</span><strong className="ct-text">{question}</strong></div>
    <div className="bp-quiz-options">
      {options.map((option, index) => (
        <div className={`ct-item bp-quiz-option${answers.includes(index) ? ' correct' : ''}`} key={`${option}-${index}`}>
          <span>{String.fromCharCode(65 + index)}</span><strong className="ct-text">{option}</strong>
        </div>
      ))}
    </div>
    <div className="bp-quiz-hint"><span>정답은 근거와 함께 확인합니다.</span><strong>{answers.map(index => String.fromCharCode(65 + index)).join(' · ')}</strong></div>
  </div>
);

const BPSummary = () => {
  const items = [
    ['구조화된 요청', '목표·맥락·자료·제약·형식을 함께 설계합니다.'],
    ['근거 중심 검증', '사실·수치·인용은 신뢰할 수 있는 원문과 대조합니다.'],
    ['사람의 책임', 'AI는 초안을 돕고 사람은 판단과 최종 승인을 맡습니다.'],
  ];
  return (
    <div className="bp-summary">
      <div className="bp-summary-word">COLLABORATE</div>
      <div className="bp-summary-items">
        {items.map(([title, detail], index) => <BPPanel key={title} eyebrow={String(index + 1).padStart(2, '0')} title={title} tone={['cyan-wash', 'cobalt-wash', 'neutral'][index]}>{detail}</BPPanel>)}
      </div>
    </div>
  );
};

const BPResourceCards = ({ body }) => (
  <div className="bp-resources">
    <div className="bp-resource-lead"><span>DEEP DIVE</span><strong>원리와 책임을<br/>함께 확장합니다.</strong><p>모델의 구조를 이해하고 실제 업무에 필요한 위험 관리 기준을 익힙니다.</p></div>
    <div className="bp-resource-list">
      {body.items.map((item, index) => <BPPanel key={item.t} eyebrow={String(index + 1).padStart(2, '0')} title={item.t} tone={index % 2 ? 'cobalt-wash' : 'cyan-wash'}>{item.d}</BPPanel>)}
    </div>
  </div>
);

const BPReferences = ({ body }) => (
  <div className="bp-references">
    {body.items.map((item, index) => (
      <div className="ct-item bp-reference" key={item}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <p className="ct-text">{item}</p>
      </div>
    ))}
  </div>
);

const BPNextLesson = ({ body }) => (
  <div className="bp-next">
    <div className="bp-next-lead"><span>NEXT</span><strong>한 번의 생성에서<br/>여러 단계의 실행으로</strong><p>다음 교시에는 도구를 사용하고 작업을 이어가는 AI 에이전트를 다룹니다.</p></div>
    <div className="bp-next-list">
      {body.items.map((item, index) => <BPPanel key={item.t} eyebrow={String(index + 1).padStart(2, '0')} title={item.t} tone={['cyan-wash', 'cobalt-wash', 'neutral'][index]}>{item.d}</BPPanel>)}
    </div>
  </div>
);

const BPChecklist = ({ body }) => (
  <div className="bp-checklist">
    <div className="bp-checklist-title"><span>SUBMIT</span><strong>제출 전<br/>네 가지만 확인합니다.</strong></div>
    <div className="bp-checklist-items">
      {body.items.map((item, index) => (
        <div className="ct-item bp-check-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong className="ct-text">{item}</strong></div>
      ))}
    </div>
  </div>
);

const BPClosing = ({ body, deck }) => (
  <div className="bp-closing">
    <div className="bp-closing-meta">HYCU / {deck.subject} / COMPLETE</div>
    <div className="bp-closing-mark">28</div>
    <BPGeneratedVisual asset={BP_GENERATED_VISUALS.closing} variant="closing" caption="반복 실행과 창의적 탐구를 연결하는 사람·AI 협업의 두 장면" />
    <div className="bp-closing-copy">
      <h1 className="ct-text">{body.big}</h1>
      <p className="ct-text">{body.small}</p>
      <div className="bp-closing-rule"></div>
    </div>
    <div className="bp-closing-path ct-item"><span className="ct-text">원리 이해</span><i></i><span className="ct-text">요청 설계</span><i></i><span className="ct-text">결과 검증</span><i></i><strong className="ct-text">책임 있는 활용</strong></div>
  </div>
);

const BPEndContent = ({ slide, deck, instructorLive }) => {
  const body = BP_SLIDE_BODIES[slide.n];
  let content;
  switch (slide.n) {
    case 19:
      content = <BPQuiz question={'다음 중 외부 생성형 AI에\n그대로 입력하면 안 되는 정보는?'} options={['공개된 보도자료', '개인정보가 포함된 고객 명단', '직접 작성한 일반 문장', '공개 라이선스 자료']} answers={[1]} />;
      break;
    case 20:
      content = <BPQuiz question={body.q} options={body.opts} answers={[body.answer, body.answer2].filter(value => value != null)} />;
      break;
    case 21:
      content = <BPQuiz question={body.q} options={body.opts} answers={[body.answer, body.answer2].filter(value => value != null)} />;
      break;
    case 22:
      content = <BPSummary />;
      break;
    case 23:
      content = <BPDataTable body={body} />;
      break;
    case 24:
      content = <BPResourceCards body={body} />;
      break;
    case 25:
      content = <BPReferences body={body} />;
      break;
    case 26:
      content = <BPNextLesson body={body} />;
      break;
    case 27:
      content = <BPChecklist body={body} />;
      break;
    case 28:
      return <BPClosing body={body} deck={deck} />;
    default:
      content = null;
  }
  return <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note={body?.note || slide.subtitle}>{content}</BPShell>;
};
