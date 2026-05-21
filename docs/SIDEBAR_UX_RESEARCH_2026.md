# Sidebar UX Research Notes (May 2026)

## Research Inputs

- Nielsen Norman Group: _Hamburger Menus and Hidden Navigation Hurt UX Metrics_
- Material 3 navigation guidance (navigation drawer / expanded rail updates)
- Existing product screenshots and current DataGov IA density

## Key Findings

1. **Desktop hidden navigation hurts discoverability**
   - NN/g reports hidden desktop navigation is used less, used later, and increases task difficulty.
   - Recommendation: keep top-level destinations visible on desktop.

2. **Compact rail is preferable to full-width drawer for dense enterprise apps**
   - Material guidance trends toward adaptive rails over always-open heavy drawers.
   - Recommendation: support both expanded and compact states, user-controlled.

3. **Contextual assistance beats guessing in operational tabs**
   - In advanced tabs (Integrations, Admin), users need clear “what this section does” guidance.
   - Recommendation: add lightweight help strips and direct links to documentation.

## Product Decision Applied

- Keep **visible left navigation** on desktop (no hamburger-only desktop pattern).
- Add **collapsible sidebar** (expanded ↔ compact) to reclaim horizontal workspace.
- Keep **mobile drawer** behavior with a hamburger trigger and overlay.
- Add **contextual help strip** in Integrations and route users to **Help Center**.

## Future Enhancements

- Persist per-user sidebar mode server-side (not only local storage).
- Add keyboard shortcut for nav toggle (e.g., `[` / `]`).
- Instrument click analytics on nav destinations and help interactions.
