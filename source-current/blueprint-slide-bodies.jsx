const BP_SLIDE_BODIES = {
  9: { note: '프롬프트 설계 · 한 번의 완벽한 질문보다 확인 가능한 반복을 설계합니다.' },
  10: {
    pairs: [['반복적인', '새로운'], ['정형적인', '비정형적인'], ['저위험', '고위험'], ['근거 명확', '판단 의존'], ['개인 초안', '공식 결정']],
    caption: ['AI 주도', '사람과 협업', '사람 주도'],
    note: '업무 진단 · 오른쪽으로 갈수록 사람의 개입과 승인 수준을 높입니다.',
  },
  11: {
    unit: '역할 적합도 · 4단계 예시',
    bars: [
      { label: '반복 작업 정리', v: 4 },
      { label: '초안과 대안 생성', v: 4 },
      { label: '분석 보조', v: 3 },
      { label: '최종 승인', v: 1 },
    ],
    note: '역할 구분 · 영향이 큰 결정일수록 사람이 근거와 결과를 직접 승인합니다.',
  },
  12: {
    steps: ['좋은 결과', '명확한 목표', '충분한 맥락', '검증 루프'], ops: ['=', '+', '+'],
    details: ['업무에 쓰이는 출력', '원하는 결과와 대상', '자료·조건·제약', '사실·품질·영향 확인'],
    notes: ['입력이 선명할수록 수정 비용 감소', '검증이 없으면 그럴듯한 오류가 남음'],
    note: '결과 품질 · 프롬프트와 검증은 서로 대체할 수 없는 두 축입니다.',
  },
  13: {
    bars: [
      { label: '초안', v: 55 }, { label: '1차 피드백', v: 72 }, { label: '2차 수정', v: 82 },
      { label: '3차 검증', v: 86 }, { label: '최종 정리', v: 88 },
    ],
    x: '반복 횟수', y: '결과 선명도',
    panelTitle: '초기 반복이 결과의 방향을 잡습니다',
    panelBody: '초기 반복은 방향을 잡고, 마지막 반복은 사실과 표현을 정교하게 다듬습니다.',
    note: '개념 곡선 · 실제 개선 폭은 과제와 모델, 입력 자료에 따라 달라집니다.',
  },
  14: {
    root: 'AI 활용 과제', mids: ['탐색과 요약', '초안과 아이디어', '반복 업무 자동화'], leaf: '모든 경로의 끝에는 사람의 검토와 승인이 있습니다',
    note: '활용 확장 · 자동화 수준이 높아질수록 권한·기록·중단 조건을 명확히 둡니다.',
  },
  15: {
    head: ['업무 요소', 'AI가 강한 부분', '사람이 맡을 부분'],
    rows: [
      ['정보 처리', '많은 자료의 요약·분류', '출처의 신뢰성과 누락 판단'],
      ['콘텐츠 생성', '초안·대안·표현 확장', '목적·맥락·최종 메시지 결정'],
      ['분석 지원', '패턴 후보와 질문 제안', '원인 해석과 의사결정'],
      ['실행 책임', '반복 단계 보조', '승인·윤리·결과 책임'],
    ],
    note: '역할 분담 · AI의 출력은 판단 재료이며 최종 결정 그 자체가 아닙니다.',
  },
  17: {
    head: ['단계', '모호한 요청', '구조화한 요청', '개선 포인트'],
    rows: [
      ['1', '회의록 정리해 줘', '결정·담당·기한을 표로 정리', '출력 목적'],
      ['2', '메일 써 줘', '신입 대상, 300자, 친절한 안내', '대상과 제약'],
      ['3', '자료 조사해 줘', '공식 출처 3개와 확인일 표시', '근거 기준'],
      ['4', '아이디어 줘', '비용별 대안 3개와 위험 비교', '비교 형식'],
    ],
    note: '프롬프트 리팩터링 · 좋은 요청은 결과를 평가할 기준까지 포함합니다.',
  },
  18: {
    cols: [
      { t: '입력 전', cards: ['개인정보 제거', '권한 자료 확인', '목표와 금지 범위 명시'] },
      { t: '생성 중', cards: ['출처 요청', '가정 표시', '여러 대안 비교'] },
      { t: '출력 후', cards: ['원문 대조', '편향·누락 점검', '사람의 최종 승인'] },
    ],
    note: '위험 관리 · 안전은 마지막 검수가 아니라 전체 흐름에 배치합니다.',
  },
  20: {
    q: '다음 중 가장 검토하기 쉬운 프롬프트는?',
    opts: ['신제품 아이디어를 멋지게 써 줘', '마케팅 문구를 많이 만들어 줘', '20대 신규 고객 대상 문구 3개를 30자 이내로 만들고 근거를 덧붙여 줘', '우리 제품을 무조건 좋게 소개해 줘'],
    answer: 2,
    note: '형성평가 2 · 목표·대상·개수·길이·근거 기준이 포함된 요청을 찾습니다.',
  },
  21: {
    q: 'AI가 출처 없는 수치를 자신 있게 제시했습니다. 적절한 대응은? (복수 정답)',
    opts: ['공식 원문에서 수치를 확인한다', '불확실한 부분을 표시하고 재검증한다', '문장이 자연스러우므로 그대로 사용한다', '다른 AI가 동의하면 사실로 간주한다'],
    answer: 0, answer2: 1,
    note: '형성평가 3 · 모델 간 일치가 아니라 신뢰 가능한 원문과 근거로 검증합니다.',
  },
  23: {
    head: ['오해', '현실적인 기준'],
    rows: [
      ['AI는 항상 정답을 제공한다', '자연스러운 결과와 사실의 정확성은 다르다'],
      ['AI는 편향 없이 중립적이다', '학습 데이터와 요청 방식의 영향을 받는다'],
      ['자동화하면 사람의 검토가 필요 없다', '영향이 클수록 승인과 책임이 더 중요하다'],
    ],
    note: '오개념 점검 · AI의 능력과 책임 범위를 함께 이해합니다.',
  },
  24: {
    items: [
      { t: 'Attention Is All You Need', d: 'Transformer 구조를 이해하는 출발점' },
      { t: 'NIST AI RMF 1.0', d: 'AI 위험을 식별·측정·관리하는 실무 프레임' },
      { t: 'UNESCO 생성형 AI 지침', d: '교육에서의 사람 중심 활용 원칙' },
      { t: 'AI 튜터 실습', d: '하나의 업무를 프롬프트와 검증 루프로 개선' },
    ],
    note: '심화 학습 · 원리와 활용, 위험 관리를 균형 있게 확장합니다.',
  },
  25: {
    items: [
      'Vaswani, A. et al. (2017). Attention Is All You Need. NeurIPS.',
      'Bommasani, R. et al. (2021). On the Opportunities and Risks of Foundation Models.',
      'NIST. (2023). Artificial Intelligence Risk Management Framework 1.0.',
      'UNESCO. (2023). Guidance for Generative AI in Education and Research.',
    ],
    note: 'References · 원리와 책임 있는 활용을 위한 핵심 자료입니다.',
  },
  26: {
    items: [
      { t: '다음 주제', d: 'AI 에이전트와 업무 자동화' },
      { t: '연결 고리', d: '프롬프트 한 번에서 여러 단계의 실행 흐름으로 확장' },
      { t: '예습 질문', d: 'AI에게 도구 사용 권한을 줄 때 어떤 중단 조건이 필요할까?' },
    ],
    note: '다음 교시 · 생성형 AI의 결과에서 에이전트의 행동으로 범위를 넓힙니다.',
  },
  27: {
    items: ['실제 업무 한 가지와 기대 결과 정의', 'AI에 맡길 단계와 사람이 맡을 단계 구분', '사용한 프롬프트와 검증 근거 첨부', '개인정보·저작권·오류 대응 기준 포함'],
    note: '과제 안내 · 결과물보다 협업 과정과 검증 근거를 평가합니다.',
  },
  28: { big: 'AI는 사고를 확장하는 파트너입니다', small: '생성은 AI와 함께, 판단과 책임은 사람이 맡습니다' },
};

