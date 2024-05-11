---
title: 类 & 结构体
date: 2024-05-11 10:14:38
tags:
 - class
categories:
 - iOS
 - 面试
---

## 类和结构体

面试经常问到这个问题，你了解么？怎么选择？各自有什么优缺点？

在Swift中，你可以通过`struct`（结构体）和`class`（类）来定义模型，二者都可以用来封装数据和行为。选择结构体和类之间主要取决于你的具体需求，以及你想如何使用它们。理解二者的区别和各自的优缺点是非常重要的：

### Struct（结构体）

#### 优点：
- **值类型**：结构体是值类型，当它被赋值给一个常量或变量，或者被传递给函数时，其值会被拷贝。
- **线程安全**：由于值类型在传递时总是被拷贝，使用结构体可以避免多线程下的数据竞争问题。
- **性能**：对于小型数据结构，结构体通常比类更高效。

#### 缺点：
- **无法使用继承**：结构体不支持继承，这意味着无法定义一个结构体来继承另一个结构体的属性或方法。

### Class（类）

#### 优点：
- **引用类型**：类是引用类型，当它被赋值给另一个常量或变量，或者被传递到一个函数时，实际上是传递的引用。
- **继承**：支持继承，可以创建一个类的子类并继承其属性和方法，也可以重写某些属性和方法以改变其行为。
- **引用计数**：允许多个引用指向同一个实例，这对于管理资源和内存来说很有用。

#### 缺点：
- **性能问题**：由于引用计数的管理，以及内存被堆分配，类的实例通常比结构体实例在性能上有所下降。
- **线程不安全**：如果多个线程共享同一个类实例，可能需要额外的工作来避免数据竞争和线程安全问题。

### 选择指导

- **使用结构体**：当你需要确保数据类型是赋值拷贝时；当你要表示简单的数据值时；以及当你的数据结构不需要用到继承时。
- **使用类**：当你需要利用继承来共享或重写行为；当你需要控制数据的身份以确保数据不被拷贝时；以及当你的数据模型是大型或复杂时。

在实践中，Swift标准库大量使用了结构体，例如`String`、`Array`和`Dictionary`都是以结构体的形式实现的，这表明结构体适合用于封装数据和行为，除非你需要类提供的特定功能（例如继承）。在苹果的Swift编码指南中，通常推荐优先考虑使用结构体。