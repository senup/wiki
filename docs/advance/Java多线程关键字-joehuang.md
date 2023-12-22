---
title: Java多线程关键字
date: 2023-12-22 13:41:29
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## 线程创建的方法

### 线程创建的方法有几种：

1. `通过继承Thread类`: 这种方式需要重写 Thread 类中的 run 方法，run 方法的方法体就是对应线程需要执行的任务。创建的线程并不会立即执行，需调用 start 方法才会执行。

```
new Thread(){
    public void run(){
        // 执行代码
    }
}.start();
```

2. `通过实现Runnable接口`: 创建一个新的类实现 Runnable 接口，然后实现它的 run 方法，将 Runnable 实例传给 Thread 类的构造方法，就可以启动新线程并执行 run 方法。

```
Runnable runnable = new Runnable(){
    @Override
    public void run(){
        // 执行代码
    }
};
new Thread(runnable).start();
```

3. `通过实现Callable和Future创建线程`: 这种方式的优势就在于可以有返回值。Future 就像一个凭证，在将来的某个时间点获取结果。

```
Callable<Integer> callable = new Callable<Integer>() {
    public Integer call() throws Exception {
        // 执行代码并返回结果
        return 0;
    }
};

FutureTask<Integer> future = new FutureTask<>(callable);
new Thread(future).start();
```

接下来是线程池：  
Java 提供了一个线程池框架，通常我们会使用 ExecutorService 的实现类创建线程池。比如 ThreadPoolExecutor 和 ScheduledThreadPoolExecutor。你可以通过以下方式创建：

```
ExecutorService executor = Executors.newFixedThreadPool(10);
```

线程池提交任务主要有两种方式：`execute()`和`submit()`。

1. `execute(Runnable command)`: 用于提交一些一次性的任务，执行完成后就丢弃。
2. `submit()`: 提交有返回值的任务，有三种形式：submit(Runnable task)、submit(Runnable task, T result)、submit(Callable task)。submit 方法返回一个 Future，我们可以通过 Future 获取线程执行后的返回结果。

### 线程创建的流程：

1. 新建线程
2. 初始化线程，包含线程组，名称，优先级，是否是守护线程，目标对象等
3. 调用线程的 start 方法，JVM 会调用该线程的 run 方法
4. 线程进入 RUNNABLE 状态，等待 JVM 线程调度器调度
5. 当线程执行完毕，或者出现未处理异常，则线程终止

---

### 线程执行的流程：

1. 新线程被提交到线程池后，首先检查线程池状态，然后执行 addWorker 方法添加工作线程并执行任务
2. 在 addWorker 中，首先会检查线程池状态和队列情况，然后创建工作线程，并放入到线程队列中，然后启动线程
3. 线程启动后，会调用线程的 run 方法，执行任务
4. 任务执行完毕后，线程不会立即销毁，而是等待新的任务
5. 如果在 keepAliveTime 时间内没有新的任务，则线程将结束运行，进入 TERMINATED 状态

---

**线程创建的流程:**

1. `实例化线程对象`：首先我们提供一个实例化 Thread 的方式，这种方式可以是直接实例化 Thread 类，也可以是通过实现 Runnable 接口的方式。

```
// 实例化Thread类
Thread thread = new Thread();

// 实现Runnable接口
Runnable runnable = new Runnable(){
    @Override
    public void run(){
        // 代码
    }
};
Thread thread = new Thread(runnable);
```

2. `初始化线程对象`：在实例化线程的过程中，我们有机会进行相关设置，例如线程名称、优先级等。

```
// 设置线程名称
thread.setName("Thread01");

// 设置线程组，这一般是默认的，通常是父线程的线程组
ThreadGroup parentGroup = thread.getThreadGroup();

//设置线程优先级(1-10)，默认是5，低优先级的线程在与高优先级线程竞争时，会更可能得到CPU资源
thread.setPriority(Thread.NORM_PRIORITY);
```

**线程执行的流程:**

1. `启动线程`：通过 Thread 实例的 start 方法。这个方法是 native 的，实际上是调用了 start0 方法。

```
thread.start();
```

2. `执行任务`：线程启动后，JVM 会调用线程的 run 方法。如果是直接创建的 Thread 对象，需要重写 run 方法，定义线程的任务；如果是 Runnable 对象，则 run 方法来自 Runnable 接口。

```
// 覆盖Thread的run方法
@Override
public void run() {
    // 执行代码
}

// Runnable的run方法
@Override
public void run(){
    // 代码
}
```

3. `设置为已启动`：线程任务执行完毕后，线程会被设置为已结束状态。

## synchronized 锁类型

Java 中提供了多种同步控制工具，例如 synchronized 是其中的一种，它可以用来保证线程安全，防止多个线程同时访问某一片代码段。

基于 synchronized 的同步，主要有三种使用方式：

1. `同步实例方法`： 直接在方法声明中加入 synchronized 关键字。在调用该方法时，不同线程将互斥访问这个方法。如果一个线程正在执行一个实例同步方法，其它线程不能访问该类的所有实例同步方法（包括同步方法和同步静态方法），其它线程可以访问非 synchronized 的方法。

```
public class MyClass {
    public synchronized void method() {
        // 需要同步的代码
    }
}
```

