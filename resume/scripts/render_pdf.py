#!/usr/bin/env python3
"""Render a resume/drafts/*.txt file to resume/out/*.pdf."""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

# Ink: body and Technologies use near-black. Muted is only for meta (dates, contact).
INK = HexColor("#1a1a1a")
MUTED = HexColor("#444444")
RULE = HexColor("#222222")

SECTION_HEADERS = {
    "Professional summary",
    "Core skills",
    "Experience",
    "Projects and personal lab",
    "Selected certifications",
    "Training",
    "Community",
    "Education",
}


def esc(s: str) -> str:
    return html.escape(s)


def is_job_title(line: str) -> bool:
    markers = (
        "Platform Engineer |",
        "Senior DevOps Engineer |",
        "Cloud Automation Engineer |",
        "Automation Engineer |",
        "Senior Systems Consultant |",
        "Senior IT Engineer |",
        "Desktop Support Team Lead |",
    )
    return any(line.startswith(m) for m in markers)


def is_date_line(line: str) -> bool:
    return bool(re.match(r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+-\s+", line))


def is_project_title(line: str) -> bool:
    return line.startswith("AWS Lambda Hackathon") or line.startswith("Personal AWS multi-account")


def render(draft_path: Path, out_path: Path, title: str) -> None:
    raw = draft_path.read_text()
    body = re.split(r"\nNotes \(not for submit\)\n", raw, maxsplit=1)[0].rstrip() + "\n"
    lines = body.splitlines()

    page_w, _ = A4
    margin = 12.5 * mm

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
        title=title,
        author="John Ajera",
    )

    styles = getSampleStyleSheet()
    for name, kwargs in [
        ("Name", dict(fontName="Helvetica-Bold", fontSize=16, leading=18, textColor=INK, alignment=TA_CENTER, spaceAfter=1.2 * mm)),
        ("Tagline", dict(fontName="Helvetica", fontSize=9, leading=11, textColor=MUTED, alignment=TA_CENTER, spaceAfter=1 * mm)),
        ("Contact", dict(fontName="Helvetica", fontSize=8.2, leading=10.5, textColor=MUTED, alignment=TA_CENTER, spaceAfter=2.2 * mm)),
        ("H1", dict(fontName="Helvetica-Bold", fontSize=9.8, leading=12, textColor=INK, spaceBefore=2.6 * mm, spaceAfter=1 * mm)),
        ("BodyTxt", dict(fontName="Helvetica", fontSize=8.3, leading=10.5, textColor=INK, spaceAfter=0.8 * mm)),
        ("JobTitle", dict(fontName="Helvetica-Bold", fontSize=8.8, leading=11, textColor=INK, spaceBefore=1.8 * mm, spaceAfter=0.2 * mm)),
        ("JobMeta", dict(fontName="Helvetica-Oblique", fontSize=7.9, leading=9.8, textColor=MUTED, spaceAfter=0.6 * mm)),
        ("BulletBody", dict(fontName="Helvetica", fontSize=8.1, leading=10.3, textColor=INK, leftIndent=2 * mm)),
        # Technologies: dark ink + bold label so stack stands out (not muted grey)
        ("TechLine", dict(fontName="Helvetica", fontSize=8.0, leading=10.0, textColor=INK, spaceBefore=0.5 * mm, spaceAfter=0.4 * mm)),
        ("Skill", dict(fontName="Helvetica", fontSize=8.1, leading=10.2, textColor=INK, spaceAfter=0.3 * mm)),
        ("SubHead", dict(fontName="Helvetica-Bold", fontSize=8.5, leading=10.5, textColor=INK, spaceBefore=1.4 * mm, spaceAfter=0.4 * mm)),
    ]:
        styles.add(ParagraphStyle(name, **kwargs))

    story = []
    story.append(Paragraph(esc(lines[0]), styles["Name"]))
    story.append(Paragraph(esc(lines[1]), styles["Tagline"]))
    mapped = []
    for p in [x.strip() for x in lines[3].split("|")]:
        if "linkedin" in p:
            mapped.append(f'<link href="https://www.linkedin.com/in/john-ajera">{esc(p)}</link>')
        elif "github.com" in p:
            mapped.append(f'<link href="https://github.com/jajera">{esc(p)}</link>')
        elif "gitprofile" in p or "johna.kiwi" in p:
            mapped.append(f'<link href="https://gitprofile.johna.kiwi">{esc(p)}</link>')
        else:
            mapped.append(esc(p))
    story.append(Paragraph(esc(lines[2]) + "<br/>" + " | ".join(mapped), styles["Contact"]))

    i = 4
    while i < len(lines) and not lines[i].strip():
        i += 1

    def add_section(title_text: str) -> None:
        story.append(Paragraph(esc(title_text), styles["H1"]))
        story.append(HRFlowable(width="100%", thickness=0.55, color=RULE, spaceAfter=1 * mm))

    para_buf: list[str] = []

    def flush_para() -> None:
        nonlocal para_buf
        if para_buf:
            story.append(Paragraph(esc(" ".join(para_buf)), styles["BodyTxt"]))
            para_buf = []

    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            flush_para()
            i += 1
            continue
        if line in SECTION_HEADERS:
            flush_para()
            add_section(line)
            i += 1
            continue
        if line.startswith("- "):
            flush_para()
            text = line[2:].strip()
            i += 1
            while i < len(lines) and lines[i].startswith("  ") and not lines[i].startswith("- "):
                text += " " + lines[i].strip()
                i += 1
            parts = re.split(r"(https://\S+)", text)
            out_bits = []
            for p in parts:
                out_bits.append(f'<link href="{p}">{esc(p)}</link>' if p.startswith("https://") else esc(p))
            story.append(Paragraph("-  " + "".join(out_bits), styles["BulletBody"]))
            story.append(Spacer(1, 0.32 * mm))
            continue
        if line.startswith("Technologies:"):
            flush_para()
            text = line
            i += 1
            while i < len(lines):
                nxt = lines[i]
                if (
                    not nxt.strip()
                    or nxt.startswith("- ")
                    or nxt in SECTION_HEADERS
                    or is_job_title(nxt)
                    or is_date_line(nxt)
                    or is_project_title(nxt)
                ):
                    break
                text += " " + nxt.strip()
                i += 1
            label, _, rest = text.partition(":")
            story.append(
                Paragraph(
                    f"<b>{esc(label.strip())}:</b> {esc(rest.strip())}",
                    styles["TechLine"],
                )
            )
            continue
        if is_job_title(line) or is_project_title(line):
            flush_para()
            story.append(
                Paragraph(esc(line), styles["JobTitle"] if is_job_title(line) else styles["SubHead"])
            )
            i += 1
            if i < len(lines) and is_date_line(lines[i]):
                story.append(Paragraph(esc(lines[i]), styles["JobMeta"]))
                i += 1
            continue
        if is_date_line(line):
            flush_para()
            story.append(Paragraph(esc(line), styles["JobMeta"]))
            i += 1
            continue
        if re.match(r"^[A-Za-z].+: ", line) and not is_job_title(line):
            flush_para()
            label, rest = line.split(": ", 1)
            story.append(Paragraph(f"<b>{esc(label)}:</b> {esc(rest)}", styles["Skill"]))
            i += 1
            continue
        para_buf.append(line)
        i += 1

    flush_para()

    def on_page(canvas, doc_) -> None:
        canvas.saveState()
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(page_w - margin, 6.5 * mm, str(doc_.page))
        canvas.restoreState()

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("draft", type=Path, help="Path to resume/drafts/*.txt")
    ap.add_argument("-o", "--out", type=Path, help="Output PDF path")
    ap.add_argument("--title", default="John Ajera - Resume")
    args = ap.parse_args()
    draft = args.draft.resolve()
    if not draft.is_file():
        print(f"draft not found: {draft}", file=sys.stderr)
        return 1
    out = args.out or (draft.parents[1] / "out" / f"{draft.stem}.pdf")
    render(draft, out.resolve(), args.title)
    print(subprocess.check_output(["pdfinfo", str(out)], text=True))
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
