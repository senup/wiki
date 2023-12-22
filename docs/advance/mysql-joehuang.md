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

---

1. 主键索引（PRIMARY KEY）: 每个表只能有一个主键索引。这就好比咖啡厅里的特调咖啡，每个咖啡厅只能有一个。主键的值必须是唯一的，并且绝对不能为空！
2. 唯一索引（UNIQUE）: 顾名思义，唯一索引要求索引列的值必须唯一，但是可以包含 NULL。在一个表中可以有很多个这样的索引，就像你可以在咖啡店里买到不同口味的咖啡。
3. 普通索引（INDEX）: 普通索引是最基本的索引，没有任何限制。他就像咖啡厅每日供应的黑咖啡，始终在那里，等你品尝。
4. 全文索引（FULLTEXT）: 理解全文索引有点类似于理解一首诗的含义。全文索引用于对文本字段进行索引。它可以简单、高效地找出包含指定词组的记录，通常用于文本搜索。

至于前缀索引，他是一种特殊的普通索引。关键的区别在于，前缀索引只对字段的部分内容建立索引。如果一个字符串列的值非常长，你可以使用前缀索引来节省存储空间。

## 什么情况需要索引

首先，确实是有一些情况下我们需要对表进行索引，比如：

1. 在经常需要查询的列上，可以加速查询；
2. 在经常被用来连接的列上，可以加速连接；
3. 在经常出现在 WHERE、GROUP BY、ORDER BY 或 FROM 子句的列上。

而有些情形可能就不太需要索引了：

1. 表记录太少；
2. 列中唯一值（也叫基数）的数目过少；
3. 频繁进行大批量的更新或插入操作的表。

## 执行计划字段解释

那关于执行计划的字段解释，简单说一下：

### Type

1. type: 用于描述 MySQL 对查询的表的访问类型，比较重要的性能判断因素。常见的有: ALL（全表扫描），index（全索引扫描），range（范围扫描），ref（单个或少数值匹配），eq_ref（联合主键匹配），const（常数匹配）等。

### extra

在 MySQL 的执行计划中，extra 列可以显示关于 MySQL 如何解析查询的一些额外的信息。当你看到“Using filesort”或者“Using temporary”时，你需要理解它们指的是什么。

1. “Using filesort”: 查询需要通过排序操作来获得结果。在这里的 filesort 并不是指使用文件，实际上，filesort 通常会在内存中完成。只有当排序的数据太大，超过了 sort_buffer_size 设置的值，才会使用到磁盘。
2. “Using temporary”: MySQL 需要创建一个临时表来存放查询结果。这通常发生在 Order by 和 group by 列不是同一列的情况。

另外，以下是一些额外的值可能出现在 extra 列：

- "Using index": 该查询直接利用了索引，而无需再次访问表中的数据行，我们通常称之为“覆盖索引”。
- "Using where": 在存储引擎返回表行后使用了 WHERE 过滤条件。
- "Using join buffer": 这意味着 MySQL 使用了连接缓冲区进行了块嵌套循环连接。
- "Impossible where": where 子句中的条件永远不会为真，查询返回结果为空。

## 索引的生效与失效情形

然后我们谈谈索引的生效与失效情形。这就像是打乒乓球，你需要知道什么时候发力才能得分。

1. 索引生效：

   - 主键索引：如查询 where id = 1；
   - 二级索引：如查询 where age > 18；
   - 覆盖索引：查询列正好是索引的一部分，如查询 select id, name from users where name = 'test'，假设 (name, id) 上有复合索引。

2. 索引失效：

   - 模糊查询，字段有前缀就会失效，如查询 name like '%test%'（但是 name like 'test%' 筛选条件是可以使用索引的）;
   - 使用函数，如查询 where upper(name) = 'TEST'；
   - 隐式类型转换，当列的数据类型在 where 子句中与比较的值的数据类型不匹配时，索引不会被使用，如 name 这列是 varchar 类型，你运行 where name = 123，索引就不能用了；
   - 联合索引最左匹配原则失败，复合索引 (name, age)，查询 where age = 18 索引失效。

## 如何优化索引

1.  主键尽量小：尽量使用整数类型，如果可以的话最好使用自增 ID。这是因为更小的列通常更容易查询和处理。
2.  利用最左原则：当创建复合索引时，应该把区分度高的列放在前面。这就像你在看一场电影，之所以看得入神，就是因为导演总是先放置有冲击力的场景。
3.  避免索引失效：尽量避免在索引列上使用函数、隐式转换、OR 等。这可以确保 MySQL 充分利用索引。这就像你在马拉松比赛中，避免穿一双不合脚的鞋子，保证你能尽力发挥。
4.  前缀索引：如果某个 VARCHAR 字段很长，可以选择对其前面的部分建立索引，节省空间。
5.  使用`EXPLAIN`：这个关键词可以帮助我们理解 MySQL 如何处理 SQL，从而找到优化的可能性。这就像你在驾驶赛车时，需要知道自己的每一个动作对车辆动态的影响。

还有一点我要补充，尽量避免过度索引，每个额外的索引都会在插入或更新时带来额外的开销，因为每次插入或者更新行，索引都需要被更新。另外，当表被修改时，索引可能会被破坏，需要定期对其进行优化。

## B+树

B 树和 B+树这两位大哥，就像咖啡和拿铁咖啡一样，都很受欢迎，都是咖啡族的重要成员，但各有各的特点。我讲好这个话题就像泡一杯咖啡，往里加两勺幽默，一点点深度，就可以了。

