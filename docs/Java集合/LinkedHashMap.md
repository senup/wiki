---
title: LinkedHashMap
date: 2023-12-26 09:50:00
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## LinkedHashMap 的底层工作原理

首先，LinkedHashMap 是 HashMap 的一个子类。它在保持 HashMap 快速查找的哈希表（数组+链表）的基础上，添加了一套双向链表结构，这套双向链表链接了所有 entry，按照插入的顺序排序，这样就实现了访问顺序的有序性。

具体来说，LinkedHashMap 里面的每一个节点（entry），都有两个指针：before 和 after，它们分别指向前一个节点和后一个节点，有点像列车的车厢连接起来。

当我们向 LinkedHashMap 插入一个元素时，新节点将被添加到双向链表的尾部。这就是为什么当你迭代遍历一个 LinkedHashMap 时，元素的输出顺序就是插入顺序。

同时，LinkedHashMap 还可以通过设置参数 accessOrder 来决定迭代顺序。默认情况下，accessOrder 为 false，表示按照插入顺序迭代。如果设置 accessOrder 为 true，那么每次通过 get()或 put()访问到一个元素时，这个元素就会被移到双向链表的最后，从而实现了按照访问顺序进行迭代。

总的来说，LinkedHashMap 通过内部维护一个双向链表，使得元素在遍历时，能按照一定的顺序（插入顺序或访问顺序）进行，从而实现了元素的有序性。
![image.png](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202312260950917.png)

<!--more-->

## 数据举例

假设有一个 LinkedHashMap，里面存了三个键值对：("A", 1), ("B", 2), ("C", 3)。我们可以假设这个 LinkedHashMap 的哈希表（数组）大小为 5，它如下：(每条链表代表一个哈希桶)

```
哈希表 (数组):
0：null
1：Entry[ hash=1, key="A", value=1, next=null, before=header, after=Entry["B",2] ]
2：Entry[ hash=2, key="B", value=2, next=null, before=Entry["A",1], after=Entry["C",3] ]
3：Entry[ hash=3, key="C", value=3, next=null, before=Entry["B",2], after=header ]
4：null
```

其中"hash()"函数返回 key 的哈希值，我们假设"A", "B", "C"的哈希值刚好分别映射到数组索引 1, 2, 3。在每个 Entry 里，除了 key 和 value 外，next 指向同一哈希桶内的下一个 Entry（本例中每个哈希桶只有一个 Entry，所以 next 为 null）。

现在，我们再来看 LinkedHashMap 特有的双向链表结构，如下：

```
header <--> Entry["A",1] <--> Entry["B",2] <--> Entry["C",3] <--> header
```

header 是 LinkedHashMap 特有的一个头节点，所有插入的 Entry 都会在 header 和它的前一个节点（before）之间加入双向链表。这样，Entry 在双向链表中的顺序就表示了它们的插入顺序。

通过上面的例子，你可以看见 LinkedHashMap 其实是哈希表和双向链表的结合。哈希表给我们带来了快速的查找和插入，而双向链表帮我们记住了键值对的插入顺序。

## 操作

1. **存数据（新增或修改）**

LinkedHashMap 存数据主要是通过`put()`函数完成的，当我们调用`put()` 函数将键值对插入到 LinkedHashMap 中时，会首先调用父类 HashMap 的`put()`函数，利用哈希表（数组+链表）进行高效的插入。然后 LinkedHashMap 会将新插入的节点添加到维护的双向链表的尾部。

而如果是修改数据，那么就不需要改变双向链表的结构，只需要修改相应节点的值就可以了。

2. **取数据**

取数据是通过`get()`函数完成的。同样地，我们首先会调用 HashMap 的`get()`函数去哈希表中找到对应的元素。如果设置了 accessOrder 为 true，在每次获取元素值后，还需要将被访问的节点从双向链表中摘出来，然后再插入到双向链表的尾部，这样使得最近被访问过的元素总是最后被迭代访问。

3. **删数据**

删除数据就直接调用`remove()`函数就好了，这里也先通过 HashMap 的`remove()`函数从哈希表中将元素删除，然后再修改双向链表中相应节点的前后指针，就把链表中的节点也删除掉了。

总的来说，LinkedHashMap 利用了 HashMap 的快速查找特性，并通过内部维护一个双向链表，增强了对插入顺序或者访问顺序的记忆，使得我们在必要时可以按照一定的顺序高效地进行迭代。


## 参考
[Java LinkedHashMap工作原理及实现 | Yikun](https://yikun.github.io/2015/04/02/Java-LinkedHashMap%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/)