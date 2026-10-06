/**
 * Single source of truth for all site copy.
 *
 * Edit text here; components never hard-code content.
 * Every claim below is taken from one of:
 *   [PDF]  Resume PDF, "Last updated Sep 2026" (primary source of truth)
 *   [TEX]  LaTeX resume (Jun 2026) — used only for hyperlink URLs the PDF text omits
 *   [LI]   LinkedIn profile export
 *   [GH]   GitHub repos / READMEs
 * Conflicts between sources are tracked in /CONFLICTS.md.
 * Missing assets are tracked in /TODO.md.
 */

import { withBase } from "@/lib/site";

/** Set to false before publishing to hide all "placeholder" boxes. */
export const showPlaceholders = true;

export type Link = {
  label: string;
  href: string;
  /** Longer label for case-study pages and screen readers. */
  longLabel?: string;
  /** Short clarification shown next to the link on case-study pages. */
  note?: string;
};

export const person = {
  name: "Joshua Karthik Ashok",
  shortName: "Joshua",
  role: "Backend & AI Systems Engineer",
  positioning: "Backend & AI Systems Engineer: optimization, LLM pipelines, scalable APIs",
  // [PDF] summary line
  summary:
    "Backend & AI Systems Engineer with a track record of shipping AI-driven optimization platforms and scalable backend systems across enterprise and startup environments.",
  // [PDF] header, confirmed by owner. CONFLICTS.md #2.
  location: "Chennai, India",
  email: "joshuakarthik2005@gmail.com",
  // [PDF] header. Shown publicly by owner's choice.
  phone: "+91-7358377346",
  phoneHref: "tel:+917358377346",
  // [LI] "CSE undergrad @ Amrita Vishwa Vidyapeetham, Class of 2027"
  status: "CS undergrad · Class of 2027",
  // TODO.md: add /public/headshot.jpg and set this to "/headshot.jpg"
  headshot: null as string | null,
  links: {
    github: "https://github.com/joshuakarthik2005",
    // Verified by owner. CONFLICTS.md #3.
    linkedin: "https://www.linkedin.com/in/joshua-karthik-ashok-00881a290/",
    resume: withBase("/Joshua-Karthik-Ashok-Resume.pdf"),
  },
  resumeUpdated: "Sep 2026",
};

export const proofPoints = [
  {
    value: "~10h → <1h",
    label: "Optimization time at HPCL",
    detail: "Dual-solver (CP-SAT + MILP) vessel scheduling for LPG imports across 20+ ports",
    href: "#experience",
  },
  {
    value: "Top 34 / 40,000+",
    label: "HP poWer Lab 2.0 (HPCL)",
    detail: "Semi-finalist with RouteX, maritime fleet optimization",
    href: "/projects/routex",
  },
  {
    value: "Winner",
    label: "SEED Business Challenge 2026",
    detail: "University of Maryland",
    href: "#achievements",
  },
];

