---
title: Hello，MySQL
date: 2023-11-16T08:03:43
tags:
  - tech
  - mysql
  - hello
draft: false
hideInList: false
feature: 
isTop: false
---


# MySQL 概述
在程序员视角看来，用户发送请求到 Java 系统，Java 系统编写 SQL 语句去访问 MySQL 获得数据库的存储数据，进行增删查改。

接下来讲讲其中的一些部件：
- 需要发送网络请求才能进行访问，所以需要引入 **MySQL 驱动**的 jar 包。
- Java 系统部署在 Tomcat 上面，Tomcat 支持多线程请求。Java 线程请求不止一个，不可能等待单个 MySQL 驱动的线程，并且频繁创建会很消耗资源，因此 Java 系统和 MySQL 这两边都引入了**连接池**。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311101415077.png)


按照上面这个图，MySQL 数据库服务器就会收到网络请求，比如一条 SQL。接下来MySQL 服务器这边就会有对应的部件来执行不同的工作：
- 线程：网络请求必须是让线程来处理，所以内部会开启一个工作线程处理。
- SQL 接口：作为接口，负责接收（和处理 SQL）
- SQL 解析器：解析 SQL 语句的含义
- 查询优化器：负责计算出最优的查询路径，或着也叫最优的查询计划
- 执行器：携带者最优查询计划去访问存储引擎，不断查询或者更新语句，直到得出想要的结果。比如查询到一条数据比对符不符合要求，不符合就接着查询
- 存储引擎：真正执行 SQL 语句的地方。这里可以有不同的存储引擎，存储引擎设计了一套先内存后磁盘的机制，确保查询速度足够快并且减轻磁盘访问压力。


<!--more-->


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311101446249.png)


# InnoDB 存储引擎

接下来说下底部存储引擎、内存、磁盘的一个关系。

假设现在有一条更新语句：update t_student set name = "lisi" where id = 1。需要把id=1的张三改名成李四。

## 执行顺序
- buffer pool:直接从磁盘更新文件太慢了，所以引入了缓存池，将磁盘文件读一份后放到内存里面，对内存进行操作会快的多。
- undo 日志：很多时候我们用到了事务，需要回滚。事务回滚就需要知道上一个被覆盖的值是什么，因此就有了undo日志。它的作用是写入数据的旧值，方便回滚。
- buffer pool:写入undo日志后，缓存池就先更新内存里面的数据。
- redo log buffer:在内存里面开辟出新的一块儿地方存放着SQL语句的操作，比如把张三改成了李四。
- redo log:存放在磁盘里面，当buffer在内存写完后就会再开始写磁盘。记录数据比如对“id=1这行记录修改了name字段的值为xxx”


## undo log
假设一个事务里面有4个update的语句，只执行了两个语句，就要回滚，那么此时就需要undo log日志，用来应对增删改回滚的事务。

结构是这样的：![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151551071.png)

根据语句的undo日志可以直接定位到哪张表哪个主键做了什么修改，即可实现事务回滚。



## redo log
为什么需要 redo log 呢？因为相比事务未提交的时候宕机，刷入磁盘的速度较慢，毕竟一个数据页 16kb；redo log 顺序写入较快才几十个字节，重启后再次提交事务即可。因此，使用 redo log 能够让数据库的并发能力更强。

redo log里本质上记录的就是在对某个表空间的某个数据页的某个偏移量的地方修改了几个字节的值，具体修改的值是什么，他里面需要记录的就是<u>表空间号+数据页号+偏移量+修改几个字节的值+具体的值</u>。

日志文件默认就两个，一个写满就覆盖另一个的日志文件。
## **redo log buffer写磁盘的时机控制**
有一个参数：innodb_flush_log_at_trx_commit来控制怎么写入？
- 0代表不写磁盘日志
- 1代表事务提交的时候必须写入redo日志（推荐）✅
- 2代表事务提交后可能过一段时间（比如一秒）再写入磁盘日志

redo log buffer的缓冲机制，，redo 1og在写的时候，都是一个事务里的一组redo log，先暂存在一个地方，完事儿了以后把一组redo log写入redo log buffer。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141654845.png)

写入redo log buffer的时候，是写入里面提前划分好的一个一个的redo log block的，选择有空闲空间的redo log block去写入，然后redo log block写满之后，其实会在某个时机刷入到磁盘里去，如图。

redo log block 写入时间：
- 超过了buffer 一半的空间
- 事务提交的时候
- 后台线程每秒写入
- MySQL 关闭时



## **宕机时机的影响**
- 假设第三步更新内存数据后宕机，那么就没写入磁盘，所以引入了redo日志用来恢复记录。
- 假设第四步做完宕机，那么内存里面的数据就都会丢失，事务也就会回滚，此时问题不大，一般就会报事务出错然后回滚回原来的状态即可。
- 假设第五步事务提交后宕机，那么此时MySQL并没有更新成功，这个时候重启MySQL就能使用redo日志重新进行更新。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311101455891.png)


# Binlog
上面1~4其实都是更新SQL的过程，到了后面几步就是事务提交的一个过程。

其实在第五步redo日志刷入磁盘时，也会同步写入Binlog。这里区别一下概念：
- redo日志是物理上的概念，比如对着内存上的数据页的什么记录，做了什么修改。这个是innodb特有的
- Binlog是逻辑上的一个概念，比如学生表上面id=1的记录，更新后的值是什么。这个是MySQL自己特有的

## Binlog刷入时机控制
参数：sync_binlog
- 0代表先进入OS cache，晚点再刷入磁盘，宕机就会有风险
- 1代表事务提交了，就要强制刷入磁盘✅


