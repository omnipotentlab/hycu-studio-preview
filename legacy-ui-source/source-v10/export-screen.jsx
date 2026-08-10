// ----- Preview, Chroma, Export screens -----

const Preview = ({ deck, currentSlide, setCurrentSlide, onScreen, chroma }) => {
  const slide = deck.slides[currentSlide];
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setCurrentSlide(Math.min(deck.slides.length-1, currentSlide+1));
      if (e.key === 'ArrowLeft') setCurrentSlide(Math.max(0, currentSlide-1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentSlide]);

  return (
    <div className="content" style={{maxWidth:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{flex:1}}></div>
        <span className="pill"><Icon name="eye" size={11}/> 학습자 시점 미리보기</span>
      </div>

      <div style={{display:'grid',placeItems:'center',padding:'12px 0'}}>
        <ScaledSlide slide={slide} deck={deck} scale={0.55} frame currentSlide={currentSlide+1} chroma={chroma}/>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'white',border:'1px solid var(--admin-line)',borderRadius:10,marginTop:12}}>
        <button className="btn btn-quiet" onClick={() => setCurrentSlide(0)}><Icon name="chevronLeft" size={13}/><Icon name="chevronLeft" size={13} style={{marginLeft:-6}}/></button>
        <button className="btn btn-quiet" onClick={() => setCurrentSlide(Math.max(0,currentSlide-1))}><Icon name="chevronLeft" size={13}/></button>
        <div style={{flex:1,height:6,background:'var(--admin-line)',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',background:'var(--hycu-cyan)',width:((currentSlide+1)/deck.slides.length*100)+'%'}}></div>
        </div>
        <span style={{fontFamily:'ui-monospace,monospace',fontSize:12,color:'var(--admin-muted)',minWidth:60,textAlign:'center'}}>{String(currentSlide+1).padStart(2,'0')} / {String(deck.slides.length).padStart(2,'0')}</span>
        <button className="btn btn-quiet" onClick={() => setCurrentSlide(Math.min(deck.slides.length-1,currentSlide+1))}><Icon name="chevronRight" size={13}/></button>
      </div>

      <div style={{marginTop:14}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,fontWeight:600}}>모든 슬라이드</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7, 1fr)',gap:8}}>
          {deck.slides.map((s, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{padding:3,background:'transparent',border:i===currentSlide?'2px solid var(--hycu-cyan)':'1px solid var(--admin-line)',borderRadius:6,cursor:'pointer'}}>
              <div style={{aspectRatio:'16/9',background:'white',borderRadius:2,overflow:'hidden',position:'relative'}}>
                <ScaledSlide slide={s} deck={deck} scale={0.07}/>
                <div style={{position:'absolute',bottom:2,right:2,background:'rgba(14,17,22,0.7)',color:'white',fontSize:9,padding:'1px 4px',borderRadius:2,fontFamily:'ui-monospace,monospace'}}>{String(s.n).padStart(2,'0')}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----- Chroma simulator -----
const Chroma = ({ deck, currentSlide, setCurrentSlide, onScreen, chroma, instructorPos, instructorScale }) => {
  const slide = deck.slides[currentSlide];
  return (
    <div className="content" style={{maxWidth:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <button className="btn btn-ghost" onClick={() => onScreen('editor')}><Icon name="chevronLeft" size={13}/> 에디터로</button>
        <div>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:18,fontWeight:600}}>교수자 크로마키 합성 시뮬레이터</div>
          <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:2}}>우측 하단 480×540px 안전 영역에 교수자 영상이 합성됩니다. 본문이 침범되는지 미리 확인하세요.</div>
        </div>
        <div style={{flex:1}}></div>
        <span className="pill" style={{background:'rgba(34,160,107,0.1)',color:'#166B4A'}}>
          <span className="dot" style={{background:'#22A06B'}}></span>침범 0건 · 안전
        </span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:14}}>
        <div>
          <div style={{display:'grid',placeItems:'center'}}>
            <ScaledSlide slide={slide} deck={deck} scale={0.55} frame chroma={true} showSafeZone instructorPos={instructorPos} instructorScale={instructorScale}/>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:12,padding:'10px 14px',background:'white',border:'1px solid var(--admin-line)',borderRadius:10}}>
            <button className="btn btn-quiet" onClick={() => setCurrentSlide(Math.max(0,currentSlide-1))}><Icon name="chevronLeft" size={13}/></button>
            <span style={{fontFamily:'ui-monospace,monospace',fontSize:12,minWidth:80,textAlign:'center'}}>{String(currentSlide+1).padStart(2,'0')} / {String(deck.slides.length).padStart(2,'0')}</span>
            <button className="btn btn-quiet" onClick={() => setCurrentSlide(Math.min(deck.slides.length-1,currentSlide+1))}><Icon name="chevronRight" size={13}/></button>
            <div style={{flex:1}}></div>
            <span style={{fontSize:11,color:'var(--admin-muted)'}}>← → 키로 이동</span>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10,fontWeight:600}}>안전 영역 검증</div>
            {[
              ['교수자 영역', '1420, 540 · 480×540', true],
              ['본문 침범', '0px', true],
              ['로고 위치', '60, 32', true],
              ['진도바 충돌', '없음', true],
              ['ADDIE 인디케이터', '활성: D', true],
            ].map(([k,v,ok], i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<4?'1px solid var(--admin-line-soft)':'none'}}>
                <Icon name="check" size={12} style={{color:'var(--success)',flexShrink:0}}/>
                <span style={{fontSize:12,color:'var(--admin-charcoal)',flex:1}}>{k}</span>
                <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,color:'var(--admin-muted)'}}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10,fontWeight:600}}>스튜디오 환경</div>
            {[
              { l: '카메라 입력', v: 'Sony FX3 · 1920×1080 · 30fps', ic: 'camera' },
              { l: '크로마키 색', v: '#00B140 (Chroma Green)', ic: 'square' },
              { l: '키 적용', v: 'OBS · Despill · 스무딩 0.4', ic: 'sliders' },
              { l: '교수자 위치', v: instructorPos === 'br' ? '우측 하단' : instructorPos === 'bl' ? '좌측 하단' : '중앙', ic: 'user' },
              { l: '교수자 크기', v: Math.round(instructorScale*100)+'%', ic: 'maximize' },
            ].map((r, i) => (
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'8px 0',borderBottom: i<4?'1px solid var(--admin-line-soft)':'none'}}>
                <Icon name={r.ic} size={12} style={{color:'var(--admin-muted)',marginTop:2,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:'var(--admin-muted)'}}>{r.l}</div>
                  <div style={{fontSize:12,color:'var(--admin-ink)',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:500,marginTop:1}}>{r.v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid var(--admin-line)',display:'flex',alignItems:'center',gap:8}}>
              <Icon name="info" size={13} style={{color:'#0091B8'}}/>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600}}>좌표 시스템 가이드</div>
            </div>
            <div style={{padding:'12px 16px',fontSize:12,color:'var(--admin-charcoal)',lineHeight:1.6}}>
              교수자 영역(D)은 절대 좌표 <code style={{background:'var(--admin-bg)',padding:'1px 4px',borderRadius:3,fontFamily:'ui-monospace,monospace',fontSize:11}}>1420, 540</code>에 고정됩니다. 본문 콘텐츠는 폭 1320px 한계를 절대 초과하지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportScreen = ({ onScreen, deck, exportFormat }) => {
  const [done, setDone] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [building, setBuilding] = React.useState(false);
  const [format, setFormat] = React.useState(exportFormat || 'pptx');
  const extension = { pptx:'pptx', pdf:'pdf', scorm:'zip', mp4:'mp4' }[format];

  const start = () => {
    setBuilding(true); setProgress(0);
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); setDone(true); setBuilding(false); return 100; }
        return p + 4;
      });
    }, 80);
  };

  return (
    <div className="content">
      <button className="btn btn-ghost" onClick={() => onScreen('editor')} style={{marginBottom:14}}><Icon name="chevronLeft" size={13}/> 에디터로</button>
      <div className="card export-card" style={{padding:32}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>최종 산출물</div>
        <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:24,margin:'0 0 4px',fontWeight:600,letterSpacing:'-0.01em',wordBreak:'keep-all'}}>HYCU_<wbr/>시장조사론_<wbr/>5주차_<wbr/>02교시.{extension}</h2>
        <div style={{fontSize:13,color:'var(--admin-muted)',wordBreak:'keep-all'}}>28매 · 와이드스크린 16:9 · HYCU 폰트 4종 임베드 · <span style={{whiteSpace:'nowrap'}}>최종 검수 완료</span></div>

        <div className="export-formats" role="radiogroup" aria-label="내보내기 포맷" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:20,marginBottom:24}}>
          {[
            { id:'pptx', l:'PowerPoint', sub:'.pptx · 편집 가능', ic:'file', primary:true },
            { id:'pdf', l:'PDF', sub:'.pdf · 인쇄용', ic:'file' },
            { id:'scorm', l:'SCORM', sub:'LMS 패키지', ic:'archive' },
            { id:'mp4', l:'동영상', sub:'.mp4 · 강의 송출', ic:'play' },
          ].map(f => (
            <button key={f.id} role="radio" aria-checked={format===f.id} onClick={()=>setFormat(f.id)}
              style={{padding:'18px 14px',background:format===f.id?'var(--hycu-cyan-soft)':'white',border:format===f.id?'2px solid var(--hycu-cyan)':'1.5px solid var(--admin-line)',borderRadius:10,textAlign:'left',cursor:'pointer'}}>
              <Icon name={f.ic} size={20} style={{color: format===f.id ? 'var(--hycu-cyan-deep)' : 'var(--admin-muted)'}}/>
              <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,marginTop:8,fontWeight:600,color:'var(--admin-ink)'}}>{f.l}</div>
              <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>{f.sub}</div>
            </button>
          ))}
        </div>

        <div className="export-options" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10,fontWeight:600}}>포함 옵션</div>
            {[
              ['HYCU 폰트 4종 임베드', true],
              ['교수자 내레이션 스크립트 (notes)', true],
              ['ADDIE 단계 메타데이터', true],
              ['슬라이드 마스터 (재사용)', true],
              ['교수자 크로마키 합성', false],
              ['형성평가 정답 표시', false],
              ['원본 교안 언어 유지', true],
            ].map(([l,d], i, a) => (
              <label key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<a.length-1?'1px solid var(--admin-line-soft)':'none',cursor:'pointer'}}>
                <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${d?'var(--hycu-cyan)':'var(--admin-line-strong)'}`,background:d?'var(--hycu-cyan)':'white',display:'grid',placeItems:'center',color:'white'}}>
                  {d && <Icon name="check" size={11}/>}
                </div>
                <span style={{fontSize:13,color:'var(--admin-ink)'}}>{l}</span>
              </label>
            ))}
          </div>

          <div>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10,fontWeight:600}}>배포 대상</div>
            {[
              { ic:'cloud', l:'HYCU LMS', sub:'시장조사론 · 5주차에 자동 등록' },
              { ic:'folder', l:'학과 공유 드라이브', sub:'/경영학부/2025-2/시장조사론' },
              { ic:'download', l:'로컬 다운로드', sub: '내 컴퓨터에 저장' },
              { ic:'mail', l:'이메일 전송', sub:'TA · 공동 강의 교수' },
            ].map((d, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'white',border:'1px solid var(--admin-line)',borderRadius:8,marginBottom:6,cursor:'pointer'}}>
                <div style={{width:30,height:30,borderRadius:6,background:'var(--admin-bg)',display:'grid',placeItems:'center',color:'var(--admin-charcoal)'}}><Icon name={d.ic} size={14}/></div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:12,fontWeight:600,color:'var(--admin-ink)'}}>{d.l}</div>
                  <div style={{fontSize:10,color:'var(--admin-muted)'}}>{d.sub}</div>
                </div>
                <Icon name="chevronRight" size={12} style={{color:'var(--admin-muted)'}}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:24,padding:'14px 16px',background:'rgba(34,160,107,0.06)',border:'1px solid rgba(34,160,107,0.2)',borderRadius:10,display:'flex',gap:12,alignItems:'flex-start'}}>
          <Icon name="check" size={16} style={{color:'#22A06B',flexShrink:0,marginTop:2}}/>
          <div style={{flex:1,fontSize:13,color:'var(--admin-charcoal)',lineHeight:1.55}}>
            <strong style={{color:'#166B4A',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>품질 검증 통과</strong> · 28/28 슬라이드가 마스터 좌표·교수자 안전 영역·시안 액센트 규칙을 준수합니다.
          </div>
        </div>

        <div style={{marginTop:20,display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button className="btn btn-ghost">미리보기</button>
          {!done && !building && <button className="btn btn-cyan" onClick={start}><Icon name="download" size={14}/> 내보내기 시작</button>}
          {building && (
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 16px',background:'rgba(0,181,226,0.06)',borderRadius:8,minWidth:280}}>
              <div style={{flex:1,height:6,background:'var(--admin-line)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',background:'var(--hycu-cyan)',width:progress+'%'}}></div>
              </div>
              <span style={{fontFamily:'ui-monospace,monospace',fontSize:11,minWidth:30,textAlign:'right'}}>{progress}%</span>
            </div>
          )}
          {done && (
            <button className="btn btn-cyan"><Icon name="check" size={14}/> 다운로드 완료 · 다시 받기</button>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width:900px){.export-formats{grid-template-columns:repeat(2,1fr)!important}.export-options{grid-template-columns:1fr!important}}
        @media (max-width:560px){.export-card{padding:20px!important}.export-formats{grid-template-columns:1fr!important;gap:8px!important}.export-formats button{padding:14px!important}}
        @media (prefers-reduced-motion:reduce){.export-card *{transition:none!important;animation:none!important}}
      `}</style>
    </div>
  );
};

