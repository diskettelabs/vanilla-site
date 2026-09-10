# Framer asset sources

These files were captured from the public page at `https://owen.uno/vanilla` on
2026-09-09 so the static site does not depend on Framer at runtime.

- `vanilla-wordmark.svg` — decoded from the header's embedded Framer SVG
- `cloud.svg`, `server.svg`, `terminal.svg` — embedded provider icons
- `microphone.svg`, `download.svg`, `file-ocr.svg`, `bolt.svg`, `sparkles.svg`,
  `compare.svg`, `shield-check.svg` — embedded feature icons
- `hero-*.svg` — reconstructed from the hero's embedded Framer SVG masks
- `../icons/waitlist.svg` and `../icons/github.svg` — public
  `framerusercontent.com` image assets
- `../meta/*` — public favicon, Apple touch icon, and Open Graph image assets

Framer's React runtime, analytics code, generated bundles, and hosted font files
are intentionally excluded. The rebuilt page uses readable source and the local
Satoshi webfonts instead.
