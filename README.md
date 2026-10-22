# Abubakar & Umar — Walima invite (2026)

React + Vite wedding card with gate video, section music, and scratch reveal.

**Live:** https://abubakarndumar.abubakar-devv.workers.dev/

## Deploy (recommended)

Har machine se sirf **git push** — Cloudflare deploy GitHub Actions se hota hai.

**Pehli dafa:** GitHub par Cloudflare secrets set karo — poori guide:

→ **[DEPLOY.md](./DEPLOY.md)**

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Music assets

Bundled: `Welcome page.mp3`, `Scratch here.mp3`, `gate.mp4`.  
Footer: `Footer.mov` (large) — loaded from GitHub raw in production; optional `Footer.mp3` in `src/assets/music/` for smaller bundle.
