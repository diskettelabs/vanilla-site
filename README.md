# Vanilla site

Static, dependency-free rebuild of the Vanilla landing page for GitHub Pages.

## Local preview

```sh
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Structure

- `index.html` — semantic page content and metadata
- `styles.css` — responsive layout, local Satoshi font, and motion
- `script.js` — mobile navigation, reveal effects, and theme preview
- `assets/` — local fonts, Framer artwork, icons, favicons, and social preview

The original public Framer artwork used by this page is preserved under
`assets/framer/`; the rebuilt site has no runtime dependency on Framer.

Pushes to `main` or `new-site` deploy through the Pages workflow.
