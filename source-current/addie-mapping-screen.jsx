// ----- ADDIE Mapping screen -----
const AddieMapping = ({ deck, onScreen }) => {
  const stages = [
    { k: 'A', cls: 'A', name: 'Analysis', ko: '분석', desc: '학습자 진단 · 선수학습' },
    { k: 'D', cls: 'D', name: 'Design', ko: '설계', desc: '학습 목표 · 로드맵' },
    { k: 'Dv', cls: 'Dv', name: 'Development', ko: '개발', desc: '개념 전개 · 사례' },
    { k: 'I', cls: 'I', name: 'Implementation', ko: '실행', desc: '활동 · 토론 · 실습' },
    { k: 'E', cls: 'E', name: 'Evaluation', ko: '평가', desc: '형성평가 · 정리' },
  ];

  return (
    <div className="content">
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16,marginBottom:18}}>
        <div className="card" style={{padding:24}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>
            ADDIE 교수설계 모형
          </div>
          <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:22,margin:'0 0 8px',fontWeight:600}}>슬라이드별 ADDIE 단계 매핑</h2>
          <p style={{fontSize:13,color:'var(--admin-muted)',margin:0,lineHeight:1.6}}>
            AI가 추론한 단계 분류입니다. 슬라이드 카드를 끌어 다른 단계로 옮길 수 있습니다.
            우상단 페이즈 인디케이터에 자동 반영됩니다.
          </p>
        </div>
        <div className="card" style={{padding:18,background:'#0E1116',color:'white',borderColor:'#0E1116'}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#00B5E2',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:8}}>분배 균형</div>
          <div style={{display:'flex',height:8,borderRadius:4,overflow:'hidden',marginBottom:10}}>
            {[
              { c:'#6A4FB7', n: 1 },
              { c:'#1971C2', n: 3 },
              { c:'#00B5E2', n: 18 },
              { c:'#2FA76A', n: 3 },
              { c:'#C25C19', n: 3 },
            ].map((s,i) => <div key={i} style={{flex:s.n,background:s.c}}></div>)}
          </div>
          <div style={{fontSize:12,color:'#9AA2AD',lineHeight:1.5}}>
            Development 비중 64% · 50분 강의의 권장 균형 범위입니다.
          </div>
        </div>
      </div>

      <div className="addie-grid">
        {stages.map(s => {
          const slides = deck.slides.filter(sl => sl.phase === s.k);
          return (
            <div key={s.k} className={`addie-col ${s.cls}`}>
              <div className="col-head">
                <div className="letter">{s.k.charAt(0)}</div>
                <div className="col-name">
                  {s.name}
                  <span className="ko">{s.ko} · {s.desc}</span>
                </div>
                <div className="count">{slides.length}매</div>
              </div>
              {slides.map(sl => (
                <div key={sl.n} className="addie-card">
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <Icon name="drag" size={12} style={{color:'var(--admin-faint)'}}/>
                    <div className="num">슬라이드 {String(sl.n).padStart(2,'0')}</div>
                  </div>
                  <div className="ti">{sl.title}</div>
                  <div className="du">
                    <Icon name="clock" size={11}/>
                    <span>{sl.type === 'cover' ? '도입 1분' : sl.type === 'activity' ? '활동 5분' : sl.type === 'quiz' ? '평가 1분' : '약 1.7분'}</span>
                  </div>
                </div>
              ))}
              {slides.length === 0 && (
                <div style={{padding:'24px 12px',textAlign:'center',color:'var(--admin-faint)',fontSize:11,border:'1.5px dashed var(--admin-line)',borderRadius:8}}>
                  카드 끌어 놓기
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{marginTop:24,textAlign:'right',fontSize:12,color:'var(--admin-muted)'}}>
        매핑 결과는 슬라이드 편집 단계에 자동 반영됩니다.
      </div>
    </div>
  );
};

window.AddieMapping = AddieMapping;
