// ----- Content Development Info — sub-tab of Step 1 -----
// 학습 Flow 구성 + 템플릿/폰트/기타 디자인 설정

const ContentDev = () => {
  const [tplCategory, setTplCategory] = React.useState('dept');
  const [tplSelected, setTplSelected] = React.useState('cyan-modern');
  const [fontSel, setFontSel] = React.useState('hycu-gothic');
  const [coverStyle, setCoverStyle] = React.useState('hero-image');
  const [accentColor, setAccentColor] = React.useState('cyan');
  const [logoPos, setLogoPos] = React.useState('top-left');

  return (
    <div>
      {/* === 학습 Flow 구성 === */}
      <div className="card" style={{padding: 22, marginBottom: 18}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14}}>
          <CDCardTitle>학습 Flow 구성</CDCardTitle>
          <div style={{fontSize:12, color: 'var(--admin-muted)'}}>각 단계별 활동을 선택하거나 직접 입력하세요 · ADDIE 단계 자동 매핑</div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
          <FlowColumn
            phase="준비하기"
            phaseNum="01"
            phaseColor="#0091B8"
            items={[
              { label: '오리엔테이션', addie: 'A' },
              { label: '학습목표 및 학습목차 제시', addie: 'D' },
              { label: '동기 사례(인트로) 제시', addie: 'D' },
            ]}
          />
          <FlowColumn
            phase="학습하기"
            phaseNum="02"
            phaseColor="#1B2C3F"
            items={[
              { label: '본학습', addie: 'Dv' },
              { label: '형성평가', addie: 'E' },
              { label: '심화학습', addie: 'I' },
            ]}
          />
          <FlowColumn
            phase="정리하기"
            phaseNum="03"
            phaseColor="#5A6B7E"
            items={[
              { label: '학습정리', addie: 'E' },
              { label: '출처 및 참고문헌', addie: null },
              { label: '다음교시 예고', addie: 'A' },
            ]}
          />
        </div>

        {/* ADDIE 분포 미니 막대 */}
        <AddieDistributionBar/>

        {/* Guide callout */}
        <div style={{marginTop: 16, padding: '14px 16px', background: '#FFF8E6', border: '1px solid #F5C842', borderRadius: 6, display: 'flex', gap: 12, alignItems: 'flex-start'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink: 0, marginTop: 1}}>
            <circle cx="12" cy="12" r="10" fill="#F5A623"/>
            <path d="M12 8v5M12 16v.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <div style={{fontSize:13, lineHeight: 1.65, color: '#7A5800'}}>
            <strong style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 700}}>제작 가이드</strong> · 텍스트 중심보다 이미지·도형·도식화하여 제시 · 프린트 시 토너 절감을 위한 화이트 배경 디자인 · 주차당 PPT 장수는 <strong style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 700}}>50페이지</strong>가 넘지 않도록 구성
          </div>
        </div>
      </div>

      {/* === 디자인 및 UI === */}
      <div className="card" style={{padding: 22, marginBottom: 18}}>
        <CDCardTitle>디자인 및 UI</CDCardTitle>

        {/* Sub-section: 템플릿 디자인 */}
        <SubSection title="템플릿 디자인" hint="학과별 또는 과목별 기본 템플릿을 선택하세요">
          {/* Category toggle */}
          <div style={{display: 'inline-flex', background: 'var(--admin-bg)', borderRadius: 6, padding: 3, marginBottom: 14}}>
            {[
              {k: 'dept', l: '학과별'},
              {k: 'course', l: '과목별'},
              {k: 'custom', l: '커스텀'},
            ].map(t => (
              <button key={t.k} onClick={() => setTplCategory(t.k)} style={{
                padding: '6px 16px', border: 'none', cursor: 'pointer',
                background: tplCategory === t.k ? 'white' : 'transparent',
                color: tplCategory === t.k ? 'var(--admin-ink)' : 'var(--admin-muted)',
                fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700,
                borderRadius: 4, boxShadow: tplCategory === t.k ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'}}>{t.l}</button>
            ))}
          </div>

          {/* Template gallery */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14}}>
            {TEMPLATES[tplCategory].map(t => (
              <TemplateCard key={t.id} t={t} selected={tplSelected === t.id} onSelect={() => setTplSelected(t.id)}/>
            ))}
          </div>
        </SubSection>

        {/* Sub-section: 폰트 */}
        <SubSection title="폰트" hint="제목과 본문에 사용할 한글 폰트를 선택하세요">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
            {FONTS.map(f => (
              <FontCard key={f.id} f={f} selected={fontSel === f.id} onSelect={() => setFontSel(f.id)}/>
            ))}
          </div>
        </SubSection>

        {/* Sub-section: 기타 */}
        <SubSection title="기타" hint="액센트 컬러·로고 위치 등 부가 옵션">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'start'}}>
            {/* Accent color */}
            <OptionGroup label="액센트 컬러">
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                {ACCENTS.map(c => (
                  <button key={c.id} onClick={() => setAccentColor(c.id)} title={c.label} style={{
                    width: 38, height: 38, borderRadius: 8, border: accentColor === c.id ? '2px solid var(--admin-ink)' : '1px solid var(--admin-line)',
                    background: c.color, cursor: 'pointer', position: 'relative', padding: 0}}>
                    {accentColor === c.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </OptionGroup>

            {/* Cover style */}
            <OptionGroup label="표지 스타일">
              <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                {[
                  {id: 'hero-image', l: '히어로 이미지형'},
                  {id: 'minimal-text', l: '미니멀 텍스트형'},
                  {id: 'grid-photo', l: '그리드 포토형'},
                ].map(o => (
                  <label key={o.id} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize:13}}>
                    <input type="radio" name="cover" checked={coverStyle === o.id} onChange={() => setCoverStyle(o.id)} style={{accentColor: 'var(--hycu-cyan-deep)'}}/>
                    <span style={{color: 'var(--admin-ink)'}}>{o.l}</span>
                  </label>
                ))}
              </div>
            </OptionGroup>

            {/* Logo position */}
            <OptionGroup label="로고 위치">
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: 6}}>
                {[
                  {id: 'top-left', y: 0, x: 0},
                  {id: 'top-center', y: 0, x: 1},
                  {id: 'top-right', y: 0, x: 2},
                  {id: 'bottom-left', y: 1, x: 0},
                  {id: 'bottom-center', y: 1, x: 1},
                  {id: 'bottom-right', y: 1, x: 2},
                ].map(p => (
                  <button key={p.id} onClick={() => setLogoPos(p.id)} style={{
                    width: 44, height: 28, padding: 0, cursor: 'pointer',
                    background: 'white', border: logoPos === p.id ? '2px solid var(--hycu-cyan-deep)' : '1px solid var(--admin-line)', borderRadius: 4,
                    position: 'relative'}}>
                    <div style={{
                      position: 'absolute', width: 10, height: 4, background: logoPos === p.id ? 'var(--hycu-cyan-deep)' : '#B8C2CC', borderRadius: 1,
                      top: p.y === 0 ? 3 : 'auto', bottom: p.y === 1 ? 3 : 'auto',
                      left: p.x === 0 ? 4 : p.x === 1 ? '50%' : 'auto', right: p.x === 2 ? 4 : 'auto',
                      transform: p.x === 1 ? 'translateX(-50%)' : 'none'}}/>
                  </button>
                ))}
              </div>
            </OptionGroup>
          </div>
        </SubSection>
      </div>
    </div>
  );
};

