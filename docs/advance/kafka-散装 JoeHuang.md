---
title: kafka-散装 JoeHuang
date: 2023-12-22 12:35:10
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---
## 消息中间件的作用

### 三大特性

#### 解耦

生产者不需要直接对接消费者

#### 异步
生产者发送消息，消费者去同步消费消息
中间件天然，可以消费者不需要同步消息，生产者继续异步生产

#### 削峰

## 消费队列的两种通信方式

画个图表示下

点对点（kafka）

拉取方式

优点：完全适配消费速度，不会占满消费者内存缺点：消费者去监听队列数据情况，性能消耗；；监听间隔
消费订阅方式

推送方式

优点：充分利用到消费者性能，消费者不需要进行监听缺点：可能会撑爆消费者内存，堆积消费者；；缓冲区


对比下 rabbitmq 的拓扒图


## 核心组件


和 Zookeper


![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221249807.png)




<!--more-->