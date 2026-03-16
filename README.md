# Studio Equipment Manager Version 1

Studio Equipment Manager Version 1 is a browser-based patch sheet and inventory workflow tool for recording sessions.

It is designed to help you:

- build and reorder channel sheets quickly
- assign microphones, tie lines, preamps, outboard, and A/D paths
- manage inventory availability while patching
- save/load templates and session data
- export printable PDF patch sheets
- copy track-name lists directly for DAW batch naming

## Project Structure

- `index.html` - app markup
- `style.css` - app styling
- `app.js` - app logic/state/export/import behavior
- `oldfile/` - archived historical HTML versions

## Features

- custom searchable equipment dropdowns across session columns
- keyboard-friendly dropdown behavior (type-to-search, tab flow)
- session metadata (artist, project, engineer, date)
- preferences for source suggestions and auto-pair rules
- studio hard normalling rules (tie line -> preamp/A/D auto-patch)
- inventory CSV template download + inventory CSV import/export
- session JSON export/import and clipboard copy tools

## Run Locally

No build step is required.

1. Open `index.html` in a browser.
2. Use the app directly.

For best file import/export behavior, use a modern Chromium-based browser.

## Data Persistence

Session state and preferences are saved in browser local storage.

## UI Cleanup Checklist

Use this before shipping UI changes:

- Reuse existing classes and tokens before adding new styles.
- Avoid inline typography (`font-size`, `font-weight`, `line-height`) in markup.
- Match surrounding control density (spacing, radius, button sizing) in the same panel/tab.
- Use accent color for state/meaning, not decoration.
- Verify new controls align with `STYLE_GUIDE.md` typography and preference patterns.

## Recent Updates

- Overhauled Session Setup controls: moved key actions into the top/action bars, simplified setup popovers, and added clearer safe mode UX.
- Added channel row quick actions (`+` insert / `-` delete) with hover-zone interaction refinements that avoid layout shifts.
- Added column pin controls in session headers with persistent pin state saved in app data.
- Added `PDF Export Settings` in Preferences, including an option to print empty rows for handwritten notes.
- Updated CSV inventory import to preserve existing studio hard normal routing.
- Moved theme switching into the Preferences tab and removed the header theme control.
- Added `App Themes & Colors` with built-in themes, a custom theme builder, and live preview.
- Added DAW export preferences for stereo merge and short-name track formatting.
- Added `User A` and `User B` custom theme presets with save/apply workflows.
- Refactored Preferences UI styling to reduce repeated inline styles and improve consistency.
- Added a persistent Cursor rule at `.cursor/rules/ui-consistency-defaults.mdc` for token/class-first UI edits.

## Git Branch

Current working branch:

- `main`