## commit标记
第七步里面才会写入commit标记，代表整个事务提交了，如果在之前发生了宕机，那么此时事务都算不成功。

## 两阶段提交
我们来通过一个简单的例子来说明两阶段提交。

假设我们有一个在线购物系统，分布在不同地方的数据库处理订单。一个订单的处理可能涉及到减少库存、扣款等多个数据库的操作。现在我们要确保所有这些数据库的操作要么都成功，要么都失败，以避免因为一部分成功一部分失败导致的问题。

1. **准备阶段：**
    - 订单处理系统的主控制中心告诉每个数据库：“我们有一个订单要处理，你们准备好了吗？”
    - 每个数据库在本地进行准备工作，比如检查库存是否足够、用户账户是否有足够余额等。
    - 如果所有数据库都准备好了，它们会回应：“准备好了！”但此时它们并没有正式执行订单，只是表示可以执行。
2. **提交阶段：**
    - 主控制中心收到所有数据库的回应后，如果都是“准备好了”，那么它告诉它们：“可以执行订单了，大家一起来！”
    - 每个数据库执行实际的订单处理操作，比如减少库存、扣款等。
    - 如果所有数据库都成功执行了订单，它们会回应：“订单执行成功！”
    - 如果有任何一个数据库在执行过程中出了问题，它会回应：“订单执行失败！”
    - 如果所有数据库都成功，主控制中心最终告诉大家：“订单完成！”如果有一个数据库失败，主控制中心告诉大家：“订单取消！”

这样，无论是全部成功还是其中有一个失败，整个订单的状态都是一致的。如果有一个数据库执行失败，所有数据库都会回滚到事务开始的状态，确保数据的一致性。




![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311101536549.png)

7步都完成后，那么就会有后台的线程将内存的脏数据一点点刷入磁盘了。

## 为什么不直接更新磁盘里的数据，而是通过IO线程不定时执行，这与性能和I/O效率有关：

- **性能：** 直接更新磁盘可能导致大量的I/O操作，影响性能。通过使用内存中的Buffer Pool，可以在内存中完成大部分读写操作，减少对磁盘的访问，提高性能。
    
- **事务隔离：** 数据库需要考虑多个事务同时进行的情况，为了保证事务的隔离性，它可能需要在内存中暂存多个事务的修改，最后一次性写入磁盘，而不是每次都即时写入。
    

总体而言，这些概念和机制的引入是为了平衡数据库的性能、可靠性和一致性。虽然增加了一些复杂性，但它们为数据库系统提供了更多的功能和优化选项。


# 机器配置
## Java机器配置
- 2核4G
- 4核8G,每秒钟可以抗下五百左右的并发访问量

## MySQL配置
- 8核16G,每秒钟可以抗下一两千左右的并发访问量
- 16核32G，每秒钟可以抗下三四左右的并发访问量

## 配置题
假设你开发的Java系统部署在一台4核8G的机器上，那么我们假设这个Java系统处理一个请 求非常非常快，每个请求只需要0.01ms就可以处理完了，那你觉得这一台机器部署的Java系统，可以实现每秒抗下几千并发 请求吗？可以实现每秒抗下几万并发请求吗？

如果每个请求只需要0.01毫秒（即10微秒）来处理，那么我们可以通过以下方式来估算它每秒抗下的并发请求量：
1. **计算每个核心的请求数：**
    - 1秒 = 1000毫秒，所以每个核心每秒可以处理的请求数为：1秒 / 0.01毫秒 = 100,000次。
2. **计算总的请求数：**
    - 如果系统有4个核心，那么总的每秒处理请求数为：4核心 * 100,000次/核心 = 400,000次/秒。
根据上述估算，这台4核8G的机器上的Java系统理论上每秒可以处理约40万次请求。
当然，这个估算是基于每个请求处理非常迅速的情况下得出的。实际上，系统的性能可能会受到其他因素的影响，比如内存大小、垃圾回收效率、网络带宽等。因此，在实际生产环境中，最好通过性能测试和基准测试来获取更准确的结果。


## 性能指标
- qps：每秒的请求数
- tps:每秒可处理的事务量，比如事务提交或者回滚的量
- 吞吐量：磁盘每秒可读写的字节数量，比如redo日志写磁盘
- iops:每秒可以执行的随机io请求数量，决定了内存脏数据刷回磁盘的效率
- lantency:磁盘读写延迟
- CPU负载
- 网络负载
- 内存负载

# buffer pool
buffer pool 是个缓存池，大小默认是 128MB。存放在内存里面，里面存放着大量的数据页。
（数据页：和磁盘中的数据页一页页对应起来，需要从磁盘加载到缓存池里面，我们所认知的数据库一行行的数据就是放在数据页里面，数据页是 16kb。）
我们把缓存池里面的数据页叫做缓存页，缓存页上面会有一些描述信息，比如数据页所属的表空间、数据页的编号、缓存页在 buffer pool 中的地址等。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131758446.png)

既然 buffer pool 只是放在内存里面，而内存空间是有限的，那么如果从磁盘加载全部数据会不会导致内存不足？还是说产生了内存碎片？如果有内存碎片，那么怎么才能减少呢？

内存碎片是指规划完缓存页和描述数据后剩下的内存，我们探讨的是如何减少这部分的内存。

## Free 链表
为啥需要这个链表呢？因为我们从磁盘将数据页读到 buffer pool 的时候，我们如果不知道哪些空白的缓存页可以用，就无法去分配内存.

所以这个时候就会把 buffer pool里面空白的所有描述页的描述数据组成一条双向链表，称其为 free 链表。如图所示，多了一个额外的 40 字节的基础节点，存放了多少个空间的节点、引用的开始节点、引用的结束节点。

