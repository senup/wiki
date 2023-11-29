### Spring中的模块

### Spring中bean的作用域

### IoC原理

### AOP原理

### Spring事务

### Spring中用到的设计模式

### SpringMVC 运行流程


### Spring 中的 Controller 和 Service 是线程安全的吗？

```
在 Spring 中，Controller 和 Service 默认情况下是单例的，也就是说它们在应用程序的整个生命周期内只会被实例化一次。因此，如果它们没有状态（即不包含可变的实例变量），它们是线程安全的。但是，如果它们包含可变状态，你需要确保状态的同步以确保线程安全。通常推荐避免在 Controller 和 Service 中使用实例变量来保存状态，而是尽可能使用方法内的局部变量，或者使用线程安全的数据结构来管理状态。
```

### 包含可变状态是怎么样呢？
假设类里面有一个计数器的变量，同时有查询计数值的方法，那么多个线程同时访问这个方法的时候，会有竞争的问题，导致数值不准确。可以使用 `AtomicInteger` 类来管理计数器，它提供了原子性的操作，避免了多线程访问时的竞态条件问题。


### 说下你对原子类的理解？

```
原子类是 Java 中提供的一组特殊数据类型，它们能够在多线程环境下进行原子操作，保证了特定操作的原子性。原子性指的是一个操作是不可中断的，要么全部执行成功，要么完全不执行，不会出现部分执行的情况。

Java 中的 `java.util.concurrent.atomic` 包提供了多种原子类，比如 `AtomicInteger`、`AtomicLong`、`AtomicBoolean` 等。这些类提供了一些常见的原子操作，比如增加值、减少值、设置值等，这些操作是线程安全的，不需要额外的同步手段就可以保证多线程环境下的正确性。

原子类的主要特点包括：

1. **原子操作：** 原子类的操作是原子的，不会被线程调度机制打断。
2. **线程安全：** 在多线程环境下，原子类提供了线程安全的操作，无需额外的同步措施。
3. **底层实现：** 这些类使用了底层的 CAS（Compare and Swap）操作来实现原子性，即比较并交换操作，保证了并发情况下的线程安全性。

原子类通常用于需要在多线程环境下进行操作的场景，比如计数器、标志位的更新等。它们能够提供高效且线程安全的解决方案，避免了使用锁所带来的开销和复杂性。
```



### 参考文献

- [Spring](https://spring.io/)
- [SpringAdvance](https://github.com/DespairYoke/java-advance)
- [Spring 框架的设计理念与设计模式分析](https://www.ibm.com/developerworks/cn/java/j-lo-spring-principle/)
- [Spring：源码解读Spring IOC原理](https://www.cnblogs.com/ITtangtang/p/3978349.html)