const BPBulletList = ({ body }) => (
  <div className="bp-bullets">
    <div className="bp-bullets-rail"></div>
    {[
      ['요청을 구체적으로', '대상과 원하는 결과를 분명히 합니다.'],
      ['맥락과 자료를 충분히', '모델이 추측할 빈칸을 줄입니다.'],
      ['제약과 형식을 명시', '길이·범위·표현 방식을 지정합니다.'],
      ['한 번에 끝내지 않기', '피드백과 검증으로 결과를 개선합니다.'],
    ].map(([title, detail], index) => (
      <div className="ct-item bp-bullet" key={title}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong className="ct-text">{title}</strong>
        <p className="ct-text">{detail}</p>
      </div>
    ))}
  </div>
);

const BPSemanticPairs = ({ body }) => (
  <div className="bp-semantic">
    {body.pairs.map(([left, right], row) => (
      <div className="ct-item bp-semantic-row" key={left}>
        <strong className="ct-text">{left}</strong>
        <div className="bp-semantic-scale">
          {[1, 2, 3, 4, 5, 6, 7].map(value => <span className={value === row + 2 ? 'active' : ''} key={value}>{value}</span>)}
        </div>
        <strong className="ct-text">{right}</strong>
      </div>
    ))}
    <div className="bp-semantic-caption">{body.caption.map(label => <span key={label}>{label}</span>)}</div>
  </div>
);

const BPBarChart = ({ body }) => {
  const maximum = Math.max(...body.bars.map(bar => bar.v));
  return (
    <div className="bp-bars">
      <div className="bp-bars-axis"><span>{body.unit}</span><span>높음</span></div>
      {body.bars.map((bar, index) => (
        <div className="ct-item bp-bar-row" key={bar.label}>
          <strong className="ct-text">{bar.label}</strong>
          <div className="bp-bar-track"><span className={`bp-bar-fill tone-${index % 2 ? 'cobalt' : 'cyan'}`} style={{width: `${(bar.v / maximum) * 100}%`}}></span></div>
          <b>{bar.v}</b>
        </div>
      ))}
    </div>
  );
};

