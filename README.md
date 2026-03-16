# Studio Equipment Manager

Studio Equipment Manager is a browser-based patch sheet and inventory workflow tool for recording sessions.

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

## Git Branch

Current working branch:

- `main`

