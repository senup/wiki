---
title: "@SneakyThrows"
date: 2023-12-23 19:25:21
tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

我们就把@SneakyThrows 比作是一个神奇的魔法师吧！

`@SneakyThrows`  是 Lombok 库中的一个注解，它可以让你的 Java 方法"偷偷"地抛出受检异常，即使方法声明不需要你这么做。这就像你有一个会隐形的魔法师，即使规则（在这里是 Java 的受检异常规则）不允许你某些行为，他也能帮你做到。

在我们的编程生活中，经常会遇到需要处理各种各样的例外情况，但是又不想在每个方法上都添加  `throws Exception` ，那么此时就可以祭出我们的`@SneakyThrows` "魔法师"。看，多轻松。

举个例子：

```java
import lombok.SneakyThrows;
import java.io.UncheckedIOException;
import java.io.UnsupportedEncodingException;

public class Test {
    @SneakyThrows(UnsupportedEncodingException.class)
    public void run() {
        // 当发生UnsupportedEncodingException异常时，不需要try-catch或throws声明，真巧妙！
        byte[] bytes = "LemonUnderTree".getBytes("Unsupported encoding");

        if (bytes.length > 128){
            // 自定义异常
            throw new IllegalStateException("Too many bytes!");
        }
    }
}
```

在这段代码中，我们的`@SneakyThrows`帮我们照顾了`UnsupportedEncodingException`，同时在一些逻辑判断中，我们又抛出了自定义的`IllegalStateException`。看到没，我们的魔法师`@SneakyThrows`他不是万能的，他能够偷偷处理受检异常，但是对于我们自定义的这些逻辑异常，我们还需要自己处理。

所以，虽然我们有个会隐形的魔法师，但他并不能替我们做所有的事，还是需要我们自己去面对部分挑战，才能真正地提升编程技巧。

使用`@SneakyThrows`后的代码看上去更加整洁，但是也要注意，不必要的使用它可能会覆盖实际需要你关注的异常，所以请明智使用这个"魔法师"。

<!--more-->