const BPEquation = ({ body }) => (
  <div className="bp-equation">
    {body.steps.map((step, index) => (
      <React.Fragment key={step}>
        {index > 0 && <span className="bp-equation-op">{body.ops[index - 1]}</span>}
        <BPNode index={index + 1} title={step} detail={body.details[index]} tone={['ink', 'cyan', 'cobalt', 'cyan-light'][index]} />
      </React.Fragment>
    ))}
    <div className="bp-equation-notes">{body.notes.map(note => <span key={note}>{note}</span>)}</div>
  </div>
);

const BPReliabilityCurve = ({ body }) => (
  <div className="bp-curve">
    <div className="bp-curve-chart">
      <div className="bp-curve-y">{body.y}</div>
      <div className="bp-curve-x">{body.x}</div>
      <svg viewBox="0 0 900 420" role="img" aria-label="피드백과 검증을 반복할수록 결과가 선명해지지만 개선 폭은 점차 완만해지는 개념 곡선">
        <path className="bp-curve-grid" d="M80 40V360H850M80 120H850M80 200H850M80 280H850"/>
        <path className="bp-curve-line" d="M90 330 C200 180 350 120 520 92 C650 72 760 66 840 62"/>
        {body.bars.map((bar, index) => <circle key={bar.label} cx={110 + index * 170} cy={330 - (bar.v - 50) * 6} r="13" className={index < 2 ? 'cyan' : 'cobalt'}/>) }
      </svg>
    </div>
    <BPPanel eyebrow="ITERATION" title={body.panelTitle} tone="cobalt-wash">{body.panelBody}</BPPanel>
  </div>
);

const BPTree = ({ body }) => (
  <div className="bp-tree">
    <BPNode index={1} title={body.root} tone="ink" />
    <BPConnector vertical />
    <div className="bp-tree-branches">
      {body.mids.map((item, index) => <BPNode key={item} index={index + 2} title={item} detail="차원별 2~3문항" tone={index === 1 ? 'cobalt' : 'cyan'} />)}
    </div>
    <BPConnector vertical />
    <BPPanel eyebrow="HUMAN CHECKPOINT" title={body.leaf} tone="neutral">{body.note}</BPPanel>
  </div>
);

const BPDataTable = ({ body }) => (
  <div className="bp-table-wrap ct-item">
    <table className="bp-table">
      <thead><tr>{body.head.map((header, index) => <th className="ct-text" key={`${header}-${index}`}>{header}</th>)}</tr></thead>
      <tbody>{body.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td className="ct-text" key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const BPActivity = () => {
  const stages = [
    ['업무 선택', '반복되는 실제 과제'],
    ['역할 분담', 'AI와 사람이 맡을 단계'],
    ['요청 설계', '목표·맥락·제약·형식'],
    ['검증 계획', '근거·품질·최종 승인'],
  ];
  return (
    <div className="bp-activity">
      <div className="bp-activity-prompt"><span>WORKSHOP</span><strong>하나의 업무를<br/>검증 가능한 AI 협업으로</strong></div>
      <div className="bp-activity-steps">
        {stages.map(([title, detail], index) => (
          <React.Fragment key={title}>
            <BPNode index={index + 1} title={title} detail={detail} tone={['cyan', 'cobalt', 'ink', 'cyan-light'][index]} />
            {index < stages.length - 1 && <BPConnector />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const BPKanban = ({ body }) => (
  <div className="bp-kanban">
    {body.cols.map((column, index) => (
      <div className={`ct-item bp-kanban-column tone-${index === 1 ? 'cobalt' : 'cyan'}`} key={column.t}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong className="ct-text">{column.t}</strong>
        {column.cards.map(card => <p className="ct-text" key={card}>{card}</p>)}
      </div>
    ))}
  </div>
);

const BPMidContent = ({ slide, deck, instructorLive }) => {
  const body = BP_SLIDE_BODIES[slide.n];
  let content;
  switch (slide.n) {
    case 9: content = <BPBulletList body={body} />; break;
    case 10: content = <BPSemanticPairs body={body} />; break;
    case 11: content = <BPBarChart body={body} />; break;
    case 12: content = <BPEquation body={body} />; break;
    case 13: content = <BPReliabilityCurve body={body} />; break;
    case 14: content = <BPTree body={body} />; break;
    case 15: content = <BPDataTable body={body} />; break;
    case 16: content = <BPActivity />; break;
    case 17: content = <BPDataTable body={body} />; break;
    case 18: content = <BPKanban body={body} />; break;
    default: content = null;
  }
  return <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note={body?.note || slide.subtitle}>{content}</BPShell>;
};
