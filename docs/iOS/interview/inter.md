---
title: 面试整理
date: 2024-06-26 09:49:54
tags:
 - 面试
categories:
 - iOS
---

## 基础篇

### 1. class 和 struct 的理解，应用在模型上该怎么选择，各自的优缺点

class 是一个引用类型，可以被继承，有自己的引用计数（可以多个引用指向同一个实例）。
优点：引用类型、继承、引用类型
缺点：性能问题，由于引用计数的存在，在内存的堆上面进行管理。性能不结构体低。线程不安全，需要使用锁来保证安全
字典也是 线程不安全的

struct 是值类型，在进行变量传递的时候，会进行值拷贝。正因为这个特性，所以在多线程访问的时候能保证没有数据竞争，线程安全。
优点：值类型、线程安全、性能高

定义模型的时候，如果需要考虑继承以及传递的时候需要的是引用数据而不是值传递的时候，就需要考虑类，不然建议使用 struct

### 2. 多线程
参考前面的文章

### 3. runtime 实现weak

大概就是 通过 ``弱引用``表来记录 weak 修饰的属性。当声明的时候， runtime 将属性注册到 ``弱引用``表里面
然后在这个引用对象释放的时候，runtime 会注销这个引用关系，并将属性置为 nil。在这个过程中 ``弱引用``表至关重要

参考连接: https://www.bilibili.com/read/cv26937327/

### 4. runtime 的使用、消息转发机制
runtime 是一套运行时机制，
先要提到动态解析，当对象收到消息的时候，需要去解析是否实现了这个方法。如果没有则去查找是否在运行时有添加过。
然后是消息转发，如果上一步没有处理掉这个方法，则调用 ``forwardingTargetForSelector`` 返回一个对象，让这个对象来接收消息
如果消息还没有被处理，runtime将根据 方法签名生成 NSInvocation，最后调用 forwardInvocation 处理消息

KVC、KVO、动态代理（运行时创建类和对象）、AOP（在方法前后插入自定义的东西）
参考资料：https://juejin.cn/post/6844904079957688328

### 5. KVC 相关

KVC 通过对 NSObject 进行扩展，让所有继承自 NSObject 的都支持了 KVC，比如 NSArray、NSDictionary、NSMutableDictionary、NSOrderedSet、NSSet
常见的方法：
1. accessInstanceVariablesDirectly  默认为YES。 如果返回为YES,如果没有找到 set<Key> 方法的话, 会按照_key, _isKey, key, isKey的顺序搜索成员变量, 返回NO则不会搜索
2. validateValue 键值验证, 可以通过该方法检验键值的正确性, 然后做出相应的处理
3. valueForUndefinedKey 如果key不存在, 并且没有搜索到和key有关的字段, 会调用此方法, 默认抛出异常。两个方法分别对应 get 和 set 的情况

说一下原理：
setter 的时候
1. setvalue 如果有方法则直接赋值
2. 如果上面失败，则看 accessInstanceVariablesDirectly 是否能扫描 _key，isKye 。如果可以，找到了对应方法就进行赋值
3. 如果上面不行，则 forUndefinedKey 直接跑出异常，当然可以自己重写避免异常

getter 的时候
1. getValue 如果有，直接取值
2. 如果上面没有，则依次向上查找 NSArray、NSSet 里面的key，如果找到了则创建一个方法返回对象
3. 如果都没找到，则 valueForUndefinedKey 抛出异常，如果自己实现，则不异常

如果自己实现，则实现这个过程就好了
参考资料：https://juejin.cn/post/6844904086744104968#heading-11



