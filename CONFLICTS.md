# Source conflicts

**Links:** all links (LinkedIn, OptiWare landing page, every achievement link, the academia.edu paper) were verified correct by the owner on 2026-10-06. No link has been changed.

Sources compared:

- **PDF**: `_sources/Joshua Karthik's Resume (2).pdf`, "Last updated Sep 2026". This is the primary source of truth.
- **TEX**: `_sources/latex code.txt`, the LaTeX resume (says "Last updated Jun 2026"). Used only for link URLs, which the PDF text doesn't expose.
- **LI**: `_sources/Profile (6).pdf`, the LinkedIn profile export.
- **GH**: GitHub profile, profile README, and repo READMEs/metadata (fetched 2026-10-06).

"Site uses" is what the site currently shows. Each value lives in `src/data/content.ts`.

| # | Topic | PDF | Other source(s) | Site uses | Action needed |
|---|-------|-----|-----------------|-----------|---------------|
| 1 | **Workhall internship** | Not listed | LI: *AI Engineering Intern, Workhall*, Apr–May 2026, Chennai, no-code facility booking app | **Included** (owner decision), bullets taken from LI | Confirm it should be public. To hide it, set `visible: false` on the Workhall entry. Consider adding it to the resume PDF so the two match. |
| 2 | **Location** | Chennai, India | LI: Coimbatore, Tamil Nadu | Chennai, India | **RESOLVED** (owner confirmed Chennai, India). |
| 3 | **LinkedIn URL** | `linkedin.com/in/joshua-karthik-ashok-00881a290/` | LI export: `linkedin.com/in/joshua-karthik-ashok` | `…-00881a290/` (unchanged) | **RESOLVED (user-verified)**: links confirmed correct by owner. |
| 4 | **HP poWer Lab 2.0 wording** | Achievements: "Top 34 / 40,000+ Semi-Finalist (Project: RouteX)". RouteX bullet: "Top 34 in poWer Lab 2.0 – HPCL Challenge 7.1" | LI: "Top 34/40,000+ at HP poWer Lab 2.0". RouteX README: "Top 34 in poWer Lab 2.0 2026" | PDF wording | No newer result found in any source. If the outcome changed (e.g. finalist or winner), update `proofPoints` and `achievements`. |
| 5 | **Experience dates & locations** | No dates or locations for any role | LI: HPCL Jun–Jul 2026 (Mumbai). Hyundai AutoEver Nov–Dec 2025 (Sriperumbudur). TrustyBytes May–Jun 2025 (Chennai) | LI dates and locations (owner decision) | Confirm them. |
| 6 | **Employer / title names** | "Hyundai". HPCL title "Project Intern – IMM Department". "TrustyBytes" | LI: "Hyundai AutoEver India". HPCL "IMM Intern". "Trusty Bytes" | "Hyundai AutoEver India" (owner confirmed). HPCL title and "TrustyBytes" from the PDF | Hyundai name **RESOLVED**. Optional: confirm the TrustyBytes spelling. |
| 7 | **GitHub bio is stale** | n/a | GH bio and profile README: "currently interning at HPCL". LI says the HPCL role ended Jul 2026 | Site doesn't claim a current internship | Update the GitHub bio. |
| 8 | **Degree name & start date** | "B.Tech in Computer and Engineering", Aug 2023 – Present | LI: "BTech, Computer Science", Apr 2023 – Apr 2027 | "B.Tech in Computer Science and Engineering", Aug 2023 | **RESOLVED** (owner-corrected degree name; Aug 2023 start matches resume). Consider fixing the typo on the resume PDF too. |
| 9 | **OptiWare "Live" link** | Links to `https://vendor-landpage.vercel.app/` | GitHub link points to the `Vendor-Innovate-Solutions` org | URL unchanged. Labelled "Landing page" (card) and "Vendor Innovate Solutions landing page" (case study), with a note that it is not a live demo of the edge-AI system | **RESOLVED (user-verified)**: URL confirmed correct by owner. |
| 10 | **ClarityLegal repo / live demo** | GitHub → `joshuakarthik2005/gen-ai` | A separate `joshuakarthik2005/ClarityLegal` repo has the same README and lists a homepage, `https://clarity-legal-ten.vercel.app`, which is a working app with a demo mode. The README's own demo/video links are placeholders | `gen-ai` only (owner decision) | Consider adding the live app as a "Live demo" link in `projects[1].links`. |
| 11 | **Publication authorship & link** | Title and summary only | LI: "Co-author, research paper…" | No authorship role shown. Link unchanged | Link **RESOLVED (user-verified)**. Optional: add co-authors or a venue/year. |
| 12 | **Skills list** | Includes GoLang, Frontend (React, Angular), JPA2, Hibernate | TEX (Jun 2026) lacks these | PDF list | None. |
| 13 | **ClarityLegal README metrics** | n/a | README claims "85%+ test coverage", "15,000+ lines", "15+ endpoints" | **Not used** (not on the resume) | Add them only if you stand behind them. |
| 14 | **CGPA** | 7.59 | n/a | **Not shown** (owner decision) | None. |
| 15 | **Phone** | +91-7358377346 | n/a | Shown in Contact (owner decision) | Be aware it will be scraped. |
