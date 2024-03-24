---
title: 使用Mac线刷小米CC9
date: 2024-03-24 16:55:33
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## 背景

有部安卓手机，提示「文件读写错误，请稍后重试」等原因久久没法解决。深圳的夏天还是比较热的，苹果手机没有红外就算了，安卓手机有红外却装不了遥控软件，一度让我非常头疼。

尝试使用 TWRT 的各种功能进行修复，无果，遂决定重新刷机。因为 windows 电脑不在身边，所以只能使用 mac 电脑了，以前从来没这么玩过，查了下教程，整理教程如下。

## 下载线刷包

我是从[Download Mi CC9/Mi 9 Lite Firmware ROM TWRP (pyxis)](https://mifirm.net/model/pyxis.ttt)的 GLOBAL 标签下，下载了国际版的线刷包，下的是最老版本的 taz 格式的包到 mac 上。

网站提供很多下载链接，实测 premium 的下载地址下载最快，3G 的安装包很快就下完了。

## 解压

下载好之后进行解压，然后打开终端，进入这个包的路径。

## 安装 android-platform-tools

首先打开终端，安装环境。

```shell
brew install --cask android-platform-tools
```

## 进入 fastboot 模式

- 手机已开机使用：adb reboot bootloader
- 没有开机：开机键+音量下长按

## 查看设备连接

拿跟能传输数据的线，这里我用的是移动硬盘的线。连接好手机和 mac，手机进入米兔机器人的 fastboot 界面。

此时输入下面的命令，能够看到设备的设备号，这个设备号复制一下，在下面会有用。

```shell
fastboot devices
```

![Pasted image 20240324170247](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202403242211703.png)

## 运行命令

终端运行线刷包的脚本，最后面的参数是我们的设备号，就可以进行刷机了。

```shell
sh ./flash_all.sh -s d183966f
```

效果如下：
![Pasted image 20240324170914](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202403242211704.png)

## 刷机完成

等待一会儿就会出现刷机完成重启的指令，此时手机就刷完了。
![Pasted image 20240324170958](https://bestkxt.oss-cn-guangzhou.aliyuncs.com/img/202403242211705.png)

## 传输文件

如果需要在 mac 和 Android 之间传输文件，可以在 mac 上安装这个软件，适用于卡刷包的场景。
[Android File Transfer](https://www.android.com/filetransfer/)

## 参考

[mac 下小米刷机 - 简书](https://www.jianshu.com/p/6d03604d2f77)
[Download Mi CC9/Mi 9 Lite Firmware ROM TWRP (pyxis)](https://mifirm.net/model/pyxis.ttt)
