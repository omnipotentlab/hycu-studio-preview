// ----- Preview, Chroma, Export screens -----

const Preview = ({ deck, currentSlide, setCurrentSlide, onScreen, chroma }) => {
  const slide = deck.slides[currentSlide];
  const previewHostRef = React.useRef(null);
  const [previewScale, setPreviewScale] = React.useState(0.55);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setCurrentSlide(Math.min(deck.slides.length-1, currentSlide+1));
      if (e.key === 'ArrowLeft') setCurrentSlide(Math.max(0, currentSlide-1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentSlide]);
  React.useLayoutEffect(() => {
    const host = previewHostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return;
    const fit = () => {
      const widthScale = (host.clientWidth - 24) / 1920;
      const heightScale = (window.innerHeight - 360) / 1080;
      setPreviewScale(Math.max(0.15, Math.min(0.55, widthScale, heightScale)));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  return (
    <div className="content" style={{maxWidth:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{flex:1}}></div>
        <span className="pill"><Icon name="eye" size={11}/> 학습자 시점 미리보기</span>
      </div>

      <div ref={previewHostRef} className="preview-stage" style={{display:'grid',placeItems:'center',padding:'12px 0',minWidth:0,width:'100%',maxWidth:'100%',overflow:'hidden'}}>
        <ScaledSlide slide={slide} deck={deck} scale={previewScale} frame currentSlide={currentSlide+1} chroma={chroma}/>
      </div>

      <div className="preview-transport" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'white',border:'1px solid var(--admin-line)',borderRadius:10,marginTop:12}}>
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
        <div className="preview-thumbnails" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(144px, 1fr))',gap:8}}>
          {deck.slides.map((s, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{minWidth:0,overflow:'hidden',padding:3,background:'transparent',border:i===currentSlide?'2px solid var(--hycu-cyan)':'1px solid var(--admin-line)',borderRadius:6,cursor:'pointer'}}>
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
  const stageRef = React.useRef(null);
  const [collisionCount, setCollisionCount] = React.useState(null);
  React.useLayoutEffect(() => {
    const measure = () => {
      const root = stageRef.current;
      const zone = root && root.querySelector('.instructor-zone');
      if (!zone) return setCollisionCount(null);
      const safe = zone.getBoundingClientRect();
      const collisions = [...root.querySelectorAll('.bp-slide .ct-item, .bp-slide .ct-text')].filter(node => {
        if (node.closest('.instructor-zone')) return false;
        if (!node.matches('.ct-item') && node.closest('.ct-item')) return false;
        const box = node.getBoundingClientRect();
        return box.right > safe.left && box.left < safe.right && box.bottom > safe.top && box.top < safe.bottom;
      });
      setCollisionCount(new Set(collisions).size);
    };
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [currentSlide, instructorPos, instructorScale]);
  React.useEffect(() => {
    const onKey = event => {
      if (event.key === 'ArrowRight') setCurrentSlide(Math.min(deck.slides.length - 1, currentSlide + 1));
      if (event.key === 'ArrowLeft') setCurrentSlide(Math.max(0, currentSlide - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentSlide, deck.slides.length]);
  const hasCollision = collisionCount > 0;
  return (
    <div className="content" style={{maxWidth:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <button className="btn btn-ghost" onClick={() => onScreen('editor')}><Icon name="chevronLeft" size={13}/> 에디터로</button>
        <div>
          <div style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:18,fontWeight:600}}>교수자 크로마키 합성 시뮬레이터</div>
          <div style={{fontSize:12,color:'var(--admin-muted)',marginTop:2}}>우측 하단 480×540px 안전 영역에 교수자 영상이 합성됩니다. 본문이 침범되는지 미리 확인하세요.</div>
        </div>
        <div style={{flex:1}}></div>
        <span className="pill" style={{background:hasCollision?'rgba(229,142,64,0.12)':'rgba(34,160,107,0.1)',color:hasCollision?'#8A4A12':'#166B4A'}}>
          <span className="dot" style={{background:hasCollision?'#E58E40':'#22A06B'}}></span>{collisionCount == null ? '안전 영역 계산 중' : hasCollision ? `겹침 ${collisionCount}개 · 검토 필요` : '겹침 없음 · 안전'}
        </span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:14}}>
        <div>
          <div ref={stageRef} style={{display:'grid',placeItems:'center'}}>
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
              ['본문 겹침', collisionCount == null ? '계산 중' : `${collisionCount}개 요소`, !hasCollision],
              ['로고 위치', '60, 32', true],
              ['진도바 충돌', '없음', true],
              ['ADDIE 인디케이터', '활성: D', true],
            ].map(([k,v,ok], i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<4?'1px solid var(--admin-line-soft)':'none'}}>
                <Icon name={ok ? 'check' : 'alertTriangle'} size={12} style={{color:ok?'var(--success)':'var(--attention)',flexShrink:0}}/>
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
              기본 100% 교수자 영역(D)은 절대 좌표 <code style={{background:'var(--admin-bg)',padding:'1px 4px',borderRadius:3,fontFamily:'ui-monospace,monospace',fontSize:11}}>1420, 540</code>의 480×540px입니다. 겹침 수를 확인하고 슬라이드별로 배치나 합성 크기를 조정하세요.
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
        <h2 style={{fontFamily:'Pretendard Variable, Pretendard, system-ui, sans-serif',fontSize:24,margin:'0 0 4px',fontWeight:600,letterSpacing:'-0.01em',wordBreak:'keep-all'}}>HYCU_<wbr/>AI리터러시_<wbr/>3주차_<wbr/>02교시.{extension}</h2>
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
              { ic:'cloud', l:'HYCU LMS', sub:'AI 리터러시 · 3주차에 자동 등록' },
              { ic:'folder', l:'학과 공유 드라이브', sub:'/공통교육/2025-2/AI리터러시' },
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
          {done && format === 'pptx' && (
            <a className="btn btn-cyan" href="./assets/HYCU_AI%EB%A6%AC%ED%84%B0%EB%9F%AC%EC%8B%9C_3%EC%A3%BC%EC%B0%A8_02%EA%B5%90%EC%8B%9C.pptx" download="HYCU_AI리터러시_3주차_02교시.pptx" style={{textDecoration:'none'}}>
              <Icon name="check" size={14}/> 다운로드 완료 · 다시 받기
            </a>
          )}
          {done && format !== 'pptx' && (
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

window.Preview = Preview;
window.Chroma = Chroma;
window.ExportScreen = ExportScreen;
