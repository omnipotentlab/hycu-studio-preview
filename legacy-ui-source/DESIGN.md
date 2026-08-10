# HYCU AI Studio Design System

## 1. Atmosphere & Identity

HYCU AI Studio is a calm, precise academic production workspace. It pairs a dark institutional navigation rail with a bright document canvas and uses HYCU cyan only to communicate progress, selection, and action. The signature is the transition from a text outline into an immediately legible visual grammar: every slide explains both what it says and why a table, flow, diagram, or chart is the right representation.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---:|---|
| Brand accent | `--hycu-cyan` | `#00B5E2` | Primary action, selected state, progress |
| Brand accent deep | `--hycu-cyan-deep` | `#0091B8` | Accent text and strong focus |
| Brand accent hover | `--hycu-cyan-hover` | `#00A4CD` | Primary action hover |
| Brand accent active | `--hycu-cyan-active` | `#007A9A` | Primary action press |
| Brand tint | `--hycu-cyan-soft` | `rgba(0,181,226,.12)` | Selected backgrounds |
| Page surface | `--admin-bg` | `#F4F6F9` | App background and inset regions |
| Panel surface | `--admin-panel` | `#FFFFFF` | Cards, document, chat panel |
| Border | `--admin-line` | `#E4E8EE` | Default separators |
| Strong border | `--admin-line-strong` | `#D0D6DE` | Focused controls |
| Text primary | `--admin-ink` | `#0E1116` | Headings and body |
| Text secondary | `--admin-charcoal` | `#3C444F` | Supporting copy |
| Text muted | `--admin-muted` | `#6E7785` | Metadata |
| Text faint | `--admin-faint` | `#A6ADB6` | Disabled and placeholder |
| Success | `--success` | `#22A06B` | Quality and completion |
| Attention | `--attention` | `#E58E40` | Review status |
| Critical | `--critical` | `#E5484D` | Blocking issue |

Rules:

- Cyan is semantic, never decorative.
- Reference screenshots define layout and component anatomy; their beige/black palette is translated into the existing HYCU tokens.
- New UI must not introduce colors outside this table.

## 3. Typography

| Level | Size | Weight | Line height | Usage |
|---|---:|---:|---:|---|
| H1 | 26px | 700 | 1.25 | Page heading |
| H2 | 20px | 600 | 1.35 | Process screen title |
| H3 | 16px | 600 | 1.4 | Card and panel heading |
| Body | 14px | 400 | 1.65 | Main copy |
| Small | 13px | 400 | 1.6 | Supporting copy |
| Caption | 12px | 500 | 1.5 | Labels and metadata |
| Micro | 11px | 600 | 1.4 | Overline and compact state |

Font stack:

- Admin UI: `Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Apple SD Gothic Neo, sans-serif`
- Slide canvas: the four HYCU families with system fallbacks already embedded in the standalone bundle
- Mono metadata: `ui-monospace, SFMono-Regular, monospace`

Korean copy uses `word-break: keep-all`; narrow regions must not create one-character orphan lines.

## 4. Spacing & Layout

Base unit: 4px. Existing tokens remain canonical:

| Token | Value |
|---|---:|
| `--s-1` | 4px |
| `--s-2` | 8px |
| `--s-3` | 12px |
| `--s-4` | 16px |
| `--s-5` | 20px |
| `--s-6` | 24px |
| `--s-7` | 32px |
| `--s-8` | 40px |

- Desktop app shell: 208px sidebar plus flexible main canvas.
- Content maximum: 1360px, with 32px horizontal gutters.
- Outline workspace: minmax(0, 1fr) document + 320px AI panel; the AI panel is sticky under process navigation.
- At 1100px and below, the outline workspace becomes one column and the AI panel becomes a normal block.
- At 760px and below, format previews and export option grids become one column.
- Browser mechanics such as `minmax()`, percentages, and sticky positioning stay intrinsic rather than becoming tokens.

## 5. Components

### Outline Document

- **Structure**: process header, generation progress, slide outline list, sticky AI panel.
- **States**: start gate, streaming, complete, selected slide.
- **Accessibility**: selected slide exposes `aria-current`; generation progress uses `role=progressbar`.
- **Layout**: responsive sidebar composition; document is the primary scroll owner.

### Outline Slide Card

- **Structure**: slide number, ADDIE marker, editable title/body, format rationale, live format preview.
- **Variants**: text, table, kanban, diagram, flow, chart, quiz, image, none.
- **States**: default, selected, editing, format picker open, AI-updated.
- **Accessibility**: card selection is keyboard reachable; edit controls have explicit labels and visible focus.
- **Motion**: selection and AI-update confirmation use opacity/color only.

### Format Preview

- **Structure**: semantic format label, plain-language description of the content represented, DOM-rendered miniature.
- **Variants**: all outline formats listed above.
- **States**: default, selected format, no-visual.
- **Accessibility**: preview is descriptive, not the sole carrier of meaning; text always names the format and rationale.

### Outline AI Panel

- **Structure**: selected slide context, message history, quick actions, text composer, send control.
- **States**: empty selection, ready, applying, applied.
- **Accessibility**: message history uses a live region; composer has a visible label; Enter submits and Shift+Enter inserts a line break.
- **Motion**: messages enter with opacity/transform only and honor reduced motion.

### Export Format Card

- **Structure**: icon, format name, extension/use description.
- **Variants**: PPTX, PDF, SCORM, MP4.
- **States**: default, hover, selected, focus.
- **Accessibility**: behaves as a radio option with one selected format.

### Export Delivery Row

- **Structure**: destination icon, name, destination detail, disclosure affordance.
- **States**: default, hover, focus.
- **Accessibility**: button semantics and visible focus.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 150ms | ease-out | Button and card state |
| Standard | 220ms | ease-in-out | Picker and panel state |
| Streaming | 320ms cadence | linear | Outline generation |

- Animate only `transform` and `opacity`; existing progress width animation is retained as a meaningful state indicator.
- Hover exists only on interactive controls.
- `prefers-reduced-motion: reduce` removes message/card entrance motion and disables smooth transitions.

## 7. Depth & Surface

Strategy: borders-first with limited functional shadow.

- Cards: white panel, 1px `--admin-line`, 12px radius.
- Sticky AI panel: same card surface plus a restrained shadow only to communicate pinning above the document.
- Popovers: strong border and functional shadow.
- No nested card stacks unless each boundary represents a distinct control or state.

## 8. Accessibility Constraints & Accepted Debt

Constraints:

- Target WCAG 2.2 AA.
- Body contrast at least 4.5:1; large text and controls at least 3:1.
- Full keyboard reachability for slide selection, format changes, AI composer, export format, and delivery targets.
- Visible focus on every interactive element.
- Korean text must use natural phrase wrapping without clipped glyphs.
- Responsive checks at 375px, 768px, and 1280px with no horizontal scrolling of primary content.

Accepted debt:

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Standalone Claude Design bundle is a prototype rather than a production source tree | `work/HYCU_AI_Studio_v2.html` | Existing project architecture; this change preserves the established handoff artifact | Exit when the implementation repo replaces the planning UI bundle |
