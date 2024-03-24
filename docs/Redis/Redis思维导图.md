---
title: Redis思维导图
date: 2024-01-10 10:04:45
tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
mindmap-plugin: basic
---

# Redis

## 比磁盘快的原因
- Redis 基于内存，使用电脉冲的方式
- 其他如 MySQL、hbase 等需要磁盘寻址，从内存再到 CPU，耗时较长

## 数据类型/数据结构/时间复杂度
- string O(1)
	- string（3）
		- int
		- embstr
		- raw
- list O(n)
	- zipList
	- linkedList
- hash O(1)
	- zipList
	- hashtable
- sort set O(logN)
	- zipList
	- skipList
- set O(1)
	- hashtable
	- intset
- 多种数据结构的原因
	- 使用更为紧凑的结构去节省空间，同时查询速度不低
- 新节点

## 全局哈希表
- 结构
	- 表+桶
- 流程
	- 先根据 hash 函数进行取模，获取表的位置
- 时间复杂度
	- O(1)
- 哈希冲突
	- 解决办法
		- 拉链法
			- 当发生哈希冲突就引申出一条链表，放在链表上面，时间复杂度 O(n)
		- rehash
			- 表2进行扩容， 表 1迁移数据到表 2，表 2 迁移结束则下线表 1
			- 渐进式 rehash
				- 原因
					- 一次性迁移数据会导致阻塞
				- 解决方法
					- 一个业务操作顺便迁移一个桶
					- 两个表同时接收增删改的操作
					- 直到表 1 所有数据都迁移完成
					- 下线表 1，设置表 2 为 current