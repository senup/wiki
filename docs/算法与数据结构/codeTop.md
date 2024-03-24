---
title: codeTop
date: 2024-01-04 10:58:08
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

> 滑动窗口，右窗口持续扩大，左窗口遇到频率大于 2 的开始收缩

<!--more-->

[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)

> 链表的下一个的下一个为自己，链表的下一个为递归后的结果。

[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)

> 使用 linkedHashMap 保证插入顺序，put 的时候如果有值就覆盖并提前，容量满了就删除头部元素，再插入尾部；get 不到就返回-1，否则提前到尾部再返回。

[215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

> 使用 priorityQueue 小顶堆，遍历添加 offer，超出 k 就 poll，返回小顶堆的头部 peek.

[25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

> 先写一个两个节点之间的反转链表算法，然后主方法控制 k 批，反转后返回新节点，将原来头节点的指针指向分批后的节点

[15. 三数之和](https://leetcode.cn/problems/3sum/)

> 前后双指针，先写一个两数之和，注意左闭右开，跳过重复元素；主方法遍历，计算当前元素值和两数之和，合并到结果集。

[53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)
> 滑动窗口：扩大窗口的时候实时比较最大值；当窗口和小于零就开始缩小窗口，丢弃值；

> 动态规划：以当前元素为结尾的最大和，然后遍历 DP 数组；


[912. 排序数组](https://leetcode.cn/problems/sort-an-array/)
> 实现快排：定义前序遍历和分区函数，分区函数里面使用随机值获取中点，同时中点移到最后再遍历整个数组进行左右大小的排序。

易错点：记得把分区中点的值抽取出变量，免得下标变换。

[21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

> 双指针走链表

[1. 两数之和](https://leetcode.cn/problems/two-sum/)
> 求下标用 hash map，遍历数组判断当前值等不等于另一半，等于就返回；如果是求值，那么就排序后双指针分三种情况想向。

[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)
> 主函数遍历数组，找到两种中心的回文；子函数使用双指针向外扩张；


[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

> 使用队列，在队列不为空的情况下每次弹出同层的元素，并放入下一层的元素




[33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array)

> 考察二分查找，判断：如果中点和左右两边的关系，然后再判断目标值和中点、目标值和边界来考虑双指针的左右移动


[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
> 嵌套遍历数组然后找到岛屿就抹掉周边，使用 DFS 递归抹除上下左右。

