---
title: 继承中构造方法访问特点
date: 2024-04-18 15:47:01
tags:
 - 继承
categories:
 - 后台
 - Java
---

## 特点
- 子类中所有的构造方法都会访问父类中的无参构造方法 ``super()``
	- 其实这么说也不对，这里默认调用父类的空参构造，只是为了表明构造方法调用链的下一步是什么。如果你显示的表明了，他就不会默认的加上去
	- 例如这里的 Me 中，显示的表明空参构造使用 this 调用本类的有参构造
 ```
public class Parent {
    private String name;
    public String seo;

//    public Parent() {
//        System.out.println("父类空参数");
//    }

    public Parent(String name) {
        this.name = name;
        System.out.println("父类有参数");
    }
}

public class Me extends Parent {
    private String subName;

    public Me() {
//        super("ni");
        this("可以哦");
        System.out.println("子类空参数");
    }

    public Me(String subName) {
        super("nih");
        this.subName = subName;
        System.out.println("子类有参数");
    }
}
 ```

	 

:::tip
以下回答来自 AI

在Java中，如果子类的构造方法没有显式地通过 super 调用父类的构造方法，那么Java编译器会尝试在子类构造方法的第一行加上 super() 来调用父类的无参构造方法。如果父类中没有无参构造方法，编译过程就会报错。
当在子类的无参构造方法中使用 this 调用本类的其他有参构造方法时，这种情况下，只有被 this 关键字调用的那个有参构造方法会在其第一行隐式地或显式地调用父类的构造方法。也就是说，在这种情况下，super() 不会被自动插入到使用 this 关键字调用的构造方法中，因为 this 调用已经表明了构造方法调用链上的下一步。
如果你的父类没有空参构造方法，你需要在子类的任何构造方法中，或者是通过 this 调用链最终到达的构造方法中显式地调用父类的有参构造方法，否则代码将无法编译通过。
下面是一个示例来说明这个概念：
```
class Parent {
    // 父类的有参构造方法
    Parent(int x) {
        System.out.println("Parent Constructor with arg " + x);
    }
}

class Child extends Parent {
    // 子类的有参构造方法显式地调用父类的有参构造方法
    Child(int y) {
        super(y);
        System.out.println("Child Constructor with arg " + y);
    }

    // 子类的无参构造方法通过 this 调用它本类的有参构造方法
    Child() {
        this(10); // 这里会调用 Child(int y) 构造方法
        System.out.println("Child default Constructor");
    }
}

public class Test {
    public static void main(String[] args) {
        Child c = new Child();
    }
}
```
在这个例子中，Child 类的无参构造方法通过 this(10) 调用了它本类的有参构造方法 Child(int y)。在 Child(int y) 构造方法中，通过 super(y) 显式地调用了父类 Parent 的有参构造方法。因此，在这个场景中，不会自动调用 super()。

:::


:::info
为什么要调用 super()

因为子类可以访问父类的非私有成员，如果子类已经初始化，但是父类没有初始化，这个时候去访问父类的非私有成员不就挂了吗！！！

如果我们写的类没有手动指定父类，他也会自动继承 Object

一定要调用 super() 吗？

不一定，只要能清楚的知道构造方法调用链就行了。 
:::

## 如果父类没有空参构造，阁下如何应对？

- 不行那就编译报错呗 😂
- 退一步，如果有有参构造，那就用有参构造呗。


## 父类私有的成员，子类能继承到吗？

是可以继承到的，但是无法直接使用。队内存中还是会存在的。
![内存图](/Java/WX20240418-173316@2x.png)
