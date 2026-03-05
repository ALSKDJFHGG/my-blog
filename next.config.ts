import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出以减少服务器内存使用
  output: 'export',
  // 禁用图片优化以减少内存使用（使用静态图片）
  images: {
    unoptimized: true,
  },
  // 确保 trailingSlash 为 false 以获得干净的 URL
  trailingSlash: false,
};

export default nextConfig;
