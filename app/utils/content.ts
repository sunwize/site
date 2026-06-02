import type { BlogPostPreview, ProjectPreview } from "~/utils/site";

type BlogCollectionItem = {
  path: string;
  title: string;
  pubDate: string;
  tags?: string[];
  draft?: boolean;
};

type ProjectCollectionItem = {
  path: string;
  title: string;
  description: string;
  thumbnail: string;
  pubDate: string;
  tags?: string[];
  draft?: boolean;
};

const parsePostDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

export const toBlogPostPreview = (post: BlogCollectionItem): BlogPostPreview => ({
  title: post.title,
  href: post.path,
  date: post.pubDate,
  tags: post.tags ?? [],
});

export const toProjectPreview = (
  project: ProjectCollectionItem
): ProjectPreview => ({
  title: project.title,
  href: project.path,
  description: project.description,
  thumbnail: project.thumbnail,
  date: project.pubDate,
  tags: project.tags ?? [],
});

export const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsePostDate(date));

export const sortByPubDateDesc = <T extends { pubDate: string }>(
  posts: T[],
) =>
  posts.toSorted(
    (a, b) =>
      parsePostDate(b.pubDate).getTime() - parsePostDate(a.pubDate).getTime(),
  );
