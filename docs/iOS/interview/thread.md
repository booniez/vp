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

### 2. 信号量
#### 2.1来看一道面试题，想想会打印什么
```Swift
private func semaphoreTest001() {
        let queue = DispatchQueue.global()
        let semaphore = DispatchSemaphore(value:0)
        queue.async {
            semaphore.wait()
            print("task 1")
        }
        queue.async {
            print("task 2")
            semaphore.signal()
        }
        queue.async {
            semaphore.wait()
            print("task 3")
            
        }
    }
    
    private func semaphoreTest002() {
        let queue = DispatchQueue(label: "xxx")
        let semaphore = DispatchSemaphore(value:0)
        queue.async {
            semaphore.wait()
            print("task 1")
        }
        queue.async {
            print("task 2")
            semaphore.signal()
        }
        queue.async {
            semaphore.wait()
            print("task 3")
            
        }
    }
    /**
     打印如下：（你没眼花，就是什么都没有）
     
     */
    
    private func asyncTest001() {
        let queue = DispatchQueue.global()
        print("task 1")
        
        queue.async {
            print("task 2")
            queue.async {
                print("task 3")
            }
            print("task 4")
        }
        print("task 5")
    }
    /**
     打印如下：
     task 1
     task 5
     task 2
     task 4
     task 3
     */
    
    private func asyncTest002() {
        let queue = DispatchQueue(label: "xxx")
        print("task 1")
        
        queue.async {
            print("task 2")
            queue.async {
                print("task 3")
            }
            print("task 4")
        }
        print("task 5")
    }
    /**
     打印如下：
     task 1
     task 5
     task 2
     task 4
     task 3
     */
```
揭晓谜底吧，解析一下详细过程
#### 2.2打印结果如下：
```Swift
    semaphoreTest001()
    /**
     打印如下：
     task 2
     task 1
     */
    semaphoreTest002()
    /**
     打印如下：（你没眼花，就是什么都没有）
     
     */
    
    asyncTest001()
    /**
     打印如下：
     task 1
     task 5
     task 2
     task 4
     task 3
     */
    
    asyncTest002()    
    /**
     打印如下：
     task 1
     task 5
     task 2
     task 4
     task 3
     */

```
#### 2.3 详解如下

让我们逐一解析这些函数中的并发行为和打印结果：

##### 2.3.1 semaphoreTest001
这个函数使用的是全局并行队列（`DispatchQueue.global()`）和信号量（`DispatchSemaphore(value:0)`）。
- 第一个`async`闭包等待(semaphore.wait()), 由于信号量初始值为0，所以它将被阻塞。
- 第二个`async`闭包在第一个之后执行，打印"task 2"然后发送信号(semaphore.signal()), 释放第一个`async`闭包的阻塞，让它继续并打印"task 1"。
- 第三个`async`闭包需要等待一个信号才能继续执行，但是在最后没有额外的signal调用给它，所以它被永久阻塞，"task 3"无法打印。

因此，打印结果是：
```
task 2
task 1
```

##### 2.3.2 semaphoreTest002
这个函数使用的是一个具有特定标签的串行队列（`DispatchQueue(label: "xxx")`），其它的与`semaphoreTest001`相似。
- 第一个`async`闭包等待(semaphore.wait()), 但由于信号量初始值为0，它将被阻塞。
- 由于队列是串行的，第二个和第三个`async`闭包必须等待第一个完成才能开始执行。第一个闭包被阻塞，导致后续的闭包都无法执行。
- 这就是为什么没有任何东西被打印的原因。

##### 2.3.3 asyncTest001
这个函数使用的是全局并行队列（`DispatchQueue.global()`）。
- 明确的“task 1”和“task 5”首先在主线程上同步打印。
- 第一个`async`闭包加入到全局队列，由于是并行队列，它并不会立即执行。
- 队列中，该闭包首先打印“task 2”，然后内嵌的`async`闭包（打印"task 3"）被加入队列，但由于是异步操作，它会在“task 4”打印完毕之后的某个时刻运行。

因此，打印结果是：
```
task 1
task 5
task 2
task 4
task 3
```
这里`task 2`与`task 4`的顺序是确定的，因为它们在同一个异步闭包内。`task 3`之后打印是因为它被包裹在另一个异步闭包内。

##### 2.3.4 asyncTest002
与`asyncTest001`相比，唯一的区别在于使用了具有特定标签的串行队列（`DispatchQueue(label: "xxx")`）。
- 同样，“task 1”和“task 5”首先打印，因为它们在主线程上同步执行。
- 随后队列中的闭包按顺序执行：首先打印“task 2”，然后因为队列是串行的，内嵌的`async`调用（预定打印"task 3"）将在当前队列上等待当前闭包结束才会开始执行。
- 执行完毕打印“task 4”之后，队列中下一个闭包（打印"task 3"的那个）开始执行。

所以，打印结果是：
```
task 1
task 5
task 2
task 4
task 3
```
由于队列是串行的，这保证了任务的执行顺序完全按照它们被加入队列的次序。

