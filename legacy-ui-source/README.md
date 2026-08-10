# legacy-ui-source — hycu-ai-studio-ui 백업 (2026-08-10)

hycu-ai-studio-ui repo(2026-08-04 생성 ~ 2026-08-10 삭제) 삭제 전 이관한 편집 가능 소스.
이 preview repo(hycu-studio-preview)가 정본으로 통합되면서, 원본 repo는 폐기됨.

## 상태 주의
- 이 소스는 v10 시점 스냅샷이다. preview의 index.html(배포 번들)은 이후 08-08 커밋(v11 —
  COURSE_PLAN을 AI 리터러시로 라벨링, 이번에 콘텐츠까지 완전 교체)으로 더 앞서 있다.
  즉 **이 jsx는 현재 배포본과 내용이 다르다** — export-screen.jsx/outline-screen.jsx 안
  "시장조사론"·"척도" 예시 텍스트는 구버전 잔재이며 실제 배포본 기준이 아니다.
- COURSE_PLAN(교과목 13주 카탈로그), Dashboard, Wizard, Editor, InspectionScreen,
  AddieMapping, Generating 등 v11에 추가/변경된 화면·데이터 구조는 이 소스에 없다 —
  index.html 압축 번들에만 존재한다(디마이너파이 필요).

## 원본 구조
- `source-v10/` — app.jsx(라우팅) · shell.jsx(사이드바/상단바/프로세스 네비) ·
  outline-screen.jsx(아웃라인 생성 화면) · export-screen.jsx(미리보기/크로마키/내보내기/번역/용어집)
- `scripts/` — build-v10.mjs, ui-v10.mjs (source-v10 → 배포용 HTML 빌드 스크립트)
- `DESIGN.md` — 디자인 시스템 문서(톤·컬러·레이아웃 원칙)

## 후속 작업 (미완료)
소스를 실제 배포본(index.html) 기준으로 갱신하고 빌드 파이프라인을 이 repo 안에서
다시 굴러가게 만드는 작업은 아직 하지 않았다. 지금은 순수 이력 보존용 백업이다.
