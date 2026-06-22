# Design Principles

> The reasoning layer — universal design principles covering **hierarchy**, **layout**, **typography rhythm**, **color logic**, **depth**, **interaction**, **responsive thinking**, and **UI component behavior**. Written so AI agents can generate, audit, or improve any design artifact regardless of the specific design system, framework, or technology in use. Apply these principles alongside any design system to ensure structural integrity, visual clarity, and cognitive coherence.

---

## 0. How agents must use this file and the other standards files

1. **Load and apply the design system first — always.** The design-system files define fonts, colors, spacing tokens, radius, shadows, and component specs. Those are the source of truth for concrete values. Implement tokens and component rules before layering anything from this file, `spacing-principles.md`, or `typography-principles.md`.
2. **Then apply UI/UX and typography principles to improve the result.** After the design-system spec is satisfied, use this file, `spacing-principles.md`, and the typography standards to refine hierarchy, contrast, spacing rhythm, interaction clarity, and polish. Principles **enhance** a compliant design — they do not replace the system.
3. **Use this file as the reasoning layer.** When the design system says *what* token to use, this file and the other standards files explain *why* that pattern works and what principles must hold.
4. **When the design system is silent, these principles decide.** Any design decision not covered by the system's tokens or component rules falls back to the principles here.
5. **Never contradict the design system.** If a principle here and a design-system rule conflict, the design system wins for that product. Flag the conflict for human review.
6. **Justify every deviation.** If a design intentionally breaks a principle, name it, explain why, and state the compensating control.

### Application order (mandatory)

```
1. Design system tokens & component specs  →  ship these first
2. Spacing principles (spacing-principles.md) →  tier, grouping, inner vs outer gaps
3. UI principles (this file)               →  refine structure, contrast, depth, interaction
4. Typography principles                   →  refine type hierarchy, leading, section headings
```

Never skip step 1. Never let step 2 or 3 override a design-system token unless a human explicitly documents the exception.

## 0.1 Non-negotiable component & surface rules

These rules override conflicting guidance elsewhere in this document. Apply them on every surface unless the user brief explicitly documents an exception.

### Badges are never full width

- **Badges must be inline, content-sized elements** — they hug their label and optional icon. A badge sizes to its text (plus padding), not to the width of its parent.
- **Full-width badges are forbidden** — never set `width: 100%`, `display: block` spanning a row, or stretch a badge to fill a card, column, or section unless the brief explicitly redefines the component (and even then, prefer a banner or alert, not a badge).
- Badges annotate status, category, or count. If the element spans a row like a bar or strip, it is **not** a badge — use an alert, banner, or list row instead.

### Inputs on matching backgrounds need visible contrast

- When an input's fill color matches (or nearly matches) its parent surface, **the field becomes invisible** — users cannot see where to type.
- **Fix:** lighten (or darken, on dark surfaces) **both** the input background **and** its border relative to the parent — enough to read as a distinct control at a glance, while staying within the design system's palette (use the next step on `neutral-*`, `brand-*`, or border tokens — never raw hex unless the system has no token).
- Apply the same rule to search fields, textareas, and selects sitting on tinted section backgrounds, cards, or nav bars.
- Contrast must hold in default, hover, focus, and error states — focus rings alone are not a substitute for a visible field at rest.

### Nested border radius must be calculated, not guessed

When a rounded parent contains a rounded child with padding (or margin) between them, **do not reuse the same radius on both** — the inner curve will look wrong (too tight or visually "broken").

Use the nested-radius formula:

```
innerRadius + distance = outerRadius
```

Where **distance** is the gap between the two curves — typically the parent's **padding** (or the margin between nested surfaces).

**Examples:**

| Parent corner radius | Padding / gap | Child corner radius |
|---|---|---|
| 24 | 8 | **16** (`24 − 8`) |
| 36 | 12 | **24** (`36 − 12`) |
| 16 | 4 | **12** (`16 − 4`) |

Units follow the design system (px, rem, etc.) — the math is the same.

**Derive values from tokens (preferred):**

Define three related values and keep them in sync wherever your stack stores design tokens (theme file, component props, style dictionary, etc.):

| Token / variable | Role |
|---|---|
| `outerRadius` | Corner radius of the parent container |
| `padding` (or `gap`) | Inset between the parent edge and the inner element |
| `innerRadius` | Corner radius of the nested child — **`outerRadius − padding`** |

**Forward:** you know the parent radius and padding → set `innerRadius = outerRadius − padding`.

**Reverse:** you know the child radius and padding → set `outerRadius = innerRadius + padding`.

Map these names to your implementation layer (CSS custom properties, Tailwind theme extension, SwiftUI `CornerRadius`, Figma variables, etc.). The formula is fixed; only the syntax changes.

When padding differs per side, use the **smallest inset** that separates the curves, or compute per-corner if asymmetry is intentional. Never copy the parent's radius onto the child without subtracting the gap.

### Input + button rows must share height

- When an input and a button sit **side by side in the same row** (search + submit, email + subscribe, filter + apply), **both controls must match height exactly** — same total box height including padding and border.
- Align them on one baseline row; do not let the input appear shorter, taller, or visually “floating” next to the button.
- Match vertical padding, font size, line-height, and border width so the outer edges line up. If the design system defines button height, **derive the input height from that token** — do not invent a second size.
- This rule applies to text fields, search fields, selects, and textareas paired with a button in a horizontal group. Stacked layouts (input above button) are exempt.

### Icon inset on inputs must balance both sides

- When an input carries a **leading or trailing icon** (search magnifier, mail glyph, currency symbol, etc.), the placeholder and typed text sit **after** the icon — not centered in the full field.
- **The gap from the icon to the input edge must equal the gap from the icon to the placeholder/text.** If the icon sits 12px from the start edge, leave 12px between the icon and where the text begins. Asymmetric spacing makes the field feel lopsided: text hugging the icon on one side while the icon floats too far from the border on the other.
- Measure both gaps on the **same axis** — inline-start edge → icon → text start (LTR: left edge → icon → text). Trailing icons mirror the rule on the inline-end side.
- Derive input text padding from the design system's icon inset token: `textPaddingStart = iconInset + iconWidth + iconInset` (or the equivalent in your stack). Do not pad text from the field edge alone and bolt the icon on with a separate, smaller inset.
- Applies to search fields, text inputs, textareas, and selects with inline icons. Icon-only buttons attached to the field (clear, reveal password) follow the input + button row rule above for height; this rule governs **in-field** icon spacing only.

### Native selects must replace the default arrow

The browser's native `<select>` arrow is an OS-rendered glyph jammed against the right edge with no controllable spacing. Left as-is it looks cramped, clashes with every other styled input, and on dark surfaces opens a white option list. A native select must be restyled to match the design system's other controls.

- **Strip the native arrow.** Set `appearance: none` (plus `-webkit-appearance` / `-moz-appearance` for legacy engines) so the default glyph is removed and you control the indicator.
- **Render a custom chevron** (SVG icon or background image) positioned a consistent inset from the inline-end edge — use the **same icon inset token** the design system uses elsewhere (e.g. 12px). Do not let it sit flush against the border.
- **Reserve trailing padding so text never collides with the chevron.** Derive it the same way as the in-field icon rule above: `paddingInlineEnd = chevronInset + chevronWidth + chevronInset` (≈ `2.5rem` for a 16px chevron at a 12px inset). The trailing chevron inset must mirror the leading text inset so the field reads balanced, not lopsided.
- **Match sibling input states.** Style default, hover, focus, and disabled to match adjacent text fields — same border, fill, and focus ring (apply the same-background contrast rule above). A select must not read as a different control family.
- **Fix the option list on dark surfaces.** Set `color-scheme: dark` (on the select or a root scope) so the still-OS-rendered expanded option list uses dark menu chrome instead of a default white popup.
- Applies to every native `<select>` and multi-select. If a richer custom dropdown (listbox / combobox) is used instead, it follows the widget size token and icon-inset rules here plus the keyboard conventions in §12.2.

### Button labels must not wrap — buttons must not shrink

- **Button label text must stay on one line** — wrapping to a second line is forbidden. Multi-line buttons break height rhythm, misalign adjacent controls, and read as broken layout, not intentional design.
- **Buttons must not shrink** in flex or grid rows. A button keeps its full intrinsic width (label + horizontal padding + icon gap). Neighboring elements (inputs, chips, copy) compress or truncate before the button does.
- **Implementation:** `white-space: nowrap` on the label; `flex-shrink: 0` (or equivalent) on the button; `min-width: fit-content` / `width: max-content` when the layout would otherwise squeeze the control. Icon-only buttons are exempt from the nowrap rule but still must not shrink below their defined touch target.
- If the label is too long for the available space, **shorten the copy** or **reflow the layout** (stack, wrap the row, move actions to a footer bar) — never wrap the button text and never let the button collapse to fit.

### Adjacent buttons must share the same size

- When two or more buttons sit **next to each other in the same row** (Cancel + Save, Login + Sign up, secondary + primary CTAs, toolbar actions), **every button in that group must match** — same height, same vertical padding, same horizontal padding token, same font size, and same border width.
- Do not place a tall primary next to a short secondary, or mix padding scales because labels differ in length. Uneven neighbors read as broken alignment, not intentional hierarchy. Hierarchy comes from **variant** (primary vs secondary vs ghost), not from resizing the control box.
- **Width may differ** by label length — that is expected. **Height and padding must not.** If the design system defines a button size token (`sm`, `md`, `lg`), every adjacent button in the group uses the **same** size token.
- **Icon-only buttons** in the same row as labeled buttons must match the labeled buttons' **height** (same outer box height / touch target). Width follows the icon-only padding rule; height stays locked to the group.
- **Implementation:** apply one shared size class or token set to the whole button group; avoid per-button inline padding overrides. In flex rows, align on `align-items: stretch` only when all buttons share identical padding — otherwise use `align-items: center` with enforced equal min-height from the design system.

### Buttons use the design-system base size — not arbitrary scales

