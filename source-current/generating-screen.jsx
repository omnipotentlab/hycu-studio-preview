// ----- Generating screen with fake streaming -----
const Generating = ({ onScreen, deck, progress, setProgress, progressStyle }) => {
  const [logs, setLogs] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const logRef = React.useRef(null);

  const PHASES = [
    { id: 'parse', label: '자료 분석', tasks: ['DOCX 파싱', 'PDF 텍스트 추출', '의미 청킹', '키워드 임베딩'] },
    { id: 'design', label: '구조 설계', tasks: ['학습 목표 추출', 'ADDIE 매핑', '슬라이드 분량 산정', '챕터 구조 생성'] },
    { id: 'gen', label: '슬라이드 생성', tasks: ['표지 생성', '학습 목표 슬라이드', '개념 전개 슬라이드', '활동·평가 슬라이드', '정리 슬라이드'] },
    { id: 'layout', label: '레이아웃 적용', tasks: ['HYCU 마스터 적용', '시안 액센트 정합성', '교수자 영역 검증', '진도바 캘리브레이션'] },
  ];

  React.useEffect(() => {
    if (paused || progress >= 100) return;
    const id = setInterval(() => {
      setProgress(p => Math.min(p + 0.7 + Math.random() * 0.4, 100));
    }, 200);
    return () => clearInterval(id);
  }, [paused, progress]);

  React.useEffect(() => {
    setCurrentSlide(Math.floor((progress / 100) * 28));
  }, [progress]);

  // Streaming log generator
  React.useEffect(() => {
    if (paused || progress >= 100) return;
    const messages = [
      { tag: 'parse', msg: 'AI리터러시_생성형AI_강의안.docx 파싱 완료 (8,420 tokens)', ok: true },
      { tag: 'parse', msg: 'UNESCO_Generative_AI_Guidance.pdf 분석 중 ▸ 12개 의미 청크 식별' },
      { tag: 'embed', msg: '의미 임베딩 생성 ▸ 1536-dim · 28 청크' },
      { tag: 'design', msg: '학습 목표 후보 6개 → 4개로 압축 (Bloom 균형)', ok: true },
      { tag: 'addie', msg: 'ADDIE 분배: A(1) D(3) Dv(18) I(3) E(3)', ok: true },
      { tag: 'gen', msg: '슬라이드 01 (표지) 생성 ▸ HYCUMyungJoB 80px' },
      { tag: 'gen', msg: '슬라이드 02 (분석) ▸ 학습 전 진단 4문항' },
      { tag: 'gen', msg: '슬라이드 03 (학습목표) ▸ 4개 항목 + 5개 키워드' },
      { tag: 'gen', msg: '슬라이드 05 (개념) ▸ 생성형 AI 핵심 원리 검토', ok: true },
      { tag: 'gen', msg: '슬라이드 06 (다이어그램) ▸ 4-up 카드 레이아웃' },
      { tag: 'gen', msg: '슬라이드 07 (모형) ▸ AI 발전 단계 도식 자동 생성', ok: true },
      { tag: 'warn', msg: '슬라이드 08 길이 경고 ▸ 본문 텍스트 압축 적용', warn: true },
      { tag: 'gen', msg: '슬라이드 16 (활동) ▸ 프롬프트 개선 실습 예제 생성' },
      { tag: 'gen', msg: '슬라이드 19 (퀴즈) ▸ 4지선다 + 정답 풀이' },
      { tag: 'layout', msg: '교수자 영역(1420,540)~480×540 침범 검증 ▸ 28/28 통과', ok: true },
      { tag: 'layout', msg: '시안 라인(64×4) 정합성 ▸ 모든 본문 슬라이드 일치', ok: true },
      { tag: 'layout', msg: 'ADDIE 인디케이터 위치(1660,36) ▸ 검증 완료', ok: true },
      { tag: 'render', msg: 'PPTX 패키징 준비 ▸ 4종 폰트 임베드' },
    ];
    const idx = Math.floor((progress / 100) * messages.length);
    if (idx < messages.length && idx > logs.length - 1) {
      setLogs(prev => [...prev, { ...messages[idx], ts: new Date().toLocaleTimeString('en-GB', { hour12: false }) }]);
    }
  }, [progress]);

  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const phaseIdx = progress < 20 ? 0 : progress < 45 ? 1 : progress < 88 ? 2 : 3;

  return (
    <div className="content">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <div className="card" style={{padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600}}>
                렌더링 진행 중 · {PHASES[phaseIdx].label}
              </div>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:24,marginTop:8,fontWeight:600,letterSpacing:'-0.01em'}}>
                {deck.subchapter}
              </div>
              <div style={{fontSize:13,color:'var(--admin-muted)',marginTop:4}}>
                {deck.subject} · {deck.week}주차 · 02교시 · {deck.duration}분
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => setPaused(!paused)}>
              {paused ? <><Icon name="play" size={12}/> 재개</> : <><Icon name="pause" size={12}/> 일시정지</>}
            </button>
          </div>

          {/* Big progress display */}
          <div style={{display:'flex',alignItems:'flex-end',gap:24,marginTop:32}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:96,fontWeight:600,color:'var(--ink-deep)',letterSpacing:'-0.04em',lineHeight:1}}>
              {Math.floor(progress)}<span style={{fontSize:48,color:'var(--admin-muted)'}}>%</span>
            </div>
            <div style={{paddingBottom:14}}>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,color:'var(--admin-ink)',fontWeight:600}}>{currentSlide} / 28매 렌더</div>
              <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:4}}>예상 남은 시간 {Math.max(1, Math.ceil((100-progress) * 2.4))}초</div>
            </div>
          </div>

          <div style={{height:6,background:'var(--admin-line)',borderRadius:3,overflow:'hidden',marginTop:24,position:'relative'}}>
            <div style={{height:'100%',width:progress+'%',background:'linear-gradient(90deg, #00B5E2, #0091B8)',transition:'width 0.2s',position:'relative'}}>
              <div style={{position:'absolute',right:0,top:-2,bottom:-2,width:2,background:'white',boxShadow:'0 0 12px var(--hycu-cyan)'}}></div>
            </div>
          </div>

          {progressStyle === 'phase' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:24}}>
              {PHASES.map((p, i) => (
                <div key={p.id} style={{padding:'14px 16px',background: i === phaseIdx ? 'rgba(0,181,226,0.08)' : i < phaseIdx ? 'white' : 'var(--admin-bg)', border: i === phaseIdx ? '1.5px solid var(--hycu-cyan)' : '1px solid var(--admin-line)', borderRadius:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                    <div style={{width:18,height:18,borderRadius:'50%',background:i<phaseIdx?'var(--success)':i===phaseIdx?'var(--hycu-cyan)':'var(--admin-line)',color:'white',display:'grid',placeItems:'center'}}>
                      {i < phaseIdx && <Icon name="check" size={10}/>}
                      {i === phaseIdx && <span style={{width:6,height:6,borderRadius:'50%',background:'white'}}></span>}
                    </div>
                    <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,color: i <= phaseIdx ? 'var(--admin-ink)' : 'var(--admin-muted)'}}>{p.label}</div>
                  </div>
                  <div style={{fontSize:10,color:'var(--admin-muted)'}}>
                    {i < phaseIdx ? '완료' : i === phaseIdx ? p.tasks[Math.floor(Math.random()*p.tasks.length)] : '대기 중'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {progressStyle === 'card' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginTop:24}}>
              {[
                { k: '분석된 자료', v: '3건', ic: 'file' },
                { k: '추출된 키워드', v: '47개', ic: 'sparkles' },
                { k: '생성된 슬라이드', v: `${currentSlide}매`, ic: 'layers' },
              ].map(c => (
                <div key={c.k} style={{padding:'14px 16px',background:'var(--admin-bg)',borderRadius:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <Icon name={c.ic} size={14} style={{color:'#0091B8'}}/>
                    <div style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.04em'}}>{c.k}</div>
                  </div>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:24,marginTop:6,fontWeight:600,color:'var(--admin-ink)'}}>{c.v}</div>
                </div>
              ))}
            </div>
          )}

          {progress >= 100 && (
            <div style={{marginTop:24,padding:'14px 18px',background:'rgba(34,160,107,0.08)',border:'1px solid rgba(34,160,107,0.3)',borderRadius:10,display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'var(--success)',color:'white',display:'grid',placeItems:'center'}}>
                <Icon name="check" size={18}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,color:'#166B4A',fontWeight:600}}>렌더 완료 · 28매</div>
                <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:2}}>모든 슬라이드가 HYCU 디자인 시스템을 준수합니다.</div>
              </div>
              <span style={{fontSize:12,color:'#166B4A',fontWeight:700}}>하단 "다음 · 편집"으로 이동</span>
            </div>
          )}
        </div>

        <div className="card" style={{padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>실시간 렌더 슬라이드</div>
            <span style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'ui-monospace,monospace'}}>슬라이드 {currentSlide || 1} 미리보기</span>
          </div>
          <div className="canvas-frame" style={{padding:16,minHeight:340,background:'var(--admin-bg)'}}>
            {currentSlide > 0 ? (
              <ScaledSlide slide={deck.slides[Math.min(currentSlide-1, deck.slides.length-1)]} deck={deck} scale={0.28} frame/>
            ) : (
              <div style={{padding:60,textAlign:'center',color:'var(--admin-muted)'}}>
                <div className="caret" style={{display:'inline-block',width:7,height:14,background:'var(--hycu-cyan)',animation:'blink 1s steps(2) infinite'}}></div>
                <div style={{marginTop:14,fontSize:12,fontFamily:'ui-monospace,monospace'}}>슬라이드 렌더 대기 중...</div>
              </div>
            )}
          </div>

          <div style={{marginTop:14}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,fontWeight:600}}>현재 처리 중인 청크</div>
            <div style={{padding:'10px 12px',background:'#0E1116',color:'#C9CFD7',borderRadius:8,fontFamily:'ui-monospace,monospace',fontSize:11,lineHeight:1.6}}>
              <span style={{color:'#7A8390'}}>{">> "}</span>
              <span style={{color:'#00B5E2'}}>chunk #{Math.min(currentSlide+5, 28)}</span>
              <span style={{color:'#fff'}}> Likert (1932) proposed a five-point summated rating scale <span style={{color:'#F2C94C'}}>three</span> independent components<span className="caret"></span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Streaming log */}
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--admin-line)',display:'flex',alignItems:'center',gap:12}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:'var(--hycu-cyan)',animation:'pulse 1.4s ease-in-out infinite'}}></span>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600}}>렌더 로그</div>
          <span style={{fontSize:11,color:'var(--admin-muted)',fontFamily:'ui-monospace,monospace'}}>{logs.length} events</span>
          <div style={{flex:1}}></div>
          <button className="btn btn-quiet">필터</button>
          <button className="btn btn-quiet">내보내기</button>
        </div>
        <div className="stream" ref={logRef} style={{borderRadius:0,height:240}}>
          {logs.map((l, i) => (
            <div key={i} className="line">
              <span className="ts">{l.ts}</span>
              <span className={`tag ${l.warn ? 'warn' : l.ok ? 'ok' : ''}`}>[{l.tag}]</span>
              <span className="msg">{l.msg}</span>
            </div>
          ))}
          {progress < 100 && <div className="line"><span className="ts">·</span><span className="tag">[live]</span><span className="msg">streaming<span className="caret"></span></span></div>}
        </div>
      </div>
    </div>
  );
};

window.Generating = Generating;
