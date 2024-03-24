import{_ as e,D as c,o as t,c as r,I as l,w as o,k as s,a as n,R as a}from"./chunks/framework.7FlijoJG.js";const b=JSON.parse('{"title":"进程与线程","description":"","frontmatter":{},"headers":[],"relativePath":"计算机基础/操作系统-进程管理.md","filePath":"计算机基础/操作系统-进程管理.md","lastUpdated":1711296414000}'),E={name:"计算机基础/操作系统-进程管理.md"},y=a("",65),i=a("",11),d=a("",29),u=s("li",null,"各进程要互斥地访问管道；",-1),F=s("li",null,"数据以字符流的形式写入管道，当管道写满时，写进程的write()系统调用将被阻塞，等待读进程将数据取走。当读进程将数据全部取走后，管道变空，此时读进程的read()系统调用将被阻塞；",-1),A=s("li",null,"如果没有写满，就不允许读，如果没读空，就不允许写。",-1),m=s("li",null,"数据一旦被读出，就从管道中抛弃，这就意味着读进程最多只能一个，否则可能会有读错数据的情况；",-1),D=a("",16);function h(C,g,f,v,B,_){const p=c("font");return t(),r("div",null,[y,l(p,{size:"3"},{default:o(()=>[n(" **使用信号量实现生产者-消费者问题** ")]),_:1}),i,l(p,{size:"3"},{default:o(()=>[n(" **使用管程实现生产者-消费者问题** ")]),_:1}),d,s("ul",null,[s("li",null,[n("管道只能采用"),l(p,{color:"red"},{default:o(()=>[n("半双工通信")]),_:1}),n("，某一时间段内只能实现单向的传输，如果要实现双向同时通信，则需要设置两个管道；")]),u,F,A,m]),D])}const x=e(E,[["render",h]]);export{b as __pageData,x as default};