- **Buttons default to the design system's base size token** (`md`, `default`, or whatever the system names its standard control size). Primary, secondary, ghost, and icon buttons all share that base height and padding unless the brief explicitly assigns a different tier.
- **Do not invent one-off button sizes** per screen, per label length, or per layout squeeze. If a button looks too large or too small, fix the layout or copy — do not create a custom padding override on the button itself.
- **Only these control types may use non-base size tokens:** **dropdown triggers**, **widgets** (date pickers, comboboxes, segmented controls, filter chips with menus), and **inputs** (text fields, search fields, textareas, selects). Those components follow their own size modules (`sm`, `xs`, compact search, dense table row, etc.) because they serve data entry and selection — not primary action.
- When a button sits beside an input, dropdown, or widget, **the button stays on the base size**; match the row by aligning the **input/dropdown/widget** to the button's outer height (see *Input + button rows must share height* above) — never shrink the button to a smaller token to fit a compact field.
- **Exception:** icon-only buttons use the design system's icon-button padding rule on the base size track — they are not a separate "small button" tier unless the system defines `icon-sm` / `icon-md` explicitly.

### Mockups and illustrations must feel premium

- Where the layout calls for a **mockup, product shot, hero illustration, empty-state graphic, or decorative visual**, do not ship placeholders, broken-image icons, gray boxes, or clip-art.
- **Prefer custom SVG** (or equivalent vector output) that matches the active design system — correct palette, radius, shadow, and typography rhythm. The result should feel **intentional, polished, and premium**, not generic or template-grade.
- Avoid stock “SaaS blob” clichés, low-effort wireframe blocks, and emoji used as stand-ins for real product UI unless the brief explicitly calls for playful emoji branding.
- Every illustration must serve composition: depth, hierarchy, or storytelling — never filler.

### Icons must be real icons — not text substitutes

- Where the design specifies an icon (nav, buttons, feature tiles, status, social, accordion chevrons, etc.), **render a proper icon** — SVG icon component or icon font — not a Unicode emoji, bare letter, or empty circle unless the brief explicitly requests emoji.
- If the project has no icon set yet, **install a reputable library** (e.g. Lucide, Font Awesome, Heroicons, Phosphor) and use it consistently. One family per product; match stroke weight and size to the design system.
- Icon size, color, and touch target must follow the design-system module for icons / controls. Pair icons with accessible labels (`aria-label` or visible text) where meaning is not obvious from context alone.

### Images must be beautiful and on-brand

- Wherever photographic media, hero imagery, or thumbnails appear, use **high-quality, art-directed visuals** — sharp, well-lit, relevant to the product story, and harmonious with the design-system color world.
- Never use obvious placeholder services, low-resolution stock, stretched assets, or images that clash with the page palette unless loading state explicitly requires a skeleton.
- Prefer curated photography or custom graphics over random stock. Crop and frame for the container; respect aspect ratio and nested-radius rules when images sit inside rounded cards.

### Framed videos (not full-bleed backgrounds)

- When a video sits **inside a section or hero as content** (not edge-to-edge background), wrap it in a **visible frame** — rounded container, border or surface treatment, and **elevation from the design-system shadow tokens** (`shadow-md`, `shadow-lg`, or the level mapped to prominent cards in the active design system).
- The frame should match card radius tokens and nested-radius math when padding separates the frame from the video.
- Background videos (full-bleed hero backdrops with overlay content) are exempt from framing — they fill the section. **Inline / inset videos** always get the frame + shadow treatment.
- Apply the same light-source and shadow discipline as cards and modals; do not use ad-hoc drop shadows outside the token scale.

### Contextual heading size caps (dashboard, store, marketing)

Marketing landing pages may use the design system's **largest display/hero scale** — oversized headlines are expected there. **Dashboard and store application surfaces are not marketing pages.** They must stay denser and quieter: smaller headings, tighter hierarchy, less display type.

Apply these **maximum font sizes** unless the user brief explicitly documents an exception:

| Surface | Context | Max heading size |
|---|---|---|
| **Dashboard / app** | Page titles, section headings, nav context, billing, settings, empty states | **28px** |
| **Dashboard / app** | Widget titles, widget section labels, in-card KPI headings, chart headers | **24px** |
| **E-commerce / store** | Storefront **hero only** (home hero, collection hero, campaign hero) | Design-system hero/display scale allowed |
| **E-commerce / store** | All other surfaces — PLP headers, PDP titles, cart, checkout, account, nav, cards, order confirmation | **28px** for primary **h1** and **h2** only |
| **Marketing** | Landing pages, campaign pages, pricing marketing sections | Design-system display/hero scale allowed |

**Rules:**

- **Dashboard headings must be smaller than marketing landing-page headings.** Never reuse a marketing hero headline size on a dashboard page title, sidebar section, or app chrome.
- **Widget headings are always capped at 24px** — even when the same component family on a marketing page would allow larger type. Widgets are dense data surfaces; oversized titles steal space from the metric or chart.
- **Store hero exception is narrow.** Only true storefront hero bands (full-width hero with headline + CTA / imagery) may exceed 28px. Product grids, product detail pages, cart lines, checkout steps, and order summaries are **not** heroes — cap h1/h2 at **28px**.
- **Semantic HTML still applies.** Use one h1 per view where appropriate; visual size comes from these caps, not from picking a larger marketing token because it exists in the type scale.
- **When the design system defines tokens above these caps**, map dashboard and non-hero store headings to the **largest token that respects the cap** — do not copy marketing display tokens into app or store UI.

**Quick check:**

- Dashboard page title ≤ 28px, every widget title ≤ 24px?
- Store page outside the hero: h1/h2 ≤ 28px?
- Marketing-only display sizes appear **only** on marketing landing pages and store hero bands?

### Sticky navbars reserve hero top space — navbar height + 96px

When the primary navigation is **sticky** or **fixed** (`position: sticky`, `position: fixed`, or equivalent app chrome that stays on screen while scrolling), the **first hero band** on the page must not start flush with the viewport top. The nav occupies that layer; hero content that ignores it will sit **under** the bar, clip on load, and feel cramped when the user scrolls back to the top.

**The rule (mandatory):**

```
heroPaddingTop = navbarOuterHeight + 96px
```

| Term | Meaning |
|---|---|
| **`navbarOuterHeight`** | Total block size of the nav as rendered — content box **plus** vertical padding, borders, and any bottom shadow or hairline that visually belongs to the bar. Measure the **actual painted height**, not a guessed token. |
| **`96px`** | Fixed breathing room **between the bottom edge of the navbar and the start of hero content** (headline, eyebrow, primary CTA row, or hero media). This is **in addition to** clearing the nav — not a substitute for it. |

**What “hero content start” means:** the first meaningful block inside the hero — headline, subcopy, CTA cluster, or inset hero media — not decorative full-bleed background that intentionally runs behind the nav (see exceptions below).

**Implementation (preferred order):**

1. **Apply `padding-top` on the hero section** (or the hero’s inner content wrapper), not `margin-top` on the nav alone. Padding keeps background fills and full-bleed treatments predictable; margin on the nav does not reserve space inside the hero’s box model.
2. **Compute from measured nav height** — use a CSS variable, layout token, or runtime measurement (`ResizeObserver`, `--header-height`) so the value updates when the nav wraps, gains a promo strip, or changes at breakpoints. Do not hard-code `64px` if the bar is actually `72px` on mobile.
3. **Set `scroll-padding-top`** on `html` or the scroll container to at least `navbarOuterHeight` (often the same variable) so in-page anchor links and “scroll to section” CTAs land with headings visible, not hidden under the sticky bar.
4. **Separate concerns:** `navbarOuterHeight` clears overlap; the **`96px`** gap is typographic/section rhythm — do not fold it into the nav height variable or shrink it to “save space” unless the brief documents an exception.

**Formula in tokens (when the design system uses rem):**

```
heroPaddingTop = navbarOuterHeight + spacing-24   /* 96px at 16px root = 6rem */
```

Map `spacing-24` (or the system’s **96px / 6rem** section-gap token) to the fixed **96px** requirement when no token exists — do not substitute a smaller step (e.g. 64px) without documented exception.

**Responsive behavior:**

- Recompute **`heroPaddingTop` at every breakpoint** where the navbar changes height (stacked mobile nav, collapsed logo row, added utility strip). A desktop nav of `80px` and a mobile nav of `112px` each get their own `+ 96px`.
- If the nav **shrinks on scroll** (compact sticky state), use the **taller initial height** for hero padding so above-the-fold layout does not jump when the bar compacts. Optionally animate inner hero spacing on scroll — never reduce below **`navbarOuterHeight + 96px`** at rest.
- **Safe areas:** on notched devices, `navbarOuterHeight` includes `env(safe-area-inset-top)` when the nav extends into the status bar — the hero formula still adds **96px below** the nav’s bottom edge.

**Exceptions (narrow):**

- **Intentional overlap:** marketing heroes that deliberately place a headline **behind** a transparent nav must still offset **readable content** (copy, CTAs) by **`navbarOuterHeight + 96px`** from the viewport top, even if a background image or video bleeds to `0`. Overlap is for atmosphere, not for text under the bar.
- **Non-hero pages:** dashboard, settings, and app shells use page title spacing from the design system — this rule targets **landing, marketing, and storefront hero bands** (see §0.1 contextual heading caps). Sticky app chrome still requires **`scroll-padding-top ≥ navbarOuterHeight`** on those surfaces.
- **No sticky nav:** if the nav scrolls away with the page, default section spacing applies — do not add the **`+ 96px`** offset.

**Failure modes (forbidden):**

- Hero h1 or primary CTA partially hidden under the sticky bar on first paint.
- Using only `padding-top: 96px` without adding **`navbarOuterHeight`** — content still slides under the nav.
- Using only `padding-top: navbarOuterHeight` with **no 96px gap** — legal clearance but visually crushed against the bar.
- Pushing the hero down with **`margin-top` on the nav** or **`top` offset hacks** instead of hero padding — breaks full-bleed backgrounds and sibling sections.

**Quick check:**

- Sticky/fixed nav present → hero **`padding-top === navbarOuterHeight + 96px`** (± rounding to system grid)?
- Anchor / hash navigation → **`scroll-padding-top ≥ navbarOuterHeight`**?
- Nav height remeasured after breakpoint or promo-strip change?
- Readable hero copy starts **below** the bar with visible **96px** air, not touching the nav shadow?

