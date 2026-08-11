const BPDiagnostic = ({ slide, deck, instructorLive }) => {
  const prompts = [
    ['사용 경험', '어떤 업무에 써 보았나?'],
    ['생성 원리', 'AI는 어떻게 답을 만들까?'],
    ['결과 검증', '무엇을 확인해야 믿을까?'],
    ['사람의 역할', '어디까지 직접 판단할까?'],
  ];
  return (
    <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="학습 전 진단 · 익숙한 AI 경험을 오늘의 협업 기준과 연결합니다.">
      <div className="bp-diagnostic">
        <div className="bp-diagnostic-question ct-item">
          <span>START</span>
          <strong className="ct-text">AI와 제대로 협업하려면<br/>무엇을 맡기고 확인해야 할까?</strong>
        </div>
        <div className="bp-diagnostic-grid">
          {prompts.map(([title, detail], index) => (
            <BPPanel key={title} eyebrow={String(index + 1).padStart(2, '0')} title={title} tone={index % 2 ? 'cobalt-wash' : 'cyan-wash'}>{detail}</BPPanel>
          ))}
        </div>
      </div>
    </BPShell>
  );
};

const BPObjectives = ({ slide, deck, instructorLive }) => {
  const outcomes = [
    ['생성 원리 이해', '입력에서 출력까지 설명'],
    ['요청 구조화', '다섯 요소로 프롬프트 설계'],
    ['결과 검증', '근거·오류·편향을 확인'],
    ['책임 있는 활용', '사람과 AI의 역할을 구분'],
  ];
  return (
    <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="학습 목표 · 이해 → 설계 → 검증 → 책임의 순서로 학습합니다.">
      <div className="bp-learning-path">
        <div className="bp-stage-label">학습 결과</div>
        <div className="bp-path-claim">결과를 빠르게 만드는 데서 끝나지 않고,<br/>근거와 책임까지 확인합니다.</div>
        <div className="bp-path-line"></div>
        {outcomes.map(([title, detail], index) => (
          <div className="bp-path-item" key={title}>
            <BPNode index={index + 1} title={title} detail={detail} tone={['cyan', 'cobalt', 'ink', 'cyan-light'][index]} />
          </div>
        ))}
      </div>
    </BPShell>
  );
};

