---
title: solid原则
date: 2024-01-05 22:47:31
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

面向对象的五大原则：single 单一职责/open 开放封闭原则/liskov 里氏替换原则/interface 接口隔离原则/dependency 依赖倒置

1. **单一职责原则（Single Responsibility Principle）**：像一个足球队，每个球员有自己的位置和任务，比如守门员的任务就是阻止对方进球。他们各司其职，这就体现了单一职责原则。
2. **开放封闭原则（Open-Closed Principle）**：当球队进行战术调整时，可以增加新的战术（开放），但是不会去改变已有战术的基本框架（封闭），现有的阵型和策略是保持不变的，这就体现了开放封闭原则。
3. **里氏替换原则（Liskov Substitution Principle）**：无论是中场还是前锋，只要赛事需要，他们可以替换彼此的位置上场比赛，并且完成相应的职责，这就满足了里氏替换原则。
4. **接口隔离原则（Interface Segregation Principle）**：每个球员只需要知道自己需要做什么，比如前锋只关心如何破门得分，而不需要知道守门员如何扑球，这就体现了接口隔离原则，即他们只需要与最小的接口进行交互。
5. **依赖倒转原则（Dependency Inversion Principle）**：所有的决策并不依赖于每个球员，而是依赖于整体的战术策略。这就是依赖倒置原则，也就是细节依赖于抽象，而不是抽象依赖于细节。

这就是一个足球队的原则，每个原则都像是足球场上的一个球员，帮助你编写出合理和高效的代码。

<!--more-->
