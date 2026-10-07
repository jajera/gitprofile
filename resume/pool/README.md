# Resume career pool

Standalone career inventory for JD-matched resume generation.

## Rules

- Use only facts in this pool. Do not invent employers, dates, metrics, or tech.
- Rewording at draft time is fine; new claims are not.
- No phone, email, or street address.
- Links: LinkedIn, GitHub, website only.
- NZ-focused applications; Singapore roles are historical experience.

## Workflow

1. Put or paste a JD (optional file under `resume/jobs/`).
2. Draft plain text: `resume/drafts/<slug>.txt` (ATS-friendly ASCII).
3. Iterate on the draft.
4. PDF in `resume/out/` only when you say the draft is final.

## Files

| File | Contents |
| --- | --- |
| `identity.yaml` | Name, location, links |
| `roles.yaml` | Employers, titles, dates, role summaries |
| `bullets.yaml` | Achievement bullets (`role_id`, tags) |
| `skills.yaml` | Skill groups |
| `certs.yaml` | Certifications |
| `training.yaml` | Courses / workshops |
| `community.yaml` | AWS community roles |
| `education.yaml` | Degrees / ITE |
| `summaries.yaml` | Professional summary variants |
| `cover_letter_claims.yaml` | Extra narrative claims |
| `projects.yaml` | Hackathons, personal lab (Control Tower/LZA, Lambda, etc.) |
| `meta.yaml` | Counts and constraints |
