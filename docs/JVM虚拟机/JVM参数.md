---
title: JVM参数
date: 2023-12-23 19:05:47
tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

首先，`-Xms4096m -Xmx4096m -Xmn2000m`  这些是 JVM 的内存设置，`-Xms`  和  `-Xmx`  分别代表了 JVM 堆的最小和最大值，都设置为 4096m，意思是堆大小固定为 4096m， `-Xmn`  则设置了新生代的大小为 2000m。

关于垃圾收集器的选用，使用`-XX:+UseConcMarkSweepGC`开启 CMS 垃圾收集器，该收集器更加适合对响应时间有严格要求的系统，开启`-XX:+CMSParallelRemarkEnabled`则是为了减少标记暂停时间。

`-XX:CMSInitiatingOccupancyFraction=75`  和  `-XX:+UseCMSInitiatingOccupancyOnly`  一起使用，代表着在堆内存使用量达到 75%的时候，就开始执行 CMS 收集。

`-XX:+HeapDumpOnOutOfMemoryError`  和  `-XX:HeapDumpPath`  一起工作，当发生内存溢出错误时，会将堆转储到指定路径的文件中，以便后续分析。

最后，`-XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m -XX:MaxDirectMemorySize=1024m`  连用则设定了元数据区、直接内存的大小，这对于控制内存开销，防止内存泄漏等都有积极的作用。

| 参数                                                                                                                                | 参数含义                                                       | 最佳实践                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `-server`                                                                                                                           | 启用 Java 虚拟机的服务器模式                                   | 对于生产环境，建议使用此模式以获得更好的性能和优化。                   |
| `-Djava.security.egd=file:/dev/./urandom`                                                                                           | 指定安全随机数生成器的算法                                     | 使用 `/dev/./urandom` 是为了增强随机数生成的安全性。                   |
| `-Xms4096m`                                                                                                                         | 设置 Java 虚拟机的初始堆大小为 4096MB                          | 根据应用程序需求和服务器配置调整初始堆大小。                           |
| `-Xmx4096m`                                                                                                                         | 设置 Java 虚拟机的最大堆大小为 4096MB                          | 根据应用程序需求和服务器配置调整最大堆大小。                           |
| `-Xmn2000m`                                                                                                                         | 设置年轻代大小为 2000MB                                        | 年轻代大小应适应应用程序的内存需求，也可能需要根据服务器性能进行调整。 |
| `-Duser.timezone=GMT+8`                                                                                                             | 设置应用程序的时区为 GMT+8                                     | 确保应用程序在正确的时区运行。                                         |
| `-Dfile.encoding=UTF-8`                                                                                                             | 设置默认文件编码为 UTF-8                                       | 使用广泛支持的 UTF-8 编码以处理不同语言的字符。                        |
| `-Dsun.net.inetaddr.ttl=1`                                                                                                          | 设置网络地址的 TTL（Time-To-Live）为 1                         | 根据网络环境和需求设置合适的 TTL。                                     |
| `-XX:-UseAdaptiveSizePolicy`                                                                                                        | 关闭自适应大小调整策略                                         | 通常在特定场景下关闭以避免不必要的调整。                               |
| `-XX:MaxTenuringThreshold=15`                                                                                                       | 设置对象进入老年代的年龄阈值为 15                              | 根据应用程序的对象生命周期进行调整。                                   |
| `-XX:+ExplicitGCInvokesConcurrent`                                                                                                  | 显式调用 GC 时采用并发模式                                     | 可以在需要时显式调用 GC 以减少停顿时间。                               |
| `-XX:CMSInitiatingOccupancyFraction=75`                                                                                             | 设置 CMS （Concurrent Mark-Sweep）收集器的老年代触发阈值为 75% | 根据应用程序的内存使用情况进行调整。                                   |
| `-XX:NativeMemoryTracking=detail`                                                                                                   | 启用本地内存追踪，并显示详细信息                               | 用于追踪 Java 进程使用的本地内存信息。                                 |
| `-XX:+UseConcMarkSweepGC`                                                                                                           | 启用并发标记-清除垃圾收集器                                    | 在需要较短停顿时间的情况下使用。                                       |
| `-XX:+CMSParallelRemarkEnabled`                                                                                                     | 启用并行标记                                                   | 提高标记阶段的并行度以减少停顿时间。                                   |
| `-XX:+UseCMSCompactAtFullCollection`                                                                                                | 全量收集时进行内存碎片整理                                     | 在 Full GC 时进行内存整理以减少碎片化。                                |
| `-XX:+UseFastAccessorMethods`                                                                                                       | 使用快速访问器方法                                             | 加速对对象字段的访问。                                                 |
| `-XX:+UseCMSInitiatingOccupancyOnly`                                                                                                | 仅使用 CMS 触发阈值                                            | 仅依靠 CMSInitiatingOccupancyFraction 触发 CMS 收集器。                |
| `-XX:+HeapDumpOnOutOfMemoryError`                                                                                                   | 内存溢出时生成堆转储文件                                       | 便于分析内存溢出问题。                                                 |
| `-XX:HeapDumpPath=/example/dump/`                                                                                                   | 指定堆转储文件的存储路径                                       | 存储内存溢出时生成的堆转储文件。                                       |
| `-Djava.awt.headless=true`                                                                                                          | 设置 Java AWT 应用程序为无头模式                               | 在无图形界面环境下运行 Java 应用程序。                                 |
| `-Dapp.id=gmp-pro-apollo-server -Djava.net.preferIPv4Stack=true`                                                                    | 设置应用程序 ID 和优先使用 IPv4 栈                             | 根据应用程序需求进行设置。                                             |
| `-XX:+PrintGCDateStamps`                                                                                                            | 打印 GC 时间戳                                                 | 用于分析 GC 发生的时间。                                               |
| `-XX:+PrintGCDetails`                                                                                                               | 打印 GC 的详细信息                                             | 提供 GC 的详细分析。                                                   |
| `-XX:+PrintCodeCache`                                                                                                               | 打印代码缓存信息                                               | 用于分析代码缓存的使用情况。                                           |
| `-verbose:gc`                                                                                                                       | 打印 GC 信息                                                   | 提供 GC 的基本信息。                                                   |
| `-Xloggc:/example/dump/${MY_POD_IP}-gc.log`                                                                                         | 设置 GC 日志文件的输出路径                                     | 存储 GC 日志以供后续分析。                                             |
| `-XX:-UseBiasedLocking`                                                                                                             | 关闭偏向锁                                                     | 在竞争激烈的场景下关闭偏向锁可以提高性能。                             |
| `-XX:-UseCounterDecay`                                                                                                              | 关闭计数器衰减                                                 | 在某些情况下可能会影响性能。                                           |
| `-XX:AutoBoxCacheMax=20000`                                                                                                         | 设置自动装箱缓存的最大值为 20000                               | 根据应用程序的自动装箱需求进行调整。                                   |
| `-XX:MetaspaceSize=128m`                                                                                                            | 设置 Metaspace 大小为 128MB                                    | 根据应用程序的元空间需求进行调整。                                     |
| `-XX:MaxMetaspaceSize=512m`                                                                                                         | 设置 Metaspace 的最大大小为 512MB                              | 根据应用程序的元空间需求进行调整。                                     |
| `-XX:ReservedCodeCacheSize=240M`                                                                                                    | 设置代码缓存的保留大小为 240MB                                 | 根据应用程序的代码缓存需求进行调整。                                   |
| `-XX:MaxDirectMemorySize=1024m`                                                                                                     | 设置直接内存的最大大小为 1024MB                                | 根据应用程序的直接内存需求进行调整。                                   |
| `-jar /example/code/server.jar --server.port=8001 --spring.profiles.active=prod --spring.config.additional-location=/example/conf/` | 启动 Java 应用程序                                             | 根据应用程序需求设置相关参数。                                         |

