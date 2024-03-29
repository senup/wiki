---
title: RedisObject
date: 2024-01-10 11:14:22
tags:
  - Tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---



# 1.简介

Redis 中的每个 Key-Value 在内存中都会被划分成 DictEntry 以及代表 Key 和 Value 的对象。

DictEntry 包含分别指向 Key 和 Value 对象的指针以及指向下一个 DictEntry 的指针。

Redis 使用 RedisObject 来表示对象，由于 Key 固定是字符串类型，因此使用字符串对象来表示，Value 可以是字符串、列表、哈希、集合、有序集合对象中的一种。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131622.png)

Redis 使用 redisObject 结构来表示对象（存储对象的相关信息）

```

typedef struct redisObject {
unsigned type;
unsigned encoding;
unsigned lru;
int refcount;
void ptr;
}robj;

```

```

type 属性：存储对象的类型（String、List、Hash、Set、ZSet 中的一种）

encoding 属性：存储对象使用的编码方式，不同的编码方式使用不同的数据结构进行存储。

lru 属性：存储对象最后一次被访问的时间。

refcount 属性：存储对象被引用的次数。

ptr 指针：指向对象的地址。

```

使用 type 命令可以查看对象的类型。

使用 object encoding 命令可以查看对象使用的编码方式。

使用 object idletime 命令可以查看对象的空闲时间（即多久没有被访问）

使用 object refcount 命令可以查看对象被引用的次数。

这些命令都是通过 Key 找到对应的 DictEntry，再从 DictEntry 的 value 指针所指的 RedisObject 中进行获取。

# 2.字符串

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131624.png)

Redis 使用 sdshdr 结构来表示字符串对象，并没有直接使用 C 语言的字符串。

struct sdshdr {
int len;
int free;
char buf\[\];
};

len 属性：存储字符串的长度。

free 属性：存储字节数组中未使用的字节数量。

buf\[\]属性：字节数组，用于存储字符。

字节数组中会有\\0 结束符，该结束符不会记录在 len 属性中。

## SDS 相比 C 语言的字符串

C 语言中存储字符串的字节数组其长度总是 N+1（最后一个是结束符），当对字符串进行增长和缩短操作时需要使用内存重分配来重新为对象分配内存。

为了减少内存重分配的次数，Redis 自定义了字符串对象（sdshdr），通过未使用的空间解除了字符串长度与底层数组长度之间的关系，在 SDS 中 buf 数组的长度不一定等于字符串的长度+1，数组里面还可以包含未使用的字节。

通过未使用的空间，SDS 实现了空间预分配和惰性空间释放两种策略，从而减少由于字符串的修改导致内存重分配的次数。

空间预分配：当需要对 SDS 保存的字符串进行增长操作时，程序除了会为 SDS 分配所必须的空间以外，还会为 SDS 分配额外的未使用的空间。

惰性空间释放：当需要对 SDS 保存的字符串进行缩短操作时，程序并不会立即使用内存重分配来回收缩短后多出来的字节，而是使用 free 属性将这些多出来的字节数量记录出来，等待将来使用。

# 3.字典

字典是 Redis 数据库以及 HashTable 编码方式的底层实现。

字典的底层使用散列，同时使用链地址法的方式解决散列冲突，那么最终就是指针数组的形式，数组中的每个元素都是一个指向 DictEntry 的指针。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131625.png)

Redis 使用 dictht 结构来表示散列表

```

typedef struct dictht {
dictEntry table;
unsigned long size;
unsigned long sizemask;
unsigned long used;
}dictht;

```

```

table 指针：指向散列表的地址。

size 属性：存储散列表的大小。

sizemask 属性：用于计算索引值。

used 属性：散列表中节点的个数。

```

Redis 使用 dictEntry 结构来表示散列表中的节点

```

typedef struct dictEntry {
void key;
union{
void val;
uint_tu64;
int64_ts64;
}v
struct dictEntry next;
}dictEntry;

```

key 指针：指向 Key 对象。

value 属性：可以是指向 Value 对象(指针)、uint64_t 整数、int64_t 整数。

next 指针：指向下一个 DictEntry。

Redis 使用 dict 结构来表示字典，每个字典中包含两个 dictht。

```

typedef struct dict{
dictType type;
void privatedata;
dictht ht\[2\];
int rehashidx;
}dict;

```

