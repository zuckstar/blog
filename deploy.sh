#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 填写要发布博客的仓库地址
git push -f https://github.com/githubzhangsheng/githubzhangsheng.github.io.git master

cd -
