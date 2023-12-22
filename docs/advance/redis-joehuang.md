---
title: redis-joehuang
date: 2023-12-22 13:50:55
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## redis 数据结构底层实现概述

- **为什么 Redis 的内存数据存储比磁盘快?**  
   内存中的数据以电子方式进行存储和运行，相比硬盘的机械旋转寻址方式，读写速度更快，延迟更低。再者，内存是 CPU 直接访问的存储媒介，相比硬盘需要通过 I/O 操作，这样进一步提高了速度。
- **Redis 的数据类型**  
   Redis 主要支持五种数据类型：string(字符串)，list(列表)，hash(哈希)，set(集合)，zset(有序集合)。各种数据类型都有其独特的应用场景，可以处理大部分的业务需求。
- **Redis 的数据结构**  
   在 Redis 的内核实现中，它使用了如下的六种数据结构:SDS(简单动态字符串)，双端链表，字典，跳跃列表，压缩列表和 intset(整数集合)。这六种数据结构是底层实现，对 Redis 的性能优化起着决定性的作用。
- **为什么数据类型与数据结构存在一对多的关系**  
   这主要是因为在不同的场景和条件下，Redis 选择了不同的数据结构来存储数据以达到最优的性能。例如，当列表元素较少且都是数字时，Redis 用 intset 这种紧凑的结构来存储以节省空间。而在元素较多或者非数字时，Redis 则用双端链表来存储，以利于两端插入和删除。同样，字符串类型在存储时也可能选择 SDS 或者 int 类型，取决于具体情况。

<!--more-->

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221351621.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221351478.png)

## 全局哈希表与哈希冲突

1. **全局哈希表**  
   全局哈希表是 Redis 中非常重要的数据结构，在 Redis 数据库中，所有的键值对都被全局哈希表保存，每一个数据库都有一个自己的全局哈希表。这种数据结构可以使我们在 O(1)的时间复杂度内定位到我们想要的数据，从而提高查找效率。
2. **哈希冲突**  
   哈希冲突发生在两个不同的键通过哈希函数计算得到了相同的结果，即他们在哈希表中的位置是相同的。造成哈希冲突的原因主要有两个，一是键的数量大于哈希槽的数量，二是哈希函数不能保证每一个键都会映射到一个独立的槽。
3. **解决哈希冲突的两种方法**  
   一种是链地址法，即同一个哈希槽中的多个键值对以链表的形式存储。另一种是开放寻址法，当哈希冲突发生时，寻找下一个空的哈希槽存储数据。
4. **Rehash 与渐进式 Rehash**  
   当哈希表中元素多到一定程度或者少到一定程度，我们就需要对哈希表进行扩容或者缩容。此过程称为 Rehash。Rehash 过程会创建一个新的哈希表，并把旧哈希表的数据全部迁移到新哈希表，完成后旧哈希表被释放。

渐进式 Rehash 是为了解决 Rehash 在数据量大时会导致服务阻塞的问题。在任意一次对哈希表的增删改查操作时，程序都会顺带把旧哈希表中的一部分或者全部键值对搬移到新哈希表中，当搬移完所有键值对之后，旧哈希表被释放，新哈希表开始提供服务。

---

- **为什么会有哈希冲突**  
   全局哈希表中的"键"(key)通过哈希函数映射到哈希表的位置，也就是"下标"。然而，由于哈希表的大小是有限的，假设有无限多的"键"，一定会存在多个键经过哈希函数映射到同一位置的情况。这种情况就是哈希冲突。
- **如何解决哈希冲突**
  - **链地址法**：当两个或者多个键对应一个下标的时候，我们可以在这个位置存储一个链表，链表中每一个节点对应一个键值对。但这种方式的缺点是，当链表太长时，查找效率将从 O(1)变为 O(n)。
  - **再哈希法(Rehashing)**：当哈希冲突发生时，我们可以找到下一个可以容纳新元素的位置。这涉及到哈希表的扩容，即当哈希表达到一定填充程度时，我们创建一个更大的哈希表，将所有元素从旧表移动到新表。
- **如何进行 Rehash**  
   Rehash 涉及创建一个更大的哈希表，并将旧哈希表的所有元素复制到新哈希表，然后释放旧哈希表的内存。但直接 Rehash 可能阻塞其他操作，直到 Rehash 完成。
- **渐进 Rehash**  
   为了解决 Rehash 的阻塞问题，我们可以在每次对哈希表进行插入、删除或者更新操作时，顺便将旧哈希表的一部分(例如一个 bucket)数据移动到新哈希表。这样做能平摊 Rehash 的计算量，过程被称为渐进 Rehash。在渐进 Rehash 过程中，两个哈希表(旧表和新表)都处于活动状态，对外提供服务。当所有的桶迁移完成后，旧哈希表被下线，新哈希表设置为当前哈希表。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353095.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353118.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221354213.png)

## 单线程

- **  
   多线程适用与不适用应用于什么场景？**  
   适合：多线程适合 CPU 密集型作业，典型的例子如图形渲染，科学计算等。  
   不适合：多线程并不适合 I/O 密集型作业，这是因为线程切换的开销在于 CPU 必须保存上下文，然后加载新线程的上下文，这个开销在 I/O 密集型作业中可以变得相当大。
