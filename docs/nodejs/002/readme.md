# 主进程和渲染进程

chrome 整个 window 是一个 Main Process, 而每一个页面则是一个 Render Process(渲染进程)，chrome 是一个多进程应用。

## 主进程

- 可以使用和系统对接的 Electron API - 创建菜单，上传文件等等
- 创建渲染进程 - Renderer Process
- 全面支持 Node.js
- 只有一个，作为程序的入口点

## 渲染进程

- 可以有多个，每个对应一个窗口
- 每个都是一个单独的进程
- 全面支持 Node.js 和 DOM API
- 可以使用