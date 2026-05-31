import type { BlogPostPreview } from "~/utils/site";

type BlogCollectionItem = {
  path: string;
  title: string;
  pubDate: Date | string;
  tags?: string[];
  draft?: boolean;
};

export const toBlogPostPreview = (post: BlogCollectionItem): BlogPostPreview => ({
  title: post.title,
  href: post.path,
  date: new Date(post.pubDate).toISOString(),
  tags: post.tags ?? [],
});

export const sortBlogPostsByPubDateDesc = <T extends { pubDate: Date | string }>(
  posts: T[],
) =>
  posts.toSorted(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
