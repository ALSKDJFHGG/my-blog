export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  readTime: number;
}

export interface Author {
  name: string;
  bio: string;
  avatar?: string;
  email?: string;
  github?: string;
  twitter?: string;
}