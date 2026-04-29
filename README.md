# quinza-site

Landing page + AdMob verification host for Quinza.

## Files

- `index.html`: public landing page for the app.
- `styles.css`: page styling.
- `assets/`: reused Quinza graphics.
- `app-ads.txt`: AdMob app verification file.
- `CNAME`: GitHub Pages custom domain (`quinza-game.com`).

## Deploy with GitHub Pages

1. Push this repository to GitHub on branch `main`.
2. Go to repository `Settings` -> `Pages`.
3. Set:
   - Source: `Deploy from a branch`
   - Branch: `main` and `/ (root)`
4. Confirm custom domain is `quinza-game.com` (the `CNAME` file is included).
5. Wait for deployment.

## Namecheap DNS (mail-safe with Improvmx)

Keep existing Improvmx mail records exactly as-is (MX + SPF TXT).

Add/ensure these web records:

1. `A` | Host: `@` | Value: `185.199.108.153` | TTL: `Automatic`
2. `A` | Host: `@` | Value: `185.199.109.153` | TTL: `Automatic`
3. `A` | Host: `@` | Value: `185.199.110.153` | TTL: `Automatic`
4. `A` | Host: `@` | Value: `185.199.111.153` | TTL: `Automatic`
5. `CNAME` | Host: `www` | Value: `<your-github-username>.github.io` | TTL: `Automatic`

Only remove conflicting web records on `@` or `www` (parking/old redirects). Do not remove MX/TXT mail records.

## Verification Checklist

1. Open `https://quinza-game.com` and verify landing page loads.
2. Open `https://quinza-game.com/app-ads.txt` and verify it shows exactly:

   `google.com, pub-2489785072705713, DIRECT, f08c47fec0942fa0`

3. In Play Console, set Developer website to `https://quinza-game.com`.
4. In AdMob app details, link `com.quinza`, then click `Check for updates`.
