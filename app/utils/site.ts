export const SITE_TITLE = "Colin Clisson";
export const SITE_DESCRIPTION =
  "I'm a software engineer based in Montreal and working at Ivado Labs, where I help our clients leverage AI to improve their business.";
export const SITE_LOCATION = "Montréal, QC";
export const SITE_URL = "https://colinclisson.com";
export const SITE_PREVIEW_IMAGE = "/images/banner.jpg";

export const JS_KEYWORDS = [
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "let",
  "static",
  "yield",
  "await",
] as const;

export type JsKeyword = (typeof JS_KEYWORDS)[number];

export const MAIN_NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
] as const;

export const SOCIAL_LINKS = [
  { href: "/resume.pdf", label: "Resume" },
  { href: "https://github.com/sunwize", label: "GitHub" },
  { href: "https://www.linkedin.com/in/colin-clisson", label: "LinkedIn" },
  { href: "mailto:colinclissonhg@gmail.com", label: "Email" },
] as const;

export type BlogPostPreview = {
  title: string;
  href: string;
  date: string;
  tags?: ReadonlyArray<string>;
};

export type ProjectPreview = {
  title: string;
  href: string;
  description: string;
  thumbnail: string;
  date: string;
  tags?: ReadonlyArray<string>;
};

export type ExperienceItem = {
  company: string;
  location: string;
  role: string;
  period: string;
  technologies: ReadonlyArray<string>;
  highlights: ReadonlyArray<string>;
};

export const EXPERIENCE_ITEMS = [
  {
    company: "Ivado Labs",
    location: "Montréal, Canada",
    role: "Software Engineer (Full Stack)",
    period: "Aug 2024 - Present",
    technologies: ["React", "AI Consulting", "LLMs"],
    highlights: [
      "Developing custom agentic solutions and AI-enabled products for client teams.",
      "Built a planogram solution that reduced operational costs by 12% and improved stocking efficiency.",
      "Implemented an SVG-based render engine for dynamic aisle layouts with stronger performance and visual accuracy.",
    ],
  },
  {
    company: "Paper Education",
    location: "Montréal, Canada",
    role: "Software Engineer (Full Stack)",
    period: "May 2022 - Aug 2024",
    technologies: ["React", "Vue", "Node.js", "GraphQL"],
    highlights: [
      "Shipped product improvements used by more than 300K students daily.",
      "Launched a math practice feature that reached over 6 million completions and increased engagement by 200%.",
      "Led a migration to a new state management system and reduced page load times by 50%.",
    ],
  },
  {
    company: "Eye In Media",
    location: "Montréal, Canada",
    role: "Software Engineer (Full Stack)",
    period: "Feb 2019 - May 2022",
    technologies: ["React", "Vue", "Node.js", "PostgreSQL"],
    highlights: [
      "Built a loyalty program for Place Rosemère shopping mall, engaging over 5K customers monthly.",
      "Maintained and optimized digital display systems that contributed to a 100% client renewal rate.",
      "Mentored interns while delivering cross-browser and mobile-responsive client work.",
    ],
  },
] as const satisfies ReadonlyArray<ExperienceItem>;
