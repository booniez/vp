---
title: 多线程
date: 2024-05-11 10:05:31
tags:
 - 多线程
categories:
 - iOS
 - 面试
---


## GCD

### 1. 异步前提 之 GCD
例如我们有一个需求，需要在操作之前先获取到 数据库数据 和 网络签名结果。然后进行组装

在 GCD 中，通常可以使用 DispatchGroup 或者 DispatchSemaphore 来实现这一点