怎么用这个链表呢？
- 如果数据在内存里面，那么就会有一个数据页缓存，如图右下角。这个时候额外的这个 hash map 的结构，类似 map<磁盘中数据页表空间号+数据页号，缓存页地址>的键值对结构，现在 map 里面找一下，如果有，则直接读，没有就从磁盘读。
- 如果数据在磁盘上面，就是去 free 链表找到一个空闲的缓存页，然后将磁盘上面目标数据页的描述信息写到链表的这个缓存页里面，然后再将 free 链表上的这个节点的双向链表指针变更，使其脱离链表即可。



![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131810137.png)


## flush 链表
这个链表是用来干什么的呢？首先，我们数据库一般是会进行增删查改的操作的，所以会有读写操作，但是基本都是要将磁盘页刷入到缓存页里面，这个时候其实 buffer pool 里面是有大量用于读的缓存页，这些数据页不需要后续写入到磁盘，而数据库也不可能马上写数据到磁盘，所以就出了 flush 链表，用于记录更新了数据的缓存页，目前还是脏页，等待刷入磁盘，结构和使用方法同 free 链表相似。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131824806.png)

## LRU链表
解决了什么问题呢？就是内存空间有限的情况下，我们比如读全表的时候会把巨多的数据页刷入磁盘，那么这个时候 free 链表直接就被耗尽，所以有了 LRU 链表。

LRU链表指的是 least recently use,最近最少使用的意思，如图。每次磁盘读取数据页到内存的时候，会把描述数据放在链表的头部，后面如果有被重新查询或者修改，那么重新放在链表的头部，通过这样控制频率来确保链表尾部的元素就是应该被淘汰的元素。

因此 ，如果 free 链表满了的话，就需要淘汰 LRU 链表最后的一个节点，将其刷入磁盘，以此产生新的 free 链表空白的数据页。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131841866.png)

### 预读机制基础版
预读机制是因为 MySQL 会把可能跟目标数据页关联的相邻数据页一起查了放进缓存页里面，因为这样就可以不用多次从磁盘里面读取了。但是，我们进行全表扫描的时候会将不需要的数据页放在 LRU 链表的头部，而尾部可能是我们真正需要读的，如果此时淘汰了尾部，那么就会出现问题。

预读机制有一个参数是innodb_read_ahead_threshold，默认值是56，意思就是如果顺序的访问了一个区里的多个数据页，访问的数据页的数量超过了这个阈值，此时就会触发预读机制，把下一个相邻区中的所有数据页都加载到缓存里去。


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131853862.png)

### 预读机制冷热分离
有问题就有解决方案。上面就是因为放在一条链表导致出了问题，MySQL 就使用了冷热分离的思想，比如刚加载的时候就放在冷区的头部，然后如果在一秒**后**还有访问，那就放在热区的头部，这样全表扫描的数据就会都在冷区，而热区才是我们经常访问的数据。

冷热区的比例：
innodb_old_blocks_pct参数控制的，他默认是37，也就是说冷数据占比37％。


更进一步的优化：冷热数据要注意预加载。所以LRU链表热区的前四分之一的数据是不会经常改变的，不会一直改动。只有热区后四分之三的数据被重新访问到才会放到热区的头部，这样就减少了最频繁访问的那部分数据频繁变更。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131908164.png)

---

在缓存中同时包含冷热数据（访问频率高和低的数据）的场景，可能会面临以下问题：

1. **资源浪费：** 热数据通常需要更频繁地被访问，而冷数据可能很长时间都不会被访问。将它们放在同一个缓存中可能导致对资源的浪费，因为缓存的大小是有限的。
    
2. **缓存命中率下降：** 冷热数据混在一起，可能导致缓存命中率下降。如果缓存中有很多冷数据，它们会占用缓存空间，降低了热数据的命中率。
    

为了优化这个问题，可以考虑在缓存设计中运用冷热隔离的思想来重构：

1. **冷热数据分离：** 将热数据和冷数据分别放在不同的缓存区域中。这可以通过使用多个Redis数据库（比如使用不同的DB index）或者不同的缓存实例来实现。热数据放在一个容量较小但更快访问的缓存中，冷数据放在一个较大但访问频率较低的缓存中。
    
2. **设置不同的过期策略：** 对于热数据，可以使用较短的过期时间，以确保缓存中的数据总是保持较新。而对于冷数据，可以使用较长的过期时间，以减少对后端数据存储的频繁查询。
    
3. **缓存预热：** 对于热数据，可以在系统启动或者某个时间段内进行缓存预热，将热数据提前加载到缓存中，以提高缓存命中率。
    
4. **动态调整：** 根据实际情况动态调整冷热数据的划分和缓存容量。可以通过监控缓存的访问模式和命中率来进行调整。
    

通过冷热隔离的思想，可以更灵活地管理不同访问模式的数据，提高缓存的效率和性能。这种设计适用于那些有大量数据，但只有一小部分是热点数据的场景。

---

## 工作线程
新增数据的时候，free 链表移除节点，LRU 链表就会在冷区数据头部新增节点。
如果是更新操作，那么 flush 链表也会在头部新增一个节点。

对于 LRU 链表来说，后台其实会启动一个工作线程空闲的时候就开始刷磁盘了，不会等到实在free 链表实在没有节点的时候才刷。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311131934345.png)


## 多个 buffer pool
首先内存小于 1GB只能申请一个 buffer pool，并且多线程访问 buffer pool 也是需要加锁的，因此内存大的话就可以申请多个来优化多线程下的并发能力。比如

［server］
innodb_buffer_poo_size = 8589934592
innodb_buffer_poo_instances = 4