```

type 指针：指向 DictType，DictType 定义了一系列函数。

privatadata 属性：传给特定函数的可选参数。

ht 数组：长度为 2 的 dictht 数组，一般情况下只会使用 ht\[0\]散列表，ht\[1\]散列表只会在对 ht\[0\]散列表进行 rehash 时使用。

rehashidx 属性：记录 rehash 的进度，如果目前没有进行 rehash 那么值为-1。

```

dictType 的结构（定义了一系列函数）

```

typedef struct dictType{
 unsigned int (hashFunction)(const void key); // H(K)散列函数
void (keyDup)(void privatedata, const void key); // 复制 Key
void (valDup)(void privatedata, const void obj); // 复制 Value
 int (keyCompare)(void privatdata, const void key1 , const void key2); // 对比 Key
 void (keyDestructor)(void privatedata, void key); // 销毁 Key
 void (valDestructor)(void privatedata, void obj); // 销毁 Value
}dictType;

```

## 3.1 在字典中进行查找、添加、更新、删除操作

### 在字典中进行查找

以客户端传递的 Key 作为关键字 K，通过 dict 中的 dictType 的 H(K)散列函数计算散列值，使用 dictht\[0\]的 sizemask 属性和散列值计算索引，然后遍历索引对应的链表，如果存在 Key 相同的 DictEntry 则直接返回，否则返回 NULL。

### 在字典中进行添加和更新

以客户端传递的 Key 作为关键字 K，通过 dict 中的 dictType 的 H(K)散列函数计算散列值，使用 dictht\[0\]的 sizemask 属性和散列值计算索引，然后遍历索引对应的链表，如果存在 Key 相同的 DictEntry 则进行更新，否则创建代表 Key 和 Value 的对象，然后创建一个 DictEntry 并使其分别指向 Key 和 Value 的对象，最终将该 DictEntry 追加到链表的末尾。

### 在字典中进行删除(查到后进行删除)

以客户端传递的 Key 作为关键字 K，通过 dict 中的 dictType 的 H(K)散列函数计算散列值，使用 dictht\[0\]的 sizemask 属性和散列值计算索引，然后遍历索引对应的链表，如果存在 Key 相同的 DictEntry 则进行删除。

## 3.2 散列表的扩容和缩容

由于散列表的负载因子需要维持在一个合理的范围内，因此当散列表中的元素过多时会进行扩容，过少时会进行缩容。

一旦散列表的长度发生改变，那么就要进行 rehash，即对原先散列表中的元素在新的散列表中重新进行 hash。

Redis 中的 rehash 是渐进式的，并不是一次性完成，因为出于性能的考虑，如果散列表中包含上百万个节点，如果一次性完成 rehash 的话，那么有可能导致 Redis 在一定时间内无法正常对外提供服务。

在 rehash 进行期间，每次对字典执行查找、添加、更新、删除操作时，除了会执行相应的操作以外，还会顺带的将 ht\[0\]散列表在 rehashidx 索引上的所有节点 rehash 到 ht\[1\]上，然后将 rehashidx 属性的值加 1。

### 渐进式 Rehash 的步骤

1.为字典的 ht\[1\]散列表分配空间。

若执行的是扩容操作，那么 ht\[1\]的长度为第一个大于等于 ht\[0\].used2 的 2ⁿ。

若执行的是缩容操作，那么 ht\[1\]的长度为第一个大于等于 ht\[0\].used 的 2ⁿ。

2.rehashidx 属性设置为 0，表示开始进行 rehash。

3.在 rehash 进行期间，每次对字典执行查找、添加、更新、删除操作时，除了会执行相应的操作以外，还会顺带将 ht\[0\]散列表在 rehashidx 索引上的所有节点 rehash 到 ht\[1\]上，然后将 rehashidx 属性的值加 1。

4.随着对字典的不断操作，最终在某个时刻，ht\[0\]散列表中的所有节点都会被 rehash 到 ht\[1\]上，此时将 rehashidx 属性设置为-1，表示 rehash 已结束。

在进行渐进式 rehash 的过程中，字典会同时使用 ht\[0\]和 ht\[1\]两个散列表，因此字典的查找、更新、删除操作会在两个散列表中进行，如果在 ht\[0\]计算得到的索引指向 NULL 则从 ht\[1\]中进行查找。



# 5.Redis 中的对象

Redis 中一共包含五种对象，分别是字符串对象、列表对象、哈希对象、集合对象、有序集合对象，每种对象都支持多种编码方式，不同的编码方式之间使用不同的数据结构进行存储。

