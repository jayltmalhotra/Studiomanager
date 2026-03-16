# Studio App Style Guide (V5)

This guide captures the visual rules currently used in `index_05.html` so new features stay consistent.

## Design Principles

- Keep UI subtle and studio-like, not flashy.
- Prefer low-contrast structure with accent for state and focus.
- Keep controls compact and readable.
- Use one typography system across all tabs.

## Core Tokens

Use CSS variables from `:root` / theme blocks:

- Backgrounds: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-quaternary`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Accent: `--accent-primary`, `--accent-hover`
- Borders/inputs: `--border-primary`, `--border-secondary`, `--input-bg`, `--input-border`
- Weights: `--ui-weight` (body), `--ui-weight-strong` (headings/important labels)

Do not hardcode colors unless there is a specific one-off need.

## Typography

- App base font: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
- Standard body weight: `var(--ui-weight)` (currently 400)
- Emphasis/headings weight: `var(--ui-weight-strong)` (currently 500)

### Size guidance

- Main page title: large (`.header h1`)
- Section headings: compact (`13px`) with light letter spacing
- Body/help text: `12px`, muted color, line-height around `1.35`
- Button text: `11px` to `12px` depending on density

## Spacing & Rhythm

- Use small rhythm increments: `6px`, `8px`, `10px`, `12px`, `16px`
- Panel internals: generally `12px` to `16px` padding
- Tight control rows: `6px` to `8px` gaps
- Keep top-level sections visually compact to preserve vertical space

## Controls

### Buttons

- Default secondary button style should match `btn-muted`.
- Rounded pills are for primary app actions in bars.
- Avoid bright fills except for explicit selected/active states.

### Toggle chips (2-state)

- Prefer chip/toggle rows for two-option choices over dropdowns.
- Active state should use accent border + subtle accent tint.

### Remove/Clear actions

- Prefer compact labeled buttons like `Clear` over icon-only round `×` in dense forms.
- Keep destructive visuals subtle unless action is truly destructive.

## Panels & Cards

- Use `panel-box` style: soft border, compact padding, subtle background contrast.
- Panel headings should use accent color and match section typography.
- Body text inside panels should use `--text-secondary` for helper copy.

## Tabs

- Tab labels should follow the same weight system as the rest of UI.
- Active tabs should feel selected without heavy/bold overemphasis.

## Preferences Page Pattern

For all Preferences sections:

- Heading: accent + `13px` style
- Description copy: `12px`, muted
- Inputs/textarea/selects: consistent border radius and input token colors
- Action row: use existing `btn-muted` family for consistency

## Motion

- Keep transitions short and restrained (`0.2s` to `0.3s` feel)
- Avoid long sweeping animations for routine interactions

## Implementation Rules

- Reuse existing classes before adding new styles.
- If new style is needed, prefer token-based values.
- Avoid ad-hoc typography in inline styles; use existing typography classes/tokens for font size, weight, and line-height.
- Keep per-tab overrides minimal and aligned:
  - `#presets`
  - `#inventory`
  - `#preferences`

## Quick Checklist (Before Shipping UI Changes)

- Does it use existing tokens and weights?
- Does text sizing match neighboring sections?
- Are controls compact and consistent with `btn-muted` / chip patterns?
- Is accent used for meaning, not decoration?
- Does it avoid unnecessary visual prominence?
