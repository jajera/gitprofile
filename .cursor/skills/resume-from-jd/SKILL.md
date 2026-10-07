---
name: resume-from-jd
description: >-
  Build a JD-matched resume from resume/pool. Draft plain-text first;
  PDF only when the user confirms final.
---

# Resume from JD

## When to use

User pastes or points at a job description and wants a tailored resume from `resume/pool/`.

## Steps

1. Read `resume/pool/` (`identity`, `roles`, `bullets`, `skills`, `certs`, `summaries`, etc.).
2. Save or update the JD at `resume/jobs/<slug>.md` if useful.
3. Choose summary, skills, bullet IDs, certs from the pool (record in `resume/jobs/<slug>.yaml` if helpful).
4. Write **only** `resume/drafts/<slug>.txt` in ATS plain text:
   - Header: name, tagline, location, LinkedIn, GitHub, website
   - Professional summary
   - Core skills
   - Experience (role headers + `-` bullets)
   - Certifications, training, community, education as needed
5. Show the user the draft path. Ask what to change.
6. **Stop.** Do not generate PDF until the user clearly asks for a final PDF.

## Plain-text rules

- ASCII-friendly. Use `-` not `—`. Use `|` or `,` not middle dots in headers if needed.
- Natural English. No invented experience.
- If the JD asks for something not in the pool, omit it; do not fabricate.

## Final PDF (only on request)

When the user says the draft is final:

1. Render with `python3 resume/scripts/render_pdf.py resume/drafts/<slug>.txt -o resume/out/<Name>_<Employer>_<Role>.pdf`
2. Keep contact rules: no phone/email.
3. `Technologies:` lines must render dark (bold label + body ink), not muted grey.
4. Confirm page count and path.