`AutoBoxCacheMax`  参数就是用来定制这个缓存的最大值。如果你设置为 20000，就表示会缓存 -128 到 20000 这个范围内的所有 Integer 对象。因此，对于你那个需求几万的供应商 id 的定时任务来说，可以有效地减少对象的创建开销，从而提高程序的性能。

---

在`-XX:AutoBoxCacheMax=20000`这个例子中，我们要看一下 Integer 对象的大小。

假设你的 JVM 运行在 64 位系统上，那每个 Integer 对象大约占用 16 字节。为什么？因为一个 Integer 对象包括一个 Object header（大约占 12 字节）和实际的 int 值（占 4 字节）。如果你设置的缓存大小为 20000，那内存占用大概为

java

```
(20000 + 128) * 16 bytes = 321.5KB
```

这里的+128 是因为缓存的范围包括了从-128 到 20000 的所有整数。

这就好比你要装 20000 罐饮料，每罐大约 16 毫升，你就需要一个能装 321.5 升的库房。当然，我这么说可能太直白了，引申来看，内存的计算其实和你平时看到的仓库、柜子一样，只不过我们这个柜子装的是数字罢了。

---

当你在系统中频繁地装箱两万个供应商ID，而且没有设定`-XX:AutoBoxCacheMax=20000`这个选项的话，那么对于这两万个Integer对象，Java 并不会进行缓存。也就是说，每次装箱操作都会产生一个新的Integer对象。

  

看起来够爽快，对不对？有多少，就来多少，直接新建一个！但是，这也意味着你的货物（也就是Integer）会在内存中疯狂地扩张。由于不断产生新的对象，这将给Garbage Collector造成更大的压力，因为它需要持续清理那些不再被引用的Integer对象，这自然会带来更大的系统开销。

  

结果就是，你可能会发现应用的性能下降，因为GC变得更加频繁，程序花在清理内存上的时间变得更多。这就好像你开了一家超市，货物太多，需要不断整理和清理，可能会忽视了服务顾客的本职工作。