我们给buffer pool设置了8GB的总内存，然后设置了他应该有4个Buffer Pool，此时就是说，每个buffer pool的大小就是2GB。

这个时候，MySQL在运行的时候就会有4个Buffer Pool了！每个Buffer Pool负责管理一部分的缓存页和描述数据块，有自己独立的free、flush、Iru等链表。
这个时候，假设多个线程并发过来访问，那么不就可以把压力分散开来了吗？有的线程访问这个buffer pool，有的线程访问那个buffer pool。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311132320225.png)

# chunk 机制
因为 buffer pool 是机器启动的时候系统自己划分的一块儿连续的内存，所以并不支持系统运行期间动态修改。因此，就有了更为细化的 chunk。

怎么动态调整呢？就是 buffer pool 是由一系列的 chunk 组成。那么只有有单个连续空间内存的 chunk 就可以分配给 buffer pool。比如我们buffer pool现在总大小是8GB，现在要动态加到16GB，那么此时只要申请一系列的128MB大小（固定）的chunk就可以了，只要每个chunk是连续的128MB内存就行了。然后把这些申请到的chunk内存分配给buffer pool就行了。


有个这个chunk机制，此时并不需要额外申请16GB的连续内存空间，然后还要把已有的数据进行拷贝。


> MySQL自然会想办法去做一些优化的，他实际上设计了一个chunk机制，也就是说buffer pool是由很多chunk组成的，他的大小是innodb_buffer_pool_chunk_size参数控制的，默认值就是128MB。
所以实际上我们可以来做一个假设，比如现在我们给buffer pool设置一个总大小是8GB，然后有4个buffer pool，那么每个buffer pool就是2GB，此时每个buffer pool是由一系列的128MB的chunk组成的，也就是说每个buffer pool会有16个chunk。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311132326527.png)


## 容量调节
此时要记住，有一个很关键的公式就是：buffer pool总大小=（chunk大小 * buffer pool数量）的倍数。

比如默认的chunk大小是128MB，那么此时如果你的机器的内存是32GB，你打算给buffer pool总大小在20GB左右，那么你得算一下，此时你的buffer pool的数量应该是多少个呢？
假设你的buffer pool的数量是16个，这是没问题的，那么此时chunk大小 * buffer pool的数量= 16* 128MB =2048MB，然后buffer pool总大小如果是20GB，此时buffer pool总大小就是2048MB的10倍，这就符合规则了。

# 物理结构
## 数据页
虽然用户使用的 MySQL 展示为一条条的 数据库记录，但是每次从磁盘读取一行数据再放到内存，频率会很高，不现实。

所以使用了数据页这个概念，每次加载一个或多个数据页到磁盘上面。

## 变长字段存储

一行数据的存储格式大致如下所示。

<u>变长字段的长度列表，null值列表，数据头，column01的值，column02的值，column0n的值......</u>

比如一行数据有VARCHAR(10) VARCHAR(5) VARCHAR(20) CHAR(1) CHAR(1)，一共5个字段，其中三个是变长字段，此时假设一行数据是这样的：

hello hi hao a a，其中字段设置都可以为 null

实际存储可能是下面这样的：

0x03 0x02 0x05 null值列表 头字段 hello hi hao a a

解释一下，原数据前三个变长字段的长度分别为 5,2,3，但是实际存储是逆序存储。

## null 值存储
null 值列表是 8 位 bit 组成，1 是 0 否，针对的是表字段允许为 null 的字段，逆序且不足补 0。

## 磁盘数据如何还原

看上面的磁盘数据存储格式：
0x09 0x04 00000101 头信息 column1=value1 column2=value2 ... columnN=valueN

首先MySQL 肯定知道了表结构的组成，再了解变长字段和 null 值列表，这个时候再去遍历表结构和尾部的文本信息，就能够推测出变长字段读几位、null 值列表跳过，剩下的定长字段直接读表结构的长度即可。

举个例子，比如我们之前说了一个例子，有一行数据是“jack NULL m NULL xx_schooI”，那么他真实存储大致如下所示：
0x09 0x04 00000101 0000000000000000000010000000000000011001 00000000094C（DB_ROW_ID）
00000000032D （DB_TRX_ID） EA000010078E （DB_ROL_PTR） 616161 636320 6262626262

头消息有 40 位，后续还包含了行的唯一标识、事务 ID、回滚指针，然后才是三个文本数值的编码值

## 行溢出
一行如果超出了数据页的范围，那么就会将数据存储在别的数据页上面，使用一个指针指向新数据页的地址，如果一个数据页放不下，那么就会有多个数据页来进行存放。

这种情况一般是超出了 varchar 的最大范围，以及 blob、text类型字段存储过长。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141559221.png)


## 数据页的结构

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141603272.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141603816.png)

## 数据区
数据表的物理实体是一个叫做表名.ibd 的文件，其中这么多数据页不可能放在一个表空间里面，因此产生了一个中间概念——数据区。

一个表空间有 256 个数据区，每个数据区有 64 个数据页，每个数据页有 16kb 的大小。



从磁盘读取数据页的时候，随机读取一个 extend 里面的一部分数据，指定开始位置和结束位置，取中间的一部分数据，可能这一部分数据就是一个数据页包含的内容，然后再将其刷入内存作为缓存页。


## 随机读和顺序写

执行 select 语句的时候，一般就是随机读的一个代表。此时磁盘文件散落在各处，所以只能使用这种性能较差的方式。同时，更新数据的时候也需要在内存中更新，在磁盘更新的磁盘更大。

另一种是顺序写，比如写 redo log。这种写的方式性能几乎同内存操作一样快。


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141619129.png)