- **Redis 的多线程模块有哪些？**  
   Redis 主操作是单线程完成的，不过在一些模块中，Redis 使用了多线程。其中包括但不限于持久化(RDB、AOF 重写),订阅-发布监听，命令解析以及主从同步。
- **Redis 如何通过单线程实现高性能？**  
   一个非阻塞的 I/O 模型是 Redis 达到高性能的关键。使用 epoll（在 Linux 下）等高效的 event multiplexer 来同时监听多个 socket，当其中一个 socket 准备好进行 I/O 时，便进行相应的读写操作。即使在单线程中，也能达到高并发的效果

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221355344.png)

## 数据结构详解

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221355610.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221356868.png)

## 字符串类型

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221356191.png)

## 列表类型

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221357044.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221358297.png)

## 哈希类型

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221358558.png)

## set 类型

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359899.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359284.png)

## zset 类型

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359004.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221359732.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221400043.png)

## 持久化

你的问题让我想起了一句名言：“Redis 的数据反复磨练，如同美食家的餐桌上的饕餮美食，需要一次次的烹饪”。持久化正是这个烹饪过程的关键步骤。

通过存储数据到硬盘，Redis 可以保证即使在服务器故障等极端情况下也不会丢失数据，这就是我们通常所说的“持久化”。

**RDB(Redis DataBase)**  是 Redis 提供的一种持久化方式，他会在指定的时间间隔内生成数据集的时间点快照。具体来说：

1. **如何进行 RDB 持久化**：有两种方式。

   - **SAVE**：SAVE 操作会阻塞 Redis 服务器进程，直到持久化过程完成为止，在这期间，Redis 不能处理任何命令请求。
   - **BGSAVE**：BGSAVE 操作会创建一个子进程来进行持久化操作，持久化过程结束之后，子进程会发送一个信号给父进程告知持久化操作已经完成，这期间，Redis 是可以处理命令请求的。

2. **如何触发 RDB 持久化**：

   - **手动触发**：通过执行 SAVE 或 BGSAVE 命令。
   - **自动触发**：我们可以通过配置 Redis 的配置文件，设置一系列的条件，进行自动 RDB，如 "save 900 1" 表示 900 秒内如果至少有 1 个 key 被修改, 那么就自动触发 BGSAVE 进行持久化。

记住，持久化虽好，不过也得注意，持久化的过程中如果数据量过大，可能会导致一些性能问题哦，毕竟，每个厨师烹饪美食的速度都是有限的。哈哈~！

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221400493.png)

## AOF

AOF(Append Only File)，字面意思就是只追加文件，就像烹饪美食一样，每一个精妙的步骤都不能囿于包含，只能一步一步地记录下来。让我们深入了解一下 AOF:

1. **什么是 AOF 持久化**：AOF 持久化是通过保存 Redis 执行过的所有写操作命令来记录数据库状态的。服务器在重启时，会通过重新执行保存在 AOF 文件中的命令来达到重建数据库的目的。
2. **BGREWRITEAOF 命令**：随着 Redis 的运行，AOF 文件的体积会持续增大，进行 AOF 重写，可以把 AOF 文件内容进行压缩，删除无用和重复的命令，缩小 AOF 文件的大小。Redis 提供了 BGREWRITEAOF 命令用于在后台线程进行 AOF 文件的重写。
3. **何时触发 BGREWRITEAOF**：

   - **手动触发**：直接使用 BGREWRITEAOF 命令。
   - **自动触发**：Redis 会记录上次重写后 AOF 文件的大小，只要当现在的 AOF 文件大小是上次重写后 AOF 文件大小的一倍（这个值是可以配置的），并且 AOF 文件的大小超过了设置阈值，默认值为 64MB，Redis 就会自动触发 BGREWRITEAOF。

4. **AOF 的刷盘策略**：

   - **always (总是)**：每次有数据修改时都立马写入磁盘。最安全，但效率最低。
   - **everysec (每秒)**：每秒钟写入磁盘一次，在安全与效率之间进行平衡，也是默认选项及推荐选项。
   - **no (从不)**：完全依赖操作系統，数据由系统的缓冲区异步写入磁盘，Redis 不主动触发写入操作。写回的时间会更长，但效率最高。

这样，AOF 就像是一个烹饪日记，记录了每一道美味的制作过程。记住，AOF 的大小可能像奶酪一样，随着时间的流逝会变得越来越大，所以定期的进行 BGREWRITEAOF 操作就显得尤为重要啦。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403563.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403148.png)

## redis 常见问题

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221405764.png)

## 布隆过滤器

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221405677.png)

## 缓存一致性

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221406253.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221406057.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221407322.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221407710.png)

## 分布式锁

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221408136.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221409590.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221409165.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221410581.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221410953.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411899.png)

## redis 性能优化

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411263.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221411141.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221412767.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221412462.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221413879.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221413856.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414106.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414453.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414825.png)

## acid 特性

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221414141.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221415200.png)

## 哨兵

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221415401.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221416559.png)
