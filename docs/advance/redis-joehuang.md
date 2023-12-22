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
    
    - **链地址法**：当两个或者多个键对应一个下标的时候，我们可以在这个位置存储一个链表，链表中每一个节点对应一个键值对。但这种方式的缺点是，当链表太长时，查找效率将从O(1)变为O(n)。
    - **再哈希法(Rehashing)**：当哈希冲突发生时，我们可以找到下一个可以容纳新元素的位置。这涉及到哈希表的扩容，即当哈希表达到一定填充程度时，我们创建一个更大的哈希表，将所有元素从旧表移动到新表。
    
      
    
- **如何进行Rehash**  
    Rehash涉及创建一个更大的哈希表，并将旧哈希表的所有元素复制到新哈希表，然后释放旧哈希表的内存。但直接Rehash可能阻塞其他操作，直到Rehash完成。
    
- **渐进Rehash**  
    为了解决Rehash的阻塞问题，我们可以在每次对哈希表进行插入、删除或者更新操作时，顺便将旧哈希表的一部分(例如一个bucket)数据移动到新哈希表。这样做能平摊Rehash的计算量，过程被称为渐进Rehash。在渐进Rehash过程中，两个哈希表(旧表和新表)都处于活动状态，对外提供服务。当所有的桶迁移完成后，旧哈希表被下线，新哈希表设置为当前哈希表。



![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353095.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221353118.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221354213.png)


## 单线程
- **  
    多线程适用与不适用应用于什么场景？**  
    适合：多线程适合CPU密集型作业，典型的例子如图形渲染，科学计算等。  
    不适合：多线程并不适合I/O密集型作业，这是因为线程切换的开销在于CPU必须保存上下文，然后加载新线程的上下文，这个开销在I/O密集型作业中可以变得相当大。
    
- **Redis的多线程模块有哪些？**  
    Redis主操作是单线程完成的，不过在一些模块中，Redis使用了多线程。其中包括但不限于持久化(RDB、AOF重写),订阅-发布监听，命令解析以及主从同步。
    
- **Redis如何通过单线程实现高性能？**  
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


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221400493.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403563.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221403148.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221404091.png)


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
