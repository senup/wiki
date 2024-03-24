---
title: githooks钩子函数
date: 2023-12-23 19:44:54
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---
作用：可以将开发、测试环境的分支名添加到黑名单列表中，这样做合并的时候不会出现误合并黑名单分支。

```shell
#!/bin/sh 

# 设置黑名单分支列表，按需添加其他分支名
BLACKLIST=("branch1" "branch2")

# 初始化禁止合并的分支哈希值列表
forbid_list=() 

# 如果存在 .git/MERGE_HEAD ，表明当前正处在合并状态
if [[ -e .git/MERGE_HEAD ]]; then 
    # 遍历黑名单分支列表
    for bl in "${BLACKLIST[@]}"; do 
        # 检查黑名单分支是否存在
        if [[ -e .git/refs/heads/${bl} ]]; then 
            # 如果存在，获取该分支最新commit的哈希值，存入禁止合并列表
            forbid_list+=(`cat .git/refs/heads/${bl}`) 
        fi
    done 
    # 获取当前合并操作引入的commit的哈希值
    merge_head=`cat .git/MERGE_HEAD` 
    # 遍历禁止合并的分支哈希值列表
    for br in "${forbid_list[@]}"; do 
        # 检查当前合并操作是否涉及到禁止合并的分支
        if [[ ${merge_head} == ${br} ]]; then 
            # 若涉及，则输出警告信息，并要求执行 git merge --abort 命令取消合并
            echo -e "\033[41;37m Attempt to merge a branch from the blacklist \033[0m\n\r" 
            echo -e "\033[41;37m Please use the command 'git merge --abort' to cancel the merge \033[0m" 
            # 终止脚本运行，中止提交操作
            exit 1 
        fi 
    done 
fi

```


保存此脚本为`.git/hooks/prepare-commit-msg`文件，并运行`chmod +x .git/hooks/prepare-commit-msg`使其具备执行权限。记得每次合并操作时使用`--no-ff`选项。你可以通过`git config --global alias.m 'merge --no-ff'`命令设置别名，方便后续的非快进合并操作。

<!--more-->