# Resume toolkit

| Path | Purpose | In git? |
| --- | --- | --- |
| `pool/` | Standalone career facts | Yes |
| `scripts/` | PDF renderer | Yes |
| `jobs/` | JD notes + selection YAML | No (local) |
| `drafts/` | Plain-text working resumes | No (local) |
| `out/` | Final PDFs | No (local) |

Flow: JD -> draft `.txt` -> approve -> PDF.

```bash
python3 resume/scripts/render_pdf.py resume/drafts/<slug>.txt \
  -o resume/out/John_Ajera_<Employer>_<Role>.pdf
```

PDF note: `Technologies:` lines render dark (bold + body ink), not muted grey.

Agent config: `.cursor/rules/resume.mdc`, `.cursor/skills/resume-from-jd/`, `.kiro/steering/`, `AGENTS.md`.
