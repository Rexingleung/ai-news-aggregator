# 推送到 GitHub 指南

## 方式一：通过 GitHub CLI (gh)

如果你安装了 GitHub CLI，执行以下命令：

```bash
# 登录 GitHub (如果还未登录)
gh auth login

# 创建并推送到新仓库
gh repo create ai-news-aggregator --public --source=. --remote=origin --push
```

## 方式二：通过 Web 界面创建仓库

1. **访问 GitHub 创建新仓库**
   - 访问 https://github.com/new
   - Repository name: `ai-news-aggregator`
   - Description: `AI资讯聚合器 - 基于Next.js 15的智能AI新闻聚合平台`
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license
   - 点击 "Create repository"

2. **添加远程仓库并推送**

   在创建仓库后，GitHub 会显示推送指令。在项目目录执行：

   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/ai-news-aggregator.git
   
   # 推送到 GitHub
   git push -u origin main
   ```

## 方式三：通过 SSH

如果你配置了 SSH 密钥：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin git@github.com:YOUR_USERNAME/ai-news-aggregator.git

# 推送到 GitHub
git push -u origin main
```

## 验证推送

推送成功后，访问你的仓库地址：
```
https://github.com/YOUR_USERNAME/ai-news-aggregator
```

## 后续推送

完成初次推送后，后续更改只需：

```bash
git add .
git commit -m "你的提交信息"
git push
```

## 部署到 Vercel

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量（如果需要 OpenAI API）：
   - `OPENAI_API_KEY`: 你的 OpenAI API Key
5. 点击 "Deploy"

## 注意事项

- 确保 `.env.local` 文件不会被提交（已在 .gitignore 中配置）
- 敏感信息应该通过环境变量配置
- 第一次部署可能需要几分钟时间
