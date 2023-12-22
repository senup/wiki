---
title: jvm-joehuang
date: 2023-12-22 14:36:27
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## JVM

JVM，也就是 Java 虚拟机，可以说是 Java 程序的执行引擎。它负责将 Java 源代码编译成能在特定平台上运行的字节码，这样就能在不同的设备上无缝运行。

JVM 也有自己的内存管理系统，负责内存的分配和回收，确保程序运行的高效性和稳定性。

简单来说，JVM 就像是 Java 程序和计算机硬件之间的桥梁，让 Java 代码能够在各种环境中运行。

## JVM、JRE、JDK 分别是什么关系？

JVM 是 Java 虚拟机，是 Java 程序的执行引擎；
JRE 是 Java 运行时环境，包含了 JVM 和 Java 程序运行所需的核心类库；而 JDK 则是 Java 开发工具包，里面集成了 JRE，也包含了开发 Java 程序所需的编译器、调试器等开发工具。

想象成房子吧，JVM 就是房子的框架，JRE 是房子的基础和结构，而 JDK 则是整个房子，包括了框架、基础和装修。

在开发 Java 程序时，需要 JDK 来编写代码、编译和运行程序；
而在运行 Java 程序时，只需要 JRE，因为它包含了程序运行所需的环境和库。

## JVM 的内存模型

JVM 的内存模型描述了在运行 Java 程序时，JVM 如何组织和管理内存。它包括了不同的内存区域，每个区域都有自己的作用和特点。

### 1. 内存模型的内容和作用

- **方法区（Method Area）**：用来存储类结构信息、常量、静态变量等。在 Java 8 之前，这里还有永久代（PermGen），但在 Java 8 后被元空间（Metaspace）所取代。
- **堆（Heap）**：存放对象实例，是被所有线程共享的内存区域。通过垃圾回收来管理，主要分为新生代（Young Generation）和老年代（Old Generation）等不同区域。
- **栈（Stack）**：每个线程都有自己的栈，存储局部变量、方法调用、部分结果等。栈分为**虚拟机栈**和**本地方法栈**。虚拟机栈用于存储方法调用和局部变量，而本地方法栈是针对 Native 方法服务的。
- **程序计数器（Program Counter Register）**：存储当前线程执行的字节码指令地址，也就是当前线程所执行的位置。

### 2. 两种栈

- **虚拟机栈（Java Virtual Machine Stack）**：用于存储方法执行过程中的局部变量、操作数栈、动态链接、方法出口等信息。
- **本地方法栈（Native Method Stack）**：与虚拟机栈类似，但是服务于 Native 方法。

### 3. 堆和栈的区别

- **堆**是用于存放对象实例的区域，通过垃圾回收机制进行管理，是所有线程共享的内存区域。
- **栈**是为每个线程分配的内存区域，用于存放线程私有的局部变量、方法调用等信息。

### 4. 1.6 到 1.8 的区域变化

在 Java 1.6 到 1.8 中，最大的变化是元空间（Metaspace）取代了永久代（PermGen）。永久代存放类的元数据信息、字符串常量池等，在大量使用动态生成类的场景下容易出现 PermGen Space 内存溢出。元空间使用的是本地内存，解决了永久代的一些限制，但需要注意控制元空间的大小，以防止系统内存被耗尽。

内存的两种分配方式，以及如何保证分配内存是线程安全

类和对象加载

类加载和对象创建的关系

有几种类加载噐

类的加载过程

什么是双亲委派模式

对象的创建方式

对象的构造过程

对象的内部构造

对象头里面有什么

对象的两种访问方式

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221436675.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221436666.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221437781.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221437842.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221438964.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221438235.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221439236.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221439851.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221440185.png)

最后一节实战可以用

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221440926.png)

<!--more-->

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221441263.png)
