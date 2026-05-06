# Dines Installations

Marketing site for **Dines Installations LTD** — Solar PV, battery storage, EV chargers and electrical work in Halifax & West Yorkshire.

Built as a static single-page site with TailwindCSS (CDN). Four design variants live side-by-side; the root URL serves the selected design.

| Path | Design |
| --- | --- |
| `/`   | **Design D — gallery-hero showcase** *(live)* |
| `/a/` | Design A — dark, parallax-heavy |
| `/b/` | Design B — light editorial |
| `/c/` | Design C — dark cinematic single hero |

A small **A / B / C / D** switcher pill in the top-right of every page lets you flip between them.

## Local preview

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765/>.

## Stack

- HTML + TailwindCSS (CDN with `forms`, `typography`, `aspect-ratio` plugins)
- Vanilla JS (IntersectionObserver + `requestAnimationFrame` parallax loop)
- Photos sourced from [Pexels](https://www.pexels.com/)

## Deploy

Deployed on Vercel — pushes to `main` redeploy automatically.

## Contact

- **Phone:** 01422 204249 / 07999 161125
- **Email:** info@dinesinstallations.co.uk
- **Address:** 4 Westminster Rd, Halifax HX3 8DH
