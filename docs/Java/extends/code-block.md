---
title: 代码块
date: 2024-04-22 15:13:07
tags:
 - 继承
categories:
 - 后台
 - Java
---

## 局部代码块
方法里面定义。
```Java
class Tom {
// 局部代码块
	public Tom() {
		{
	 	 // 代码块内容
		}
	}
	

```
特点如下：
- 限定变量的生命周期，随着方法的结束被释放

## 构造代码块
在类里面，方法外定义。
```Java
class Tom {
// 构造代码块
	{
	 	// 代码块内容
	}

```
特点如下：
- 每次构造方法执行的时候，都会执行构造代码块的内容，并且在构造方法前执行
- 使用场景：将多个构造方法共同的部分聚合到一起，复用代码

## 静态代码块
在类里面，方法外定义。
```Java
class Tom {
// 静态代码块
	static {
	 	// 代码块内容
	}

```
特点如下：
- 使用 static 修饰，随着类的加载而加载，并且只加载一次
- 使用场景：在类加载的时候完成一些数据的初始化工作