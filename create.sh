#!/bin/bash

# 获取用户输入的文件名
echo "请输入Markdown文件的名字(不需要扩展名):"
read file_name

echo "请输入文章标题:"
read title_name

# 获取当前时间，格式为 年/月/日 时:分:秒
current_time=$(date +"%Y-%m-%d %H:%M:%S")

# 创建Markdown文件，并写入所需内容
cat <<EOF >"${file_name}.md"
---
title: $title_name
date: $current_time
tags:
 - tag
categories:
 - categorie
---
EOF

echo "文件 ${file_name}.md 已创建。"