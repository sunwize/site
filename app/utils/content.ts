import type { BlogPostPreview } from "~/utils/site";

type BlogCollectionItem = {
  path: string;
  title: string;
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

export const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsePostDate(date));

export const sortBlogPostsByPubDateDesc = <T extends { pubDate: string }>(
  posts: T[],
) =>
  posts.toSorted(
    (a, b) =>
      parsePostDate(b.pubDate).getTime() - parsePostDate(a.pubDate).getTime(),
  );
