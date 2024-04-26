---
title: 配置 Mac
date: 2024-04-26 16:03:33
tags:
 - Mac 
categories:
 - 服务器
---

## 1. 配置 Java
### 1.1 查看电脑上所有 Java 的版本
```shell
/usr/libexec/java_home -V
```
打印如下:
```shell
Matching Java Virtual Machines (4):
17.0.10 (x86_64) "Amazon.com Inc." - "Amazon Corretto 17" /Users/yl/Library/Java/JavaVirtualMachines/corretto-17.0.10/Contents/Home
1.8.202.08 (x86_64) "Oracle Corporation" - "Java" /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
1.8.0_402 (x86_64) "Amazon" - "Amazon Corretto 8" /Users/yl/Library/Java/JavaVirtualMachines/corretto-1.8.0_402/Contents/Home
1.8.0_202 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home
/Users/yl/Library/Java/JavaVirtualMachines/corretto-17.0.10/Contents/Home
```
### 1.2 查看当前 Java 版本
```shell
java -version
```

在macOS上，你可以使用shell脚本来快速切换不同版本的Java。这里是一种方法：

首先，你可以为每个Java版本写一个alias（别名），这样就可以通过简短的命令切换Java版本。打开你的`.bash_profile`，`.zshrc`，或是目前shell使用的配置文件，然后添加如下内容（根据你的Java安装路径进行相应的修改）：

```bash
# Java Version Aliases
alias java17='export JAVA_HOME=$(/usr/libexec/java_home -v17)'
alias java8_202='export JAVA_HOME=$(/usr/libexec/java_home -v1.8.0_202)'
alias java8_402='export JAVA_HOME=$(/usr/libexec/java_home -v1.8.0_402)'
alias java8_oracle='export JAVA_HOME=$(/usr/libexec/java_home -v1.8.202.08)'
```

在这个例子中，`java_home`工具会根据提供的版本参数，自动找到匹配的Java安装路径，并设置`JAVA_HOME`环境变量。`alias`命令创建了便捷的别名来切换不同的Java版本。

保存并关闭配置文件后，你需要刷新你的shell环境，这可以通过运行以下命令完成：

```bash
source ~/.bash_profile  # 如果你使用bash
# 或
source ~/.zshrc  # 如果你使用zsh
```

### 1.2 切换 Java 版本
现在，你可以通过运行设置好的别名命令来切换Java版本，如：

```bash
java17  # 切换到Java 17
java8_202  # 切换到Java 1.8.0_202
java8_402  # 切换到Java 1.8.0_402
java8_oracle  # 切换到Oracle Java 1.8.202.08
```

每次运行别名之后，你可以通过执行`java -version`来确认当前活动的Java版本。这样，你就可以轻松地在不同的Java版本之间进行切换了。