## Linux 读写
Linux的存储系统分为VFS层、文件系统层、Page Cache缓存层、通用Block层、IO调度层、Block设备驱动层、Block设备层，如下图：
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141623678.png)

简单讲下，vfs层相当于一个接口，接到请求就按照不同的类型分发给不同的文件系统。接着在页缓存找下，找不到就转发给通用 block 层，转化成 IO 请求，io 调度层有两种算法，一种是公平算法，讲究先来后到，可能导致请求过大阻塞后来请求；另一种更推荐，就是 deadline 算法，给定一个到期时间，确保所有请求不至于被阻塞。然后 io 调度决定 IO 顺序，选择不同的驱动，去设备层真正执行存储硬件查询。

## RAID
raid ，磁盘阵列技术。就是用来管理多块磁盘之前读写的一种技术，方便磁盘进行拓展，以及决定哪块磁盘进行写入。还有额外的备份技术，如图：
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141629886.png)


这个比较有意思的是，当服务器断电之后，这里有个磁盘缓存设置来进行继续供电，将缓存中的数据写入到阵列中的磁盘上面。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311141631361.png)

## 实战案例
- 问题：数据库无法连接故障的定位，Too many connections
- 核对：Java 系统连接池两台机器最多 400 个连接，排查 MySQL 最大连接数是 241 个（show variables like 'max_connections'）
- 原因：底层的linux操作系统把进程可以打开的文件句柄数限制为了1024了，计算出 214
- 解决：ulimit -HSn 65535


# 事务
接下来介绍解决多个事务并发运行的时候，同时写和同时读写的一些并发冲突的处理机制，包括了MySQL事务的隔离级别、MVCC多版本隔离、锁机制，等等。

## 脏写
所谓脏写，就是我刚才明明写了一个数据值，结果过了一会儿却没了！真是莫名其妙。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151606789.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151606669.png)





## 脏读
事务B去查询了事务A修改过的数据，但是此时事务A还没提交，所以事务A随时会回滚导致事务B再次查询就读不到刚才事务A修改的数据了！这就是脏读。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151608641.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151559113.png)


## 不可重复读
假设有三个事务并发执行，事务a执行期间未提交的时候，因为事务b或c的事务提交的关系读到了三次不同的值。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151603780.png)


## 幻读
两个事务并发执行，事务a第一次查出来数据有十条，结果因为事务b提交了所以事务a第二次查出来有十二条数据。


## 小结
脏写和脏读是在两个事务均未提交前写、读。
不可重复读和幻读是发生在已经提交的事务后。

---

在SQL标准中规定了4种事务隔离级别，就是说多个事务并发运行的时候，互相是如何隔离的，从而避免一些事务并发问题。

这4种级别包括了：read uncommitted（读未提交），read committed（读已提交），repeatable read（可重复读），serializable（串行化）。



## 隔离级别修改
@Transactional（isolation=Isolation.DEFAULT），然后默认的就是DEFAULT值，这个就是MySQL默认支持什么隔离级别就是什么隔离级别。也可以改成Isolation.READ_COMMITTED,Isolation.REPEATABLE_READ, Isolation.SERIALIZABLE几个级别，都是可以的。

## undo log 版本链
就是说数据库的每个行记录都会有一个undo log的版本链，同时行记录中会有两个两个隐藏的字段，描述了当前的事务id和回滚指针。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151623928.png)

## MVCC
这个ReadView呢，简单来说，就是你执行一个事务的时候，就给你生成一个ReadView，里面比较关键的东西有4个。
• 一个是m_ids，这个就是说此时有哪些事务在MySQL里执行还没提交的；
• 一个是min_trx_id，就是m_ids里最小的值；
• 一个是max_trx_jd，这是说mysql下一个要生成的事务id，就是最大事务id；
•一个是creator_trx_id，就是你这个事务的id

每个事务访问行数据的时候都会记录当前的事务id和当前活动的事务id，如果行数据事务id小于等于当前的事务id，那么可以查；如果事务大于或者事务id在当前活动id列表里面，说明事务未提交或者大于当前版本，不可以查，需要顺着版本链往下找。


读已提交的级别每次读数据会生成一个readview，可重复读只会在事务开始的时候生成一个事务，所以读已提交能给读到提交后的数据，而可重复读每次读取的数据都是一样的。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151634199.png)


## 小结
首先我们先要明白，多个事务并发运行的时候，同时读写一个数据，可能会出现脏写、脏读、不可重复读、幻读几个问题。

- 脏写，就是两个事务都更新一个数据，结果有一个人回滚了把另外一个人更新的数据也回滚没了。
- 脏读，就是一个事务读到了另外一个事务没提交的时候修改的数据，结果另外一个事务回滚了，下次读就读不到了。
- 不可重复读，就是多次读一条数据，别的事务老是修改数据值还提交了，多次读到的值不同。
- 幻读，就是范围查询，每次查到的数据不同，有时候别的事务插入了新的值，就会读到更多的数据。
针对这些问题，所以才有RU、RC、RR和串行四个隔离级别。

- RU隔离级别，就是可以读到人家没提交的事务修改的数据，只能避免脏写问题；
- RC隔离级别，可以读到人家提交的事务修改过的数据，可以避免脏写和脏读问题。
- RR是不会读到别的已经提交事务修改的数据，可以避免脏读、脏写和不可重复读的问题；
- 串行是让事务都串行执行，可以避免所有问题。

# 锁机制

共享锁的语法如下：select * from table `lock in share mode`。

查询操作还能加互斥锁：select * from table `for update`。