export const nav = [
  { id: "projects", label: "Projects" },
  { id: "demo", label: "Demo" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ArchLayer = { name: string; nodes: string[] };
export type Decision = { title: string; body: string };
export type MediaSlot = { kind: "image" | "video"; label: string; src: string | null };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  achievement?: string;
  problem: string;
  approach: string;
  impact: string[];
  stack: string[];
  links: Link[];
  /** Resume bullets, verbatim from [PDF]. */
  resumeBullets: string[];
  detail: {
    overview: string;
    architectureNote?: string;
    architecture: ArchLayer[];
    decisions: Decision[];
    results: { value: string; label: string }[];
    extra?: { title: string; items: string[] };
    media: MediaSlot[];
  };
};

export const projects: Project[] = [
  {
    slug: "routex",
    name: "RouteX",
    tagline: "AI-Powered Maritime Fleet Optimization Platform",
    achievement: "Top 34 in poWer Lab 2.0 – HPCL Challenge 7.1",
    problem:
      "Allocate HPCL's 9 coastal tankers across 6 loading and 11 unloading ports so every port's monthly demand is met at minimum transportation cost.",
    approach:
      "Constraint programming with Google OR-Tools CP-SAT over ~726 generated feasible route patterns, served by a FastAPI backend with Celery/Redis async solves and a Next.js dashboard.",
    impact: [
      "40–50% cost reduction over manual planning",
      "100% demand satisfaction",
      "Solver profiles from 15 s to 300 s",
    ],
    stack: ["OR-Tools (CP-SAT)", "FastAPI", "Next.js", "MongoDB", "Celery", "Redis", "searoute-py"],
    links: [{ label: "GitHub", href: "https://github.com/CosmicEngineers/RouteX" }],
    resumeBullets: [
      "Built an AI-driven coastal fleet optimization system using Google OR-Tools (CP-SAT), FastAPI, Next.js, and MongoDB, solving HPCL's 9-tanker, 17-port problem with ~726 feasible route patterns and 40–50% cost reduction over manual planning.",
      "Developed a constraint programming engine with multi-objective support (cost, time, emissions), solver profiles (15 s–300 s), and parallel route generation; enforced single-port loading and max two-port discharge with 100% demand satisfaction.",
      "Implemented real-time maritime visualization with interactive route playback, Gantt-based fleet scheduling, and Celery/Redis async processing; integrated searoute-py for sea distances. Top 34 in poWer Lab 2.0 – HPCL Challenge 7.1.",
    ],
    detail: {
      overview:
        "RouteX tackles HPCL's Challenge 7.1, coastal vessel optimization, as a set-partitioning problem. Nine tankers (seven of 50,000 MT and two of 25,000 MT) serve 11 unloading ports with a combined monthly demand of 440,000 MT. Each trip loads at a single port and discharges at no more than two ports.",
      architecture: [
        { name: "Frontend · Next.js", nodes: ["Dashboard", "Optimization panel", "Results visualizer", "Route playback + Gantt"] },
        { name: "API · FastAPI", nodes: ["Challenge routes", "Fleet management", "Port management"] },
        { name: "Services", nodes: ["CP-SAT engine (route generation, constraints, objective)", "Cost calculator", "Distance calculator (searoute-py)", "EEOI emissions calculator"] },
        { name: "Data", nodes: ["MongoDB (primary)", "In-memory fallback", "Redis cache"] },
        { name: "Async", nodes: ["Celery + Redis task queue for long-running solves"] },
      ],
      decisions: [
        {
          title: "Set partitioning over pre-generated routes",
          body: "~726 feasible route patterns are generated up front, each one already following the trip rules (one loading port, at most two discharge ports). CP-SAT then picks a minimum-cost set of patterns that covers all demand.",
        },
        {
          title: "Solver profiles instead of one fixed budget",
          body: "Quick (15 s), Balanced (60 s), and Thorough (300 s) profiles let a planner trade solve time for solution quality.",
        },
        {
          title: "Async solves via Celery/Redis",
          body: "Long-running optimizations run as background tasks, so the API stays responsive while a solve is in progress.",
        },
        {
          title: "Real sea distances",
          body: "searoute-py computes maritime distances, so voyage times follow sea lanes rather than straight lines.",
        },
        {
          title: "Multi-objective support",
          body: "The engine supports cost, time, and emissions objectives.",
        },
      ],
      results: [
        { value: "~726", label: "feasible route patterns" },
        { value: "40–50%", label: "cost reduction vs manual planning" },
        { value: "100%", label: "demand satisfaction" },
        { value: "Top 34", label: "poWer Lab 2.0, HPCL Challenge 7.1" },
      ],
      media: [
        { kind: "image", label: "RouteX dashboard screenshot", src: null },
        { kind: "video", label: "Route playback demo video", src: null },
      ],
    },
  },
  {
    slug: "claritylegal",
    name: "ClarityLegal",
    tagline: "AI-Driven Legal Document Intelligence Platform",
    achievement: "Top 100 / 30,000+ at Google Gen AI Exchange Hackathon",
    problem:
      "Make sophisticated contract review accessible to small and mid-sized businesses: upload a legal document, get its summary, risks, and key clauses in plain language.",
    approach:
      "OCR extraction, Vertex AI (Gemini) analysis, and RAG semantic search over multi-document embeddings, behind a FastAPI backend and a Next.js frontend.",
    impact: [
      "<5 s document processing",
      "Grounded Q&A with near-zero hallucination",
      "Validated on SaaS, NDA, and employment contracts",
    ],
    stack: ["Vertex AI (Gemini)", "OCR", "RAG", "FastAPI", "Next.js", "GCP Cloud Run", "Firestore"],
    links: [{ label: "GitHub", href: "https://github.com/joshuakarthik2005/gen-ai" }],
    resumeBullets: [
      "Engineered an AI-powered legal analysis system using Vertex AI (Gemini), OCR, RAG search, FastAPI, and Next.js, enabling <5 s document processing and structured extraction of summaries, risks, and key clauses.",
      "Developed clause extraction, risk scoring, and grounded Q&A modules with near-zero hallucination; implemented semantic search over multi-document embeddings for real-time cross-document retrieval. Validated on SaaS, NDA, and employment contracts as a commercial prototype for SMEs.",
    ],
    detail: {
      overview:
        "Users upload a legal document and get a summary, risks with severity ratings, an obligation timeline, and a chat interface whose answers cite clauses. Semantic search runs across all uploaded documents.",
      architecture: [
        { name: "Frontend · Next.js", nodes: ["Document upload", "PDF viewer", "Summary / risks / timeline", "Document chat"] },
        { name: "API · FastAPI on Cloud Run", nodes: ["Auth (OAuth 2.0 + JWT)", "Upload & processing", "RAG search", "Risk detection", "Chat"] },
        { name: "Google Cloud", nodes: ["Document AI (OCR)", "Vertex AI (embeddings + Gemini)", "Cloud Storage", "Firestore", "Secret Manager"] },
      ],
      decisions: [
        {
          title: "Retrieval-grounded answers",
          body: "Q&A and clause extraction are grounded in retrieved document passages, which keeps hallucination near zero.",
        },
        {
          title: "Cross-document embeddings",
          body: "Embeddings span every uploaded document, so a single semantic search retrieves across contracts in real time.",
        },
        {
          title: "Serverless backend",
          body: "The FastAPI backend runs on GCP Cloud Run alongside managed Storage, Firestore, and Secret Manager.",
        },
      ],
      results: [
        { value: "<5 s", label: "document processing" },
        { value: "3", label: "contract types validated (SaaS, NDA, employment)" },
        { value: "Top 100", label: "of 30,000+ at Google Gen AI Exchange" },
      ],
      extra: {
        title: "Core API surface",
        items: [
          "POST /api/upload",
          "POST /api/rag-search",
          "POST /api/summarize",
          "POST /api/detect-risks",
          "POST /api/chat",
        ],
      },
      media: [
        { kind: "image", label: "Upload → analysis screenshot", src: null },
        { kind: "video", label: "Risk detection / chat demo video", src: null },
      ],
    },
  },
  {
    slug: "optiware",
    name: "OptiWare",
    tagline: "Edge-AI Warehouse Automation",
    achievement: "Top 10 / 10,000+ at Sony AITRIOS Hackathon",
    problem:
      "Real-time item detection for warehouse sorting, with automated alerting and operator dashboards on top.",
    approach:
      "On-device inference with a Sony IMX-500 sensor, Raspberry Pi, and TensorFlow Lite. Events flow to PostgreSQL and AWS (SNS/S3/Lambda) for alerting and operator dashboards.",
    impact: [
      "Sub-200 ms inference latency",
      "<1.5 s event propagation",
      "30% lower edge-pipeline overhead",
    ],
    stack: ["Sony IMX-500", "Raspberry Pi", "TensorFlow Lite", "PostgreSQL", "AWS SNS", "AWS S3", "AWS Lambda"],
    links: [
      {
        // URL verified by owner. It is the team's landing page, not a live demo of the edge system.
        label: "Landing page",
        longLabel: "Vendor Innovate Solutions landing page",
        note: "Team landing page, not a live demo of the edge-AI system.",
        href: "https://vendor-landpage.vercel.app/",
      },
      { label: "GitHub", href: "https://github.com/Vendor-Innovate-Solutions" },
    ],
    resumeBullets: [
      "Developed an edge-AI warehouse automation system using Sony IMX-500, Raspberry Pi, and TensorFlow Lite, achieving sub-200 ms inference latency with high-precision item detection for real-time sorting.",
      "Integrated PostgreSQL and AWS (SNS/S3/Lambda) to enable <1.5 s event propagation, automated alerting, and operator dashboards; optimized edge pipeline to reduce overhead by 30%.",
    ],
    detail: {
      overview:
        "OptiWare runs item detection on the edge so sorting decisions don't wait on a cloud round-trip. Detection events then propagate through AWS to automated alerts and operator dashboards.",
      architectureNote: "High-level component view reconstructed from the resume. Confirm the data flow before publishing.",
      architecture: [
        { name: "Edge", nodes: ["Sony IMX-500 sensor", "Raspberry Pi", "TensorFlow Lite inference"] },
        { name: "Cloud · AWS", nodes: ["SNS (alerting)", "S3", "Lambda"] },
        { name: "Data & UI", nodes: ["PostgreSQL", "Operator dashboards"] },
      ],
      decisions: [
        {
          title: "Inference at the edge",
          body: "Running TensorFlow Lite on IMX-500 + Raspberry Pi keeps detection under 200 ms for real-time sorting.",
        },
        {
          title: "Event-driven cloud path",
          body: "SNS and Lambda propagate events in under 1.5 s and drive automated alerting.",
        },
      ],
      results: [
        { value: "<200 ms", label: "inference latency" },
        { value: "<1.5 s", label: "event propagation" },
        { value: "30%", label: "edge pipeline overhead reduced" },
        { value: "Top 10", label: "of 10,000+ at Sony AITRIOS" },
      ],
      media: [
        { kind: "image", label: "Edge device / detection screenshot", src: null },
        { kind: "video", label: "Real-time sorting demo video", src: null },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Experience — bullets verbatim from [PDF] unless marked [LI].
// Dates/locations from [LI] (PDF has none). See CONFLICTS.md #5–#7.
// ---------------------------------------------------------------------------

export type Experience = {
  company: string;
  short: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  /** Bullets beyond the first `featured` are collapsed behind a disclosure. */
  featured: number;
  visible: boolean;
  source?: string;
};

export const experience: Experience[] = [
  {
    company: "Hindustan Petroleum Corporation Limited (HPCL)",
    short: "HPCL",
    role: "Project Intern – IMM Department",
    period: "Jun 2026 – Jul 2026",
    location: "Mumbai",
    featured: 3,
    visible: true,
    bullets: [
      "Architected a dual-solver vessel scheduling platform (CP-SAT + MILP, 20K+ mixed-integer variables, 200+ constraint templates) for HPCL's annual LPG import operations across 20+ ports; reduced optimization time from ~10 hours to <1 hour and achieved 89–97% demand accuracy with dedicated Non-Designated port cost optimization.",
      "Built a multi-pass LLM extraction engine (Gemini 2.5 Flash + IBM Docling) that converts crude oil assay PDFs into validated Excel workbooks, automating the transcription of 200+ data fields per assay backed by 11 physics-based validation checks and a human-in-the-loop review dashboard.",
      "Deployed a serverless executive dashboard (Google Sheets → Apps Script API → auto-refreshing TV display) consolidating real-time data from 5 departments into a single C-suite information screen, eliminating 45+ min/day of manual cross-department reporting with traffic-light alerting and 60-second data refresh.",
      "Automated daily consolidation of pipeline operations reports from 4 companies (MPSPL, RRKPL, VVSPL, MDPL) by building a Python tool that fetches DOR attachments from Outlook, maps data blocks via dynamic text anchors, and safely injects values into a master tracking workbook — replacing daily manual copy-paste with a scheduled, formula-safe, backup-protected sync.",
    ],
  },
  {
    // [LI] only — included by owner's decision. CONFLICTS.md #1.
    company: "Workhall",
    short: "Workhall",
    role: "AI Engineering Intern",
    period: "Apr 2026 – May 2026",
    location: "Chennai",
    featured: 3,
    visible: true,
    source: "LinkedIn",
    bullets: [
      "Designed and built a College Facility Booking App on Workhall's no-code business application platform, digitizing a manual, spreadsheet-driven booking process.",
      "Configured workflow automation, approval logic, and role-based access without traditional coding, leveraging Workhall's NLP-driven app-building environment.",
      "Delivered a production-ready internal tool that eliminated manual coordination for facility scheduling/approvals.",
    ],
  },
  {
    company: "Hyundai AutoEver India",
    short: "Hyundai",
    role: "SAP ABAP Intern",
    period: "Nov 2025 – Dec 2025",
    location: "Sriperumbudur",
    featured: 2,
    visible: true,
    bullets: [
      "Engineered and enhanced SAP ABAP artifacts — including SmartForms, DDIC objects, BAPIs, BADIs, and user-exits — streamlining core manufacturing and procurement workflows and enabling 30% reduction in manual processing overhead across SAP modules (MM, SD).",
      "Optimized legacy ABAP programs through performance tuning, SQL trace analysis, and buffering strategies, improving runtime efficiency by 20–25% and elevating system reliability in production-grade environments.",
    ],
  },
  {
    company: "TrustyBytes",
    short: "TrustyBytes",
    role: "Full Stack Developer Intern",
    period: "May 2025 – Jun 2025",
    location: "Chennai",
    featured: 2,
    visible: true,
    bullets: [
      "Engineered React frontends and Node.js/MongoDB APIs, achieving 20–30% faster UI load times and 25% improved API reliability through optimized components, JWT auth hardening, and structured data validation.",
      "Strengthened product quality by adding 70% test coverage for new features and maintaining CI pipelines, reducing deployment issues by 40% while contributing to Agile sprint planning and code reviews.",
    ],
  },
];

export const education = {
  school: "Amrita Vishwa Vidyapeetham",
  // Corrected by owner (PDF had "Computer and Engineering"). CONFLICTS.md #8.
  degree: "B.Tech in Computer Science and Engineering",
  period: "Aug 2023 – Present",
  graduation: "Expected April 2027",
  location: "Coimbatore, TN",
};

// ---------------------------------------------------------------------------
// Achievements — [PDF] text, [TEX] URLs.
// ---------------------------------------------------------------------------

export type Achievement = {
  title: string;
  result: string;
  context?: string;
  link: Link;
  highlight?: boolean;
};

export const achievements: Achievement[] = [
  {
    title: "HP poWer Lab 2.0 (HPCL)",
    result: "Top 34 / 40,000+ Semi-Finalist",
    context: "Project: RouteX",
    highlight: true,
    link: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/posts/joshua-karthik-ashok-00881a290_hppowerlab2-hpcl-operationsresearch-activity-7444638842357383169-QypH",
    },
  },
  {
    title: "SEED Business Challenge 2026 (University of Maryland)",
    result: "Winner",
    highlight: true,
    link: { label: "LinkedIn", href: "https://www.linkedin.com/feed/update/urn:li:share:7418695509856370688/" },
  },
  {
    title: "Google Gen AI Exchange Hackathon",
    result: "Top 100 / 30,000+",
    context: "Project: ClarityLegal",
    link: { label: "LinkedIn", href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7398825050780520448/" },
  },
  {
    title: "Sony AITRIOS Hackathon",
    result: "Top 10 / 10,000+",
    context: "Project: OptiWare",
    link: { label: "LinkedIn", href: "https://www.linkedin.com/feed/update/urn:li:activity:7311741020226916352/" },
  },
  {
    title: "Odoo Hackathon",
    result: "Top 10 / 1,500",
    context: "Full-stack rental system",
    link: { label: "Google Drive", href: "https://drive.google.com/drive/folders/1Uy974Hg8ScA7W4dKBEn1nIwvLFYYtRGv" },
  },
  {
    title: "SIH 2024",
    result: "Selected to Regionals",
    context: "Project: modernERP",
    link: { label: "LinkedIn", href: "https://www.linkedin.com/posts/joshua-karthik-ashok-00881a290_ppt-activity-7291126427943407616-kYUg/" },
  },
  {
    title: "IITM Foundational Degree",
    result: "Foundational in Data Science",
    link: { label: "View Certificate", href: "https://www.linkedin.com/posts/joshua-karthik-ashok-00881a290_pdf-activity-7291136382507356161-Lrz4/" },
  },
];

export const publication = {
  title: "Navigating the Dual Realities of Image Generation and Deepfake Detection",
  summary:
    "Conducted a comparative study of GAN- and diffusion-based image generation models, identified key robustness gaps in deepfake detection (adversarial vulnerability, compression artefacts, cross-model inconsistency), and proposed methodological directions—spanning multimodal cues and feature-level analysis—to improve forensic reliability.",
  topics: ["GANs", "Diffusion models", "Deepfake detection", "Robustness"],
  link: {
    label: "Read the paper",
    href: "https://www.academia.edu/127380076/Navigating_the_Dual_Realities_of_Image_Generation_and_Deepfake_Detection",
  },
};

// [PDF] Technical Skills, grouped as on the resume.
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript/JavaScript", "C/C++", "Java", "GoLang", "SAP ABAP"] },
  { group: "Backend", items: ["FastAPI", "Node.js (Express)", "Next.js API Routes"] },
  { group: "Frontend", items: ["React", "Angular"] },
  { group: "Databases", items: ["PostgreSQL", "MongoDB", "Firestore", "Redis", "JPA2", "Hibernate (ORM)"] },
  { group: "AI/ML & CV", items: ["OpenCV", "TensorFlow", "TensorFlow Lite", "OR-Tools (CP-SAT)", "OCR pipelines", "searoute-py"] },
  { group: "Cloud/DevOps", items: ["Docker", "Git", "CI/CD", "Vercel", "AWS (SNS/S3/Lambda)", "GCP Cloud Run", "Celery/Redis"] },
];

// Neutral by default. Edit to state availability (e.g. internship / full-time, start date) if you want.
export const contactCopy = {
  blurb: "Questions about my work, a role, or a project? Email is the fastest way to reach me.",
};

export const demoCopy = {
  title: "Fleet playback",
  kicker: "Interactive demo",
  intro:
    "A lightweight, client-side take on RouteX's route playback and Gantt scheduling views. Scrub through ten days of coastal tanker trips to see each vessel's route on the map and its trip on the timeline.",
  disclaimer:
    "Demo on static sample data. Fleet capacities, charter rates, port coordinates, demands, and trip times come from the public RouteX repository's Challenge 7.1 dataset. The schedule itself is a hand-built illustrative plan, not RouteX solver output, and its cost figure doesn't reflect RouteX results. Coastline is schematic.",
};

export const site = {
  title: `${person.name} · ${person.role}`,
  description:
    "Backend & AI Systems Engineer building optimization platforms (CP-SAT, MILP), LLM extraction pipelines, and scalable APIs. RouteX, ClarityLegal, OptiWare.",
  keywords: [
    "Joshua Karthik Ashok",
    "Backend Engineer",
    "AI Systems Engineer",
    "OR-Tools",
    "CP-SAT",
    "FastAPI",
    "LLM pipelines",
    "RAG",
  ],
};
