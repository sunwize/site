export const SITE_TITLE = "Colin Clisson";
export const SITE_DESCRIPTION = "Personal website";
export const SITE_LOCATION = "Montréal, QC";

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
  { href: "/videos", label: "Videos" },
  { href: "/projects", label: "Projects" },
] as const;

export const SOCIAL_LINKS = [
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

export type VideoPreview = {
  title: string;
  href: string;
  date: string;
  thumbnail: string;
  external?: boolean;
};

export type ProjectPreview = {
  title: string;
  href: string;
  description: string;
  tags?: ReadonlyArray<string>;
};