|锁类型|独占锁|共享锁|
|:-----|:-----|:-----|
|独占锁|互斥|互斥|
|共享锁|互斥|不互斥|
还有就是有另外两个情况会加表级锁。如果有事务在表里执行增删改操作，那在行级会加独占锁，此时其实同时会在表级加一个意向独占锁；如果有事务在表里执行查询操作，那么会在表级加一个意向共享锁。

--- 
LOCK TABLES xxx READ：这是加表级共享锁

LOCK TABLES xxx WRITE：这是加表级独占锁

但是我们接下来就要给大家讲讲，手动加表级共享锁和独占锁，以及更新和查询的时候自动在**表级**加的意向共享锁和意向独占锁，他们之间反而是有一定的互斥关系，关系如下表所示。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151728567.png)

## 数据库性能抖动
问题：
- 缓存页满了，刷入磁盘过慢
- redo log写满去写另一个文件，另一个文件大量变更尚未写入磁盘，于是开始写入
解决:第一个是尽量减少缓存页flush到磁盘的频率，第二个是尽量提升缓存页flush到磁盘的速度。
由于频率没法变，因此采用第二种，用固态硬盘+修改最大flush速率innodb_io_capacity.。


# 索引
## 页分裂
页分裂，就是万一你的主键值都是你自己设置的，那么在增加一个新的数据页的时候，实际上会把前一个数据页里主键值较大的，挪动到新的数据页里来，然后把你新插入的主键值较小的数据挪动到上一个数据页里去，保证新数据页里的主键值一定都比上一个数据页里的主键值大。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151741348.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151741719.png)



## 主键查询
每个数据页的页号，还有数据页里最小的主键值放在一起，组成一个索引的目录。


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151742144.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151806121.png)

## 聚簇索引
如果一颗大的B+树索引数据结构里，叶子节点就是数据页自己本身，那么此时我们就可以称这颗B+树索引为聚簇索引！

## 二级索引
聚簇索引里面的叶子节点存放的是所有字段，而二级索引的索引页里都是页号和最小的索引字段值和主键id。

根据主键id重新回聚簇索引里面查询数据就叫做回表。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151810220.png)

### 二级索引的页分裂

表数据多了，那么二级索引树的数据页就会满，满了就拷贝新的数据页，然后进行主键值的挪动，确保按照主键值排序，此时根页就升级成为了索引页。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311151817023.png)

## 优缺点
好处显而易见了，你可以直接根据某个字段的索引B+树来查找数据，不需要全表搜索，性能提升是很高的。

但是坏处呢？索引当然有缺点了，主要是两个缺点，一个是空间上的，一个是时间上的。
- 空间上而言，你要是给很多字段创建很多的索引，那你必须会有很多棵索引B+树，每一棵B+树都要占用很多的磁盘空间啊！所以你要是搞的索引太多了，是很耗费磁盘空间的。 其次，你要是搞了很多索引，那么你在进行增删改查的时候，每次都需要维护各个索引的数据有序性，因为每个索引B+树都要求页内是按照值大小排序的，页之间也是有序的，下一个页的所有值必须大于上一个页的所有值！所以你不停的增删改查，必然会导致各个数据页之间的值大小可能会没有顺序，比如下一个数据页里插入了一个比较小的值，居然比上一个数据页的值要小！此时就没办法了，只能进行数据页的挪动，维护页之间的顺序。
- 或者是你不停的插入数据，各个索引的数据页就要不停的分裂，不停的增加新的索引页，这个过程都是耗费时间的。

## 排序
MySQL在查询大数据量的时候，是不能用内存来排序的，通常就会基于磁盘文件来排序，filesort，速度很慢，

因此需要`order by 联合索引`，才能解决问题。

## 分组
同上。

## 覆盖索引
需要的字段值直接在索引树里就能提取出来，不需要回表到聚簇索引，这种查询方式就是覆盖索引。

## 回表
有的时候MySQL的执行引擎甚至可能会认为，你要是类似select * from table order by xx1,xx2,xx3的语句，相当于是得把联合索引和聚簇索引，两个索引的所有数据都扫描一遍了，那还不如就不走联合索引了，直接全表扫描得了，这样还就扫描一个索引而已。
但是你如果要是select * from table order by xx1,xx2,xx3 limit 10这样的语句，那执行引擎就知道了，你先扫描联合索引的索引树拿到10条数据，接着对10条数据在聚簇索引里查找10次就可以了，那么就
还是会走联合索引的。


## 索引设计规则
- 写完功能后，了解会进行怎样的查询语句，那么这个时候，第一个索引设计原则就来了，针对你的SQL语句里的where条件、order by条件以及group by条件去设计索引。
- 一般建立索引，尽量使用那些基数比较大的字段，就是值比较多的字段，那么才能发挥出B+树快速二分查找的优势来。
- 为防止索引页分裂过快，性能差，建议两三个索引覆盖全表的查询。
- 自增主键不用uuid等手段，否则也会导致频繁页分裂。
- where 和 order by 不可兼得。毕竟大多数场景用不上同一个联合索引。
- 联合索引拓展索引字段的时候可以巧妙使用in(枚举值)的方法保证最左匹配原则。
- 如果索引字段需要计算，那么就得考虑多冗余一个字段在表里。


# 执行计划

## 性能罗列

|类型|性能|备注 |
|:-----|:-----|:-----|
|const|超高|通过聚簇索引或者二级索引(唯一索引)+聚簇索引回源，比如where id = xx 或者 where unique_name = xx|
|ref|      |普通二级索引，比如where name = xx|
|eq_ref|      |针对被驱动表如果基于主键进行等值匹配，那么他的查询方式就是eq_ref|
|ref_or_null |  |普通二级索引回源，比如where name=xx and name is null|
|range|      |普通索引范围查询，where age > 10 and age< 1|
|index |慢|select的数据在二级索引树上面，因此只扫描二级索引树|
|all|      |全表扫|