// ===== Subcomponents =====

const CDCardTitle = ({ children }) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
    <span style={{width: 3, height: 16, background: 'var(--hycu-cyan-deep)', borderRadius: 1}}></span>
    <h3 style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 15, margin: 0, fontWeight: 700, color: 'var(--admin-ink)'}}>{children}</h3>
  </div>
);

const SubSection = ({ title, hint, children }) => (
  <div style={{paddingTop: 14, paddingBottom: 18, borderTop: '1px solid var(--admin-line)', marginTop: 18}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14}}>
      <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:14, fontWeight: 700, color: 'var(--admin-ink)', letterSpacing: '-0.01em'}}>{title}</div>
      <div style={{fontSize:12, color: 'var(--admin-muted)'}}>{hint}</div>
    </div>
    {children}
  </div>
);

const OptionGroup = ({ label, children }) => (
  <div>
    <div style={{fontSize: 11, color: 'var(--admin-muted)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 10, textTransform: 'uppercase'}}>{label}</div>
    {children}
  </div>
);

const ADDIE_INFO = {
  A:  { label: 'A',  full: 'Analysis',       ko: '분석', color: '#6A4FB7' },
  D:  { label: 'D',  full: 'Design',         ko: '설계', color: '#1971C2' },
  Dv: { label: 'Dv', full: 'Development',    ko: '개발', color: '#00B5E2' },
  I:  { label: 'I',  full: 'Implementation', ko: '실행', color: '#2FA76A' },
  E:  { label: 'E',  full: 'Evaluation',     ko: '평가', color: '#C25C19' }};

const AddieChip = ({ k }) => {
  const info = ADDIE_INFO[k];
  if (!info) return null;
  return (
    <span title={`${info.full} · ${info.ko}`} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace,monospace', fontSize: 9.5, fontWeight: 700,
      padding: '2px 6px', borderRadius: 4, lineHeight: 1,
      background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}33`}}>{info.label}</span>
  );
};

const AddieDistributionBar = () => {
  // Static derivation matching the default checked activities above
  const counts = { A: 2, D: 2, Dv: 1, I: 1, E: 2 };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div style={{marginTop: 18, padding: '14px 16px', background: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-line)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
        <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--admin-ink)'}}>
          선택된 활동의 ADDIE 분포
          <span style={{marginLeft: 8, fontWeight: 500, color: 'var(--admin-muted)', fontSize: 11}}>한 교시 안에 5단계가 어떻게 분포되는지를 보여줍니다</span>
        </div>
        <div style={{fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--admin-muted)'}}>총 {total} 활동</div>
      </div>
      <div style={{display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', background: 'white', border: '1px solid var(--admin-line)'}}>
        {['A','D','Dv','I','E'].map(k => {
          const n = counts[k]; if (!n) return null;
          return <div key={k} title={`${ADDIE_INFO[k].full} ${n}`} style={{flex: n, background: ADDIE_INFO[k].color}}></div>;
        })}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize:11}}>
        {['A','D','Dv','I','E'].map(k => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 5}}>
            <span style={{width: 8, height: 8, borderRadius: 2, background: ADDIE_INFO[k].color, display: 'inline-block'}}></span>
            <span style={{color: 'var(--admin-ink)', fontWeight: 600}}>{ADDIE_INFO[k].label}</span>
            <span style={{color: 'var(--admin-muted)'}}>{ADDIE_INFO[k].ko}</span>
            <span style={{fontFamily: 'ui-monospace,monospace', color: 'var(--admin-muted)'}}>· {counts[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlowColumn = ({ phase, phaseNum, phaseColor, items }) => {
  const [checked, setChecked] = React.useState(items.map(() => true));
  const [customText, setCustomText] = React.useState('');
  const toggle = i => {
    const next = [...checked]; next[i] = !next[i]; setChecked(next);
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {/* Phase header */}
      <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: phaseColor, borderRadius: 6, color: 'white'}}>
        <span style={{fontFamily: 'ui-monospace,monospace', fontSize: 11, fontWeight: 700, opacity: 0.7}}>{phaseNum}</span>
        <span style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em'}}>{phase}</span>
      </div>
      {/* Items */}
      {items.map((item, i) => (
        <label key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'white', border: '1px solid var(--admin-line)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s'}}>
          <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} style={{accentColor: 'var(--hycu-cyan-deep)', width: 14, height: 14, cursor: 'pointer', flexShrink: 0}}/>
          <span style={{flex: 1, fontSize:13, color: 'var(--admin-ink)', fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 600}}>{item.label}</span>
          {item.addie && <AddieChip k={item.addie}/>}
        </label>
      ))}
      {/* Custom input */}
      <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--admin-bg)', border: '1px dashed var(--admin-line)', borderRadius: 6}}>
        <svg width="14" height="14" viewBox="0 0 24 24" style={{flexShrink: 0}}>
          <path d="M12 5v14M5 12h14" stroke="var(--admin-muted)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="직접 입력하기"
          style={{flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize:13, color: 'var(--admin-ink)', fontFamily: 'inherit'}}
        />
      </div>
    </div>
  );
};

const TemplateCard = ({ t, selected, onSelect }) => (
  <div onClick={onSelect} style={{
    border: selected ? '2px solid var(--hycu-cyan-deep)' : '1px solid var(--admin-line)',
    borderRadius: 8, padding: selected ? 7 : 8, cursor: 'pointer',
    background: 'white', position: 'relative', transition: 'all 0.15s'}}>
    {/* Thumbnail */}
    <div style={{width: '100%', aspectRatio: '16/10', borderRadius: 4, background: t.bg, position: 'relative', overflow: 'hidden', marginBottom: 10}}>
      {/* Mock slide content */}
      <div style={{position: 'absolute', top: 8, left: 10, width: 14, height: 4, background: t.accent, borderRadius: 1}}/>
      <div style={{position: 'absolute', top: 18, left: 10, right: 10, height: 7, background: t.text || 'rgba(255,255,255,0.85)', borderRadius: 1}}/>
      <div style={{position: 'absolute', top: 30, left: 10, width: '60%', height: 4, background: t.text || 'rgba(255,255,255,0.6)', borderRadius: 1, opacity: 0.7}}/>
      {/* Accent shape */}
      {t.shape === 'circle' && <div style={{position: 'absolute', bottom: -8, right: -8, width: 38, height: 38, borderRadius: '50%', background: t.accent, opacity: 0.6}}/>}
      {t.shape === 'bar' && <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: t.accent}}/>}
      {t.shape === 'corner' && <div style={{position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 0 22px 22px', borderColor: `transparent transparent ${t.accent} transparent`}}/>}
    </div>
    {/* Meta */}
    <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'var(--admin-ink)', marginBottom: 2}}>{t.name}</div>
    <div style={{fontSize: 11, color: 'var(--admin-muted)'}}>{t.meta}</div>
    {/* Check */}
    {selected && (
      <div style={{position: 'absolute', top: 14, right: 14, width: 20, height: 20, borderRadius: '50%', background: 'var(--hycu-cyan-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="11" height="11" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    )}
  </div>
);

const FontCard = ({ f, selected, onSelect }) => (
  <div onClick={onSelect} style={{
    border: selected ? '2px solid var(--hycu-cyan-deep)' : '1px solid var(--admin-line)',
    borderRadius: 8, padding: selected ? 13 : 14, cursor: 'pointer', background: 'white',
    position: 'relative'}}>
    <div style={{fontFamily: f.preview, fontSize: 22, fontWeight: 700, color: 'var(--admin-ink)', marginBottom: 6, letterSpacing: '-0.02em'}}>가나다 Aa 한양</div>
    <div style={{fontFamily: f.preview, fontSize:13, color: 'var(--admin-muted)', marginBottom: 10, lineHeight: 1.4}}>현대 사회의 변화와 학습의 방향</div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--admin-bg)'}}>
      <div>
        <div style={{fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontSize:13, fontWeight: 700, color: 'var(--admin-ink)'}}>{f.name}</div>
        <div style={{fontSize:11, color: 'var(--admin-muted)', marginTop: 2}}>{f.weights}</div>
      </div>
      {f.recommended && <div style={{fontSize: 9.5, color: '#0091B8', background: 'rgba(0,145,184,0.1)', padding: '2px 7px', borderRadius: 3, fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif', fontWeight: 700, letterSpacing: '0.04em'}}>RECOMMENDED</div>}
    </div>
    {selected && (
      <div style={{position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--hycu-cyan-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    )}
  </div>
);

// ===== Mock data =====
const TEMPLATES = {
  dept: [
    { id: 'cyan-modern', name: '경영학과 기본형', meta: '경영·마케팅 계열', bg: 'linear-gradient(135deg, #E6F5FA, #C5E8F3)', accent: '#0091B8', text: '#1B2C3F', shape: 'bar' },
    { id: 'ink-bold', name: '경제학부 학술형', meta: '경제·금융 계열', bg: 'linear-gradient(135deg, #1B2C3F, #2A3D52)', accent: '#7DD8EE', shape: 'circle' },
    { id: 'soft-pastel', name: '교육학과 친화형', meta: '교육·사범 계열', bg: 'linear-gradient(135deg, #FFF3E6, #FCE0C2)', accent: '#F5A623', text: '#5A3A0E', shape: 'corner' },
    { id: 'tech-grid', name: '컴퓨터공학과', meta: '공학·이학 계열', bg: 'linear-gradient(135deg, #1B2C3F, #0091B8)', accent: '#7DD8EE', shape: 'bar' },
  ],
  course: [
    { id: 'cyan-modern', name: 'AI 리터러시 분석형', meta: 'AIG101 권장', bg: 'linear-gradient(135deg, #E6F5FA, #ffffff)', accent: '#0091B8', text: '#1B2C3F', shape: 'corner' },
    { id: 'data-viz', name: '데이터 시각화형', meta: '통계·분석 과목', bg: 'linear-gradient(135deg, #F0F4F8, #D6E4F0)', accent: '#0091B8', text: '#1B2C3F', shape: 'bar' },
    { id: 'case-study', name: '사례 중심형', meta: '실무 사례 과목', bg: 'linear-gradient(135deg, #FFF8E6, #FAE4B5)', accent: '#F26B1C', text: '#5A3A0E', shape: 'circle' },
    { id: 'minimal', name: '미니멀 화이트', meta: '범용 사용', bg: '#FFFFFF', accent: '#1B2C3F', text: '#1B2C3F', shape: 'bar' },
  ],
  custom: [
    { id: 'cyan-modern', name: '나의 템플릿 1', meta: '2024.09.12 저장', bg: 'linear-gradient(135deg, #E6F5FA, #7DD8EE)', accent: '#0091B8', text: '#1B2C3F', shape: 'circle' },
    { id: 'blank', name: '+ 새 템플릿', meta: '빈 슬라이드부터 시작', bg: 'repeating-linear-gradient(45deg, #F5F7FA, #F5F7FA 6px, white 6px, white 12px)', accent: '#B8C2CC', text: '#5A6B7E', shape: null },
  ]};

const FONTS = [
  { id: 'hycu-gothic', name: 'HYCU Gothic', weights: 'Light · Medium · Bold', preview: 'HYCUGothicM, sans-serif', recommended: true },
  { id: 'noto-sans', name: 'Noto Sans KR', weights: 'Regular · Bold', preview: '"Noto Sans KR", sans-serif' },
  { id: 'pretendard', name: 'Pretendard', weights: '400 · 600 · 800', preview: 'Pretendard, sans-serif' },
  { id: 'nanum-myeongjo', name: '나눔명조', weights: 'Regular · Bold', preview: '"Nanum Myeongjo", serif' },
  { id: 'spoqa-han', name: 'Spoqa Han Sans', weights: 'Regular · Bold', preview: '"Spoqa Han Sans Neo", sans-serif' },
  { id: 'ibm-plex', name: 'IBM Plex Sans KR', weights: '400 · 700', preview: '"IBM Plex Sans KR", sans-serif' },
];

const ACCENTS = [
  { id: 'cyan', label: 'HYCU Cyan', color: '#0091B8' },
  { id: 'ink', label: 'Deep Ink', color: '#1B2C3F' },
  { id: 'orange', label: 'Warm Orange', color: '#F26B1C' },
  { id: 'green', label: 'Forest Green', color: '#2FA76A' },
  { id: 'purple', label: 'Royal Purple', color: '#6A4FB7' },
  { id: 'rose', label: 'Rose', color: '#D94B6B' },
];

window.ContentDev = ContentDev;
window.ADDIE_INFO = ADDIE_INFO;
