# Dines Installations

Marketing site for **Dines Installations LTD** — Solar PV, battery storage, EV chargers and electrical work in Halifax & West Yorkshire.

Built as a static single-page site with TailwindCSS (CDN) and a custom rAF-driven parallax engine — 10 distinct parallax techniques across 4 tabs (Home, About, Services, Contact).

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
