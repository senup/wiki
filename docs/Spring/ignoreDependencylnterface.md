---
title: ignoreDependencylnterface
date: 2024-01-03 12:19:51
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

Spring 的  `ignoreDependencyInterface`  方法用于指定某个接口的自动装配行为被忽略。它在  `AbstractAutowireCapableBeanFactory`  类中定义。当我们设置某个接口被忽略时，Spring 在进行依赖注入时，就不会考虑实现了这个接口的 Beans。

这就好比我们在组织一场聚会时，决定不邀请穿红衣服的朋友（我知道这听起来有点奇怪，但是这只是一个例子啦）。在这种情况下，红衣服就是这个被忽略的"接口"，所有穿红衣服的朋友们（实现了这个接口的 Beans）就不会被邀请参加聚会（也就是不会被自动装配到其他 Beans 中）。

这个方法的使用场景一般包括：

- 当你有一个 Bean A 提供了某种服务，而其他多个 Beans 需要这个服务。你希望所有需要这个服务的 Beans 能自动装配 Bean A。但是，你有一个特殊的 Bean B，虽然它也需要这个服务，却希望通过其他方式获取，而不是自动装配。这种情况下，你就可以对 Bean B 实现一个特殊的接口，并在配置中将这个接口设置为忽略自动装配。

代码示例如下：

```
public class SpecialBean implements IgnoredInterface {
  // ...
}

@Autowired
public class NormalBean {
    private SpecialBean specialBean;
    // ...
}
```

在上述代码中，尽管  `NormalBean`  中有一个  `SpecialBean`  的依赖，但因为  `SpecialBean`  实现了被忽略的  `IgnoredInterface`  接口，所以 Spring 在装配  `NormalBean`时不会自动装配  `SpecialBean`。

这个机制就像一场纷繁的聚会，虽然有着各种各样的角色，但是只有理解了每个角色的规则，我们才能顺利地完成这场聚会。希望这个解释能帮助你更好地理解  `ignoreDependencyInterface`  这个方法，让我们继续在代码的世界里畅游吧！

<!--more-->

如 ApplicationContextAware，ResourceLoaderAware，都是特殊的自动配置接口，它们在 Spring 容器启动和初始化过程中都起着重要作用。当一个类实现这些接口后，它们可以直接访问 Spring Context 中的特定功能。

例如：一个类实现了 ApplicationEventPublisherAware 接口后，可以直接发布事件，一个实现了 EnvironmentAware 接口的类则可以访问系统环境变量等。

Spring 容器在启动的过程中，在执行依赖注入之前，会先调用这些接口的 set 方法，比如 setApplicationContext，setEnvironment，把 Spring Context 中对应的功能设置到这些 Bean 中。

这也意味着，对于实现了这些接口的 Bean，它们实际上已经被 Spring 赋予了特殊的职能，所以，这些 Bean 在普通的依赖注入过程中就被忽略了。

回到我们的问题，我们可以把 ignoreDependencyInterface 看做是一道保护壁垒，阻断了这些特殊 Bean 和其他 Bean 的联系。这样，Spring 在自动配置其它 Beans 时，就不需要去处理这些特殊 Beans 的依赖关系了。

---

既然 Spring 在执行自动装配时，会忽略这些实现了 Aware 接口的特殊 Bean，那么它们就不能在普通的自动装配过程中被执行。那么，Spring 在何时对这些特殊 Bean 进行处理呢？

答案是，在完成 Bean 的实例化之后，Spring 会执行一个叫  `invokeAwareMethods`  的函数，这个函数会对实现了 Aware 接口的 Beans 进行处理。这些特殊的 Bean 们，都会在这个函数中，得到自己需要的资源。

看起来它们就像电影中的主角，虽然有一段时间看似消失在镜头之外，但实际上他们在幕后准备着自己的大场面. 当  `invokeAwareMethods`  这场景到来时，它们便各自走上前台，执行各自的任务。

将这个流程转换成代码，如一个实现了 ApplicationContextAware 接口的 bean:

```
public class MyBean implements ApplicationContextAware {
    private ApplicationContext ctx;

    public void setApplicationContext(ApplicationContext context) {
        this.ctx = context;
    }
    // ...
}
```

当 Spring 创建`MyBean`的实例后，它将调用`MyBean.setApplicationContext`方法，将 ApplicationContext 注入到`MyBean`中，这样，`MyBean`就能在后续的业务处理中，使用 ApplicationContext 中的功能了。同理，对于其他的 Aware 接口，其处理方式也是类似的。
