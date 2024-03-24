---
title: CompletableFuture
date: 2023-12-25 09:30:56
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

在这个例子里，我们创建了一个异步的任务  `buyTask`，去超市买食材。然后立即开始做饭，做完饭后调用  `buyTask.get()`  确保购物任务也完成了，然后 announce "Dinner's ready!"。注意 buyTask.get() 会等待购物任务完成。

```java
public class CookingDemo {

    public static void main(String[] args) throws Exception {
        CompletableFuture<Void> buyTask = CompletableFuture.runAsync(() -> {
            System.out.println("Assistant is buying the food...");
            sleep(5000);
            System.out.println("Assistant has bought the food.");
        });

        System.out.println("You start cooking...");
        sleep(3000);
        System.out.println("You have finished the cooking.");

//当你调用 `future.get()` 时，如果 future 还没有完成，那么这会阻塞当前线程，直到 future 完成。如果 future 已经完成，`get` 方法会立即返回结果（或者是 `null`，如果 future 的类型是 `CompletableFuture<Void>` 的话）
        buyTask.get();
        System.out.println("Dinner's ready!");
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}

```

---

所有的任务都是并行的，就好像你有两个助手和你一起准备晚餐，提高了效率。

CompletableFuture.allOf 方法允许多个 CompletableFuture 结束后再进行接下来的操作。这就像是你在确认所有的烹饪步骤完成后才会叫大家来吃饭。

```java
public class CookingDemo {

    public static void main(String[] args) throws Exception {
        // Task 1: 助手去超市买菜
        CompletableFuture<Void> buyFoodTask = CompletableFuture.runAsync(() -> {
            System.out.println("Assistant is buying the food...");
            sleep(5000);
            System.out.println("Assistant has bought the food.");
        });

        // Task 2: 助手去买饮料
        CompletableFuture<Void> buyDrinkTask = CompletableFuture.runAsync(() -> {
            System.out.println("Assistant is buying the drink...");
            sleep(3000);
            System.out.println("Assistant has bought the drink.");
        });

        // Task 3: 主厨开始做饭
        System.out.println("You start cooking...");
        sleep(7000);
        System.out.println("You have finished the cooking.");

        // 等待所有任务完成
        CompletableFuture.allOf(buyFoodTask, buyDrinkTask).get();
        System.out.println("Dinner's ready and let's eat!");
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

<!--more-->
