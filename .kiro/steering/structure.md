---
inclusion: always
---

# Structure

```
src/                 # Astro site
data/profile.md      # Fetched profile snapshot for the site
site.json            # Site chrome and links
resume/
  pool/              # Standalone career facts (YAML)
  jobs/              # JD notes and selection YAML
  drafts/            # Plain-text resume drafts (working copies)
  out/               # Final PDFs only
.cursor/rules/       # Cursor project rules
.cursor/skills/      # Cursor skills
.kiro/steering/      # Kiro steering
```

Resume flow: pool -> job selection -> `resume/drafts/<slug>.txt` -> (user approval) -> `resume/out/*.pdf`.