### Landing-page navbar width must match the section content width

On landing / marketing pages, the navbar's content must line up with the page's content column. If the sections constrain their content to a max-width, **the navbar's inner content uses the same max-width** so the logo, nav links, and CTA align to the exact same left and right edges as the content below.

- **Match the section content max-width.** Sections at `1280px` → navbar content container at `1280px`. Sections at `1024px` → navbar content at `1024px`. Whatever value the sections use, the navbar inner wrapper uses the **same token / value**.
- **Align the edges, not just the number.** Logo snaps to the section's left content edge; the trailing CTA / nav cluster snaps to the right content edge — same horizontal padding/gutter as the sections. The navbar reads as part of the same grid, never wider or narrower than the content it sits above.
- **Bar vs. content.** The navbar **background / border / shadow** may still span full viewport width (edge-to-edge bar). It is the **inner content wrapper** that is constrained to the section width — exactly like the sections, where the band is full-bleed but the content is capped.
- **Implementation:** use the **same max-width container** (same class, token, or `--content-max-width` variable) for the navbar inner wrapper and the section inner wrappers. Do not hard-code a different navbar width. When the section width changes at a breakpoint, the navbar content width changes with it.

**Scope — landing pages only.** This rule applies to **landing / marketing / storefront-hero pages**. It does **not** apply to application UI, dashboards, settings, modals, or app chrome — those use full-width or app-shell navigation widths defined by the design system, not the marketing content column.

**Quick check:** Drop a vertical guide on the section's left and right content edges. Do the navbar's logo and CTA land on those same two lines?

### Marketing & e-commerce content width is 1280px

On **marketing** and **e-commerce** surfaces, the content column has a single canonical max-width: **1280px**. Every section, every band, and the navbar all cap their inner content at the same 1280px so the whole page shares one consistent content edge top to bottom.

- **One width for the whole page.** All marketing / store sections (hero, features, pricing, testimonials, product grid, PDP, cart, footer) constrain their **inner content** to **1280px**. The navbar's inner content uses the **same 1280px** (see *Landing-page navbar width* above) so logo and CTA align to the section edges.
- **Full-bleed band, capped content.** Section **backgrounds** (color, image, gradient) may still run edge-to-edge across the viewport. It is the **inner content wrapper** that is locked to 1280px — the band is full width, the content is not.
- **Narrower only when the component demands it.** When a single component should not be that wide — a standalone accordion / FAQ, a reading column (long-form copy at 45–75 chars/line per §4.1), a login or checkout form card, a single dialog — give **that component** its own narrower max-width inside the 1280px column. The exception is the **component**, not the section: the section still uses the 1280px container; only the inner element is narrowed.
- **Implementation:** define one shared container token / class (e.g. `--content-max-width: 1280px`) and apply it to every marketing/store section and the navbar. Do not hard-code per-section widths. Narrow components get a separate, smaller max-width token (e.g. `--reading-max-width`, `--form-max-width`) nested inside the 1280px wrapper.

**Scope.** Applies **only** to marketing and e-commerce surfaces. It does **not** apply to **dashboards / application UI** — those are **full width** or follow the **app-shell layout width defined by the typeui MCP / design system** (sidebar + fluid main, fixed content panes, etc.), never the 1280px marketing column.

**Quick check:**

- Every marketing/store section + navbar content capped at 1280px?
- Backgrounds may be full-bleed, but content stays within 1280px down the whole page?
- Only genuinely narrow components (single accordion, reading column, form card) use a smaller width — and they sit inside the 1280px container, not replace it?
- Dashboard / app surfaces use the app-shell width, not 1280px?

---

# Pillar 1 — Constraints

## 1.1 What are design constraints?

Constraints are limitations on the designs you create. They originate from customers, stakeholders, the medium itself, or are self-imposed. Within these limitations great ideas emerge faster — narrowing the possibilities while accelerating production. Constraints are the starting point, not the obstacle.

## 1.2 Constraint categories

