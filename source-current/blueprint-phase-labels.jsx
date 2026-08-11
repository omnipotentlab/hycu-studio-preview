const BP_PHASE_LABELS = {
  '—': 'OPENING',
  A: 'ANALYSIS',
  D: 'DESIGN',
  Dv: 'DEVELOPMENT',
  I: 'IMPLEMENTATION',
  E: 'EVALUATION',
};

const BP_PHASE_NAMES = {
  '—': '도입',
  A: '분석',
  D: '설계',
  Dv: '개발',
  I: '실행',
  E: '평가',
};

const BP_GENERATED_VISUALS = {
  cover: {
    src: window.HYCU_GENERATED_VISUAL_URLS.cover,
    alt: '맞물린 기어와 디지털 회로가 미래 도시로 이어지고, 사람들이 빛나는 데이터 경로를 따라 전진하는 생성형 일러스트레이션',
  },
  closing: {
    src: window.HYCU_GENERATED_VISUAL_URLS.closing,
    alt: '왼쪽의 산업용 로봇과 오른쪽의 창의적 로봇이 제작과 사고의 두 방식을 대비해 보여주는 생성형 일러스트레이션',
  },
};

const BPMeta = ({ slide, deck }) => (
  <div className="header bp-meta">
    <div className="logo bp-wordmark">HYCU</div>
    <div className="chapter-indicator bp-breadcrumb">
      <span>{deck.subject}</span><span>/</span><span>{deck.chapter}</span><span>/</span>
      <strong>{String(slide.n).padStart(2, '0')} {BP_PHASE_LABELS[slide.phase] || 'LECTURE'}</strong>
    </div>
    <div className="addie bp-phase" aria-label={`ADDIE ${BP_PHASE_NAMES[slide.phase] || '도입'} 단계`}>
      <span>{BP_PHASE_NAMES[slide.phase] || '도입'}</span>
    </div>
    <div className="bp-page"><strong>{String(slide.n).padStart(2, '0')}</strong><span>/</span><span>{String(deck.totalSlides).padStart(2, '0')}</span></div>
  </div>
);

const BPTitle = ({ title, subtitle }) => (
  <div className="title-block bp-title-block">
    <h1 className="title ct-text">{title}</h1>
    {subtitle && <p className="subtitle ct-text">{subtitle}</p>}
    <div className="accent bp-title-rule"></div>
  </div>
);

const BPFooter = ({ slide, deck, note }) => (
  <div className="footer bp-footer">
    <div className="bp-footer-rule"></div>
    <div className="meta"><strong>{deck.subject}</strong><span>·</span><span>{note || slide.subtitle}</span></div>
    <div className="pageno">HYCU AI STUDIO</div>
  </div>
);

const BPSafeZone = ({ live }) => {
  if (!live) return null;
  const config = typeof live === 'object' ? live : {};
  const position = config.position || 'br';
  const scale = config.scale || 1;
  const offset = typeof position === 'object' ? position : {};
  const style = {
    transform: `translate(${offset.x || 0}px, ${offset.y || 0}px) scale(${scale})`,
    transformOrigin: position === 'bl' ? 'bottom left' : 'bottom right',
    ...(position === 'bl' ? { left: 30, right: 'auto' } : {}),
  };
  return (
  <div className="instructor-zone live bp-instructor" style={style}>
    <div className="bp-instructor-avatar">홍</div>
    <strong>홍길동 교수</strong>
    <span>크로마키 합성 영역</span>
  </div>
  );
};

const BPShell = ({ slide, deck, children, note, instructorLive = false, className = '' }) => (
  <div className={`bp-shell ${className}`}>
    <BPMeta slide={slide} deck={deck} />
    <BPTitle title={slide.title} subtitle={slide.subtitle} />
    <div className="bp-stage">{children}</div>
    <BPFooter slide={slide} deck={deck} note={note} />
  </div>
);

const BPNode = ({ index, title, detail, tone = 'cyan', className = '' }) => (
  <div className={`ct-item bp-node bp-tone-${tone} ${className}`}>
    {index != null && <span className="bp-node-index">{String(index).padStart(2, '0')}</span>}
    <strong className="ct-text">{title}</strong>
    {detail && <span className="ct-text">{detail}</span>}
  </div>
);

const BPPanel = ({ eyebrow, title, children, tone = 'neutral', className = '' }) => (
  <div className={`ct-item bp-panel bp-tone-${tone} ${className}`}>
    {eyebrow && <span className="bp-eyebrow ct-text">{eyebrow}</span>}
    {title && <strong className="bp-panel-title ct-text">{title}</strong>}
    {children && <div className="bp-panel-body ct-text">{children}</div>}
  </div>
);

const BPConnector = ({ label, tone = 'ink', vertical = false }) => (
  <div className={`bp-connector bp-tone-${tone}${vertical ? ' vertical' : ''}`} aria-hidden="true">
    {label && <span>{label}</span>}
  </div>
);

const BPChip = ({ children, tone = 'neutral' }) => <span className={`ct-text bp-chip bp-tone-${tone}`}>{children}</span>;

const BPGeneratedVisual = ({ asset, variant, caption }) => (
  <figure className={`ct-item bp-generated-visual bp-generated-visual-${variant}`}>
    <div className="bp-generated-media">
      <img src={asset.src} width="1024" height="1024" alt={asset.alt} data-generated-source="hycu-source-deck" draggable="false" />
      <i className="bp-generated-registration" aria-hidden="true"></i>
    </div>
    <figcaption><span>AI GENERATED VISUAL · SOURCE DECK</span><p className="ct-text">{caption}</p></figcaption>
  </figure>
);

const BPCover = ({ slide, deck }) => (
  <div className="bp-cover">
    <div className="bp-cover-meta"><strong>HYCU</strong><span>/</span><span>{deck.subject}</span><span>/</span><span>{deck.week}주차</span></div>
    <div className="bp-cover-number">01 / {String(deck.totalSlides).padStart(2, '0')}</div>
    <div className="bp-cover-main">
      <span className="bp-cover-kicker">GENERATIVE AI · HUMAN COLLABORATION</span>
      <h1 className="ct-text">{(slide.titleLines || [slide.title]).map((line, index) => <React.Fragment key={line}>{index > 0 && <br/>}{line}</React.Fragment>)}</h1>
      <p className="ct-text">{slide.subtitle}</p>
    </div>
    <BPGeneratedVisual asset={BP_GENERATED_VISUALS.cover} variant="cover" caption="데이터·모델·사람이 연결되며 새로운 업무 흐름을 만드는 장면" />
    <div className="bp-cover-path">
      {['원리 이해', '요청 설계', '결과 검증', '책임 있는 활용'].map((label, index) => (
        <React.Fragment key={label}>
          <BPNode index={index + 1} title={label} tone={['cyan', 'cobalt', 'ink', 'cyan-light'][index]} />
          {index < 3 && <BPConnector />}
        </React.Fragment>
      ))}
    </div>
    <div className="bp-cover-owner"><strong>{deck.professor}</strong><span>{deck.affiliation}</span></div>
  </div>
);