## 多表查询
- 警惕笛卡尔积的产生，关联条件要写好，避免select * from table1,table2
- 警惕嵌套循环关联。
- 了解驱动表和被驱动表。

select * from t1 where x1 in （select x2 from t2 where ×3=xxx）这个语句就会先执行子查询的语句，然后生成一张物化表。

如果这个时候t1表的数据大于物化表，那么就全表扫物化表，再对每行数据都到x1这个字段的索引进行查找，如果在就符合条件。

如果这个时候t1表的数据小于物化表，那就全表扫t1，判断每条数据是否都在物化表里面。


## 半连接
当然MySQL对子查询还有进行一种优化——半连接。比如：
select t1.* from t1 semi join t2 on t1.x1=t2.x2 and t2.×3=xxx
当然，其实并没有提供semi join这种语法，这是MySQL内核里面使用的一种方式，上面就是给大家说那么个意思，其实上面的semi join的语义，是和IN语句+子查询的语义完全一样的，他的意思就是说，对于 1表而言，只要在t2表里有符合t1.×1=t2.×2和t2．×3=xxx两个条件的数据就可以了，就可以把t1表的数据筛选出来了。




# 执行计划
### 案例1
explain select * from t1 joint2


extra显示 Using join buffffer (Block Nested Loop) ,代表嵌套循环扫描，每一条进行比对，产生了笛卡尔积。

### 案例2
EXPLAIN SELECT * FROM t1 WHERE X1 IN （SELECT ×1 FROM t2） OR x3='xxxx；

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152202603.png)


因为有两个select语句，所以id有两个。其中select_type有两种，区分了主查询和子查询。对于t2表来说using index，也就是说走了二级索引查询x1；然后主查询有使用x3索引的机会，但是分析成本发现几乎跟全表扫描差不多，可能这个字段区分度不够大，因此决定直接全表扫。

## 案例 3
EXPLAIN SELECT * FROM t1 UNION SELECT * FROM t2

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152208059.png)

第一二行是全表扫描，第三行使用了临时表，说明是因为 union 需要做去重工作。

## 案例 4

EXPLAIN SELECT * FROM t1 WHERE ×1 IN （SELECT ×1 FROM t2 WHERE ×1 = 'xXx' UNION SELECT ×1 FROM t1 WHERE ×1 ='xxX）；

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152228466.png)

这里的 select_type有dependent subquery，就是说这是独立的子查询（子查询中的子查询），另一个 dependent union，子查询中的被 union 连接的表。


## 案例 5

EXPLAIN SELECT * FROM （SELECT X 1, count（ * ） as cnt FROM t1 GROUP BY XI）AS_t1 where knt>10；

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152241604.png)

上面的执行计划里，我们其实应该先看第二条执行计划，他说的是子查询里的那个语句的执行计划，他的select_type是derived，意思就是说，针对子查询执行后的结果集会物化为一个内部临时表，然后外层查询是针对这个临时的物化表执行的。
大家可以看到，他这里执行分组聚合的时候，是使用的index_×1这个索引来进行的，type是index，意思就是直接扫描偶了index_x1这个索引树的所有叶子节点，把x1相同值的个数都统计出来就可以了。
然后外层查询是第一个执行计划，select_type是PRIMARY，针对的table是，就是一个子查询结果集物化形成的临时表，他是直接针对这个物化临时表进行了全表扫描根据where条件进行筛选的。



## select type
- `simple` 单表查询
- `primary` 主查询
- `subquery` 子查询
- `union` union操作下被连接的表
- `union result` union 操作的临时表
- `dependent subquery` 子查询中的子查询
- `dependent union` 子查询中的被 union
- `derived` 内部临时表、物化表



# 执行计划的ref

而执行计划里的 ref 也相对会关键一些，当你的查询方式是索引等值匹配的时候，比如const、ref、eq_ref、ref_or_null这这些方式的时候，此时执行计划的ref字段告诉你的就是：你跟索引列等值匹配的是什么？是等值匹配一个常量值？还是等值匹配另外一个字段的值？

EXPLAIN SELECT * FROM t1 WHERE ×1 ='xXX'

这个语句的执行计划是常量 const。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152249298.png)

EXPLAIN SELECT * FROM t1 INNER JOIN t2 ON t1.id =t2.id；
这个语句的执行计划是 primary，代表 t2 表的主键，被驱动表基于主键进行等值匹配。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152250787.png)

## extra
好，那么我们看看extra的信息，是Using index，这是什么意思呢？其实就是说这次查询，仅仅涉及到了一个二级索引，不需要回表，因为他仅仅是查出来了x1这个字段，直接从index_x1索引里查就行了。
如果没有回表操作，仅仅在二级索引里执行，那么extra里会告诉in是**Using index**。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152253877.png)


**using where** 表示没用到索引或者除了用到索引还用到别的条件。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152254369.png)

这个执行计划也是非常的清晰明了，这里针对t1表去查询，先通过ref方式直接在index_×1 索引里查找，是跟const代表的常量值去查找，然后查出来250条数据，接着再用Using where代表的方式，去使用AND x2='xxx'条件进行筛选，筛选后的数据比例是18%，最终所以查出来的数据大概应该是45条。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152255192.png)


**内存优化多表关联**

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152257050.png)


这个SQL很明确了，他基于x2字段来排序，是没法直接根据有序的索引去找数据的，只能把所有数据写入一个临时的磁盘文件，基于排序算法在磁盘文件里按照×2字段的值完成排序，然后再按照LIMIT 10的要求取出来头10条数据。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152259346.png)


