---
title: jvm
date: 2023-11-29 22:56:08
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

### 元空间溢出

元空间（Metaspace）是 Java 8 之后取代了永久代（PermGen）的内存区域，用于存储类的元数据信息，比如类名、方法名、字段信息等。元空间默认是不限制大小的，它是直接使用本机的内存而不是 Java 堆内存。元空间溢出通常是由于加载了大量的类或者动态生成的类导致的。

元空间溢出可以通过以下几种方式触发：

1. **加载大量类或生成大量动态代理类**：如果程序中频繁地加载大量的类或者使用动态生成类的方式，会导致元空间占用过多内存而溢出。
2. **限制元空间大小**：通过 JVM 参数`-XX:MaxMetaspaceSize`来限制元空间的大小，当达到这个限制时就会触发溢出。

示例代码可以模拟加载大量类的情况：

```
import java.util.ArrayList;
import java.util.List;

public class MetaspaceOOM {
    public static void main(String[] args) {
        List<Class<?>> classes = new ArrayList<>();
        while (true) {
            Class<?> clazz = generateClass();
            classes.add(clazz);
        }
    }

    private static Class<?> generateClass() {
        // 动态生成类并返回
        // ...
    }
}

```

### 栈空间溢出

栈空间（Stack）是线程私有的，用于存储线程的方法调用、局部变量等信息。栈空间是有限制的，当线程的方法调用层级过深或者每个方法调用所使用的栈空间过大时，会触发栈空间溢出（StackOverflowError）。

栈空间溢出可以通过以下方式触发：

1. **递归调用过深**：如果一个方法递归调用的层级过深，导致方法调用链过长，栈空间可能会耗尽。
2. **每个方法使用的栈空间过大**：如果方法中使用了大量的局部变量或者大对象，会占用大量栈空间，导致栈空间溢出。

示例代码可以模拟栈空间溢出：

```
public class StackOverflowExample {
    public static void main(String[] args) {
        stackOverflowMethod();
    }

    private static void stackOverflowMethod() {
        stackOverflowMethod(); // 递归调用导致栈溢出
    }
}

```

### gc 停顿

垃圾回收（GC）停顿指的是在进行垃圾回收时，应用程序的执行会被暂停。停顿可能会对应用程序的响应性和性能产生影响。主要有以下几种情况会导致 GC 停顿：

1. **全停顿（Full GC）**：在进行全局垃圾回收时，会触发全停顿。在进行 Full GC 期间，所有的应用线程都会被暂停。这种停顿在一些场景下会比较显著，特别是当堆内存较大且垃圾回收器需要执行长时间的清理时。
2. **年轻代 GC 停顿**：年轻代（Young Generation）的垃圾回收，即 Minor GC，也会导致短暂的停顿。这种停顿一般较短，因为年轻代的垃圾回收通常会在新生代中进行，只会影响新生代的对象。
3. **老年代 GC 停顿**：对于老年代（Old Generation）的垃圾回收，即 Major GC 或 Full GC，停顿时间可能较长，特别是在清理老年代的大对象或者执行多次 Minor GC 后需要进行 Full GC 时。

控制 GC 停顿的方法主要包括：

1. **优化垃圾回收器选择**：不同的垃圾回收器（如 CMS、G1、ZGC、Shenandoah 等）有不同的特性，一些垃圾回收器专注于降低停顿时间。
2. **调整垃圾回收参数**：可以通过调整堆大小、GC 算法、触发 GC 的阈值等参数来影响 GC 的行为。比如，增加堆内存大小可能会减少 GC 的频率，减少停顿时间。
3. **并行和并发处理**：一些垃圾回收器使用并行和并发的方式来执行垃圾回收，尽量减少应用程序的停顿时间。这些方式会在不同场景下有不同的适用性。
4. **优化对象分配和回收**：减少对象的频繁分配和及时释放不再使用的对象可以减少 GC 的频率和停顿时间。
5. **合理的 GC 策略**：根据应用的实际情况选择合适的 GC 策略和参数配置，对于不同的应用场景可能需要针对性地进行调优。

GC 停顿的控制并非简单的一种设置，需要结合应用程序的实际情况和性能需求进行综合考量和优化。

<!--more-->
