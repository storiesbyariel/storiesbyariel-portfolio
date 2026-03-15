# storiesbyariel-portfolio

A clean, static photography portfolio scaffold for **Stories by Ariel**, designed for easy GitHub Pages deployment.

## Included Files

- `index.html` — main one-page site with people-first sections
- `styles.css` — base styling
- `script.js` — minimal JS (dynamic footer year)
- `assets/README.md` — placeholder for media organization
- `.gitignore`

## Local Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/storiesbyariel-portfolio.git
   cd storiesbyariel-portfolio
   ```
2. Open `index.html` in your browser, or run a local static server:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000`.

## Deploy with GitHub Pages

### Route A: User/Org Site (root URL)
Use this when repo is named exactly:
- `your-username.github.io` (or org equivalent)

Steps:
1. Rename repo to `your-username.github.io`.
2. Push the site files to the repository default branch.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`) / root (`/`)
5. Site publishes at:
   - `https://your-username.github.io/`

### Route B: Project Site (repo URL path)
Use this for this repo name (`storiesbyariel-portfolio`).

Steps:
1. Push code to `main`.
2. In GitHub: **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main` / root (`/`)
4. Site publishes at:
   - `https://your-username.github.io/storiesbyariel-portfolio/`

## Customize Next

- Replace placeholder copy in `index.html`
- Add photos under `assets/`
- Update contact email and social links
- Expand People Work and Personal Work into separate pages if needed
