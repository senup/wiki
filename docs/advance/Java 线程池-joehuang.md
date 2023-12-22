---
title: Java 线程池-joehuang
date: 2023-12-22 13:36:13
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221336660.png)

## 线程池的核心参数

想象我们要举办一个派对，这个派对就是我们的任务数。每个参加我们派对的人，都可以被看作是一个个独立的线程。看明白了吗？好，现在让我们来建立我们的派对吧。

首先，我们先来看"coreSize"，这就好比你的派对里可以容纳的核心嘉宾数量，也可以说是理想状态下你希望能够参与你派对的人的数量。

接下来，是"maximumSize"。这是你派对的极限，也就是你的派对地点所能承载的最大人数。毕竟，即使你的朋友再多，你的派对地点也容不下无限人吧。这与 Java 线程池的最大线程数一样，即使我们的任务再多，我们也不能无限地派发线程。

再者，讲到"delayTime"，不难看出这应该是一种时间概念，实则是我们的独待时间。想象一下，你的核心嘉宾如果超过了这个时间还没有来到你的派对，说明他可能由于某种原因没法来，然后该位置就要留给其他客人了，比如等待的任务。

最后，我们看看"queue"。这就像是一个等待区，把那些想进入派对但派对地点已经没有位置的人放在一起，当派对地点有位置让出来时，他们就可以进场参与派对，也就是可以开始执行任务了。

这样，多线程的核心参数的概念是不是就清楚多了？对了，这些都是线程池 ExecutorService 框架中 ThreadPoolExecutor 类的代码参数。

## 任务提交流程

你可以想象一下，在一个办公室里，有一位商务助理接收每一个新的任务，并根据固定的流程来处理他们。在 Java 的多线程环境中，任务提交流程大体上就是这个样子的，现在让我们来看一看具体是什么样子的。

1. 当任务（这是那个新的工作申请）首次提交时，商务助理（线程池）首先会核查当前的正在处理任务的员工（线程）数量是否已经达到了核心线程数"coreSize"。如果没有，商务助理就会新雇用一个员工来处理这个任务；但如果已经达到了核心线程数，这个新任务就需要等待一下。
2. 受理的新任务如果不能立即有员工来处理，它就会进入到等待区(queue)，这个等待区就是那个“排队等待的场所”。它会整齐排队等待被处理。
3. 如果等待区(queue)已经满了，也就是说，已经没有足够的空间容纳更多等待处理的任务，这时，商务助理（线程池）就需要做出决定了：要么雇用额外的员工（线程），直到达到"maximumSize"；要么对于新进来的任务直接说“不”，无法接受，也就是抛出 RejectedExecutionException。
4. 当等待区的任务被取出来分配给一个员工（线程）处理，它就从队列中出列。然后使用适当的工作策略（涉及到线程的运行、优先级等因素）开始执行任务。
5. 最后，当一个任务被完成，员工（线程）就可以选择去等待区（queue）拿新的任务进行处理，如果等待区没有新任务，而且这个员工被设定为可以自动退出的，那么过一段时间之后，他们就会“被解约”，也就是线程被结束掉。

我希望这个办公室的场景可以帮助你更好地理解线程池中的任务提交流程。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221337838.png)

## 创建 worker

我们现在就重点分析一下 ThreadPoolExecutor 中添加 worker 线程的流程。

在描述这个过程之前，我们先看看 ThreadPoolExecutor 中的两个字段：

- `workers`： workers 是一个 HashSet，用于保存线程池中的工作线程 Worker，而 Worker 是 ThreadPoolExecutor 的一个内部类，封装了线程（Thread）和 Runnable 对象。
- `ctl`： ctl 是一个 AtomicInteger 类，高三位表示线程池状态，低二十九位表示线程数量。

好，现在让我们一步步看看 addWorker 方法的流程：

1. 首先要判断传入的参数是否符合预期，也就是判断当前线程数是否小于 corePoolSize 或者是否允许创建非核心线程。
2. 让我们看看第一次尝试添加 worker。如果当前的线程数少于`corePoolSize`，那就会尝试创建并启动一个核心线程，此时如果添加失败（可能线程池状态已经改变或者线程数已经超过阈值），会直接返回 false。如果当前线程数等于或者超过了`corePoolSize`，那么会尝试加入到队列中。
3. 如果加入到队列成功，会进行第二次尝试，先检查线程池的状态，如果是 RUNNING，就创建并启动新线程；如果状态不是 RUNNING，就移除这个任务，返回 false。如果线程池的状态是 RUNNING，但是发现没有创建任何线程，那就会移除这个任务并尝试添加新的 worker。
4. 如果以上尝试都失败，那就尝试创建并启动非核心线程。

如果最终创建并启动线程成功，就会返回 true，否则返回 false。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221338243.png)

## worker 执行任务


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339992.png)

P 5 04 获取任务

P 6 05 worker 销毁

P 7 06 线程池关闭流程

P 8 常见线程池

提交任务流程

```
P1 线程池的核心参数

P2 01任务提交流程

> P3 02创建worker

P4 03worker执行任务

P5 04获取任务

P6 05worker销毁

P7 06线程池关闭流程

P8 常见线程池

```





![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339771.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221339932.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221340839.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221340765.png)

<!--more-->
