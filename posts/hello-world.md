---
title: "Hello World - 我的第一篇博客"
date: "2026-03-03"
tags: ["博客", "欢迎"]
category: "生活"
excerpt: "欢迎来到我的个人博客！这是第一篇文章，介绍一下这个博客的创建过程和技术栈。"
---

欢迎来到我的个人博客！

## 起源

创建这个博客的初衷很简单 - 我想有一个地方可以记录我的技术学习和生活感悟。虽然市面上有很多优秀的博客平台，但我还是决定自己动手搭建一个。

## 技术栈

这个博客使用了以下技术：

- **Next.js 14** - React 框架，提供了优秀的开发体验和性能
- **TypeScript** - 类型安全，减少运行时错误
- **Tailwind CSS** - 实用优先的 CSS 框架，快速构建美观的界面
- **Markdown** - 轻松写作，专注于内容

## 为什么选择 Next.js

Next.js 提供了静态生成（SSG）功能，非常适合博客这种内容相对固定的网站。相比传统的服务端渲染，SSG 具有以下优势：

1. **更快的加载速度** - 页面在构建时预渲染为 HTML
2. **更好的 SEO** - 搜索引擎可以直接索引静态内容
3. **更低的成本** - 可以部署在任何静态托管服务上

## 代码示例

```typescript
export function getAllPosts() {
  const slugs = getPostFilePaths().map((fileName) =>
    fileName.replace(/\.md$/, '')
  );

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}
```

## 未来计划

- [ ] 添加评论功能
- [ ] 实现文章搜索
- [ ] 添加 RSS 订阅
- [ ] 优化移动端体验

感谢你的阅读！