2. `同步代码块`： 将需要同步的代码包括在 synchronized 关键字和一对大括号中。为了达到同步的效果，你必须使用一个对象引用来指定同步块，并且具有相同指定对象引用的所有同步块才能够实现同步。换句话说，线程一次只能在一个对象引用的一个或多个同步块上同步。

```
public void someMethod() {
    synchronized (this) {
        // 需要同步的代码
    }
}
```

3. `同步静态方法`：使用 synchronized 修饰符来修饰一个静态方法。当一个线程获取到类锁，其他线程无法访问同一个类的所有同步静态方法，其它线程可以访问非 synchonized 的方法。

```
public class MyClass {
    public static synchronized void method() {
        // 需要同步的代码
    }
}
```

上述三种方式提供了同步机制，它们都是通过使用监视器锁（monitors）来实现方法或者代码块的互斥访问。Java 中的每一个对象都可以作为锁，这是因为每个对象都有与之关联的监视器锁。

synchronized 保证了线程安全，但是使用过多会导致性能问题，因此我们需要尽量减少临界区的大小，只对必要的代码段进行同步。

## 同步是如何实现的

为了应对多线程环境下的线程安全问题，Java 提供了同步机制，也就是我们常说的  `synchronized`  关键字。关于同步的实现，我们需要深入理解一下 JVM 中的对象结构，以及对锁状态的更新。

在 JVM 中，每个 Java 对象在内存中都有一个对象头，也就是 Object Header。如果我们看一个普通的 Java 对象，它主要由三部分构成：

- `Mark Word`：存储对象自身的运行时数据，如哈希码(hashcode)、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等。这部分数据的长度在 32 位和 64 位的 JVM（未开启压缩指针）中分别为 32bit 和 64bit。
- `类型指针`：其指向对象的类元数据(Class Metadata)，JVM 通过这个指针来确定这个对象是哪个类的实例。
- `实例数据（即我们在类中所定义的各种类型的字段）`：无论是从父类继承下来的，还是在子类中定义的，只要是对象的非静态字段，都在此处分配。

然后，具体到同步如何实现，其核心就是对 Mark Word 中锁状态标志的修改。整个过程是这样的：

1. 在默认无锁状态（非同步情况）下，Mark Word 的结构是分配设置为偏向锁，并指向运行该代码的线程。
2. 当有其他线程试图获取该对象的锁时，若偏向锁的指向刚好是这个线程，那么它就可以顺利获取到。反之，如果其他线程试图获取，则必须通过挂起自己线程的方式来撤销（撤销需要等待全局安全点，这是一个重量级操作）。撤销之后，偏向锁就升级为轻量级锁。
3. 接下来的过程就是线程争用的处理。如果没有争用，那么轻量级锁就直接退化为偏向锁。如果有争用，那么锁就膨胀为重量级锁，重量级锁就会让其他申请的线程进入阻塞状态。

这就是一次完整的锁升级，也是同步的实现过程。看似复杂，其实就像玩玩具一样。闯过了这一关，你就已经跨出了成为并发编程大师的重要一步。

## 可见性和有序性

在多线程编程中，"可见性"和"有序性"是两个基本的概念，它们对理解如何编写正确和高效的并发程序至关重要。

1. `可见性`：当一个线程修改了共享变量的值，其他线程可以立即知道这个修改。Java 中，关键字 volatile 可以保证变量的可见性。当一个共享变量被 volatile 修饰时，它会保证修改的值立即同步到主内存，当有其他线程需要读取时，它会直接从主内存中读取新值。

但需要注意的是，尽管 synchronized 关键字可以使共享变量在线程间保持同步，避免了线程间互相看不到对方的更新值的问题，但它本身并不能保证可见性，可见性是由 volatile 关键字来保证的。



```
private volatile int value;

public void setValue(int value) {
   this.value = value;
}
```

2. `有序性`：即程序执行的顺序按照代码的先后顺序执行。在 Java 里，可以通过 volatile 关键字来保证某些操作的有序性。Java 内存模型中，对 volatile 变量的写操作先行发生于读操作，这就创建了一个"先行发生原则"，如果对 volatile 变量的写操作先行发生于读操作，那么在读操作时就可以得到这个最新的值。

此外，双重检查锁定的单例模式就可以利用 volatile 的这种有序性特性来工作。在这种模式下，volatile 防止了其他线程看到部分初始化的单例。



```
public class Singleton {
    private volatile static Singleton instance;

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized(Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

在上述代码中，“instance = new Singleton()”这段代码其实是分为三步执行：

1）为 instance 分配内存空间;

2）初始化 instance;

3）将 instance 指向分配的内存地址。

但是由于 JVM 具有指令重排的特性，执行顺序有可能变成 1->3->2。在单线程环境下不会出现问题，但在多线程环境下会导致问题。指令重排是为了提高性能。

为了避免这个问题，我们需要添加 volatile 关键字，禁止进行指令重排。

## wait 和 notify





![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221344828.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221344976.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221345323.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221345261.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221346059.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221346073.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221347716.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221347808.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221347143.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221348793.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221348631.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221349027.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221349212.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221350802.png)

<!--more-->
