# Deploy — sirf GitHub se (kisi bhi laptop par)

Live site: **https://abubakarndumar.abubakar-devv.workers.dev/**

Code push karo → GitHub Actions khud build + Cloudflare par deploy karega. Local `wrangler login` ki zaroorat nahi.

---

## Ek dafa setup (5 minute)

### 1) Cloudflare API token

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → profile icon → **My Profile** → **API Tokens**
2. **Create Token** → template **Edit Cloudflare Workers** (ya custom):
   - Account → **Workers Scripts** → **Edit**
   - Account → **Workers KV Storage** → Edit (optional)
   - Zone → skip (Workers-only project)
3. Token copy karo — dubara nahi dikhega.

### 2) Account ID

1. Dashboard → **Workers & Pages**
2. Right side **Account ID** copy karo.

### 3) GitHub repo secrets

Repo: **https://github.com/25abubakar/Weds**

1. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Ye do secrets add karo:

| Name | Value |
|------|--------|
| `CLOUDFLARE_API_TOKEN` | step 1 wala token |
| `CLOUDFLARE_ACCOUNT_ID` | step 2 wala ID |

Dono **Repository secrets** hon (Environment secrets optional).

---

## Roz ka kaam (kisi bhi machine se)

```bash
git add .
git commit -m "your message"
git push origin master
```

Ya GitHub par code edit → commit to `master`.

Phir:

1. **Actions** tab → **Deploy to Cloudflare Workers**
2. Latest run **green** honi chahiye
3. Site par hard refresh (Ctrl+F5)

Manual deploy bina naye commit ke:

- **Actions** → **Deploy to Cloudflare Workers** → **Run workflow** → branch `master`

---

## Deploy theek hua ya nahi?

1. Actions run **success**
2. Browser: page source / Network — JS file naam badalta hai (har build naya hash), masalan `index-7kGbQ9mP.js`

Agar run **fail** aur message **Missing secret** ho → upar wale secrets dubara check karo.

Agar **Authentication error** ho → token expire / galat permissions — naya **Edit Cloudflare Workers** token banao.

---

## Files

- Workflow: `.github/workflows/deploy-cloudflare.yml`
- Worker config: `wrangler.toml` (worker name: `abubakarndumar`)
- Build output: `dist/` (git ignore — CI har bar banata hai)

Footer audio bada hai (`Footer.mov`) — bundle mein nahi; production mein GitHub raw URL se load hota hai (`musicTracks.ts`).
