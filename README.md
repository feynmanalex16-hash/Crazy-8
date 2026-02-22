# Crazy Eights (疯狂 8 点) - 经典纸牌游戏

这是一个使用 React 19 + Vite + Tailwind CSS 开发的经典纸牌游戏“疯狂 8 点”。支持智能 AI 对手、多种卡牌皮肤切换以及流畅的动画体验。

## 🎮 游戏特性

- **经典玩法**：完全遵循标准疯狂 8 点规则（匹配花色或点数，8 为万能牌）。
- **智能 AI**：具备基础策略能力的电脑对手。
- **皮肤系统**：支持三种视觉风格切换：
  - **经典 (Classic)**：传统纸牌质感，深蓝色牌背。
  - **极简 (Minimal)**：现代扁平化设计，清爽干净。
  - **霓虹 (Neon)**：赛博朋克风格，发光特效。
- **响应式设计**：完美适配手机、平板和桌面端。
- **流畅动画**：基于 `motion` (Framer Motion) 的物理感交互。

## 🛠️ 技术栈

- **前端框架**: React 19
- **构建工具**: Vite
- **样式方案**: Tailwind CSS 4
- **动画库**: Motion (Framer Motion)
- **图标库**: Lucide React
- **部署平台**: Vercel

## 🚀 本地开发

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **构建生产版本**:
   ```bash
   npm run build
   ```

## 🌍 部署到 Vercel

本项目已配置好 `vercel.json`，可以直接部署：

1. **上传至 GitHub**:
   - 在 GitHub 上创建一个新仓库。
   - 将本地代码推送到仓库：
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <您的仓库地址>
     git branch -M main
     git push -u origin main
     ```

2. **连接 Vercel**:
   - 登录 [Vercel 控制台](https://vercel.com/)。
   - 点击 "Add New" -> "Project"。
   - 导入刚才创建的 GitHub 仓库。
   - **Framework Preset** 选择 `Vite`。
   - 点击 "Deploy" 即可完成部署。

## 📜 游戏规则

1. 每人初始分发 8 张牌。
2. 玩家必须打出与弃牌堆顶牌**花色相同**或**点数相同**的牌。
3. **数字 8 是万能牌**：可以在任何时候打出，并允许玩家指定接下来的花色。
4. 如果无牌可打，必须从牌堆抽一张牌。
5. 先清空手牌的一方获胜。

---
Made with ❤️ by AI Studio