### Redis 各个对象支持的编码方式

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131635.png)

## 1.字符串对象

字符串对象支持 INT、EMBSTR、ROW 三种编码方式。

### INT 编码方式

如果字符串的值是整数，同时可以使用 long 来进行表示，那么 Redis 将会使用 INT 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131636.png)

INT 编码方式会将 RedisObject 中的 ptr 指针直接改写成 long ptr，ptr 属性直接存储字面量。

### EMBSTR 编码方式

如果字符串的值是字符，同时字符串的大小小于 32 个字节，那么 Redis 将会使用 EMBSTR 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131637.png)

### ROW 编码方式

如果字符串的值是字符，同时字符串的大小大于 32 个字节，那么 Redis 将会使用 ROW 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131638.png)

EMBSTR 和 ROW 编码方式在内存中都会创建字符串对象(SDS)，区别在于 EMBSTR 编码方式中 RedisObject 和 SDS 共同使用同一块内存单元，Redis 内存分配器只需要分配一次内存，而 ROW 编码方式需要单独的为 RedisObject 和 SDS 分配内存单元。



编码转换

如果字符串的值不再是整数或者用 long 无法进行表示，那么 INT 编码方式将会转换成 ROW 编码方式。

如果字符串的值其大小大于 32 个字节，那么 EMBSTR 编码方式将会转换成 ROW 编码方式。

INT 编码方式不能转换成 EMBSTR 编码方式。

### 字符串共享对象

Redis 在启动时会初始化值为 0~9999 的字符串对象作为共享对象，当 set 一个 Key 其 Value 是在 0~9999 范围时，会直接使用该共享对象，DictEntry 中的 value 指针直接指向该共享的字符串对象。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131639.png)

在集群模式中，Redis 的每个节点启动时都会初始化值为 0~9999 的字符串对象作为共享对象。

在 RedisV4.0 以上，使用 Object refcount 命令不再返回共享对象实际被引用的次数，而是直接返回 Integer.MAX_VALUE。

## 2.列表对象

列表对象支持 ZIPLIST、LINKEDLIST 两种编码方式。

### ZIPLIST 编码方式

如果列表对象保存的元素的数量少于 512 个，同时每个元素的大小都小于 64 个字节，那么 Redis 将会使用 ZIPLIST 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131640.png)

### LINKEDLIST 编码方式

如果列表对象保存的元素的数量多于 512 个，或者元素的大小大于 64 个字节，那么 Redis 将会使用 LINKEDLIST 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131641.png)

### 编码转换

如果列表对象保存的元素的数量多于 512 个，或者元素的大小大于 64 个字节，那么 Redis 将会使用 LINKEDLIST 编码方式。

可以通过 list-max-ziplist-entries 和 list-max-ziplist-value 参数，调整列表对象 ZIPLIST 编码方式中最多可以保存元素的个数以及每个元素的最大大小。

## 3.哈希对象

哈希对象支持 ZIPLIST 和 HASHTABLE 两种编码方式。

### ZIPLIST 编码方式

如果哈希对象保存的键值对的数量少于 512 个，同时每个键值对中的键和值的大小都小于 64 个字节，那么 Redis 将会使用 ZIPLIST 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131642.png)

### HASHTABLE 编码方式

如果哈希对象保存的键值对的数量多于 512 个，或者键值对中的键或值的大小大于 64 个字节，那么 Redis 将会使用 HASHTABLE 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131643.png)

### 编码转换

如果哈希对象保存的键值对的数量多于 512 个，或者键或值中的键和值的字符串的大小大于 64 个字节，那么 Redis 将会使用 HASHTABLE 编码方式。

可以通过 hash-max-ziplist-entries 和 hash-max-ziplist-value 参数，调整哈希对象 ZIPLIST 编码方式中最多可以保存元素的个数以及每个键值对中的键和值的字符串的最大大小。

## 4.集合对象

集合对象支持 INTSET 和 HASHTABLE 两种编码方式。

### INTSET 编码方式

如果集合对象保存的元素的数量少于 512 个，同时每个元素都是整数，那么 Redis 将会使用 INTSET 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131644.png)

### HASHTABLE 编码方式

如果集合对象保存的元素的数量多于 512 个，或者元素不是整数，那么 Redis 将会使用 HASHTABLE 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131645.png)

### 编码转换

如果集合对象保存的元素的数量多于 512 个，或者元素不是整数，那么 Redis 将会使用 HASHTABLE 编码方式。

