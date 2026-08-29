# Personal CV for John Ajera

Static site at [gitprofile.johna.kiwi](https://gitprofile.johna.kiwi/).

Narrative content comes from the [`jajera/jajera`](https://github.com/jajera/jajera) profile README. Site-only links and chrome live in [`site.json`](site.json).

Project inventory (Pages, modules, Actions) lives on [pages.johna.kiwi](https://pages.johna.kiwi/), not here.

## Local

```bash
npm install
PROFILE_README_PATH=../jajera/README.md npm run fetch-profile   # optional local SoT
npm run dev
npm run build
npm run preview
```

`npm run build` fetches the profile README from GitHub (or `PROFILE_README_PATH`) then builds Astro into `dist/`. A committed snapshot lives in `data/profile.md` as fallback.

GA4 (`gaMeasurementId` in `site.json`) is injected only in production builds.

## Deploy

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Custom domain: `gitprofile.johna.kiwi` (Route 53 CNAME from johna-kiwi-infra `sites.yaml`).
3. Push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (`astro-pages-deploy` reusable).
4. Daily refresh updates `data/profile.md` when the profile README changes.

## Related hubs

- [johna.kiwi](https://johna.kiwi/) — curated home
- [guides.johna.kiwi](https://guides.johna.kiwi/) — walkthrough hub
- [pages.johna.kiwi](https://pages.johna.kiwi/) — project index
