---
title: joe的Redis
date: 2024-01-10 09:14:41
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

# Redis 持久化 - RDB 和 AOF

## RDB 全量备份

### RDB 基本介绍

RDB 全称 Redis Database Backup file,是 Redis 的一种持久化方式。

它对 Redis 中的数据库状态进行周期性的快照保存,这种快照称为 RDB 文件。RDB 文件包含了一个时间点的所有数据库中的键值对。

RDB 的优点是:

- RDB 是一个紧凑的单一文件,非常适合用于备份和镜像。
- RDB 读取速度快,可以最大限度地减少启动时间。

### RDB 的保存

RDB 保存可以通过两种方式触发:

- 使用 SAVE 命令手动触发。这是阻塞 Redis 主线程的,会停止其他服务,等待 RDB 进程完成。
- 使用 BGSAVE 命令,由后台线程进行 RDB 保存。这是非阻塞方式。

除此之外,还可以通过配置自动触发:

```
save 900 1 #900秒内如果有1个key发生变化,则自动触发bgsave,使用后台线程持久化
save 300 10 #300秒内如果有10个key发生变化,则自动触发bgsave,使用后台线程持久化
save 60 10000 #60秒内如果有10000个key发生变化,则自动触发bgsave,使用后台线程持久化
```

### RDB 文件

每次 RDB 保存会生成一个新的 RDB 文件。RDB 文件是一个紧凑的单一文件,里面包含了给定时间点的所有数据库的数据。

一个 RDB 文件中提供了 Redis 版本号、数据库全部数据快照、数据校验和等信息。文件内容是经过压缩的,非常适合做备份和异地数据传输。

## AOF 增量备份

### AOF 基本介绍

AOF(Append Only File)是另一种持久化方式,它会追加写每一个写命令到一个 AOF 文件中,所以是增量持久化。

与 RDB 在持久化完之后是一个完整的文件不同,AOF 持久化依赖命令日志,可以部分恢复数据。

AOF 的优点是可以最大程度地保证数据不丢失,缺点是文件会变得越来越大。

### AOF 的保存

Redis 提供了三种策略进行 AOF 的刷盘控制:

- **always**: 每个写命令都立即强制写入硬盘,效率最低,数据完整性最好。

- **everysec**: 每秒钟刷盘一次,或当输出缓冲区满时刷盘,是默认策略。

- **no**: 不根据时间频率刷盘,只有系统调用强制刷盘时才刷盘,效率最高,数据完整性最差。

### AOF 重写

为了减小 AOF 文件大小,Redis 提供了 AOF 重写(rewrite)機制,即重新生成一个新 AOF 来替代现有的 AOF。

AOF 重写可以手动触发,也可以通过配置自动触发:

```
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

上面配置表示 AOF 文件大小是上次重写之后大小的两倍并且文件大小超过 64M 时会自动触发。

## RDB 和 AOF 的选择

- 如果对数据完整性要求较高,则应该使用 AOF。

- 如果对性能要求较高,则应该使用 RDB。

- Redis 4.0 开始支持 RDB 和 AOF 的混合使用。可以在一天当中定时生成 RDB 文件,而在 RDB 之间的时间使用 AOF 进行增量保存,这样既保证了完整性,也部分保证了性能。

- 对于内存数据集较大时,建议不要太频繁的生成 RDB 全量备份,否则会消耗很大系统性能。32G 内存时增量备份就比较合适。

- 建议使用后台线程生成 RDB,而 AOF 的刷盘策略则使用每秒或关闭策略。

## 总结

1. RDB 适合备份和恢复大数据集。AOF 适合故障和极端情况下的数据恢复。

2. 在性能要求较高的场景下,可以关闭 RDB 和 AOF,直接使用内存。或仅使用 RDB。在数据要求完整的场景下,可以开启 AOF。

3. 通过配置 RDB 和 AOF 的自动触发策略,可以实现在保证性能的同时兼顾数据可靠性。

4. 合理配置刷盘策略,不要让 RDB 和 AOF 的生成过于频繁影响性能。

<!--more-->
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101039849.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101045658.png)


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202401101049111.png)