// ----- Translation Hub (in export tab) -----
const TranslateHub = ({ deck, targetLangs, translations, statusInfo, translating, translateProgress, startTranslate, onScreen }) => {
  return (
    <div>
      {/* Header card */}
      <div className="card" style={{padding:24,marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:48,height:48,borderRadius:10,background:'rgba(0,181,226,0.1)',display:'grid',placeItems:'center',color:'#0091B8'}}>
            <Icon name="globe" size={22}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'#0091B8',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:600,marginBottom:4}}>다국어 교안</div>
            <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:22,margin:'0 0 4px',fontWeight:600,letterSpacing:'-0.01em'}}>05-02 척도 유형과 측정 신뢰도 — 외국어 번역</h2>
            <div style={{fontSize:13,color:'var(--admin-muted)'}}>28매 · 슬라이드 본문 · 학습 목표 · 키워드 · 내레이션 스크립트 · 형성평가 — 일괄 번역</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:32,fontWeight:600,color:'var(--admin-ink)',letterSpacing:'-0.02em'}}>2 / 4</div>
            <div style={{fontSize:11,color:'var(--admin-muted)'}}>승인·검수 진행 중</div>
          </div>
        </div>
      </div>

      {/* Language cards grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:14}}>
        {targetLangs.map(l => {
          const tr = translations[l.id] || { status: 'idle' };
          const st = statusInfo[tr.status];
          const isWorking = translating === l.id;
          const progress = isWorking ? translateProgress : (tr.progress || 0);
          return (
            <div key={l.id} className="card" style={{padding:20,position:'relative',overflow:'hidden'}}>
              {/* status accent bar */}
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:st.dot}}></div>

              <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:8,background:st.bg,display:'grid',placeItems:'center',color:st.color,flexShrink:0}}>
                  <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:14,fontWeight:700}}>{l.short}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:16,fontWeight:600,color:'var(--admin-ink)'}}>{l.native}</div>
                  <div style={{fontSize:12,color:'var(--admin-muted)'}}>{l.label}</div>
                </div>
                <span className="pill" style={{background:st.bg,color:st.color,fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600,whiteSpace:'nowrap'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:st.dot,display:'inline-block'}}></span>
                  {st.label}
                </span>
              </div>

              {/* Coverage / progress */}
              {tr.status === 'idle' ? (
                <div style={{padding:'14px 0',textAlign:'center',color:'var(--admin-muted)',fontSize:12,borderTop:'1px solid var(--admin-line-soft)',borderBottom:'1px solid var(--admin-line-soft)',marginBottom:12}}>
                  아직 번역되지 않았습니다.
                </div>
              ) : (
                <div style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:11,color:'var(--admin-muted)'}}>
                    <span>{tr.status === 'translating' ? 'AI 번역 진행' : '번역 완료'}</span>
                    <span style={{fontFamily:'ui-monospace,monospace',color:'var(--admin-ink)'}}>{tr.coverage || 0}/{deck.slides.length}매</span>
                  </div>
                  <div style={{height:6,background:'var(--admin-line)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',background:st.dot,width:progress+'%',transition:'width 0.2s'}}></div>
                  </div>
                  {tr.status === 'review' && (
                    <div style={{display:'flex',gap:6,marginTop:8,fontSize:11}}>
                      <span className="pill" style={{background:'rgba(34,160,107,0.1)',color:'#166B4A'}}>승인 {tr.approvedSlides || 0}</span>
                      <span className="pill" style={{background:'rgba(247,180,0,0.12)',color:'#9A6B00'}}>대기 {tr.pendingSlides || 0}</span>
                      <span className="pill">검수자 · {tr.reviewer}</span>
                    </div>
                  )}
                  {tr.status === 'approved' && (
                    <div style={{display:'flex',gap:6,marginTop:8,fontSize:11}}>
                      <span className="pill" style={{background:'rgba(34,160,107,0.1)',color:'#166B4A'}}><Icon name="check" size={10}/> {tr.approvedBy}</span>
                      <span className="pill">{tr.updated}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{display:'flex',gap:6}}>
                {tr.status === 'idle' && (
                  <button className="btn btn-cyan" style={{flex:1,justifyContent:'center'}} disabled={!!translating} onClick={() => startTranslate(l.id)}>
                    <Icon name="sparkles" size={13}/> 일괄 번역 시작
                  </button>
                )}
                {tr.status === 'translating' && (
                  <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} disabled>
                    <Icon name="refresh" size={13}/> 번역 중… {progress}%
                  </button>
                )}
                {tr.status === 'review' && (
                  <>
                    <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={() => onScreen('editor')}>
                      <Icon name="edit" size={12}/> 검수
                    </button>
                    <button className="btn btn-cyan" style={{flex:1,justifyContent:'center'}}>
                      <Icon name="check" size={12}/> 일괄 승인
                    </button>
                  </>
                )}
                {tr.status === 'approved' && (
                  <>
                    <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={() => onScreen('editor')}>
                      <Icon name="eye" size={12}/> 보기
                    </button>
                    <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}}>
                      <Icon name="refresh" size={12}/> 재번역
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Run all */}
      <div className="card" style={{padding:18,display:'flex',alignItems:'center',gap:14}}>
        <Icon name="sparkles" size={18} style={{color:'#0091B8'}}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:13,fontWeight:600,color:'var(--admin-ink)'}}>모든 미번역 언어 일괄 번역</div>
          <div style={{fontSize:11,color:'var(--admin-muted)',marginTop:2}}>용어집 12개 항목이 자동 적용 · 번역 후 모두 검수 대기 상태로 전환됩니다 · 약 4분 소요</div>
        </div>
        <button className="btn btn-cyan" disabled={!!translating}>
          <Icon name="globe" size={13}/> 전체 번역 실행
        </button>
      </div>

      {/* AI translation engine */}
      <div className="card" style={{padding:18,marginTop:14}}>
        <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:12,fontWeight:600}}>번역 엔진 설정</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,fontSize:12}}>
          {[
            ['엔진', 'Claude 3.5 Sonnet · 학술 모드'],
            ['톤', '교수 강의체 · 격식 (formal)'],
            ['용어집', 'HYCU_시장조사_v2.4 · 12개 항목'],
            ['문체 가이드', 'APA 7판 · 본문 인용 보존'],
            ['번역 단위', '슬라이드 + 본문 + 내레이션 + 자막'],
            ['예외 처리', '인용·고유명사·코드 보호'],
          ].map(([k,v], i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:i<4?'1px solid var(--admin-line-soft)':'none'}}>
              <span style={{color:'var(--admin-muted)'}}>{k}</span>
              <span style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',color:'var(--admin-ink)',fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----- Glossary panel -----
const GlossaryPanel = ({ q, setQ, items, langs }) => {
  const cats = [...new Set((window.GLOSSARY || []).map(g => g.cat))];
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{flex:1,position:'relative'}}>
          <Icon name="search" size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--admin-muted)'}}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="용어 검색…" style={{width:'100%',padding:'10px 12px 10px 36px',border:'1px solid var(--admin-line)',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box'}}/>
        </div>
        <button className="btn btn-ghost"><Icon name="upload" size={13}/> CSV 가져오기</button>
        <button className="btn btn-cyan"><Icon name="plus" size={13}/> 용어 추가</button>
      </div>

      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
        <span className="pill" style={{background:'rgba(0,181,226,0.1)',color:'#0091B8',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontWeight:600}}>전체 ({(window.GLOSSARY||[]).length})</span>
        {cats.map(c => <span key={c} className="pill">{c}</span>)}
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr style={{background:'var(--admin-bg)',borderBottom:'1px solid var(--admin-line)'}}>
              <th style={{textAlign:'left',padding:'10px 14px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',width:24}}></th>
              <th style={{textAlign:'left',padding:'10px 14px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>한국어 (원문)</th>
              {langs.map(l => (
                <th key={l.id} style={{textAlign:'left',padding:'10px 14px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l.short} · {l.native}</th>
              ))}
              <th style={{textAlign:'left',padding:'10px 14px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:11,fontWeight:600,color:'var(--admin-muted)',textTransform:'uppercase',letterSpacing:'0.06em',width:80}}>분류</th>
            </tr>
          </thead>
          <tbody>
            {items.map((g, i) => (
              <tr key={i} style={{borderBottom: i<items.length-1?'1px solid var(--admin-line-soft)':'none'}}>
                <td style={{padding:'10px 14px',color:g.locked?'#0091B8':'var(--admin-faint)'}}>
                  {g.locked ? <Icon name="lock" size={12}/> : null}
                </td>
                <td style={{padding:'10px 14px',fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',color:'var(--admin-ink)',fontWeight:500}}>{g.term}</td>
                {langs.map(l => (
                  <td key={l.id} style={{padding:'10px 14px',color:'var(--admin-charcoal)'}}>{g[l.id] || <span style={{color:'var(--admin-faint)'}}>—</span>}</td>
                ))}
                <td style={{padding:'10px 14px'}}>
                  <span className="pill" style={{fontSize:10}}>{g.cat}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:14,padding:'12px 14px',background:'rgba(0,181,226,0.05)',border:'1px solid rgba(0,181,226,0.18)',borderRadius:8,fontSize:12,color:'var(--admin-charcoal)',display:'flex',alignItems:'flex-start',gap:10}}>
        <Icon name="info" size={14} style={{color:'#0091B8',flexShrink:0,marginTop:2}}/>
        <div style={{lineHeight:1.55}}>
          <strong style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',color:'#0091B8',fontWeight:600}}>잠금 표시(🔒) 용어</strong>는 모든 번역에서 절대로 변형되지 않습니다.
          새 교시·새 강의에 자동으로 적용되며, 학과 단위로 공유할 수 있습니다.
        </div>
      </div>
    </div>
  );
};

window.Preview = Preview;
window.Chroma = Chroma;
window.ExportScreen = ExportScreen;
