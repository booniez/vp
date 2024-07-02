---
title: 面试整理
date: 2024-06-26 09:49:54
tags:
 - 面试
categories:
 - iOS
---

## iOS

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

[参考连接](https://www.bilibili.com/read/cv26937327/): https://www.bilibili.com/read/cv26937327/

### 4. runtime 的使用、消息转发机制
runtime 是一套运行时机制，
先要提到动态解析，当对象收到消息的时候，需要去解析是否实现了这个方法。如果没有则去查找是否在运行时有添加过。
然后是消息转发，如果上一步没有处理掉这个方法，则调用 ``forwardingTargetForSelector`` 返回一个对象，让这个对象来接收消息
如果消息还没有被处理，runtime将根据 方法签名生成 NSInvocation，最后调用 forwardInvocation 处理消息

KVC、KVO、动态代理（运行时创建类和对象）、AOP（在方法前后插入自定义的东西）
[参考资料](https://juejin.cn/post/6844904079957688328)：https://juejin.cn/post/6844904079957688328

### 5. KVC 相关

KVC 通过对 NSObject 进行扩展，让所有继承自 NSObject 的都支持了 KVC，比如 NSArray、NSDictionary、NSMutableDictionary、NSOrderedSet、NSSet
常见的方法：
1. accessInstanceVariablesDirectly 默认为YES。如果返回为YES,如果没有找到``set<Key>``方法的话，会按照``_key``, ``_isKey``, ``key``, ``isKey``的顺序搜索成员变量, 返回NO则不会搜索
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
[参考资料](https://juejin.cn/post/6844904086744104968#heading-11)：https://juejin.cn/post/6844904086744104968#heading-11

### 6. KVO 相关

在 init 的时候添加观察者，在 dealloc 的时候移除观察者。如果不移除，比如之前的观察者还在，会有野指针错误。
KVO 是动态的生成了一个子类，在添加观察者过后，会改变原来的 isa，子类里面重写 setter 方法
[参考资料](https://juejin.cn/post/6844904090569277447)：https://juejin.cn/post/6844904090569277447

### 7. 视图 a 上的按钮超出一部分，让超出的部分响应点击

手动实现 hitTest 方法，判断点击的坐标是否在按钮上，然后返回按钮

### 8. 动态库、静态库

动态库在编译的时候不会被拷贝到目标程序，目标程序只会存储一个动态引用
动态库是编译链接的最终产物，无法优化，需要拷贝到frameworks文件夹中，会增加ipa包体积
动态库不能超过6个
[参考资料](https://juejin.cn/post/7049803824214573086)

### 9. iOS 中的锁

互斥锁、自旋锁
互斥锁(Mutual exclusion，缩写Mutex)防止两条线程同时对同一公共资源(比如全局变量)进行读写的机制。当获取锁操作失败时，线程会进入睡眠，等待锁释放时被唤醒
互斥锁 又分为递归锁和非递归锁。递归锁可以多次重新进入

互斥锁会让线程休眠，但是自旋锁不会休眠。因此自旋锁的效率更高

自旋锁：OSspinlock、atomic、读写锁
atomic 的原子性就是依赖于自旋锁 spinlock。但是由于安全性，后面被 os_unfair_lock 代替
atomic 也只能保证读写安全，不能保证数据安全
读写锁 也是一种自旋锁

互斥锁：pthread_mutex、@synchronized（递归）、NSLock（非递归）、NSRecursiveLock（递归）、dispatch_semaphore、NSCondition、os_unfair_lock

@synchronized 是一个递归锁，可以保证锁的唯一性

普通场景下涉及到线程安全，可以用NSLock
循环调用时用NSRecursiveLock
循环调用且有线程影响时，请注意死锁，如果有死锁问题请使用@synchronized

### 10. GCD 死锁问题

会发生死锁的代码。
```
let queue = DispatchQueue(label: "xxx") // 串行队列
        print("task 1")
        
        queue.async {
            print("task 2")
            queue.sync {
                print("task 3")
            }
            print("task 4")
        }
        print("task 5")
```
原因是当前队列是一个串行队列，首先加入 task1，然后是 async 然后是 task5。
因为是主队列，线 task1、然后 task5 然后 async。
async 里面因为是串行队列。所以先 task2 ，然后是 sync。此时回发生阻塞，等待 queue 队列上其他的任务完成，也就是 async 完成。但是  async 里面又在等待同步。所以互相等待，死锁
串行队列里面的异步任务还没有完成。又在异步里面添加了同步任务将线程阻塞，就直接死锁了。

注重一点：同步任务，会立即阻塞当前线程，然后同步任务要等当前任务完成过后才能继续下一个任务。不具备开启线程的能力

### 11. 栅栏函数

简而言之，就是先执行栅栏前任务，再执行栅栏任务，最后执行栅栏后任务


### 12. tableview 优化

1. 减少透明视图，手动设置视图颜色
2. 提前计算高度
3. cell 里面尽量少重复的创建 view
4. 小图片使用Assets，大图片用 bundle
5. 高度计算和cell赋值分开
6. 减少离屏渲染


### 13. 离屏渲染

1. 同时需要满足父layer需要裁剪时，子layer也因为父layer设置了圆角也需要被裁剪（即视图contents有内容并发生了多图层被裁剪）时才会触发离屏渲染。
可以设置 clipsToBounds 为 false 关掉剪裁
2. 不设置阴影，用图片代替。
3. 减少透明的情况。
4. 使用了 shouldRasterize 光栅化

### 14. 常见的异常
EXC_BAD_ACCESS 内存访问问题

SIGABRT 终止信号  
多线程访问可变数组, 可变字典, 多线程添加/删除 元素导致
一种是由于方法调用错误(调用了不能调用的方法)
一种是由于数组访问越界, 这样一般是先抛异常, 从异常就可以明显看出错误原因

SIGSEGV 无效的内存引用

EXC_ARITMETHIC 除以0或整数溢出/下溢引发的异常
EXC_BAD_INSTRUCTION  --- 线程试图访问非法/无效的指令或将无效的参数（操作数）传递给指令

### 音频录制

AVAudioRecorder iOS13 以上版本





## Java

### Java 线程数量配置

Java 5中线程池：
1。 newCachedThreadPool 创建一个可缓存的线程池，若线程数超过处理所需，缓存一段时间后会回收，若线程数不够，则新建线程。
2。newFixedThreadPool 创建一个固定大小的线程池，可控制并发的线程数，超出的线程会在队列中等待
3。 newScheduledThreadPool 创建一个周期性的线程池，支持定时及周期性执行任务。
4。newSingleThreadExecutor 创建一个单线程的线程池，可保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行
5。 ThreadPoolExecutor 自定义

线程池参数：核心线程数量、最大线程数量、空闲线程存活时间、时间单位、队列、工厂、拒绝策略
拒绝策略：
1。 AbortPolicy 拒绝抛出异常
2。 CallerRunsPolicy 使用当前线程来执行次任务 业务中通常用这个
3。 DiscardOldestPolicy 放弃头部最旧的，来执行
4。 DiscardPolicy 忽略抛弃此任务
[参考资料](https://www.cnblogs.com/vipstone/p/15983907.html)：https://www.cnblogs.com/vipstone/p/15983907.html

线程数 = CPU 核心数 * (1 + IO 耗时/ CPU 耗时)
线程数 = CPU 核心数 / (1 - 阻塞系数)
其中计算密集型阻塞系数为 0，IO 密集型阻塞系数接近 1，一般认为在 0.8 ~ 0.9 之间。比如 2 核 CPU，按照公式就是 2 / ( 1 - 0.9 ) = 20 个线程数

线程的平均工作时间所占比例越高，就需要越少的线程；

线程的平均等待时间所占比例越高，就需要越多的线程；

### Spring 事物传播机制
总的来说分为3大类，一类支持当前事物，一类不支持当前事物、一类是可以嵌套的。

支持当前事物的分为
1. REQUIRED 如果当前有事物，则用当前事物，如果没有则开新的事物
2. SUPPORTS 如果当前有事物，则用当前事物，如果没有就算了
3. MANDATORY 强制使用当前事物，如果没有，则抛出异常。

不支持当前事物分为
1. REQUIRES_NEW 如果当前有事物，则挂起来，用新的
2. NOT_SUPPORTED 如果当前有事物，则挂起来，以非事物的方式进行
3. NEVER 不使用事物，如果有事物就抛异常

嵌套类型：
NESTED 如果有事务，则嵌套在里面，如果没有，则新建事务

### redis 

redis 常见的数据类型：
1. String
2. set 
3. list
4. hash
5. zset 有序集合

### spring
IOC：容器化，也就是依赖注入
通过配置文件读取 bean 的定义信息、然后进行增加。过后通过 aop 创建 bean 对象
bean对象的生命周期：实例化、初始化、使用、销毁

aop 使用，先定义注解，然后写切面。实现 around 方法，拿到 point 去解析

### 索引失效

1. 为遵循左前缀匹配 %abc% 会失效，但是 abc% 不会失效
2. 对索引字段进行了计算
3. 对索引字段使用了函数
4. 对索引字段进行了类型转换
5. 联合索引不完全使用失效
6. 不等于 让索引失效
7. 使用 like %abc 失效，模糊匹配的时候，通配符不能再最前面
8. is not null 索引字段，让 索引失效
9. OR 前后存在非索引的列。

### 缓存不一致的问题

缓存更新两种方案
1. 先删除旧的缓存，更新数据库 。问题是如果缓存在 a 线程已经删除，b线程读取缓存是空的，就会去读数据库，然后更新缓存。缓存就是旧的。可以采用缓存过期+延迟双删。
2. 先更新数据库，在更新缓存。 a线程更新了数据库，没有更新缓存，b线程就会读到旧的缓存。但是更新缓存很快，影响不大，如果需要，可以使用锁，对缓存的操作变成串行

可以聊聊之前的积分项目。查询积分是一个高频操作，使用了缓存 + 延迟双删 + 缓存过期的策略

### 定位CPU高占用
1。 阿尔萨斯 thread -n 3 -i 1000 查找前三个线程，然后查栈信息定位代码
2。 top 定位进程 pid ，top -Hp 进程id 定位线程信息。最后通过 jstack 进程id | grep -a 200 线程id

### ThreadLocal

threadlocal 为了解决子线程的问题，诞生了 InheritableThreadLocal，他会在生成子线程的时候将 threadlocal 传递给子线程，但是往往我们并不会手动初始化子线程，而是使用了线程池,
这个时候就诞生了进一步的 TransmittableThreadLocal 俗称 ttl。

threadlocal 内存泄漏是因为，每一个 thread 维护一个 threadlocalmap，key 是 若引用的 threadlocal实例，然后 key 会被 GC，就造成了 key 没了，value还在
要想 value 也消失，需要 thread 销毁

### rabbitmq

创建 利用队列 ttl 和 死信交换机实现倒计时
怎么防丢失，利用消息id验证，可以利用 rabbitmq 的 confirm ，也可以用 retrun。
[参考资料](https://juejin.cn/post/7146587225516408839)：https://juejin.cn/post/7146587225516408839

防止重复消费，需要做验证。消费了就不再消费了

如何实现每个消费者都消费，不指定队列名字，用交换机，绑定route key，发送到 key上面。就可以每个消费者都消费。
如何实现只有一个消费者消费，就指定队列名字进行消费

### Netty 

NIO 三大核心：通道 channel、缓冲 buffer、选择器 Selector