可以通过 set-max-intset-entries 参数，调整集合对象 INTSET 编码方式中最多可以保存元素的个数。

## 5.有序集合对象

有序集合对象支持 ZIPLIST 和 SKIPLIST 两种编码方式。

### ZIPLIST 编码方式

如果有序集合对象保存的元素的数量少于 128 个，同时每个元素的大小都小于 64 个字节，那么 Redis 将会使用 ZIPLIST 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131646.png)

### SKIPLIST 编码方式

如果有序集合对象保存的元素的数量多于 128 个，或者元素的大小大于 64 个字节，那么 Redis 将会使用 SKIPLIST 编码方式。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131647.png)

为了在有序集合中可以快速的进行查找以及范围操作，因此有序集合会同时使用 HashTable 和跳表两种结构来进行维护，HashTable 中的键存储的是元素本身，值存储的是分数，当需要进行查找时，可以以 O(1)的时间复杂度获取到元素的分数，当需要进行范围型操作时，从跳表进行操作。

### 编码转换

如果有序集合对象保存的元素的数量多于 128 个，或者元素的大小大于 64 个字节，那么 Redis 将会使用 SKIPLIST 编码方式。

可以通过 zset-max-ziplist-entries 和 zset-max-ziplist-value 参数，调整有序集合对象 ZIPLIST 编码方式中最多可以保存元素的个数以及每个元素的最大大小。

# 6.Redis 内存分配器

Redis 提供了 jemalloc、libc、tcmalloc 内存分配器，默认使用 jemalloc，需要在编译时指定。

## Jemalloc 内存分配器

jemalloc 内存分配器将内存划分为小、大、巨大三个范围，每个范围又包含多个大小不同的内存单元。

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131648.png)

DictEntry、RedisObject 以及对象在初始化时，Redis 内存分配器都会分配一个合适的内存大小。

如果频繁修改 value，且 value 的大小相差很大，那么有可能会导致已分配的内存空间不足，那么 redis 内存分配器需要重新为对象分配内存，然后释放掉对象之前所占用的内存（不是立即释放，此时属于内存碎片，等待 Redis 的内存清除策略）

# 7.Redis 内存监控

可以使用 info memory 命令查看 Redis 内存的使用情况

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131649.png)

```

used_memory：redis 有效数据占用的内存大小(包括使用的虚拟内存)

uesd_memory_rss：redis 有效数据占用的内存大小(不包括使用的虚拟内存)、redis 进程所占用的内存大小、内存碎片(与 TOP 命令查看的内存一直)

mem_fragmentation_ratio(内存碎片率) = used_memory_rss / used_memory ，由于一般不会使用虚拟内存，同时 redis 进程所占用的内存相对使用的内存来说很少，因此这个比例可以认为是内存碎片率。

mem_allocator：redis 内存分配器，可选 jemalloc(默认)、libc、tcmalloc

```

max_memory 配置的是 Redis 有效数据最大可以使用的内存，由于存在内存碎片，因此 Redis 实际占用的内存大小最终一定会比 max_memory 要大。

## 关于内存碎片率

mem_fragmentation_ratio = used_memory_rss / used_memory ;

当内存碎片率 < 1 时，表示 redis 正在使用虚拟内存，当内存碎片率严重 \> 1，表示 redis 存在大量的内存碎片。

内存碎片率在 1~1.1 之间是比较健康的状态。

## 产生内存碎片的原因

1.如果频繁修改 value，且 value 的大小相差很大，那么有可能导致已分配的内存大小不足，那么 redis 内存分配器需要重新为对象分配内存，之前的内存空间就属于内存碎片。

2.过期和被删除的 Key，先会被标记，此时属于内存碎片，然后等待 Redis 的内存清除策略回收（惰性或主动）

3.大 key。

## 解决内存碎片的方法

1.重启 Redis 服务，会自动读取 RDB 文件进行数据的恢复，重新为对象分配内存。

2.Redis4.0 提供了清除内存碎片的功能

#自动清除
activedefrag yes

#手动执行命令清除
memory purge

# 8.Redis 监视器

![](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101131650.png)

客户端向服务器发送命令请求时，服务器除了会执行相应的命令以外，还会将关于这条命令的相关信息转发给各个监视器。

客户端可以通过执行 monitor 命令让自己变成一个监视器，实时接收服务器当前正在执行的命令的相关信息。

---
