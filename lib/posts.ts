import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt?: string;
}

export function getPostFilePaths(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((fileName) => fileName.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data as PostMetadata,
    content,
  };
}

export function getAllPosts() {
  const slugs = getPostFilePaths().map((fileName) =>
    fileName.replace(/\.md$/, '')
  );

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      date: post.metadata.date,
      tags: post.metadata.tags || [],
      category: post.metadata.category || '未分类',
      excerpt: post.metadata.excerpt || post.content.slice(0, 150) + '...',
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostsByTag(tag: string) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set<string>();

  allPosts.forEach((post) => {
    categories.add(post.category);
  });

  return Array.from(categories).sort();
}