const BPRoadmap = ({ slide, deck, instructorLive }) => {
  const steps = [
    ['이해', '생성형 AI의 원리', '10분'],
    ['설계', '프롬프트와 역할 분담', '15분'],
    ['실습', '업무 협업 흐름 만들기', '15분'],
    ['확인', '위험 점검과 평가', '10분'],
  ];
  return (
    <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="교시 로드맵 · 원리를 이해하고 직접 설계한 뒤 활용 기준을 확인합니다.">
      <div className="bp-roadmap">
        <div className="bp-roadmap-intro"><span>50 MINUTES</span><strong>AI 사용 경험을<br/>협업 역량으로 바꿉니다.</strong></div>
        <div className="bp-roadmap-steps">
          {steps.map(([label, title, time], index) => (
            <React.Fragment key={label}>
              <BPNode index={index + 1} title={title} detail={`${label} · ${time}`} tone={['cyan', 'cobalt', 'ink', 'cyan-light'][index]} />
              {index < steps.length - 1 && <BPConnector />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </BPShell>
  );
};

const BPConcept = ({ slide, deck, instructorLive }) => (
  <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="생성의 원리 · 모델은 학습한 패턴과 현재 입력을 바탕으로 다음 결과를 구성합니다.">
    <div className="bp-concept">
      <div className="bp-concept-formula">
        <BPNode index={1} title="학습된 패턴" detail="텍스트 · 이미지 · 코드" tone="cyan" />
        <BPConnector label="입력과 결합" />
        <BPNode index={2} title="생성 모델" detail="확률적으로 다음 요소 예측" tone="cobalt" />
        <BPConnector label="구성" />
        <BPNode index={3} title="새로운 결과" detail="초안 · 요약 · 아이디어" tone="ink" />
      </div>
      <div className="bp-concept-bottom">
        <BPPanel eyebrow="KEY IDEA" title="AI의 결과는 검색된 정답이 아니라 생성된 예측입니다" tone="neutral">자연스러운 문장과 사실의 정확성은 서로 다른 문제입니다.</BPPanel>
        <BPPanel eyebrow="WHY IT MATTERS" title="그럴듯함보다 근거를 확인해야 합니다" tone="cyan-wash">중요한 사실·수치·인용은 신뢰할 수 있는 출처와 대조합니다.</BPPanel>
      </div>
    </div>
  </BPShell>
);

const BPLevels = ({ slide, deck, instructorLive }) => {
  const levels = [
    ['규칙 기반', '정해진 조건', '명시된 규칙을 실행'],
    ['머신러닝', '패턴 학습', '데이터에서 분류·예측'],
    ['딥러닝', '표현 학습', '복잡한 특징을 자동 추출'],
    ['생성형 AI', '새 결과 생성', '텍스트·이미지·코드 구성'],
  ];
  return (
    <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="AI의 발전 · 규칙 실행에서 데이터 학습을 거쳐 새로운 결과 생성으로 역할이 확장됩니다.">
      <div className="bp-levels">
        <div className="bp-levels-axis"><span>정해진 규칙 실행</span><span>새로운 결과 생성</span></div>
        <div className="bp-levels-line"></div>
        {levels.map(([title, detail, example], index) => (
          <BPNode key={title} index={index + 1} title={title} detail={`${detail} · ${example}`} tone={['cyan', 'cobalt', 'ink', 'cyan-light'][index]} />
        ))}
      </div>
    </BPShell>
  );
};

const BPLikert = ({ slide, deck, instructorLive }) => {
  const scores = ['목표', '맥락', '자료', '제약', '출력 형식'];
  return (
    <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="프롬프트 구조 · 다섯 요소를 한 번에 제시하면 결과의 방향과 검토 기준이 선명해집니다.">
      <div className="bp-likert">
        <div className="bp-likert-question ct-item ct-text">“신입 구성원을 위한 AI 보안 안내문을 5개 항목으로 작성해 줘.”</div>
        <div className="bp-likert-scale">
          {scores.map((label, index) => (
            <div className="bp-likert-point ct-item" key={label}>
              <span className={index === 4 ? 'active' : ''}>{index + 1}</span>
              <strong className="ct-text">{label}</strong>
            </div>
          ))}
        </div>
        <div className="bp-likert-sum"><span>명확한 요청</span><strong>구조화된 프롬프트</strong><span>검토 가능한 결과</span></div>
      </div>
    </BPShell>
  );
};

const BPComparison = ({ slide, deck, instructorLive }) => (
  <BPShell slide={slide} deck={deck} instructorLive={instructorLive} note="역할 분담 · AI의 생성 속도와 사람의 검증 책임을 결합할 때 결과가 업무에 쓰일 수 있습니다.">
    <div className="bp-comparison">
      <BPPanel eyebrow="AI STRENGTH" title="빠른 생성" tone="cyan-wash">대안을 넓히고 초안을 빠르게 만드는가</BPPanel>
      <div className="bp-target bp-target-cyan"><span></span><span></span><span></span><i></i></div>
      <div className="bp-comparison-sign">+</div>
      <BPPanel eyebrow="HUMAN ROLE" title="근거 검증" tone="cobalt-wash">사실·맥락·영향을 책임 있게 판단하는가</BPPanel>
      <div className="bp-target bp-target-cobalt"><span></span><span></span><span></span><i></i></div>
      <div className="bp-comparison-result"><strong>좋은 AI 협업</strong><span>빠르면서도 검토 가능한 결과</span></div>
    </div>
  </BPShell>
);
