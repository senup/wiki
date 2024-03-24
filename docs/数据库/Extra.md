---
title: Extra
date: 2023-12-28 13:02:19
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

探寻 MySQL 执行计划中的 EXTRA 涵义和相关的 SQL 例子吧：

1. 'Using index'：即只通过使用索引，就可以从表中获取所需的信息。例如：

```
   CREATE INDEX idx_name ON users(name);
   SELECT name FROM users WHERE name='Bob';
```

2. 'Using where'：表示 MySQL 服务器将在存储引擎检索行后再进行过滤。例如：

```
   SELECT * FROM users WHERE age > 30;
```

3. 'Using temporary'：表示 MySQL 需要使用临时表排序查询结果。例如：

```
    SELECT * FROM users ORDER BY age DESC;
```

4. 'Using filesort'：说明 MySQL 会对结果使用一个外部的索引排序，而不是按照表内的索引顺序进行读取。例如：

```
    SELECT * FROM users ORDER BY birth_date;
```

5. 'Using join buffer'：表示在连接表时使用了进程连接缓存。例如：

```
   SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id WHERE users.age > 25;
```

6. 'Impossible WHERE'：查询的 WHERE 子句值永远不会为真，所以没有结果。例如：

```
    SELECT * FROM users WHERE 1=0;
```

7. 'Select tables optimized away'：在无需访问表的情况下优化了 GROUP BY。例如，当仅根据索引查询 MIN()或者 MAX()值时。

<!--more-->

1. 'Using index condition'：表示使用了索引条件推送（Index Condition Pushdown，简称 ICP），和"Using where"工作类似，但效率更高。举个例子，假设有一个下列语句：

```
   SELECT * FROM users WHERE status='active' AND age BETWEEN 20 AND 30;
```

如果字段`status`和`age`上有索引，ICP 会在读取索引时先检查`age BETWEEN 20 AND 30`这个条件，过滤掉不符合条件的记录，减少大量不必要的数据访问。

2. 'Using index for group-by'：意味着 MySQL 使用了索引进行 GROUP BY 操作，而不是创建一个临时表。例如：

```
   CREATE INDEX idx_user_status ON users(status);
   SELECT status, COUNT(*) FROM users GROUP BY status;
```

3. 'Using sort_union'、'Using union' 和 'Using intersect'：这些都代表 MySQL 在处理多个索引的时候所采用的策略。'Using sort_union' 表明使用了排序的并集（Sort Merge）来处理这些索引。'Using union' 表明使用了索引合并（Union）策略。'Using intersect' 表明使用了索引交集策略。举个例子，下面的查询可能会用到：

```
   CREATE INDEX idx_user_name ON users(name);
   CREATE INDEX idx_user_status ON users(status);
   SELECT * FROM users WHERE name='Bob' OR status='active';
```

4. 'Range checked for each record (index map: N)'：对于联表查询，MySQL 在查找的时候会对每一个从先导表中取出的值检查是否使用后续表的索引。例如：

```
   SELECT * FROM users, orders WHERE users.id = orders.user_id AND orders.total > 100;
```

注意，这里的内容并非全部的"extra"部分内容，MySQL 执行计划的 extra 信息可能会随着 MySQL 版本的更新增加一些新的内容。
