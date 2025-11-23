import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 资讯聚合器",
  description: "实时获取主流网站的AI相关资讯，由AI智能分析总结",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
