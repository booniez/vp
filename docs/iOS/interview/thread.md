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

### 来看一道面试题，想想会打印什么
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
    
```
揭晓谜底吧，解析一下详细过程
### 2.2打印结果如下：
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
### 2.3 详解如下

让我们逐一解析这些函数中的并发行为和打印结果：

### 2.3.1 semaphoreTest001
这个函数使用的是全局并行队列（`DispatchQueue.global()`）和信号量（`DispatchSemaphore(value:0)`）。
- 第一个`async`闭包等待(semaphore.wait()), 由于信号量初始值为0，所以它将被阻塞。
- 第二个`async`闭包在第一个之后执行，打印"task 2"然后发送信号(semaphore.signal()), 释放第一个`async`闭包的阻塞，让它继续并打印"task 1"。
- 第三个`async`闭包需要等待一个信号才能继续执行，但是在最后没有额外的signal调用给它，所以它被永久阻塞，"task 3"无法打印。

因此，打印结果是：
```
task 2
task 1
```

#### 2.3.2 semaphoreTest002
这个函数使用的是一个具有特定标签的串行队列（`DispatchQueue(label: "xxx")`），其它的与`semaphoreTest001`相似。
- 第一个`async`闭包等待(semaphore.wait()), 但由于信号量初始值为0，它将被阻塞。
- 由于队列是串行的，第二个和第三个`async`闭包必须等待第一个完成才能开始执行。第一个闭包被阻塞，导致后续的闭包都无法执行。
- 这就是为什么没有任何东西被打印的原因。

#### 2.3.3 asyncTest001
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

#### 2.3.4 asyncTest002
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

## 总结一下几种方案

iOS 中的多线程编程主要使用以下四种方案：Grand Central Dispatch (GCD)、NSOperation、NSThread，以及低级的 POSIX Threads (PThread)。下面将分别探讨这些方案的优缺点以及提供相应的Swift示例代码。

### 1. Grand Central Dispatch (GCD)

**优点**:
- Apple推荐的多线程处理方案，优化了多核心处理器的并行运算能力。
- 提供了队列的概念，简化了异步执行任务的方式。
- 管理线程生命周期，开发者无需直接创建和销毁线程。

**缺点**:
- 对于复杂的操作依赖关系不易管理。
- 提供的是底层API，相对有一定的学习成本。

**例子**:
```swift
DispatchQueue.global(qos: .background).async {
    // 后台线程执行任务
    let result = "任务完成"
    
    DispatchQueue.main.async {
        // 主线程更新UI
        print(result)
    }
}
```

### 2. NSOperation 和 NSOperationQueue

**优点**:
- 基于GCD，提供更高层次的抽象，更简单易用。
- 支持设置操作的优先级、添加操作之间的依赖关系。
- 可以方便的取消、暂停、恢复操作。

**缺点**:
- 性能略逊于直接使用GCD。
- 实现相比GCD更为复杂。

**例子**:
```swift
let operationQueue = OperationQueue()

let operation1 = BlockOperation {
    print("Operation 1")
}

let operation2 = BlockOperation {
    print("Operation 2")
}

operationQueue.addOperations([operation1, operation2], waitUntilFinished: false)
```

### 3. NSThread

**优点**:
- 直接控制线程，粒度最细。
- 方便执行简单的后台任务。

**缺点**:
- 需要手动管理线程的生命周期。
- 对资源的消耗相对较大，容易引发线程安全问题。

**例子**:
```swift
let thread = Thread {
    print("NSThread 执行任务")
}

thread.start()
```

### 4. PThread (POSIX Threads)

**优点**:
- POSIX标准的线程操作，提供了最大的控制能力和灵活性。
- 可移植性好，可用于非iOS平台。

**缺点**:
- 使用复杂，需要深入了解多线程编程。
- 管理成本高，容易发生错误。

**例子**:
```swift
import Foundation

var thread: pthread_t?

pthread_create(&thread, nil, { location in
    print("PThread 执行任务")
    return nil
}, nil)
```

综上所述，选择哪一种多线程方案，需要根据项目需求和开发者的喜好来决定。GCD和NSOperation是iOS开发中最常用的多线程方式，它们简化了多线程编程，同时提高了效率。NSThread 虽然给了开发者更直接的控制权，但是现在较少单独使用。PThread作为一种更底层的多线程方案，在特定场景下还是非常有用的，尤其是在需要跨平台或者需要细粒度控制线程行为的情况下。

