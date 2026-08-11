// ----- Login Screen — 2026 modern style for HYCU AI Studio -----
const LoginScreen = ({ onLogin }) => {
  const [id, setId] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState('sso'); // 'sso' | 'id'
  const [step, setStep] = React.useState(-1);    // -1 idle · 0..2 진행 · 3 완료
  const [mp, setMp] = React.useState({ x: 50, y: 50, active: false });
  const rightRef = React.useRef(null);

  const SSO_STEPS = [
    { t: '학사시스템 SSO 인증', s: '한양사이버대학교 통합 인증 서버' },
    { t: '교원 정보 조회', s: '소속 · 직위 · 담당 권한 확인' },
    { t: '담당 교과목 데이터 동기화', s: '교과목 · 주차 설계 · 기획서 · CQI' },
  ];

  const ssoLogin = () => {
    setStep(0);
    [1, 2, 3].forEach((i) => setTimeout(() => setStep(i), 850 * i));
    setTimeout(() => onLogin && onLogin(), 850 * 3 + 550);
  };

  const onMove = (e) => {
    if (!rightRef.current) return;
    const r = rightRef.current.getBoundingClientRect();
    setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, active: true });
  };
  const onLeave = () => setMp(m => ({ ...m, active: false }));

  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin && onLogin(); }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      display: 'grid', gridTemplateColumns: '1.05fr 1fr',
      background: '#050E26', overflow: 'hidden', position: 'fixed', inset: 0,
    }}>
      {/* LEFT: brand canvas */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at top left, rgba(0,181,226,0.25), transparent 55%), radial-gradient(ellipse at bottom right, rgba(0,145,184,0.18), transparent 50%), #050E26',
        padding: '56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Abstract data streams — bezier flow lines representing AI data processing */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.4,filter:'blur(1px)',pointerEvents:'none'}} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="streamFade1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#00B5E2" stopOpacity="0"/>
              <stop offset="40%" stopColor="#7DD8EE" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#00B5E2" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="streamFade2" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#0091B8" stopOpacity="0"/>
              <stop offset="50%" stopColor="#00B5E2" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#0091B8" stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="bgGlow2" cx="30%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#00B5E2" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#050E26" stopOpacity="0"/>
            </radialGradient>
            <filter id="streamBlur"><feGaussianBlur stdDeviation="0.5"/></filter>
          </defs>
          <rect width="1000" height="1000" fill="url(#bgGlow2)"/>
          {/* Flowing data stream curves — top-left to bottom-right */}
          {[
            'M -50 100 Q 250 50 500 350 T 1100 700',
            'M -50 200 Q 200 180 450 420 T 1100 800',
            'M -50 300 Q 300 250 550 500 T 1100 900',
            'M -50 50  Q 180 120 400 280 T 1100 600',
            'M -50 400 Q 250 380 500 580 T 1100 950',
            'M -50 500 Q 280 460 530 660 T 1100 1000',
            'M -50 650 Q 220 600 480 800 T 1100 1050',
            'M -50 750 Q 250 720 500 900 T 1100 1100',
          ].map((d, i) => (
            <path key={'s'+i} d={d} fill="none" stroke={i%2 ? 'url(#streamFade1)' : 'url(#streamFade2)'} strokeWidth={1.2 + (i%3)*0.4} filter="url(#streamBlur)"/>
          ))}
          {/* Data particles along streams */}
          {Array.from({length:30}).map((_,i) => {
            const x = ((i*167)%1100)-50, y = ((i*89)%900)+80, r = 1.5 + (i%3);
            return <circle key={'p'+i} cx={x} cy={y} r={r} fill="#7DD8EE" opacity={0.4 + (i%4)*0.15}/>;
          })}
          {/* Stream pulses (brighter dots on curves) */}
          {Array.from({length:12}).map((_,i) => {
            const x = ((i*211)%900)+80, y = ((i*149)%700)+150;
            return (
              <g key={'pulse'+i}>
                <circle cx={x} cy={y} r="2.5" fill="#7DD8EE"/>
                <circle cx={x} cy={y} r="6" fill="none" stroke="#00B5E2" strokeWidth="0.5" opacity="0.5"/>
              </g>
            );
          })}
        </svg>
        {/* Animated cyan grid */}
        <div style={{position:'absolute',inset:0,opacity:0.12,backgroundImage:'linear-gradient(rgba(0,181,226,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,181,226,0.25) 1px, transparent 1px)',backgroundSize:'48px 48px',maskImage:'radial-gradient(ellipse at top left, black 40%, transparent 75%)',WebkitMaskImage:'radial-gradient(ellipse at top left, black 40%, transparent 75%)'}}></div>
        {/* Glow blobs */}
        <div style={{position:'absolute',width:520,height:520,top:-180,right:-120,borderRadius:'50%',background:'radial-gradient(circle, rgba(0,181,226,0.35), transparent 60%)',filter:'blur(40px)',pointerEvents:'none'}}></div>
        <div style={{position:'absolute',width:380,height:380,bottom:-100,left:-80,borderRadius:'50%',background:'radial-gradient(circle, rgba(125,216,238,0.25), transparent 60%)',filter:'blur(40px)',pointerEvents:'none'}}></div>

        {/* Top: brand */}
        <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:14}}>
          <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.logoWhite) || 'HYCU_MAINSYMBOL_WHITE.png'} alt="HYCU" style={{width:52,height:52,objectFit:'contain',filter:'drop-shadow(0 4px 12px rgba(0,181,226,0.3))'}}/>
          <div>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:18,fontWeight:700,color:'white',letterSpacing:'-0.01em'}}>HYCU AI Studio</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:1}}>AI 교안생성 플랫폼 · 학사시스템 연동 서비스</div>
          </div>
        </div>

        {/* Middle: hero copy */}
        <div style={{position:'relative',zIndex:1,maxWidth:520}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',background:'rgba(0,181,226,0.12)',border:'1px solid rgba(0,181,226,0.3)',borderRadius:999,marginBottom:24,visibility:'hidden'}}>
            <span></span>
          </div>
          <h1 style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:54,fontWeight:800,color:'white',letterSpacing:'-0.03em',lineHeight:1.08,margin:0}}>
            교안 제작의 새로운 표준,<br/>
            <span style={{background:'linear-gradient(90deg, #00B5E2, #7DD8EE)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>AI와 함께</span>
          </h1>
          <p style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:16,color:'rgba(255,255,255,0.65)',lineHeight:1.6,marginTop:18,letterSpacing:'-0.005em'}}>
            학사시스템에 로그인하면 담당 교과목이 그대로 넘어옵니다.<br/>
            검색도, 재입력도 없이 — 로그인 후 바로 교안을 생성하세요.
          </p>
          <div style={{display:'flex',gap:24,marginTop:36,visibility:'hidden'}}></div>
        </div>

        {/* Bottom: footer */}
        <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'space-between',color:'rgba(255,255,255,0.4)',fontSize:11.5}}>
          <div>© 2026 Hanyang Cyber University</div>
          <div style={{display:'flex',gap:18}}>
            <a style={{color:'inherit',cursor:'pointer'}}>이용약관</a>
            <a style={{color:'inherit',cursor:'pointer'}}>개인정보처리방침</a>
            <a style={{color:'inherit',cursor:'pointer'}}>고객지원</a>
          </div>
        </div>
      </div>

      {/* RIGHT: liquid glass form on dark with subtle mesh */}
      <div ref={rightRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',padding:'48px',background:'#0E1116',overflow:'hidden'}}>
        {/* Subtle drifting glow blobs — much more restrained */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at 25% 30%, rgba(0,181,226,0.16), transparent 50%), radial-gradient(circle at 75% 75%, rgba(125,216,238,0.1), transparent 55%)',filter:'blur(30px)',animation:'meshDrift 22s ease-in-out infinite'}}></div>
        {/* Base dot pattern */}
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1.2px, transparent 1.4px)',backgroundSize:'24px 24px',pointerEvents:'none'}}></div>
        {/* Mouse-follow bright dots — dots near cursor light up cyan */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:mp.active?1:0,transition:'opacity 0.3s ease',backgroundImage:'radial-gradient(circle, rgba(0,181,226,1) 1.4px, transparent 1.6px)',backgroundSize:'24px 24px',WebkitMaskImage:`radial-gradient(220px circle at ${mp.x}% ${mp.y}%, black 0%, rgba(0,0,0,0.4) 40%, transparent 75%)`,maskImage:`radial-gradient(220px circle at ${mp.x}% ${mp.y}%, black 0%, rgba(0,0,0,0.4) 40%, transparent 75%)`}}></div>
        {/* Soft cyan halo to add depth */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:mp.active?0.7:0,transition:'opacity 0.4s ease',background:`radial-gradient(280px circle at ${mp.x}% ${mp.y}%, rgba(0,181,226,0.18), transparent 65%)`,filter:'blur(8px)'}}></div>

        {/* Liquid Glass card */}
        <div style={{
          position:'relative',zIndex:1,width:'100%',maxWidth:420,
          padding:'40px 36px',
          background:'rgba(20,28,40,0.55)',
          backdropFilter:'blur(20px) saturate(140%)',
          WebkitBackdropFilter:'blur(20px) saturate(140%)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:20,
          boxShadow:'0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 60px -24px rgba(0,0,0,0.7), 0 0 60px -30px rgba(0,181,226,0.18)',
        }}>
          {/* Subtle gloss highlight on top */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',borderRadius:'20px 20px 0 0',pointerEvents:'none'}}></div>
          <div style={{marginBottom:26}}>
            <h2 style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:28,fontWeight:700,color:'white',margin:'0 0 8px',letterSpacing:'-0.02em'}}>로그인</h2>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.55)',margin:0,letterSpacing:'-0.005em'}}>학사시스템 계정으로 연동 로그인합니다.</p>
          </div>

          {/* PRIMARY — 학사 SSO 연동 로그인 */}
          <button onClick={ssoLogin} style={{width:'100%',padding:'16px 18px',background:'linear-gradient(135deg, #00B5E2, #0091B8)',color:'white',border:'none',borderRadius:12,fontFamily:'inherit',fontSize:15,fontWeight:700,cursor:'pointer',letterSpacing:'-0.01em',boxShadow:'0 10px 28px -10px rgba(0,181,226,0.6)',display:'flex',alignItems:'center',gap:12,textAlign:'left'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <rect x="3" y="3" width="8" height="8" rx="1" fill="rgba(255,255,255,0.55)"/>
              <rect x="13" y="3" width="8" height="8" rx="1" fill="white"/>
              <rect x="3" y="13" width="8" height="8" rx="1" fill="white"/>
              <rect x="13" y="13" width="8" height="8" rx="1" fill="rgba(255,255,255,0.55)"/>
            </svg>
            <span style={{flex:1,lineHeight:1.3}}>학사시스템 계정으로 로그인<span style={{display:'block',fontSize:11.5,fontWeight:600,opacity:0.8,marginTop:2}}>HYCU SSO 통합 인증 · 교원 계정</span></span>
            <Icon name="arrow" size={16}/>
          </button>

          {/* 연동 안내 */}
          <div style={{marginTop:14,padding:'12px 14px',background:'rgba(0,181,226,0.07)',border:'1px solid rgba(0,181,226,0.18)',borderRadius:10}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#7DD8EE'}}></span>
              <span style={{fontSize:11,fontWeight:700,color:'#7DD8EE',letterSpacing:'0.1em'}}>학사 데이터 연동</span>
            </div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.6}}>로그인 즉시 담당 <b style={{color:'rgba(255,255,255,0.85)',fontWeight:600}}>교과목 · 주차 설계 · 교과목기획서 · CQI</b> 정보를 학사시스템에서 불러옵니다.</div>
          </div>

          {mode === 'sso' ? (
            <button onClick={() => setMode('id')} style={{width:'100%',marginTop:18,padding:'12px',background:'transparent',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,color:'rgba(255,255,255,0.6)',fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer'}}>일반 계정으로 로그인</button>
          ) : (
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14,marginTop:22,paddingTop:22,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div>
              <label style={{display:'block',fontSize:11.5,color:'rgba(255,255,255,0.55)',fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:7}}>아이디</label>
              <input value={id} onChange={e => setId(e.target.value)} placeholder="test@hycu.ac.kr" autoComplete="username"
                style={{width:'100%',padding:'13px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,fontFamily:'inherit',fontSize:14,color:'white',outline:'none',transition:'all 0.15s',boxSizing:'border-box'}}
                onFocus={e => { e.target.style.border = '1px solid rgba(0,181,226,0.6)'; e.target.style.background = 'rgba(0,181,226,0.06)'; }}
                onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>
            <div>
              <label style={{display:'block',fontSize:11.5,color:'rgba(255,255,255,0.55)',fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:7}}>비밀번호</label>
              <div style={{position:'relative'}}>
                <input value={pw} onChange={e => setPw(e.target.value)} type={showPw?'text':'password'} placeholder="••••••••••" autoComplete="current-password"
                  style={{width:'100%',padding:'13px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,fontFamily:'inherit',fontSize:14,color:'white',outline:'none',transition:'all 0.15s',boxSizing:'border-box',paddingRight:46}}
                  onFocus={e => { e.target.style.border = '1px solid rgba(0,181,226,0.6)'; e.target.style.background = 'rgba(0,181,226,0.06)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',width:34,height:34,background:'transparent',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',display:'grid',placeItems:'center'}}>
                  <Icon name="eye" size={15}/>
                </button>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:4}}>
              <label style={{display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer',color:'rgba(255,255,255,0.7)',fontSize:13}}>
                <input type="checkbox" style={{accentColor:'#00B5E2',width:14,height:14}}/>
                자동 로그인
              </label>
              <a style={{fontSize:13,color:'#7DD8EE',cursor:'pointer',fontWeight:500}}>비밀번호 찾기</a>
            </div>

            <button type="submit" disabled={loading}
              style={{marginTop:14,padding:'14px 18px',background:'linear-gradient(135deg, #00B5E2, #0091B8)',color:'white',border:'none',borderRadius:10,fontFamily:'inherit',fontSize:14.5,fontWeight:700,cursor:loading?'wait':'pointer',letterSpacing:'-0.01em',boxShadow:'0 8px 24px -8px rgba(0,181,226,0.5)',transition:'all 0.15s',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.75:1}}>
              {loading ? <><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}></span>로그인 중…</> : <>로그인 <Icon name="arrow" size={14}/></>}
            </button>
            <button type="button" onClick={() => setMode('sso')} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.45)',fontFamily:'inherit',fontSize:12.5,cursor:'pointer',marginTop:2}}>← 학사 연동 로그인으로 돌아가기</button>
          </form>
          )}

          <p style={{marginTop:28,fontSize:12.5,color:'rgba(255,255,255,0.4)',lineHeight:1.6,textAlign:'center'}}>
            교수·교직원만 이용할 수 있습니다.<br/>
            사용 문의는 <a style={{color:'#7DD8EE',cursor:'pointer'}}>콘텐츠개발팀</a>으로 연락주세요.
          </p>
        </div>
      </div>

      {/* SSO 학사 연동 핸드셰이크 */}
      {step >= 0 && (
        <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(5,14,38,0.82)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',display:'grid',placeItems:'center'}}>
          <div style={{width:440,padding:'34px 34px 30px',background:'rgba(20,28,40,0.9)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,boxShadow:'0 30px 80px -30px rgba(0,0,0,0.8)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:26}}>
              <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#00B5E2,#0091B8)',display:'grid',placeItems:'center',color:'white'}}><Icon name="link" size={17}/></div>
              <div>
                <div style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:16,fontWeight:700,color:'white',letterSpacing:'-0.01em'}}>학사시스템 연동 중</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:2}}>HYCU 통합 인증 · LCMS 학사 데이터</div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {SSO_STEPS.map((s, i) => {
                const state = step > i ? 'done' : step === i ? 'run' : 'todo';
                return (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'24px 1fr auto',gap:12,alignItems:'center',opacity: state==='todo'?0.35:1,transition:'opacity 0.3s'}}>
                    <div style={{width:24,height:24,borderRadius:'50%',display:'grid',placeItems:'center',background: state==='done'?'rgba(0,181,226,0.18)':'rgba(255,255,255,0.06)',border: state==='run'?'1px solid rgba(0,181,226,0.5)':'1px solid rgba(255,255,255,0.1)',color:'#7DD8EE'}}>
                      {state==='done' ? <Icon name="check" size={12}/> : state==='run' ? <span style={{width:11,height:11,border:'2px solid rgba(125,216,238,0.25)',borderTopColor:'#7DD8EE',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}></span> : <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,255,255,0.4)'}}></span>}
                    </div>
                    <div>
                      <div style={{fontFamily:'Pretendard Variable, Pretendard, sans-serif',fontSize:13.5,fontWeight:600,color:'white'}}>{s.t}</div>
                      <div style={{fontSize:11.5,color:'rgba(255,255,255,0.45)',marginTop:2}}>{s.s}</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color: state==='done'?'#7DD8EE':'rgba(255,255,255,0.3)',letterSpacing:'0.04em'}}>{state==='done'?'완료':state==='run'?'처리 중':'대기'}</div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:26,height:4,background:'rgba(255,255,255,0.08)',borderRadius:999,overflow:'hidden'}}>
              <div style={{width:`${Math.min(100,(step/3)*100)}%`,height:'100%',background:'linear-gradient(90deg,#00B5E2,#7DD8EE)',borderRadius:999,transition:'width 0.5s ease'}}></div>
            </div>
            <div style={{marginTop:12,fontSize:11.5,color:'rgba(255,255,255,0.4)',textAlign:'center'}}>{step>=3 ? '동기화 완료 — 교안 생성으로 이동합니다' : '학사시스템에서 담당 교과목을 불러오는 중입니다'}</div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        @keyframes meshDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(20px, -30px) scale(1.08); }
          66%      { transform: translate(-25px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

window.LoginScreen = LoginScreen;
