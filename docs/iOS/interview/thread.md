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

## 延伸，具体用法

### GCD
在iOS中，使用Grand Central Dispatch (GCD) 来管理多线程任务是一种高效且常见的方式。GCD 提供了一个C语言的库，它使用任务队列的概念来执行代码块，并管理这些代码块在系统中的线程上的执行。下面是如何在 Swift 中使用 GCD 来管理多线程任务：

### 主要概念：
- **任务（Task）**：提交给GCD的执行单元，可以是一个闭包或函数。
- **队列（Queue）**：任务执行的场所。队列决定了任务的执行方式（同步或异步）以及并发或串行执行。

### 队列类型：

- **串行队列（Serial Queue）**：一个时间点只执行一个任务。
- **并发队列（Concurrent Queue）**：允许多个任务并发执行。
- **主队列（Main Queue）**：特殊的串行队列，用于更新UI，保证所有操作都在主线程上执行。

### 执行方式：

- **同步执行（sync）**：在当前线程执行任务，且会阻塞当前线程，直到任务完成。
- **异步执行（async）**：可以在不同的线程上执行任务，并且不会阻塞当前线程。

### 用法示例：

#### 创建自定义串行队列
```swift
let serialQueue = DispatchQueue(label: "com.example.mySerialQueue")
```

#### 创建自定义并发队列
```swift
let concurrentQueue = DispatchQueue(label: "com.example.myConcurrentQueue", attributes: .concurrent)
```

#### 提交异步任务
```swift
DispatchQueue.global(qos: .background).async {
    // 在后台队列异步执行耗时任务
    let result = "任务完成"
    
    DispatchQueue.main.async {
        // 在主队列异步执行UI更新
        print(result) // 输出结果
    }
}
```

#### 提交同步任务
```swift
let customQueue = DispatchQueue(label: "com.example.myCustomQueue")

customQueue.sync {
    // 这里的任务会阻塞当前线程，直到任务完成
    performTask()
}
```

#### 延时执行任务
```swift
let delayInSeconds = 2.0
DispatchQueue.main.asyncAfter(deadline: .now() + delayInSeconds) {
    // 2秒后在主线程执行
    print("延迟执行的任务")
}
```

在使用 GCD 管理多线程时，要注意避免死锁，特别是当你在主线程上同步提交任务到主队列时。还要注意资源竞争和共享资源的访问，可能需要使用信号量（DispatchSemaphore）或其他同步机制来保证线程安全。

### NSOperation

NSOperation是一个面向对象的API，它提供了与Grand Central Dispatch（GCD）类似的并发和多线程编程功能，但以更抽象的方式呈现。通过使用NSOperation，你可以更容易地管理操作的依赖性，优先级，状态以及取消。NSOperation本身是一个抽象类，因此你通常使用它的子类，如NSBlockOperation或创建自定义的NSOperation子类。

NSOperation需要与NSOperationQueue搭配使用。NSOperationQueue负责调度和执行NSOperation中的任务。

### 主要概念：
- **NSOperation**：表示一个单一的任务。它是抽象类，你通常会使用其子类NSInvocationOperation和NSBlockOperation，或者自定义子类。
- **NSOperationQueue**：管理NSOperation对象的集合。队列负责根据系统资源和其他因素来决定何时执行操作。

### 使用步骤：
1. 创建操作（NSOperation对象）。
2. （可选）设置操作之间的依赖关系。
3. 创建队列（NSOperationQueue对象）。
4. 将操作添加到队列中。

### 实例代码：

#### 创建并使用NSBlockOperation
```swift
// 创建操作队列
let operationQueue = NSOperationQueue()

// 创建NSBlockOperation，封装任务
let operation = NSBlockOperation {
    // 在操作中执行长时间运行的任务
    print("执行耗时任务")
}

// 设置操作完成后的回调
operation.completionBlock = {
    print("操作完成")
}

// 将操作添加到队列
operationQueue.addOperation(operation)
```

#### 添加依赖性
```swift
let operation1 = NSBlockOperation {
    print("任务1")
}

let operation2 = NSBlockOperation {
    print("任务2")
}

// 设置operation2依赖于operation1
operation2.addDependency(operation1)

// 添加操作到队列
operationQueue.addOperations([operation1, operation2], waitUntilFinished: false)
```

#### 取消操作
```swift
// 取消单个操作
operation1.cancel()

// 取消队列中的所有操作
operationQueue.cancelAllOperations()
```

#### 暂停和恢复队列
```swift
// 暂停队列
operationQueue.isSuspended = true

// 恢复队列
operationQueue.isSuspended = false
```

你可以通过创建自定义的NSOperation子类来封装更复杂的或者需要更细粒度控制的长时间运行的任务。子类化NSOperation时，你需要重写`main`方法，并在其中放置任务逻辑。你还可以重写其他方法来处理取消操作或者在操作执行前后做一些工作。

NSOperation与GCD相比，最大的优势在于它更易于控制操作间的依赖关系，以及更容易管理异步操作的状态（例如检测一个操作何时完成或取消）。此外，通过NSOperationQueue，你可以控制同时运行的操作数量，可以通过设置其`maxConcurrentOperationCount`属性来限制并发操作的数量。

### NSThread

iOS中的`NSThread`提供了面向对象的方式来操作线程。虽然相较于GCD和NSOperation，`NSThread`的使用更为底层和直接，它允许你有更多控制线程的行为。使用`NSThread`，开发者需要手动管理线程的生命周期，包括创建、启动、同步和通信等。由于手动管理线程细节容易出错，通常推荐只在需要极致性能优化或者处理极为特殊的多线程行为时才使用`NSThread`。

### 使用`NSThread`的基本步骤：
1. **创建线程**：使用`NSThread`创建一个新的线程，并指定一个方法或函数作为线程启动后执行的任务。
2. **启动线程**：让线程开始运行。
3. **设置线程属性**：（可选）设置线程的一些属性，例如线程名、优先级等。
4. **线程同步和通信**：（可选）实现线程间的同步和通信。

### 实例代码：

#### 创建并启动一个线程
```swift
import Foundation

func myThreadFunction() {
    print("这是在新线程中执行的任务")
}

// 创建线程
let myThread = Thread(target: self,
                      selector: #selector(myThreadFunction),
                      object: nil)

// 启动线程
myThread.start()
```

### 设置线程属性
```swift
// 设置线程名
myThread.name = "My Custom Thread"

// 设置线程的优先级（0.0 到 1.0之间，1.0为最高优先级）
Thread.threadPriority(0.5)
```

### 在子线程和主线程间进行通信
```swift
func myThreadFunction() {
    // 执行耗时操作...
    print("耗时操作在这个新线程上完成。")
    
    // 回到主线程更新UI
    DispatchQueue.main.async {
        // 更新UI操作
    }
}
```

### 注意事项
- **线程安全**：当多个线程访问和修改同一数据源时，需要采取措施保证线程安全，例如使用锁。
- **避免死锁**：注意代码和资源访问逻辑，避免出现死锁情况。
- **资源管理**：相较于GCD和NSOperation，使用`NSThread`时更需要注意资源的管理和释放。

`NSThread`提供了与线程相关的更直接控制，但带来的是更高的管理成本和出错率。在现代iOS开发中，推荐首选GCD和NSOperation这两种更高级的并发编程方式，它们提供了更简洁高效的接口，同时也简化了线程管理的复杂性。然而，在一些特殊场景下，直接使用`NSThread`可能会是一个不错的选择，特别是当你需要更细粒度的控制线程行为或者需要与某些底層API直接交互时。

### PThread
不常见，以后再补充吧。因为我目前也没见过怎么用