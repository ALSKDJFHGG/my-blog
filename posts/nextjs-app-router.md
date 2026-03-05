---
title: "Next.js App Router 深度解析"
date: "2026-02-28"
tags: ["Next.js", "React", "前端开发"]
category: "技术"
excerpt: "Next.js 13 引入了全新的 App Router，带来了很多新的特性和改进。本文将深入探讨 App Router 的工作原理和最佳实践。"
---

Next.js 13 最大的变化之一是引入了全新的 **App Router**，它基于 React Server Components 构建，为开发者提供了更强大的功能和更好的性能。

## App Router vs Pages Router

传统的 Pages Router 使用文件系统路由，而 App Router 也使用文件系统路由，但采用了不同的目录结构和约定：

### Pages Router 结构
```
pages/
  index.tsx
  about.tsx
  blog/
    [slug].tsx
```

### App Router 结构
```
app/
  page.tsx
  about/
    page.tsx
  blog/
    [slug]/
      page.tsx
```

## Server Components

App Router 默认使用 Server Components，这意味着组件在服务器端渲染，不需要发送 JavaScript 到客户端。

### 优势

1. **减少包体积** - 不发送不必要的 JavaScript
2. **直接访问后端资源** - 可以直接连接数据库
3. **更好的安全性** - 敏感数据不会暴露给客户端

### 示例

```typescript
// Server Component (默认)
async function BlogList() {
  const posts = await db.posts.findMany();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

```typescript
// Client Component (需要 'use client' 指令)
'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## 数据获取

App Router 提供了两种新的数据获取方式：

### 1. 使用 async/await (推荐)

```typescript
async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return <div>{post.title}</div>;
}
```

### 2. 使用 React Cache

```typescript
import { cache } from 'react';

const getPosts = cache(async () => {
  return await db.posts.findMany();
});
```

## 布局系统

App Router 引入了布局的概念，可以在多个页面间共享 UI：

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <nav>导航栏</nav>
        {children}
        <footer>页脚</footer>
      </body>
    </html>
  );
}
```

## 总结

App Router 是 Next.js 的未来，它结合了 React Server Components 的优势，为开发者提供了更强大、更灵活的工具。虽然学习曲线较陡峭，但一旦掌握，将大大提升开发效率和应用性能。