这个SQL里只能对全表数据放到临时表里做大量的磁盘文件操作，然后才能完成对x2字段的不同的值去分组，分组完了以后对不同x2值的分组去做聚合操作，这个过程也是相当的耗时的，性能是极低的。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152300554.png)



## 其他字段
- key_len表示这个字段里面长度最大的长度
- rows表示扫描了多少行
- filtered 是个百分比，代表最终过滤的比例，乘以 rows 能算出过滤后查到多少行

## 生产案例
EXPLAIN SELECT COUNT（id） FROM USers WHERE id IN （SELECT user_id FROM users.extentinfo WHERE latest_login_time < xxxxx）

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152302602.png)

那么这里为什么会跑的这么慢呢？其实很明显了，大家可以想一下，首先他对子查询的结果做了一次物化临时表，落地磁盘了，接着他还全表扫描了users表的所有数据，每一条数据居然跑到一个没有索引的物化临时表里再做一次全表扫描找匹配数据。

解决：引导着让数据库走 id 的主键聚簇索引。

在不影响他语义的情况下，尽可能的去改变SQL语句的结构和格式，最终被我们尝试出了一个写法，如下所示：

```
SELECT COUNT（id）
FROM users
WHERE （id IN （SELECT user_id FROM users_extent_info WHERE latest_login_time < xxxxx） OR id IN
（SELECT user_id FROM users_extent_info WHERE latest Jogin_time <-1））
```

在上述写法下，WHERE语句的OR后面的第二个条件，根本是不可能成立的，因为没有数据的latest_login_time是小于-1的，所以那是不会影响SQL语义的，但是我们发现改变了SQL的写法之后，执行计划也随之改变。


---


select * from products where category="xx' and sub_category='xx' order by id desc limit xx,xx

这其实是一个很稀松平常的SQL语句，他就是用户在电商网站上根据商品的品类以及子类在进行筛选，然后按id倒序排序，最后是分页，就这么一个语句，KEY index_category（catetory，sub_category）肯定是存在的。

此时执行计划具体内容就不写了，因为大家之前看了那么多执行计划，基本都很熟悉了，我就说这里最核心的信息，他的possible_keys里是有我们的index_category的，结果实际用的key不是这个索引，而是PRIMARY！！而且Extra里清晰写了Usingwhere。

为什么呢？它根据了聚簇索引来对一行行的数据进行了过滤，所以是全表扫描。可以推测出 MySQL 计算成本出现了问题。为什么呢？
- 即使找到了分类，也会筛出超多的数据，还要考虑回表、排序等问题
- 运营加了新品类但是下面无商品，于是查询新品类，直接就全表扫描聚簇索引了



```
重写 SQL：select * from products force index（index_category） where category="xx' and sub_category="xx
order by id desc limit xx,xx
```

---
SELECT * FROM comments WHERE product_id ='xx' and is_good_comment='1'ORDER BY id desc
LIMIT 100000,20

也就是说，对这个商品的每一条评论，都要进行一次回表操作，回到聚簇索引里，根据id找到那条数据，取出来is_g00d_comment字段的值，接着对is_good_comment='1'条件做一个比对，筛选符合条件的数据。
但是这个时候扫到了几十万的数据，要做几十万次的回表，还要做 基于磁盘临时文件的ID 倒序再取 20 条。

那么如何对他进行优化呢？其实这个思路，反而就跟我们讲的第二个案例反过来了，第二个案例中基于商品品类去查商品表，是尽量避免对聚簇索引进行扫描，因为有可能找不到你指定的品类下的商品，出现聚簇索引全表扫描的问题。

因此对于这个案例，我们通常会采取如下方式改造分页查询语句：


```
SELECT * from comments a，
（SELECT id FROM comments WHERE product_id ='xx" and is_g00d_comment="1'ORDER BY id
desc LIMIT 100000,20） b WHERE a.id=b.id
```

上面那个SQL语句的执行计划就会彻底改变他的执行方式，他通常会先执行括号里的子查询，子查询反而会使用PRIMARY聚簇索引，按照聚簇索引的id值的倒序方向进行扫描，扫描过程中就把符合`WHERE product_id ='xx'and is_g00d_comment='1'`条件的数据给筛选出来。
比如这里就筛选出了十万多条的数据，并不需要把符合条件的数据都找到，因为limit后跟的是100000,20，理论上，只要有100000+20条符合条件的数据，而且是按照id有序的，此时就可以执行根据limit 100000,20提取到5001页的这20条数据了。

# 主从架构
然后从库上有一个10线程，这个1O线程会负责跟主库建立一个TCP连接，接着请求主库传输binlog日志给自己，这个时候主库上有一个IO dump线程，就会负责通过这个TCP连接把binlog日志传输给从库的IO线程，如下图所示。

接着从库的IO线程会把读取到的binlog日志数据写入到自己本地的relay日志文件中去，然后从库上另外有一个SQL线程会读取relay日志里的内容，进行日志重做，把所有在主库执行过的增删改操作，在从库上做一遍，达到一个还原数据的过程，如下图。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202311152329826.png)

到此为止，想必大家对MySQL主从复制的原理也就有一个基本的了解了，简单来说，你只要给主节点挂上一个从节点，从节点的IO线程就会跟主节点建立网络连接，然后请求主节点传输binlog日志，主节点的IO dump线程就负责传输binlog日志给从节点，从节点收到日志后就可以回放增删改操作恢复数据。
在这个基础之上，就可以实现MySQL主从节点的数据复制以及基本一致，进而可以实现高可用架构以及读写分离架构。