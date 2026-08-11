// ----- Inspection — 편집과 분리된 전체 검수 프로세스 -----
// 편집을 마친 뒤 전체 규칙 검사를 한 번에 돌리고, 이슈가 잡히면 편집으로 되돌아가
// 편집 화면 우측 검수 탭에서 슬라이드별 상세·수정 액션을 확인한다.
// (편집 화면 내 검수 탭은 그대로 유지 — 여기는 "전체를 돌리는" 별도 단계)

const INSPECTION_RULES = [
  { id: 'freshness', label: '최신성 검사', desc: '인용 데이터·통계의 기준 연도 확인' },
  { id: 'sources',   label: '출처 각주 검사', desc: '인용문·이미지 출처 기재 여부' },
  { id: 'objectives',label: '학습목표 정합성', desc: '모든 학습 목표가 슬라이드에서 다뤄지는지' },
  { id: 'master',    label: '마스터 규격 검사', desc: '마스터 좌표·교수자 영역 침범 여부' },
  { id: 'layout',    label: '본문 영역 검사', desc: '안전 영역 초과·텍스트 오버플로' },
];

const InspectionScreen = ({ deck, onScreen }) => {
  const [started, setStarted] = React.useState(false);
  const [doneRules, setDoneRules] = React.useState(0);
  const total = INSPECTION_RULES.length;
  const running = started && doneRules < total;
  React.useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setDoneRules(c => c >= total ? c : c + 1), 900);
    return () => clearInterval(id);
  }, [started]);
  const issues = REVIEW_ISSUES;
  const errs = issues.filter(i => i.sev === 'error').length;
  const warns = issues.filter(i => i.sev === 'warn').length;
  const SEV = {
    error: { l: '오류', c: '#C0392B', bg: 'rgba(192,57,43,0.08)' },
    warn:  { l: '주의', c: '#9C5B1F', bg: 'rgba(156,91,31,0.08)' },
  };
  return (
    <div className="content" style={{paddingBottom:96}}>
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>Inspection</div>
        <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:21,margin:'0 0 6px',fontWeight:600}}>전체 검수 — {deck.chapter}</h2>
        <p style={{fontSize:13,color:'var(--admin-muted)',margin:0,lineHeight:1.6}}>
          편집이 끝난 교안 전체에 검수 규칙 {total}종을 실행합니다. 이슈가 잡히면 편집으로 돌아가
          우측 <b>검수 탭</b>에서 슬라이드별 상세와 수정 액션을 확인하세요. 미해결 이슈는 내보내기 전까지 계속 표시됩니다.
        </p>
        {!started ? (
          <button className="btn btn-cyan" style={{marginTop:16,fontSize:13.5,padding:'10px 26px'}} onClick={() => setStarted(true)}>
            검수 실행 — 슬라이드 {deck.slides.length}매 전체
          </button>
        ) : null}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:14,alignItems:'start'}}>
        <div className="card" style={{padding:16}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:700,marginBottom:10,color:'var(--admin-ink)'}}>검사 규칙 {Math.min(doneRules,total)} / {total}</div>
          {INSPECTION_RULES.map((r, i) => {
            const st = i < doneRules ? 'done' : i === doneRules ? 'run' : 'wait';
            return (
              <div key={r.id} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'9px 4px',opacity: st==='wait'?0.5:1}}>
                <div style={{width:18,height:18,borderRadius:'50%',flexShrink:0,marginTop:1,background: st==='done'?'var(--success)':st==='run'?'var(--hycu-cyan)':'var(--admin-line)',color:'white',display:'grid',placeItems:'center'}}>
                  {st==='done' ? <Icon name="check" size={10}/> : st==='run' ? <span style={{width:6,height:6,borderRadius:'50%',background:'white'}}></span> : null}
                </div>
                <div>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12.5,fontWeight:600,color:'var(--admin-ink)'}}>{r.label}</div>
                  <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:1}}>{st==='run' ? '검사 중…' : r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          {!started ? (
            <div className="card" style={{padding:'40px 24px',textAlign:'center',color:'var(--admin-muted)',fontSize:13}}>
              단계를 오갈 때 자동 실행되지 않습니다 — 좌측 규칙을 확인하고 「검수 실행」을 눌러 시작하세요.
            </div>
          ) : running ? (
            <div className="card" style={{padding:'40px 24px',textAlign:'center',color:'var(--admin-muted)',fontSize:13}}>
              슬라이드 {deck.slides.length}매 전체를 검사하고 있습니다…
            </div>
          ) : (
            <>
              <div className="card" style={{padding:'16px 18px',marginBottom:12,display:'flex',alignItems:'center',gap:16}}>
                <div style={{display:'flex',gap:8}}>
                  <span style={{fontSize:12,fontWeight:700,color:SEV.error.c,background:SEV.error.bg,padding:'4px 12px',borderRadius:999,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>오류 {errs}</span>
                  <span style={{fontSize:12,fontWeight:700,color:SEV.warn.c,background:SEV.warn.bg,padding:'4px 12px',borderRadius:999,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>주의 {warns}</span>
                </div>
                <div style={{flex:1,fontSize:12.5,color:'var(--admin-muted)'}}>이슈 {issues.length}건 발견 — 수정하려면 편집으로 돌아가세요.</div>
                <button className="btn btn-cyan" onClick={() => onScreen('editor')}>
                  <Icon name="edit" size={13}/> 편집으로 돌아가 수정
                </button>
              </div>
              {issues.map((r, i) => (
                <div key={i} className="card" style={{padding:'13px 16px',marginBottom:8,display:'flex',gap:12,alignItems:'flex-start'}}>
                  <span style={{fontSize:10.5,fontWeight:700,color:SEV[r.sev].c,background:SEV[r.sev].bg,padding:'2px 9px',borderRadius:999,flexShrink:0,marginTop:2,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif'}}>{SEV[r.sev].l}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13.5,fontWeight:700,color:'var(--admin-ink)'}}>
                      {r.title} <span style={{fontWeight:500,color:'var(--admin-muted)',fontSize:12}}>· 슬라이드 {String(r.n).padStart(2,'0')}</span>
                    </div>
                    <div style={{fontSize:12.5,color:'var(--admin-muted)',marginTop:3,lineHeight:1.6}}>{r.body}</div>
                    <div style={{fontSize:11.5,color:'var(--hycu-cyan-deep)',marginTop:5,fontWeight:600}}>제안 액션: {r.action} — 편집 화면 검수 탭에서 실행</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.InspectionScreen = InspectionScreen;
