# source-current — index.html 번들과 100% 동일한 실제 소스

`work/HYCU_AI_Studio_v2.html`(구 legacy) / 루트 `index.html`(현재 배포본)은 self-bundled 아티팩트라
JS/CSS가 gzip+base64로 인코딩돼 있어 사람이나 Claude Design 같은 코드 리더가 직접 읽을 수 없다.
이 폴더는 그 배포본 안의 실제 번들 청크를 그대로 압축 해제해서 뽑아낸 것 — **재구성이나 추측이
아니라 배포 중인 바이트 그대로**다 (2026-08-11 추출, 커밋 시점의 index.html 기준).

## 구조

| 파일 | 내용 |
|---|---|
| `app.jsx` | 라우팅(App 컴포넌트), 화면 전환 |
| `shell.jsx` | Sidebar·Topbar·ProcessNav·ProcessFooter |
| `login-screen.jsx` | 로그인 화면 |
| `course-setup-screen.jsx` | Step 1: 교과목 정보 |
| `wizard-screen.jsx` | 교안 설정 — **COURSE_PLAN(13주 AI 리터러시 커리큘럼) 포함** |
| `outline-screen.jsx` | 아웃라인 생성 화면 |
| `generating-screen.jsx` | 슬라이드 렌더 진행 화면 |
| `editor-screen.jsx` / `editor-object-layer.jsx` | 편집 워크벤치 + 오브젝트 편집 레이어 |
| `inspection-screen.jsx` | 검수 화면 |
| `addie-mapping-screen.jsx` | ADDIE 단계 매핑 |
| `preview-chroma-export-screen.jsx` | 미리보기·크로마키·내보내기·번역·용어집 |
| `dashboard-screen.jsx` | 대시보드 |
| `library-screen.jsx` | 교안 라이브러리 |
| `content-dev-info.jsx` | Step 1 서브탭 콘텐츠 개발 정보 |
| `slide-canvas.jsx` | 슬라이드 캔버스 렌더러(HYCUSlide/ScaledSlide) |
| `blueprint-*.jsx` | 실제 AI 리터러시 05-02 슬라이드 본문(BP_SLIDE_BODIES 등) — 아웃라인 생성 시 실제 노출되는 콘텐츠 |
| `seed-data.jsx` | LECTURES/CURRENT_DECK 시드 데이터 — **AIG101/AI 리터러시 기준** |
| `design-system-primitives.jsx` | 디자인 시스템 5개 핵심 컴포넌트 |
| `icons.jsx` | 인라인 SVG 아이콘 세트 |
| `vendor/` | React·ReactDOM·Babel standalone (서드파티, 수정 대상 아님) |

## 알려진 잔존 이슈 (후속 정리 필요)

`slide-canvas.jsx`에 옛 시장조사론/척도 관련 하드코딩 콘텐츠가 약 30곳 남아있음(명목/서열/등간/비율 척도,
Likert/Stapel/Guttman 척도 등). `blueprint-*.jsx`의 실제 AI 리터러시 콘텐츠가 우선 적용되는 경로라
현재 데모(05-02)에는 노출 안 되는 것으로 보이나, 다른 슬라이드 번호·폴백 경로에서 여전히 참조될 수
있음 — 전수 조사 후 제거 필요. `library-screen.jsx`·`course-setup-screen.jsx`·`content-dev-info.jsx`에도
소량(1~2곳) 잔존.

## 이 폴더를 다시 최신화하려면

배포본이 바뀔 때마다 이 폴더가 자동으로 갱신되지 않는다 — index.html을 다시 손보면 이 폴더도 재추출해야
정합성이 유지된다. 재추출 스크립트는 별도 요청 시 정리 가능.
