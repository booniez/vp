#!/bin/bash

# 1. 切换到你的git仓库的目录
cd $PWD

# 2. 执行git add命令
git add .

# 3. 生成commit message
commit_message="Modified files: "$'\n'
files=$(git diff --name-only HEAD)

# 如果没有文件更改，则退出
if [ -z "$files" ]; then
    echo "No files changed, exiting..."
    exit 0
fi

# 将文件列表添加到commit message
for file in $files; do
    commit_message+="$file "$'\n'
done

# 移除最后的逗号和空格
#commit_message=${commit_message%, }

# 4. 执行git commit命令
git commit -m "$commit_message"

# 5. 推送到远程仓库的main分支
git push vp main
git push vp_gitee main

echo "Pushed to origin main successfully."

##!/bin/bash
#
## 获取所有改动文件的状态和名称
#status=$(git status --porcelain)
#
## 如果没有文件改动，则退出
#if [ -z "$status" ]; then
#  echo "No files changed, nothing to commit."
#  exit 0
#fi
#
## 初始化commit message
#commit_message="Modified files:"
#
## 设置计数器
#file_counter=0
#
## 循环遍历每个改动的文件
#while IFS= read -r line; do
#  # 避免空行
#  if [ -z "$line" ]; then
#    continue
#  fi
#
#  # 截取状态符号后的所有内容作为文件路径（包括空格）
#  filepath=$(echo "$line" | cut -c4-)
#
#  # 递增文件计数器
#  ((file_counter++))
#
#  # 更新commit message，每个文件一行
#  commit_message="$commit_message"$'\n'"$file_counter. $filepath"
#done <<< "$status"
#
## 如果没有文件要提交，报错退出
#if [ $file_counter -eq 0 ]; then
#  echo "Error: No files changed, nothing to commit."
#  exit 1
#fi
#
## 输出commit message进行调试
#echo "$commit_message"
#
## 进行commit操作
#git commit -a -m "$commit_message"
#
## 推送到 vp 的main分支
#git push vp main
#
#