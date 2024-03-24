---
title: volatile
date: 2024-01-18 08:57:48
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---



## ✅有了synchronized为什么还需要volatile?
双重检查锁（Double Checked Locking Pattern）是一种常用的单例实现方式，它的精髓就在于“轻则获取，重则同步”，这个模式的话，絮絮叨叨就有点破坏了节奏，让我们直接看代码吧：

```java
public class Singleton {
    private volatile static Singleton instance;
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    // 其他代码...
}
```

在这份代码中，`volatile`关键字起了一个非常重要的作用。当`instance = new Singleton()`这样的代码运行的时候，它实际上分为三个步骤：

1. 为`Singleton`对象分配内存；
2. 在内存中初始化这个`Singleton`对象；
3. 将`instance`变量指向分配的内存空间。

然后问题就来了，由于 Java 有一种叫做`指令重排`的机制，上面三个步骤可能会变为 1→3→2 这样的顺序。这就意味着，一个线程可能在第三步的时候，刚好另一个线程在外面的`if`中检查到`instance`不为空，然后这个线程就会直接返回一个还没有被初始化的`instance`，就像是你的朋友把你新买的但是还没有装配的组装模型拿去展示，这肯定是万万不行的。

而加了`volatile`后，就可以禁止指令重排，确保`instance`每次都是在被初始化后才被写入，因此其他线程在读取到的`instance`只可能是一份完全初始化好的实例。

所以说，`volatile`就像是那个守夜人，在黑夜中为我们的`Singleton`守护安全，不被还没完全初始化就被别的线程拿去用。你看，是不是又有一丝英雄主义的浪漫呢，哈哈~

<!--more-->


## 重排序
比如一个 new 的操作,实际上会先1.分配内存空间,2.对象初始化,3.赋值给变量.
但是重排序导致 132，这种情况就可能第二个线程拿到了没初始化完成的一个变量。
因此，使用 volatile 就能禁止指令重排序