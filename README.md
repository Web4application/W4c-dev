Water Droplets
--------------


A [Pen](https://codepen.io/Auraecosystem/pen/NPRvqEJ) by [Aura](https://codepen.io/Auraecosystem) on [CodePen](https://codepen.io).

[License](https://codepen.io/license/pen/NPRvqEJ).

# W4c-dev – Web4 Core / Cloud / Experiments

Monorepo for prototyping **Web4** ideas: AI-enhanced web apps, serverless (Cloudflare Workers), decentralized elements, wallets, inference tools, and full-stack experiments.

## Current Focus
- AI inference & models (`Model.jsonl`, `Ai-inference/`)
- Cloud/Workers setups (`wrangler.toml`, `workers/`)
- Local dev testing (Vite, Next.js, PHP prototypes)
- Multi-language snippets (Go, TS, Python, Ruby, C#...)

## Setup / Local Dev
1. Clone: `git clone https://github.com/Web4application/W4c-dev.git`
2. Install deps (if using Node parts): `npm install`
3. Run dev server:
   - Vite: `npm run dev`
   - Wrangler: `npx wrangler dev`
   - Caddy for custom domain: see below
4. Add to /etc/hosts: `127.0.0.1 web4.dev`
5. Open: https://web4.dev (use mkcert for HTTPS)

## Cleanup Notes
Removed duplicate test folders (`locallhost/`, etc.) — use `web4.dev` for local domain testing.

## License
See License.txt

More at: https://web4application.github.io/W4c-dev/
