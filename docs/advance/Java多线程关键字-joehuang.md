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

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221342188.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221343708.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221343729.png)

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
