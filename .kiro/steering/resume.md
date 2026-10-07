---
inclusion: auto
name: resume
description: >-
  JD-matched resume generation from resume/pool. Use when the user pastes a job
  description, asks for a tailored CV/resume, or works under resume/.
---

# Resume generation

## Facts

- Use only `resume/pool/*.yaml`. Do not invent experience, tools, or dates.
- Rewording is allowed. New claims are not.
- No phone, email, or street address. Links: LinkedIn, GitHub, website only.
- Target NZ roles. Keep Singapore history concise unless the JD needs it.

## Workflow

1. Draft first: write `resume/drafts/<slug>.txt` in plain text.
2. Optionally record selection in `resume/jobs/<slug>.yaml`.
3. Iterate on the `.txt` with the user.
4. Create a PDF in `resume/out/` **only** when the user says the draft is final.

## Style

- Natural English. Clear verbs. No hype.
- ATS plain text: ASCII hyphens `-`, colons, commas. Avoid em dashes `—`, smart quotes, and decorative bullets.
- Prefer `-` bullets in drafts.
- Do not claim JD requirements that are missing from the pool (say what was omitted if asked).

## PDF

Render with `resume/scripts/render_pdf.py`. `Technologies:` lines are a highlight: bold label and dark near-black ink (not muted grey).
