---
title: mysql-joehuang
date: 2023-12-22 13:04:26
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221305083.png)

## 查询语句的执行过程

要理解 MySQL 查询过程，你首先需要知道 MySQL 全过程像一个生产线，由连接器、查询缓存、解析器、预处理、优化器、执行器这 6 个组件组成。

1. 连接器: 这如同冰箱的门，这就是你和 MySQL 数据库之间沟通的桥梁。连接器的作用是建立连接、管理连接、结束连接。MySQL 默认连接空闲时间是 8 小时。
2. 查询缓存: 类似于冰箱中的冷藏层，如果有新鲜食物直接从这里取。如果你的 SQL 查询曾经执行过，这个结果可能会被直接缓存下来。当接收到一个新查询请求时，会先在查询缓存看看之前是否执行过这个语句。如果曾经执行过，这个查询结果就直接返回给客户端。但是，任何表的结构变了，那么缓存就会被清空。额外注意，MySQL 8.0 开始，会默认不开启查询缓存。
3. 解析器: 你可以理解成冰箱中的食材清单。解析器做的工作就是对 SQL 语句进行词法解析和语法解析，验证其正确性并生成对应的解析树。
4. 预处理: 类似食材清洗与切割。它是在生成的解析树基础上进行进一步的处理，确保查询请求符合 MySQL 的规则。
5. 优化器: 等同于对食材的烹饪方式进行规划与选择，这个过程主要是确定执行 SQL 语句的查询计划，比如，判断是先查表 A 还是先查表 B。
6. 执行器: 这就是决定是否打开冰箱，然后逐个取出食材按照配方烹饪的厨师。在所有准备调度完成后，执行器开始执行，依据表的引擎定义，去调用引擎接口。

这样的 MySQL 查询流程就好比如厨师要做菜的步骤：打开冰箱-拿出配方-然后逐个取出食材-确认食材正确性-然后清洗食材-选择烹饪方式-最后开始烹饪菜肴。

## 索引的分类

索引的分类：

1. 数据结构：

   - B-Tree 索引：MySQL 中最常见的一种类型，对于 InnoDB 引擎，数据文件就是按照 B+Tree 组织的，用于处理等值和范围查询。
   - Hash 索引：适用于等值查询，不能用于排序和范围查找。
   - Full-text 全文索引：通常用于实现在有大量文本的字段中查找关键词。

2. 物理存储：

   - 聚簇索引：物理存储顺序和索引顺序一致，一个表只能有一个聚簇索引（InnoDB 的主键索引就是一个聚簇索引）。
   - 非聚簇索引：也称为二级索引，非聚簇索引中的每一个项都会包含对应记录的主键值（也就是聚簇索引的键值）。

3. 字段特性分类：

   - 单列索引：包含单个列的索引。
   - 多列索引：包含多个列的索引，也被称为复合索引。

4. 字段个数：

   - 前缀索引：表的字段过长，可以对其前缀进行索引。
   - 全字段索引：对整个字段进行索引。




首先，确实是有一些情况下我们需要对表进行索引，比如：

1. 在经常需要查询的列上，可以加速查询；
2. 在经常被用来连接的列上，可以加速连接；
3. 在经常出现在 WHERE、GROUP BY、ORDER BY 或 FROM 子句的列上。

而有些情形可能就不太需要索引了：

1. 表记录太少；
2. 列中唯一值（也叫基数）的数目过少；
3. 频繁进行大批量的更新或插入操作的表。

那关于执行计划的字段解释，简单说一下：

1. type: 用于描述 MySQL 对查询的表的访问类型，比较重要的性能判断因素。常见的有: ALL（全表扫描），index（全索引扫描），range（范围扫描），ref（单个或少数值匹配），eq_ref（联合主键匹配），const（常数匹配）等。

然后我们谈谈索引的生效与失效情形。这就像是打乒乓球，你需要知道什么时候发力才能得分。

1. 索引生效：

   - 主键索引：如查询 where id = 1；
   - 二级索引：如查询 where age > 18；
   - 覆盖索引：查询列正好是索引的一部分，如查询 select id, name from users where name = 'test'，假设 (name, id) 上有复合索引。

2. 索引失效：

   - 模糊查询，字段有前缀就会失效，如查询 name like '%test%'（但是 name like 'test%' 筛选条件是可以使用索引的）;
   - 使用函数，如查询 where upper(name) = 'TEST'；
   - 隐式类型转换，当列的数据类型在 where 子句中与比较的值的数据类型不匹配时，索引不会被使用，如 name 这列是 varchar 类型，你运行 where name = 123，索引就不能用了；
   - 联合索引最左匹配原则失败，复合索引 (name, age)， 查询 where age = 18 索引失效。

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221305313.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221307578.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221307333.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221308274.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221307100.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221315071.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221316521.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221317076.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221317074.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221318323.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221319171.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221319907.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221320451.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221320182.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221322019.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221323974.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221323726.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221323060.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221324465.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221324860.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221325412.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221326108.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221325058.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221327839.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221327522.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221328764.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221328148.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221328855.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221329560.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221329908.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221329520.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221330780.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221330562.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221331217.png)
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221332447.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221332282.png)

![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312221333594.png)

<!--more-->