| Category | What it covers |
|---|---|
| **Problem / audience** | Who the users are, what problem you solve, literacy level, cultural context. |
| **Device / medium** | Screen sizes, network speed, input modalities. |
| **Brand / corporate** | Guidelines, voice, tone, retention metrics. |
| **Accessibility** | WCAG 2.2 AA, color vision deficiency, RTL, reduced motion. |
| **Development / platform** | Stack capabilities, platform conventions (each platform's published interface guidelines, web standards), performance budgets. |
| **Timeline & budget** | Deadlines, team size, available tooling. |

## 1.3 Start with a feature, not a layout

Do not design the shell (navigation, sidebar, footer) first. Start with a piece of actual functionality — the core task the user needs to accomplish. The shell can only be designed well once you understand the features it must contain.

Design the smallest useful version you can ship. If part of a feature is a "nice-to-have," design it later.

## 1.4 Agent rules — constraints

- **DO** identify and list all known constraints before generating any design.
- **DO** design within platform conventions to leverage the user's existing mental model.
- **DO** treat accessibility as a constraint from the first pass — not a polish step.
- **DO NOT** treat constraints as purely negative. Every constraint removes inferior options.
- **DO NOT** ignore audience-specific constraints. Language direction, literacy level, cultural context, and device environment shape every surface.

---

# Pillar 2 — Hierarchy & Emphasis

## 2.1 What is visual hierarchy?

Visual hierarchy is how you control where the eye goes first, second, and third on any surface. It is the single most important factor in making something look "designed" — more than color choice, font choice, or illustration quality. It draws on Gestalt psychology: the brain's compulsion to create order out of chaos, find patterns, and group separate elements into a unified whole. Hierarchy *uses* that compulsion rather than fighting it.

The test is simple: blur your eyes or shrink the design to thumbnail size. Can you still tell what the most important element is? If everything looks the same at a glance — same size, same weight, same color — the hierarchy is broken and the user has to *read* the whole page to figure out what matters. That is a design failure.

A working hierarchy does three things:

1. **Draws the eye to the primary element immediately** — the headline, the main CTA, the key data point. The user should know what this screen is *about* within one second.
2. **Provides a clear visual path** from primary to secondary to tertiary content, so scanning feels effortless rather than exhausting.
3. **Makes secondary and tertiary content findable but quiet** — present for users who need it, but never stealing attention from what matters most.

### Hierarchy works at every viewing distance

A well-designed surface has engagement points at multiple levels of attention. At a distance (a thumbnail, a notification, a peripheral glance), the primary element should still be identifiable through size and contrast alone. At arm's length, the secondary structure — headings, grouping, key actions — should become readable. At close reading distance, the full detail layer is available. If the design only works at close reading distance, it fails every casual or hurried user.

This also means **context shapes hierarchy demands.** A user who is rushing through a checkout on a bus with one hand occupied needs a more aggressive hierarchy — fewer levels, bigger targets, louder primary action — than a user browsing a portfolio on a desktop at leisure. The hierarchy must match the cognitive budget the user realistically has.

## 2.2 Core hierarchy principles

### Alignment

Alignment is the invisible thread that ties a design together. When a heading, a paragraph, and a button all share the same left edge, the eye reads them as one coherent unit without effort. When they each start at a slightly different position, the brain wastes energy figuring out whether the misalignment means something or is just sloppy.

In practice this means: pick an axis (usually the left edge in LTR languages) and lock content to it. Within a card, every line of text should start at the same horizontal position. Across a page, sections should share the same content margins. Icons and labels sitting side by side should share a baseline or center line — pick one and be consistent.

Deliberate misalignment *can* create emphasis — offsetting a pull-quote or letting an image bleed past the content column. But it only works when the rest of the design is strictly aligned, so the break registers as intentional. If alignment is already loose, nothing reads as intentional.

### Color

Color is a loudness knob. A saturated element screams for attention; a muted element whispers. Hierarchy works when you turn the knob up on the one thing that matters and turn it down on everything else.

Concretely: the primary CTA gets the strongest, most saturated brand color against a contrasting background — it should be the single brightest spot on the screen. Section headings get a dark, high-contrast text color but no background fill. Body text gets a slightly softer tone (dark grey rather than pure dark). Tertiary metadata (timestamps, footnotes, helper text) gets the lightest, lowest-contrast treatment — still readable, but clearly not the point.

Be aware that people perceive color very differently — some see hue distinctions others cannot, and luminance is more universally reliable than hue alone. Build hierarchy primarily on luminance (light vs. dark) and saturation (vivid vs. muted) rather than depending on hue differences that color-blind users may miss.

### Contrast

Contrast is not just about color. It is the degree of *difference* between any two adjacent elements — in size, weight, color, texture, shape, or density. When notably different elements sit near each other, both become more noticeable.

A bold dark heading next to regular-weight grey body text creates instant hierarchy through contrast difference alone — before the brain even registers font size. This is why two elements of the *same* size can have completely different visual priority: one in a high-contrast dark color, the other in a low-contrast light grey. A filled button next to an outline button achieves hierarchy through shape-contrast even if both are the same size and color.

The principle: hierarchy is built by maximizing contrast between levels and minimizing contrast within a level. Elements at the same hierarchical level should look similar; elements at different levels should look *clearly* different.

### Proximity

The brain automatically assumes that things close together *belong* together and things far apart are *separate*. This is one of the most powerful and most frequently broken principles in UI design.

A common failure: a form where the gap between a label and its input field is the same as the gap between that input and the *next* label. The eye cannot tell which label belongs to which field — the user has to *think* instead of just *seeing*. The fix: tighten the label closer to its own field, and add more space before the next group. The ratio between inner-group and between-group spacing is what creates the visual sentence structure.

This extends to every scale: a card's internal elements (image, title, meta, button) should be tightly spaced, while the gaps *between* cards should be wider. A page section's internal content should be compact compared to the breathing room between sections. When the inner and outer spacing are similar, the design reads as a uniform wall of content with no structure.

### Size

Larger elements draw the eye first — this is nearly universal across cultures. A hero headline dominating the top of a page tells the user "this is what this screen is about" before they read a single word. A massive number on a dashboard card says "this metric is the point."

But size has diminishing returns. If you make a primary heading very large, you pressure yourself into making secondary headings *also* large to look proportional, which inflates body text, which leaves no room for breathing. The result: everything is big, so nothing feels big. Size works best when there is a *steep* contrast between levels — large primary, noticeably smaller secondary, compact body, and tiny metadata. The jump between levels is what creates hierarchy, not the absolute size of any one level.

For interactive elements: a primary button should be visibly larger than secondary buttons, and secondary larger than tertiary links. But oversizing any button past a certain point makes it look like a banner ad — users learn to skip oversized rectangles.

Size also has an accessibility dimension: users with low vision depend on the ability to scale text and interactive elements. If the hierarchy is built *only* on size, zooming or increasing font size can flatten all the levels. Build size hierarchy as a relative ratio, not absolute pixel values, so the relationships hold when the user scales the interface.

### Time (motion)

Motion is hierarchy across time. When a page loads and one element fades in before the rest, the eye treats it as the most important thing. When a button animates on press while surrounding elements stay still, the motion confirms "yes, this is what you tapped."

Motion serves three hierarchy purposes: **entrance** (drawing attention to what just appeared), **feedback** (confirming that an action registered), and **transition** (showing how the user moved from state A to state B so they do not lose spatial orientation). Motion that does not serve one of these three purposes is decoration, and decoration that moves is distraction.

Critical constraint: all motion must have a static fallback. Users with vestibular disorders or reduced-motion preferences must receive the same information without animation — the state change must be visible through other hierarchy cues (position change, color change, new content appearing).

### Texture

Texture is the perceived surface quality of a UI element — smooth, rough, grained, glossy, matte. In digital design, texture is visual, not tactile, but the brain still processes it as a material cue. A subtle paper-grain background feels different from a flat solid one; a frosted-glass panel reads differently from an opaque card.

Texture serves hierarchy in two ways. First, it can **create highlights without relying on color** — a slightly different surface treatment on a featured card or a hero section draws the eye even when the color stays the same. Second, it can **signal interactivity or meaning**: a raised, slightly textured button feels "graspable," while a flat, textureless surface reads as passive background.

Use texture sparingly. Heavy or literal skeuomorphic textures (leather, wood grain, stitching) can feel dated and distract from content. The most effective texture is subtle — a barely-there noise layer, a soft gradient, a frosted backdrop — just enough to create contrast with surrounding flat surfaces without becoming the focus itself.

## 2.3 Hierarchy through emphasis and de-emphasis


### Emphasize by de-emphasizing

When the main element does not stand out, do not make it louder. Instead, soften the competing elements — lighter color, less weight, less contrast. This works at every scale, from a nav item to an entire sidebar.

### Labels are secondary to data

Do not default to a rigid `label: value` format. If the format or context is self-explanatory (email, phone, price), omit the label. When needed, combine label and value ("12 left in stock"). When labels must appear, de-emphasize them so data dominates.

**Exception:** On information-dense pages where users scan for labels (spec sheets), emphasize the label instead.

### Progressive disclosure

Not everything belongs on the first screen. Progressive disclosure sequences information so the user sees only what they need at each step, with deeper detail available on demand. This is a hierarchy technique, not a navigation technique — it reduces cognitive load by limiting the number of competing elements at any one moment.

The principle: show the essential decision or content first, and let the user opt in to complexity. A settings page shows top-level categories; tapping one reveals its details. A product card shows name, image, and price; expanding it shows specs and reviews. A multi-step form breaks a long process into digestible chunks, each screen with a single clear focus.

Progressive disclosure fails when it hides information the user needs *right now* behind unnecessary clicks, or when the user cannot tell that more detail exists. Always signal that deeper content is available (a "show more" link, an expand icon, a step indicator).

### Separate visual hierarchy from document hierarchy

Semantic headings (h1–h6) exist for accessibility. They do not dictate visual size. An h1 on a settings page may be visually small. Pick elements for semantics; style them for hierarchy.

### Balance weight and contrast

Weight and contrast are two independent dials, and adjusting one often requires compensating with the other to keep the hierarchy in balance.

A bold heading in a dark color has both high weight *and* high contrast — it screams. That is correct for a primary heading. But a bold heading in a softer, lighter color keeps the visual weight (the boldness gives it structure) while pulling back the volume (the softer color prevents it from overwhelming nearby content). This combination is useful for secondary headings that need to feel substantial without competing with the primary.

The reverse also works: a normal-weight element in a strong, high-contrast color can have the same visual prominence as a bolder element in a subdued color. The key insight is that if something already dominates in one dimension (very bold or very high-contrast), you can afford to pull back in the other. If something is subtle in both dimensions simultaneously, it will disappear.

## 2.4 Button & action hierarchy

- **Primary actions** — solid, high-contrast background. Obvious and prominent.
- **Secondary actions** — outline style or lower-contrast background. Clear but not dominant.
- **Tertiary actions** — styled as links. Discoverable but unobtrusive.

Destructive actions are not automatically big and red. Give them secondary or tertiary styling unless they are the primary action. Combine with a confirmation step where the destructive action *becomes* primary.

## 2.5 Agent rules — hierarchy

- **DO** identify the single most important element on every surface and ensure it dominates visually.
- **DO** use no more than 3–4 hierarchical levels per surface.
- **DO** apply Gestalt grouping (proximity, alignment, similarity, common region) to chunk related content.
- **DO** use progressive disclosure to manage density — show essentials first, deeper detail on demand.
- **DO** validate hierarchy by squinting — the primary element should still be first.
- **DO** ensure hierarchy works at multiple viewing distances: glance, arm's length, and close reading.
- **DO** use white space as an active hierarchy tool — restraint often reveals a better solution than adding more elements.
- **DO** build size hierarchy as relative ratios so it survives user-initiated scaling and zoom.
- **DO** build contrast across multiple dimensions (size, weight, color, texture, shape) — not just one.
- **DO NOT** rely on color alone for hierarchy — reinforce with size, position, weight, and contrast.
- **DO NOT** make every element compete for attention. If everything is bold, nothing is bold.
- **DO NOT** use animation as the sole indicator of importance.
- **DO NOT** hide information the user needs *now* behind progressive-disclosure layers — disclose complexity, not essentials.

---

# Pillar 3 — Layout

## 3.1 You do not have to fill the whole screen

If a component needs a narrow width, give it that width. Stretching things to fill a wide viewport makes the interface harder to parse. Give each element the space it needs — do not make something worse to match something else.

If a narrow element feels unbalanced in a wide context, split the layout into columns rather than stretching.

## 3.2 Grids are a tool, not a religion

Grids simplify layout decisions, but outsourcing *all* sizing to fluid percentages does harm:

- **Sidebars** should have a fixed width optimized for their content; the main area flexes.
- **Cards, modals, and forms** should have a max-width and only shrink when the screen forces it.
- Within components, do not use fluid sizing unless you actually want the element to scale.

## 3.3 Five canonical grid layouts

| Layout | Best for | Watch out |
|---|---|---|
| **Block** (single column) | Blogs, long-form, "About" pages. | Needs strong typography to avoid monotony. |
| **Column grid** | Editorial, pricing, dashboards, marketing. | Too many columns on mobile becomes unreadable; collapse aggressively. |
| **Modular grid** | Galleries, e-commerce, dashboards, news. | Mixed-size modules need clear hierarchy to avoid chaos. |
| **Baseline grid** | Editorial and brand systems with typographic rhythm. | Hard to honor strictly across responsive breakpoints. |
| **Hierarchical grid** | Homepages, magazine, dashboards with mixed widgets. | Easy to break consistency; needs strong discipline. |

## 3.4 Hard vs. soft grids

- **Hard grid** — every element snaps to baseline rows and columns. Use for editorial/print parity. Risk: brittle at responsive breakpoints.
- **Soft grid** — consistent spacing and column alignment, but no baseline snapping. Use for most digital products. Flexible, responsive, less fragile.

## 3.5 Spacing for typography and sections

Spacing within the full component/token system is defined by the design system. This document covers only the *principles* of spacing as they apply to typography rhythm and section separation:

- **Heading-to-body distance** must be tighter than **section-to-section distance.** A heading belongs to the content below it, not above it.
- **Within a group**, elements should be close together. **Between groups**, there should be noticeably more space. The ratio is what makes grouping readable.
- **Start with generous space and tighten** — it is easier to see what needs to come closer than what needs more room.
- **Never use equal spacing everywhere.** If every gap is the same, nothing is grouped, and hierarchy collapses.

## 3.6 Grouping: space before lines

Grouping connects related elements. Spacing (proximity) is the primary tool. Use borders, dividers, shadows, or cards only when proximity alone is not enough.

- **Implicit grouping** (proximity, open space): preferred default for most content — headlines, body text, CTAs, lists, carousels.
- **Explicit grouping** (borders, cards, dividers): for interactive items, data-dense surfaces, or when proximity is ambiguous.

Do not add a divider between elements already grouped by proximity — it doubles the signal and feels noisy.

## 3.7 Agent rules — layout

- **DO** give each element the space it needs; do not stretch to fill the viewport.
- **DO** choose a grid type per template and justify the choice.
- **DO** use proximity as the primary grouping mechanism.
- **DO** keep heading-to-body tighter than section-to-section spacing.
- **DO** reserve hero top space when the nav is sticky/fixed: **`padding-top = navbarOuterHeight + 96px`** on the hero section; set **`scroll-padding-top ≥ navbarOuterHeight`** for anchors (§0.1).
- **DO** on landing pages, constrain the navbar's inner content to the **same max-width as the page sections** so the logo and CTA align to the section content edges (§0.1) — does not apply to app/dashboard/modal chrome.
- **DO NOT** rely on a grid as the only layout tool — combine with fixed/max-widths.
- **DO NOT** use equal spacing everywhere — differentiate inner-group from between-group.
- **DO NOT** add borders or dividers when proximity alone communicates the grouping.

---

# Pillar 4 — Typography Principles

> Specific fonts, type scales, and sizes are defined by the design system. This pillar covers the universal principles that apply regardless of which fonts or scale the system uses.

## 4.1 Line length

Optimal readability is **45–75 characters per line**. If the content area is wider, still constrain paragraph width. Do not let text run edge-to-edge on wide viewports.

## 4.2 Line-height is inversely proportional to font size

- **Body text:** needs looser line-height so the eye tracks back to the next line.
- **Headings:** need tighter line-height because the eye does not need as much help.
- **Wide columns:** need more line-height. **Narrow columns:** can use less.

## 4.3 Baseline alignment

When mixing font sizes on a single line (e.g. a card title and an action link), align by baseline — the imaginary line letters rest on — not by vertical center.

## 4.4 Letter-spacing

- Trust the type designer by default — leave letter-spacing alone.
- Tighten letter-spacing when using body-optimized fonts at large heading sizes.
- Widen letter-spacing for all-caps text to compensate for lost ascender/descender variety.

## 4.5 Weight hierarchy in forms

Entered data is the most important element, then the label, then the placeholder. Reflect this in weight and color: entered data darkest and heaviest, labels lighter, placeholders lightest.

## 4.6 Font-size minimum for mobile inputs

On mobile, input font size must be large enough to prevent the browser from auto-zooming the viewport when the field is focused. The design system defines the exact size; the principle is: never allow input focus to trigger an unwanted zoom.

## 4.7 Case and readability

Fully capitalized multi-word buttons and labels take longer to read. Prefer Title Case or sentence case unless the design system explicitly specifies all-caps for a component.

## 4.8 Agent rules — typography

- **DO** constrain line length to 45–75 characters for body text.
- **DO** set line-height inversely proportional to font size.
- **DO** align mixed font sizes by baseline, not vertical center.
- **DO** reflect importance hierarchy in form field weight (data > label > placeholder).
- **DO NOT** use thin font weights (below the design system's normal weight) for UI text.
- **DO NOT** use all-caps for multi-word buttons unless the design system specifies it.
- **DO NOT** set input font sizes small enough to trigger mobile auto-zoom.

---

# Pillar 5 — Color Principles

> Specific palettes, shades, and tokens are defined by the design system. This pillar covers the universal logic of how color functions in hierarchy, accessibility, and communication.

## 5.1 Color hierarchy

On a typical screen, most of the surface is neutral — white, off-white, or grey backgrounds with dark text. The human eye is naturally drawn to the one element that breaks this pattern with a strong, saturated color. This is why the primary CTA should be the *only* element wearing the full-strength brand color — it becomes the focal point without any other effort.

When multiple elements share the same strong color, they split the user's attention and none of them wins. A common mistake: styling both a primary button and a navigation icon and a section accent and a badge all in the same saturated blue. The fix is to assign color "budgets": the primary action gets full saturation, secondary interactive elements get a muted or lightened version, and decorative accents get the lightest tint. Think of it as a color volume curve that descends steeply from the single loudest element to everything else.

## 5.2 Text on colored backgrounds

Making text grey on a colored background does not work — the result looks faded and disabled. Instead, use a color with the same hue as the background, adjusting only saturation and lightness until the hierarchy reads clearly.

## 5.3 Accessibility contrast

Every text/background pairing must meet WCAG 2.2 AA contrast minimums. When meeting contrast on colored backgrounds makes the color too dark and attention-grabbing, **flip the contrast**: use dark colored text on a light colored background instead of white text on a dark colored background.

## 5.4 Never rely on color alone

Color-blind users cannot distinguish some hue pairs. Always pair color with a secondary signal: icons, text labels, shape differences, or contrast differences. Color *supports* what the design already communicates, never as the sole channel.

## 5.5 Avoid true black

True black (#000) for text or backgrounds looks unnatural on screens. Use the darkest shade from the design system's grey scale instead.

## 5.6 Agent rules — color

- **DO** use color to reinforce hierarchy: strongest for primary, muted for secondary/tertiary.
- **DO** ensure every text/background pairing meets WCAG 2.2 AA.
- **DO** pair color with a secondary signal for every semantic state (error, warning, success).
- **DO** lighten or darken input fill **and** border when the field sits on a same-hue parent surface (§0.1).
- **DO NOT** use grey text on colored backgrounds — match the hue.
- **DO NOT** rely on color alone to communicate information.
- **DO NOT** use true black for text or backgrounds unless the design system explicitly calls for it.
- **DO NOT** leave inputs visually flush with their parent background — users must see the field boundary at rest (§0.1).

---

# Pillar 6 — Depth & Visual Polish

## 6.1 Light source consistency

Shadows only look right when every element on the page behaves as if lit by the same source. In screen design, the convention is light from above (sometimes slightly above-left). This means raised elements — buttons, cards, floating toolbars — get a subtle lighter edge on top and cast a soft shadow downward. Inset elements — text inputs, wells, sunken panels — get the inverse: a slightly darker top edge and a lighter bottom edge, implying they sit below the surface.

When different elements cast shadows in different directions (one to the bottom-right, another straight down, another to the left), the interface feels physically impossible and subtly wrong, even if the user cannot articulate why. Consistency here is non-negotiable — pick one light direction and enforce it everywhere.

## 6.2 Elevation conveys meaning

Shadows tell the user how "close" an element is to them, and closer elements demand more attention. This creates a depth-based hierarchy:

- **Flat on the surface** (no shadow): body content, static text, backgrounds — the baseline layer.
- **Slightly raised** (small, tight shadow): cards at rest, buttons, form fields — interactive elements the user can grab.
- **Clearly floating** (medium, slightly spread shadow): dropdown menus, sticky headers, tooltips — elements that layer on top of content temporarily.
- **High above** (large, soft, diffuse shadow): modals, dialogs, full-screen overlays — these demand immediate attention and dim everything beneath them.

The mistake is applying the same shadow to everything. If a card and a modal have the same shadow, the user's spatial model breaks — they cannot tell what is in front of what. The design system defines the specific shadow tokens; the principle is that elevation must consistently map to attention-priority across every screen.

## 6.3 Depth without shadows

Shadows are the most common depth cue, but not the only one:

- **Color and lightness:** lighter elements against a darker background feel closer to the user; darker elements feel receded. A white card on a grey page reads as "above" the page without any shadow at all.
- **Overlap:** when one element overlaps another, the brain instantly reads front-to-back ordering. An avatar that slightly overlaps a card edge, or a badge that sits on the corner of an icon, creates depth for free.
- **Scale and blur:** larger, sharper elements feel closer; smaller, blurred elements feel further. This is mostly relevant for hero illustrations or decorative backgrounds, not for core UI elements.

## 6.4 Use fewer borders

Borders are not the only separator. Prefer spacing, box shadows, or different background colors. Too many borders make a design feel busy and cluttered.

## 6.4a Nested border radius

Rounded containers that hold rounded children are a common polish failure. When both layers share the same radius, the inner corner looks pinched or misaligned.

**Rule:** compute the inner radius from the outer radius minus the gap between them (§0.1):

`innerRadius = outerRadius − padding` (equivalently `outerRadius = innerRadius + padding`).

Apply this to cards wrapping media, modals wrapping panels, nav bars wrapping search inputs, and any nested `border-radius` pair. Use design-system radius tokens for the computed values when they land on-scale; otherwise round to the nearest token and document the choice.

## 6.5 Accent borders

A simple colored border on a card edge, alert side, or navigation item adds visual interest without graphic design skill.

## 6.6 Background decoration

Break monotony with subtle background-color changes between sections, gentle gradients, or low-contrast patterns. Keep contrast low so decoration never competes with content.

## 6.7 Design empty states

When there is no user content, do not show a blank screen. Guide the user toward their first action: clear message explaining what the screen will show, and a prominent call-to-action. Hide supporting UI (tabs, filters) that has no function until content exists.

## 6.8 Skeleton screens over spinners

For content whose shape is predictable (lists, cards, profiles), display skeleton placeholders mirroring the final layout instead of a generic spinner.

## 6.9 Agent rules — depth & polish

- **DO** maintain a single consistent light source across the design.
- **DO** use elevation to communicate attention-priority.
- **DO** prefer spacing, shadows, and background color over borders for separation.
- **DO** calculate nested inner `border-radius` as `outerRadius − padding` (§0.1).
- **DO** design empty states as onboarding opportunities.
- **DO** use skeleton screens for predictable content.
- **DO NOT** use shadows as decoration — they must map to elevation meaning.
- **DO NOT** add borders when proximity or background-color difference already creates separation.
- **DO NOT** reuse the parent border-radius on a padded inner child without subtracting the gap.

---

# Pillar 7 — Interaction & Controls

## 7.1 Cognitive principles

- **Fitts' Law** — primary actions must be large and reachable; destructive actions smaller and distanced from primary ones.
- **Hick's Law** — decision time increases with the number of choices. Limit choices per screen; use progressive disclosure to reveal complexity only when needed.
- **Gestalt principles** — proximity, similarity, and common region create clear groupings.

## 7.2 Form design principles

### Structure
- **Single-column forms** are easier to scan and complete than multi-column layouts.
- **Bordered fields** are instantly recognized as inputs; underline-only fields take longer to parse.

### Labels and fields
- A label must be visually closer to the field it describes than to the previous field.
- When an input shares its parent's background color, **lighten (or darken) the field fill and border** so the control remains visible at rest — not only on focus (§0.1).
- Mark optional fields, not required ones — marking exceptions is clearer than scattering asterisks.
- Show important constraints inline (e.g. password requirements as the user types), not hidden in tooltips or shown only after submission fails.
- Highlight the focused field to prevent users from losing their place.

### Buttons
- Buttons must look like buttons: rectangles or rounded rectangles.
- Only the primary button gets a strong fill color. Secondary buttons use outline or subdued styling.
- In a **horizontal input + button row**, the input must match the button's **total height** (§0.1).
- **Button labels stay on one line; buttons do not shrink** in shared rows (§0.1) — shorten copy or reflow the layout instead.
- In left-to-right cultures, place the primary action on the right. In stacked layouts, at the bottom.
- Each button needs its own safe-area — no overlapping tap/click zones.
- Do not make buttons so large they look like banner ads — oversized buttons get skipped.

### Selectors
- Avoid dropdowns for 3–5 options — use radio cards or tabs that show all options at once.
- Add filter/search to long dropdowns. Show popular choices at the top.
- Restyle native `<select>` — strip the default arrow (`appearance: none`), add a custom chevron with balanced inset and reserved trailing padding, match sibling input states, and set `color-scheme: dark` on dark surfaces (§0.1).
- Toggles are for settings that take immediate effect. Checkboxes are for options confirmed by a separate action. Do not mix them.
- Align checkboxes to the top of the first text line, not the vertical center.

### Tables
- On mobile with few columns, use a stacked cell-view instead of horizontal scrolling.
- Left-align text; right-align numbers. Do not center table content.
- Emphasize data, not labels.

### Steppers / wizards
- Name steps clearly ("Location", not "Step 2"). Make completed steps clickable.

### Validation
- Do not hide invalid fields inside collapsed sections — expand and scroll to the error.
- Guide users through requirements as they type (inline validation), not after submission.

### Modals / popups
- Provide a large close target. Offer multiple close paths: X button, dismiss button, outside click.

## 7.3 Feedback and errors

- **Every action must produce feedback.** Silent failures erode trust.
- **Errors must explain the problem and offer a next step.** "Email already used — log in instead?" Not "Unknown error."
- **Loading states must set expectations.** Progress indicators for determinate waits, skeleton screens for predictable content, spinners only for indeterminate short waits.

## 7.4 Agent rules — interaction

- **DO** define trigger → action → feedback → resolution for every interactive element.
- **DO** apply Fitts' and Hick's Laws.
- **DO** provide immediate feedback for every user action.
- **DO** ensure every flow has a clear entry, path, and exit — including error recovery.
- **DO** use single-column forms with clear label-to-field proximity.
- **DO** keep inputs visually distinct from same-color parent surfaces (§0.1).
- **DO** match input height to adjacent buttons in the same row (§0.1).
- **DO NOT** create interactions that lack feedback.
- **DO NOT** break platform conventions without a documented reason.
- **DO NOT** sacrifice accessibility for animation. Respect reduced-motion preferences.
- **DO NOT** use vague button labels ("OK", "Next", "Submit") — name the specific action.

---

# Pillar 8 — Responsive & Adaptive Thinking

> Specific breakpoints, media queries, and responsive tokens are defined by the design system. This pillar covers the universal principles of adaptive design.

## 8.1 Mobile-first thinking

Design for the smallest, most constrained context first, then enhance for larger viewports. This forces you to solve the hardest problems first (limited space, touch input, slow networks) and results in leaner, more focused interfaces.

## 8.2 Content decides breakpoints

Breakpoints exist where content stops being readable, scannable, or usable — not where a device list says to put them. Start every responsive component by asking: "What is the smallest viewport where this content reads well?" Introduce a breakpoint where strain first appears.

Test with the longest realistic value (longest product title, longest translated label) — not the average. Some languages routinely add 30–50% to English string length.

## 8.3 Components should not know the viewport

A reusable component (card, form row, panel) does not know whether it lives in a sidebar, a 2-column grid, or a full-width hero. Components should respond to their *container's* available space, not the viewport. Page-level layout responds to the viewport; components respond to their context.

## 8.4 Touch & pointer awareness

- Hit targets must be large enough for finger taps with spacing between them.
- Detect input capability (fine pointer vs. coarse pointer) rather than guessing by device.
- Provide keyboard equivalents for every pointer interaction.
- Make focus styles visible and high-contrast.

## 8.5 Hover is not guaranteed

Any content or control surfaced by hover must also be reachable without hover. Touch users see no hover. Menus must open on tap/click and focus, not just hover. Tooltips must appear on focus and be dismissible with keyboard. Overlays that reveal on hover must be visible at rest on touch devices.

## 8.6 Performance is part of responsive

A site that looks right on mobile but ships a desktop-sized payload is not responsive. Serve appropriately sized assets, defer non-critical resources, and test on real low-end hardware — not only on the developer's laptop.

## 8.7 Flexible images and media

Images and media must adapt to their container. Serve different sizes for different viewports (resolution switching) and different crops when the composition must change (art direction). Reserve space for media before it loads to prevent layout shift.

## 8.8 Do not disable zoom

Users depend on browser zoom and OS text scaling for accessibility. Never disable pinch-to-zoom or cap the maximum scale. Layouts must reflow gracefully at 200% zoom without clipping or hiding content.

## 8.9 Agent rules — responsive

- **DO** design mobile-first: smallest viewport as base, enhance upward.
- **DO** let content — not device names — determine where breakpoints fall.
- **DO** make components respond to their container, not the viewport.
- **DO** ensure hit targets work for finger, stylus, and mouse.
- **DO** provide non-hover fallbacks for every hover interaction.
- **DO** test with zoom at 200%, slow networks, and real low-end devices.
- **DO NOT** disable zoom or cap maximum scale.
- **DO NOT** rely on hover alone for essential content or controls.
- **DO NOT** ship desktop-weight payloads to mobile.
- **DO NOT** name breakpoints after devices — use size-based names.

---

# §9 Conflict Resolution Priority

When principles from different pillars pull in opposite directions:

1. **Accessibility** — non-negotiable; always wins.
2. **Usability / interaction clarity** — the user must complete their task.
3. **Performance** — a beautiful design that does not load is not a design.
4. **Constraints** — respect the medium, platform, and brand.
5. **Hierarchy** — the user must understand what is important.
6. **Aesthetics / polish** — important, but never at the cost of function or access.

**Design system vs. principles:** For any product with an active design system, **always implement design-system tokens and component specs first**, then apply this file and `typography-principles.md` to refine the result (§0). When this file and the design system conflict on a concrete value, **the design system wins**. Flag the conflict for human review. Principles decide only where the system is silent.

---

# UI Principles

> These principles draw from Gestalt psychology, accessibility research, and decades of interaction-design practice. They apply on **every** surface. They are organized in two phases — **Foundations** (what UI design is, its element categories, and how it relates to UX) and **Process** (design-thinking principles and stages) — followed by **seven actionable principles** that govern every surface.

---

## Phase 1 — Foundations: What UI design is

> Phase 1 establishes the vocabulary. Before designing or reviewing a surface, an agent must understand what UI is for, what elements it is built from, and how it relates to UX.

### 2. The role of UI design

> User interface design considers the overall look and feel of digital product experiences, and applies usability and interaction-design principles to all product functions and interactive features.

**Why it matters.** Before modern UI, interacting with computers required fluency with program or machine languages. Users navigated disorganized control panels that only made sense to specialists. The job of UI is to translate technology into something any human can pick up — through familiar affordances, immediate feedback, and an emotional connection between the user and the product.

**Agent rules — DO**

- Treat the UI as **the space where the user and the product communicate** — every visible element is part of that conversation.
- Apply both **usability** (can the user do it?) and **interaction-design** (does each step feel right?) principles to every function and feature.
- Build emotional connection through coherent visual, tonal, and interactive design — UI is what *humanizes* the underlying technology.

**Agent rules — DO NOT**

- Do not treat UI as decoration applied on top of an engineered surface.
- Do not ship UI that requires a tutorial for the primary task.
- Do not invent novel affordances for tasks the user already knows how to do.

**Quick check** — Could a first-time user complete the primary task without help or documentation?

---

### 3. UI ≠ UX (but they are inseparable)

> UI cannot exist without UX. User interfaces bring the user experience to life by performing key functions and making features usable. The end-user experience is a combination of both — collaboration is essential.

Historically, UI designers focused on visual detail and consistency; UX designers focused on user flows and information architecture. These roles should be based on **individual competency**, not a prescribed title.

**Agent rules — DO**

- Treat UX flows and UI surfaces as **one continuous artifact** — the flow tells you *what* to design; the surface tells you *how*.
- Assign responsibility based on individual **competency**, not job title.
- Use UX research to validate UI decisions; use UI craft to make UX flows feel inevitable.

**Agent rules — DO NOT**

- Do not let separate UX and UI teams silo their work — that is the most reliable cause of shipped surfaces that look polished but make no sense.
- Do not redesign a screen without understanding the upstream and downstream surfaces it lives between.

**Quick check** — Can you trace this surface to a defined user flow and a defined user goal?

---

### 4. Pick the right interface type

Every UI shares the same goal: make user interactions with the product as streamlined and enjoyable as possible. The common types:

- **Graphical UI (GUI)** — image- or icon-based. The dominant type on phones, tablets, and desktops. Users interact via touch, mouse, stylus, or keyboard.
- **Gesture-based UI** — translates motion in a 3D space into commands. Common in AR/VR and emerging spatial-computing surfaces.
- **Voice UI (VUI)** — voice-driven navigation and commands (smart assistants, in-car systems, accessibility tools).

**Agent rules — DO**

- Pick the interface type that **fits the user's context and hands**: do not ship a VUI for a noisy environment; do not ship a gesture UI where a button works.
- Always allow a **fallback modality** — a GUI surface should remain usable when voice is unavailable; a VUI should expose a visual transcript or alternative.

**Agent rules — DO NOT**

- Do not shoehorn a single interface type onto every context.
- Do not adopt a novel modality (3D, gesture, AR) just because it is trendy — only when it removes friction for the user.

---

### 5. The four element categories every UI uses

Every UI is assembled from four element categories. Use them deliberately.

- **Input controls** — let the user communicate with the product (buttons, checkboxes, radios, toggles, text fields, dropdowns, sliders).
- **Informational components** — let the product communicate with the user (icons, notifications, progress bars, tooltips, badges, banners).

**Badge rule (§0.1):** badges are **inline, content-sized** status/category chips. **Full-width badges are never allowed.** If it spans a row, use a banner, alert, or list item — not a badge.

**Icon rule (§0.1):** use a real icon set (SVG library or icon font). Do not substitute emoji or bare glyphs where an icon is specified.

**Media rule (§0.1):** photos must be beautiful and on-brand; mockups and illustrations must be custom, premium-quality SVG (or equivalent); inset videos get a framed card treatment with design-system shadows — background hero videos are exempt.

- **Navigational components** — help the user find their way through the product (tabs, breadcrumbs, search fields, menus, pagination, sliders).
- **Containers** — keep the UI organized, group related elements, and cap content width to the screen size (cards, panels, headers, accordions, modals, tabs).

**Agent rules — DO**

- For every screen, **name which category each element belongs to.** A screen with no informational components is a screen with no feedback.
- Keep input controls **predictable** — a checkbox always behaves like a checkbox, no matter where it lives.
- Size badges to their content; **never** stretch a badge to full container width (§0.1).
- Use a **consistent icon library** for all UI icons; install one if the project lacks icons (§0.1).
- Use containers to **cap content width** so reading length stays comfortable on large monitors.

**Agent rules — DO NOT**

- Do not blur categories (a "button" that is actually a navigational link; a "card" that is actually a button).
- Do not create custom container shapes that don't carry information — they add visual noise without serving the user.
- Do not ship full-width badges (§0.1).
- Do not use emoji or placeholder glyphs as icons in production UI (§0.1).
- Do not leave mockups, illustrations, or image slots as gray boxes or broken placeholders (§0.1).

---

### 6. The four UI pro-tips

The four practices that separate competent UI from professional UI.

- **Put the user first.** At every step, ask: "How does this impact the user?" If the answer is anything other than "it makes their life better or easier", rethink the choice. The best UIs give the user a sense of *control*.
- **Do your homework.** Run competitor analysis even when you are an expert — it surfaces target-audience expectations, unwritten conventions, and where the field has already solved a problem.
- **Apply proven product-design principles.** Stay current on accessibility guidelines (WCAG), inclusive design, internationalization, and the evolving standards in your category. Keep an accessibility-literate person on the review path.
- **Use the right tools.** Choose tools that match the work: collaborative, version-controlled, with the ability to gather feedback and pull from a shared component library.

**Agent rules — DO**

- Before generating a new component, search the existing system for a precedent.
- Before innovating a pattern, review at least three reference products in the same category.
- Before shipping, run an accessibility pass: contrast, focus, keyboard navigation, screen-reader semantics, motion.

**Agent rules — DO NOT**

- Do not skip competitor research because "we are the leader" — the cost of looking is hours; the cost of missing a convention is years of confused users.
- Do not chase tool novelty over team familiarity.

---

## Phase 2 — Process: How to think before you design (Design Thinking)

> Design thinking is a creative, iterative approach to solving complex problems. It starts with the user — their needs, pain points, and expectations — and uses that insight to guide every product decision. The process keeps work grounded in real needs and real feedback.

### 7. Validate every idea against three lenses

A strong UI decision sits at the intersection of three lenses:

- **Desirability** — Does the solution meet a real user need?
- **Feasibility** — Do we have the resources and technology to build it?
- **Viability** — Will this work long-term for the business or organization?

**Agent rules — DO**

- Before designing a feature, write one sentence per lens. If you cannot articulate all three, the feature is not ready.
- Reject features that score high on only one or two lenses — they tend to ship and then quietly die.

**Agent rules — DO NOT**

- Do not optimize for feasibility alone (engineer-driven roadmaps the user does not want).
- Do not optimize for viability alone (business-driven features the user rejects).

**Quick check** — Can you state, in one sentence each, the user need, the build path, and the long-term business value?

---

### 8. The four design-thinking principles

The four rules that govern *how* a team thinks while applying design thinking.

- **The human rule.** Design starts with people. Every decision — what to build, how it works, how it looks — must be grounded in real needs and lived experiences.
- **The ambiguity rule.** Uncertainty is part of out-of-the-box thinking. Stay curious; test ideas before locking in direction; work *through* ambiguity instead of avoiding it.
- **The re-design rule.** Most problems have been solved before in some form. Don't assume a blank slate — learn from what exists, keep what holds up, and build from there.
- **The tangibility rule.** Ideas get better when they're visible. Use low- and high-fidelity prototypes to communicate and test in the real world, not in slide decks.

**Agent rules — DO**

- Run prototypes early and often — even a paper sketch communicates more than a long written brief.
- When the team is stuck, return to the **human rule**: who is this for, what are they actually trying to do?

**Agent rules — DO NOT**

- Do not lock the design direction before testing a tangible artifact.
- Do not dismiss prior art — re-design beats blank-slate in the overwhelming majority of cases.

---

### 9. The five stages of design thinking

Design thinking is **non-linear**. You loop back, repeat stages, and work on several parts in parallel. What matters is momentum and learning, not strict sequence.

#### 9.1 Empathize

Understand the people you're designing for. What are they trying to accomplish? Where do they get stuck? What matters most in their day-to-day?

**Method** — *Empathy mapping* surfaces users' attitudes and behaviors; user interviews reveal frustrations behind quantitative data.

**Agent rules — DO**

- Actively listen, observe behavior, and ask the right questions — do not start with assumptions.
- Capture verbatim quotes; they anchor downstream decisions.

**Agent rules — DO NOT**

- Do not rely solely on analytics — they tell you *what* but not *why*.

#### 9.2 Define

Frame the problem clearly. What specific challenge are you solving? Who's affected, and what is getting in their way?

**Method** — Write a focused **problem statement**; map key user needs through user personas. Use *the 5 whys* to drill from symptom to root cause.

**Agent rules — DO**

- Write the problem in the user's words, not the team's vocabulary.
- Ask "why?" until you reach a root cause, not a surface symptom.

**Agent rules — DO NOT**

- Do not solve symptoms (e.g., "users complain about the button color" usually means the action itself is wrong, not the color).

#### 9.3 Ideate

Explore possible solutions. The goal is **breadth**, not the answer.

**Method** — *Mind mapping* breaks linear thinking; *affinity diagrams* surface themes and patterns in feedback.

**Agent rules — DO**

- Run short, structured brainstorming sessions — quantity first, judgment second.
- Capture every idea visibly so the group can riff off each other.

**Agent rules — DO NOT**

- Do not anchor on the first idea — set a minimum quantity before evaluating.

#### 9.4 Prototype and test

Test early and often. Build prototypes of the strongest ideas, put them in front of users, validate the direction, streamline the workflow, and reduce development risk.

**Method** — *Storyboards* visually represent a user's journey, highlighting how they interact with the product.

**Agent rules — DO**

- Start with **low-fidelity** prototypes; high-fidelity comes after the structure is validated.
- Use a mix of test methods: moderated usability tests, unmoderated remote tests, A/B testing, heatmaps, session recordings, and live interviews for qualitative insights.

**Agent rules — DO NOT**

- Do not show stakeholders only high-fidelity mocks — they will react to color and forget structure.
- Do not skip testing because "we are confident".

#### 9.5 Implement

Move into development. Even at this stage, keep iterating — use analytics, feedback loops, and lightweight A/B testing to refine. Track KPIs post-launch.

**Method** — Continuous *usability testing* identifies issues, informs improvements, and grounds modifications in real user experiences.

**Agent rules — DO**

- Attach analytics events to every primary action **before** launch.
- Define what success looks like **quantitatively** before shipping — otherwise you cannot tell whether you achieved it.

**Agent rules — DO NOT**

- Do not treat launch as the end of the design process — it is the start of the feedback loop.

---

## The Seven UI Design Principles

> These seven principles draw from Gestalt psychology, accessibility research, and decades of interaction-design practice. They apply on **every** surface.

### 10. Hierarchy

> Help users recognize key information and distinguish it from less important elements at a glance.

A useful comparison: designing a digital product is like designing a book. On every page, navigational cues remind you of the title, chapter, and section so you never get lost. UI works the same way.

**Agent rules — DO**

- Use **font size and weight** to emphasize the most important elements. Larger, bolder = more important.
- Use **contrast** to pull the eye to key items (see §13).
- Use **spacing** to create visual interest and signal which elements relate to each other (see §14).
- Be intentional about **what the user sees first** vs. what they must scroll to. Content hierarchy reflects what the user cares about most.

**Agent rules — DO NOT**

- Do not give every element the same visual weight — the eye has nowhere to land.
- Do not let decorative elements outweigh primary actions.

**Quick check** — Squint at the screen. The primary action and the headline should remain distinguishable; everything else should fade.

---

### 11. Progressive disclosure

> Guide users through a multi-step process or a complex feature by providing the right amount of information at each step.

Too many features at once overwhelm. Smart UI sequences features and flows so the experience never feels heavy — and gives users **a way to orient themselves**, so they know where they are and how many steps remain.

**Agent rules — DO**

- Reveal complexity **on demand**. A signup flow asks for name first, contact info second, interests later — not all on one form.
- Provide **orientation cues** so users know where they are in the flow and how many steps remain.
- Hide advanced options behind expandable sections, secondary screens, or "Show more" affordances.

**Agent rules — DO NOT**

- Do not amputate advanced options entirely — every system has irreducible complexity; hide it, do not delete it.
- Do not hide *primary* actions behind disclosure — only secondary or contextual ones.

**Quick check** — Could a new user pause mid-flow and still know how many steps remain?

---

### 12. Consistency

> A good interface feels familiar from the first click. Consistent patterns mean the user stops thinking about the UI and focuses on the task.

When a button looks and works the same way throughout the product, users stop noticing the UI. If one button is suddenly bigger, users wonder why — that irregularity adds cognitive load, creates hesitancy, and breaks trust. Consistency is also an **inclusive-design** principle: inconsistent design *seems* complex, and "seems complex" is indistinguishable from "is complex" to a real user. The effect compounds for people on assistive technology, who experience inconsistency twice — visually, and in the underlying structure their tools must navigate.

Consistency has **two dimensions** — internal and external. A surface must be evaluated against both.

#### 12.1 Internal consistency — consistent with itself

> Internal consistency is an interface being consistent **with itself** — across screens, sections, platforms, and teams.

A surface is internally consistent when there is **one pattern per problem**, not many. The classic audit question is: *"Why have we got seventeen different button styles?"* If a pattern inventory turns up more patterns than problems, the team has accidentally invented variants that pretend to be different — and users now have to learn each one. Inconsistency between elements isn't only cosmetic: when things look (or sound, or feel) different, users expect them to **behave** differently and **achieve** different ends.

**Agent rules — DO**

- Maintain a **single design system** with one solution per UI problem: one button style per role, one card per role, one navigation pattern, one search affordance.
- Reuse the **same mechanism for the same job** across the product — searching a books catalogue and an audio-books catalogue uses the same search UI; do not invent a second.
- Keep **patterns consistent across platforms** that share the product — desktop, mobile web, and native apps. A user who learned the desktop search filters should recognize them on iOS.
- Treat the pattern library as the **single source of truth** between departments and teams; it is the contract that prevents independent teams from re-solving the same problem.

**Agent rules — DO NOT**

- Do not let separate teams ship divergent solutions to the same problem (e.g., two department search UIs inside one product).
- Do not introduce one-off variants of existing components — promote them to named variants of the canonical component, or get them merged in.
- Do not let cosmetic differences (color, radius, padding) drift between platforms of the same product without an explicit reason.

**Quick check** — Inventory every pattern on the surface (button styles, card styles, navigation models, form styles, search affordances). Is there exactly **one solution per problem**?

#### 12.2 External consistency — consistent with the wider discipline

> External consistency is an interface being consistent with the broader **culture** of interface design — the shared language of conventions, patterns, and behaviors that users have already learned elsewhere.

No interface exists in a vacuum. The language of interaction has evolved over decades: hamburger menus, breadcrumbs, dropdown menus, the "X" close button, the magnifying-glass search icon — these are conventions that became traditions. Users bring those conventions to the product whether you opt in or not. Interfaces that break too many rules may win design awards, but they alienate users. The rule of thumb: users should be able to look at any part of the interface and think *"I've seen something like this before."* Not exactly like it — but like it.

**Agent rules — DO**

- Place conventional elements in their **familiar locations** — logo top-left or center, primary navigation at the top, contact details and legal in the footer, hamburger menu in one of the top corners on mobile.
- Adopt **established interaction conventions**: a tab interface follows the keyboard behaviors documented in WAI-ARIA Authoring Practices; a search field accepts Enter to submit; the "X" closes; Escape dismisses.
- Lean on **platform-level guidelines** when designing for a specific platform: each platform publishes its own interface guidelines — follow them for native apps, and follow web standards and native semantics for the open web.
- Let convention save invention: if the majority of comparable products place X in Y, do the same unless you have measured evidence to deviate.

**Agent rules — DO NOT**

- Do not invent a novel pattern for a problem the field has already solved.
- Do not break conventional **keyboard, focus, or motion** behavior — those conventions also serve assistive-tech users.
- Do not let an award-chasing exception break conventions on a primary flow.

**Quick check** — Show a screenshot to someone outside the team. Can they correctly guess what each element does without instructions?

#### 12.3 Cohesiveness — one voice from start to finish

> The experience should feel like a **continuation** from one screen to the next — like a book, where every visual element cues the reader that they are still in the same story.

Cohesiveness covers more than components. It covers **mood**, **density**, **voice**, and **tone of copy**. If the homepage is airy and the product page is dense and content-heavy, the user wonders whether they have left the product. If marketing copy is formal and enterprise while in-product copy is casual and pun-heavy, the user is yanked between two voices. A customer who has a great experience and recommends the product to a friend, only for the friend to encounter a different mood or voice, has experienced an inconsistency too.

**Agent rules — DO**

- Maintain a **consistent mood** across the surfaces of one product: density, color saturation, spacing rhythm, photographic style.
- Maintain a **consistent voice and tone** in interface copy across marketing pages, in-product UI, error messages, empty states, and help content.
- Build voice/tone guidance into the design system so writing stays cohesive across teams (alongside color, type, and component tokens).

**Agent rules — DO NOT**

- Do not let one section of the product (e.g., a recently redesigned page) shed the mood of the rest — it reads as a different product.
- Do not write casual, joke-heavy copy inside an otherwise professional product (or vice versa).
- Do not let referral and recommendation flows hand a new user off to a section that looks or sounds nothing like the rest.

**Quick check** — Read the in-product copy and the marketing copy aloud. Do they sound like one person talking?

#### 12.4 Color and type — defensible rules of thumb

For most products:

- **Type:** use **two or three** type styles across the entire product. More than that makes surfaces feel unstructured, busy, and distracting.
- **Color:** start with **one primary, one secondary, a few tones of each, plus black and white**. Larger palettes can work in complex systems but get harder to manage with every addition.
- Additional typefaces or colors are acceptable **as deliberate differentiators**, but only when they clearly fit within the established experience.

**Agent rules — DO**

- Define the **type pair / type triad** in the design system before designing surfaces.
- Define **semantic color roles** (primary action, secondary action, destructive, success, info) and use them everywhere — the role drives the choice, not the swatch.

**Agent rules — DO NOT**

- Do not introduce a fourth or fifth typeface for "personality" on a single surface — it dilutes the system.
- Do not use a brand secondary color for a primary action — that breaks the contract the user has learned about which color means *primary*.

#### 12.5 Alignment as a consistency signal

Alignment is one of the easiest ways to make a surface look intentional. Repetition of placement teaches the user where to look next.

**Agent rules — DO**

- Place **recurring elements in the same location** across screens: titles, primary CTA, navigation, breadcrumbs. If a screen's title sits a known distance from the top, every screen with a title repeats that distance.
- Align elements on a **shared grid** — logo, image, header, body text down the left edge — so the eye moves predictably down the page.
- Use the design tool's guides, measurements, and constraint systems to enforce alignment instead of eyeballing it.

**Agent rules — DO NOT**

- Do not let "close enough" alignment ship — small misalignments accumulate into a UI that reads as untrustworthy.

(See §16 — Alignment — for the full rule.)

#### 12.6 Deliberate inconsistency — use sparingly, on purpose

Consistency is not absolute. A **deliberate break** of pattern is one of the most powerful tools for **emphasis**, exactly because the brain is wired to detect deviation from a pattern. The shorthand rule: *if everything is bold, nothing is bold.* Inconsistency is also acceptable — sometimes necessary — when serving a specific user need outweighs a rigid rule.

**Agent rules — DO**

- Use a single, deliberate break (an indented quote block, a highlighted row in a table, one inverted CTA on a long page) to direct attention.
- Limit the **number of emphasis signals** stacked on one element. A bold, red, italic, larger, indented block is over-signaled; pick one.
- When you break consistency on purpose, **document why and where** in the design system so the deviation does not creep into more places.
- Break consistency when a clear **user need** demands it — never let a rigid system override an unsolved user problem.

**Agent rules — DO NOT**

- Do not emphasize many things at once — if everything is emphasized, nothing is.
- Do not break consistency for novelty alone — only for clearly justified emphasis or a measured user need.

**Quick check** — Count the deliberate breaks of pattern on the surface. Is each one justified by a specific moment the user must notice?

---

### 13. Contrast

> Use contrast strategically to draw attention to important content or features.

For critical information, push contrast higher than the rest of the surface. For destructive actions, use a jarring contrast that commands attention; for secondary actions, soften the contrast so the user is not confused.

**Agent rules — DO**

- Reserve **the strongest contrast** for the primary action and the most important information.
- Use **color + form** together — a destructive button is high-contrast *and* labeled clearly.
- Define a **contrast scale** (e.g., strong, medium, low) in the design system and apply it predictably across every surface.

**Agent rules — DO NOT**

- Do not use the same level of contrast for primary, secondary, and tertiary actions.
- Do not use contrast as decoration — every contrast bump should signal hierarchy.

**Quick check** — From a normal viewing distance, can you spot the primary action in under 1 second?

---

### 14. Accessibility

> Designs must be usable across the full range of human ability. Vision impairments alone affect more than one in four users worldwide.

Accessibility is not a polish step — it is a baseline. UI is constantly evolving, particularly in areas like text, color, contrast, and tabbing order. Keep an accessibility-literate reviewer on the path.

**Agent rules — DO**

- Meet or exceed the **Web Content Accessibility Guidelines (WCAG)** AA standards for contrast and interaction.
- Provide **alternative text** for non-decorative images and icons.
- Use **sufficient padding** around interactive elements; touch targets ≥ **44 × 44 px / 48 × 48 dp** with at least 8-unit spacing between adjacent targets.
- Ensure **compatibility with assistive technology** (screen readers, switch controls, voice control).
- Provide **complete keyboard navigation** — every interactive element reachable and operable without a mouse.

**Agent rules — DO NOT**

- Do not rely on **color alone** to encode meaning — pair color with text, icon, or position.
- Do not use auto-playing audio, blocking modals, or motion that ignores reduced-motion preferences.
- Do not defer accessibility to "polish later" — it costs more to retrofit than to build in.

**Quick check** — Can a keyboard-only user complete every primary task on this surface?

---

### 15. Proximity

> Things that belong together should stay together. Users naturally perceive elements that are close to each other as related.

Take a video player: play, fast-forward, and rewind sit on the same row because they all control playback. The quit button lives separately to prevent accidental clicks that would interrupt the viewing experience.

**Agent rules — DO**

- Place **related elements close**; **unrelated elements far apart**.
- Use a **tight inner / loose outer** spacing ratio — groups read tightly; separation between groups reads cleanly.
- Group form fields by **topic** (account, address, payment), not by data type.

**Agent rules — DO NOT**

- Do not space everything uniformly — the eye loses the grouping signal.
- Do not place destructive actions next to primary ones — proximity itself increases accidental clicks.

**Quick check** — Looking at the screen, does each group read as one unit, with clear breathing room between groups?

---

### 16. Alignment

> Clean lines make designs feel professional. A strong grid system establishes order and balance; consistent alignment improves readability and predictability, making it easier for users to navigate.

**Agent rules — DO**

- Anchor every element to **a shared grid or baseline**. Inconsistent alignment is the most common source of "looks sloppy" feedback.
- Use **a single alignment direction per zone** (e.g., left-aligned headings throughout a section; centered hero only where it is the explicit pattern).
- Align **content edges**, not arbitrary container edges — what the user reads should line up.

**Agent rules — DO NOT**

- Do not mix left-, center-, and right-aligned text on the same surface without an explicit reason.
- Do not let "off-grid" elements ship — small alignment errors accumulate into a UI that reads as untrustworthy.

**Quick check** — Place a vertical guide on the left edge of the main content column. Do all major elements snap to it?

---