B 树（Balanced Tree）是一种平衡的多路搜索树，他的全称的意思大概就是“你要是敢在我这棵树上找便宜，我就让你看不到家门口的路”。B 树的每个节点可以有多于 2 个子节点，通过自顶向下、从左到右进行搜索。每一层的所有关键字大致上都是平衡的。

而 B+树在 B 树的基础上，进行了一些优化，他的全称大概就是"我不光平衡，我还漂亮，我是最闪亮的那颗星"。B+树的非叶子节点仅用来索引，不包含实际的数据，所有数据都保存在叶子节点。这意味着每次数据的检索都要走到叶子节点，所以每次搜索的路径长度都相同

他们的主要区别：

1. B 树的每个节点包含键和数据，而 B+树的非叶子节点只有键，真正的数据只存在叶子节点。因此，相同的数据，B+树的索引会更小。
2. B+树的所有叶子节点都是通过指针连接在一起的，这对于全表扫描非常有利。这就像你去喝咖啡，一眼就可以看到所有的咖啡选项，非常方便。
3. B+树的每层节点都相同的关键字数量，因此查询效率稳定。这使得 B+树在数据库中非常受欢迎。

## 举个例子说明 B 树和 B+树的层级情况

你的问题就像一杯热咖啡一样，提起了我的精神！这就是一个很好的例子来说明 B 树和 B+树的层级情况。

假设我们有一张表，有 100 万行数据，每行 1KB，索引是 8 字节的长整形。那么我们来看看对于 B 树和 B+树的情况是怎么样的？

首先，我们来看 B 树。假设 B 树的阶数为 15。那么，

- 在最底层，我们有 100 万个数据项，每个都有一个索引指向。
- 在倒数第二层，我们有 100 万/15 个索引，因为每个索引节点可以有 15 个子节点。
- 同理，再往上一层，我们有 100 万/15/15 个索引。
- 依次类推，最后我们可以算出，这个 B 树的高度为 6 层。

再来看看 B+树。假设 B+树的阶数为 1000，且索引节点与指针占用 16B。

- 在最底层，我们是有 100 万个数据项，每个都有一个索引指向，全都在叶子节点。
- 在倒数第二层，我们有 100 万/1000 个索引，因为每个索引节点可以有 1000 个子节点。
- 同理，再往上一层，我们就只有根节点了，这个根节点可以包含 1000 个索引。
- 所以，最后我们可以算出，这个 B+树的高度为 3 层。

你看，B+树和 B 树的高度差距还是挺明显的。

---

首先，我们想象一下这两种树结构，它们都是从一个根节点开始分叉的，每一个节点都会再分出许多子节点。节点的分支数量也就是我们所说的“阶”。B 树和 B+树在此处的不同就在于，B 树把数据存储在所有节点上，而 B+树只在叶子节点存储数据。

我们来看 B 树的计算，假设阶数是 15：

- 第一层：只有一个根节点。
- 第二层：根节点可以分叉出 15 个子节点，辛辛苦苦，就像是敲打出 15 杯咖啡。
- 第三层：每个第二层的节点再分叉，分出 15 个，也就是 15\*15 个。就像一杯咖啡又分成 15 杯，喝起来似乎永无止境。

想象一下，我们要查找数据，就像从根节点开始，选择一个节点，然后逐层向下，最终找到我们要找的数据。所以，如果我们的数据由 100 万个，那么我们就需要通过这个过程，根据节点数来计算我们要经过多少层。

再来看 B+树：

- 第一层：只有一个根节点。
- 第二层：根节点包含 1000 个索引，相当于 1000 个分叉。
- 第三层：第二层的每个索引都指向一批数据，大大小小，总共有 100 万个数据。

所以，B+树的结构能让我们在少量的步骤内找到我们想要的数据，和找到那杯完美的咖啡一样。

---

让我们跳起来，尝试用一个愉快的例子来说明这两种不同的树型数据结构的计算层级情况。

预备，音乐起！ 让我们假设有一场盛大的音乐嘉年华，正好有 100 万首歌曲在这个数据库中。每首歌曲的数据是 1KB，这就是你的数据页大小。为了便于搜索，我们给每首歌曲创建了一个长整形索引，索引大小是 8B。

那么，首先让 B 树开场吧。假设，我们选择了 15 阶的 B 树。那么，我们的乐章的演变如下:

- 在最底层，我们有 100 万首歌曲，每首都有一个索引。
- 当我们向上爬一层到达倒数第二层，我们将会拥有 100 万/15 个索引，因为每个索引节点可以有 15 个子节点。
- 于是，我们继续上升到倒数第三层，这里有 100 万/15/15 个索引节点。
- 如此持续下去，我们最终找出的是，我们的 B 树将会是 6 层的舞台。

接下来，让我们看看 B+树如何摇滚。假设我们选择了 1000 阶的 B+树，那么每个索引占 16B。乐队的成员变动如下：

- 在最底层，我们的乐队里有 100 万首歌，每首歌曲都有一个索引，全部存放在叶子节点。
- 当我们向上爬到倒数第二层，我们有 100 万/1000 个索引节点，每个索引节点可以有 1000 个子节点。
- 最终，我们在根节点处结束，它包含 1000 个索引。
- 所以我们 B+树的乐团所在的舞台只有 3 层。

所以，你看，无论是 B 树还是 B+树，通过这温馨的音乐嘉年华的比喻，他们的计算层级情况应该清晰很多了吧！

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
