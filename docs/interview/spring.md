### Spring 中的模块

在 Spring 框架中，各个模块提供了不同的功能，主要包括以下几个核心模块：

1. **Spring Core Container**：核心容器模块提供了 Spring 框架的基础功能，包括 IoC（控制反转）和 DI（依赖注入）等核心特性。主要包括：

   - **Beans**：管理应用中的对象（Bean）的创建、配置和管理。
   - **Core**：提供核心工具类和基础支持，比如资源加载、类型转换等。
   - **Context**：建立和访问 Bean 的上下文，提供高级特性如事件传播、国际化等。

2. **Spring AOP**：提供面向切面编程（AOP）的支持，允许在程序中通过切面的方式进行横切关注点的处理，如事务管理、日志记录等。
3. **Spring JDBC**：简化数据库访问，提供了对 JDBC 的封装和抽象，支持声明式事务管理。
4. **Spring ORM**：提供了对 ORM 框架的集成支持，包括对 Hibernate、JPA、JDO 等的支持。
5. **Spring Web**：提供了构建 Web 应用程序所需的上下文、Web MVC、WebSocket、Web Socket 等模块。
6. **Spring Test**：为单元测试和集成测试提供支持，包括对 Junit 和 TestNG 的支持。

除了这些核心模块之外，Spring 还有一些附加的模块，如 Security（安全）、Data（数据访问）、Boot（快速启动）、Cloud（云计算）、Batch（批处理）等，这些模块提供了更丰富的功能扩展和集成支持，以满足不同应用场景的需求。

### Bean

在工作中，Spring Bean 是指由 Spring 容器管理的对象。我通常使用 `@Component`、`@Service`、`@Repository` 或 `@Controller` 等注解来标记一个类，使其成为一个 Spring Bean。这些 Bean 可以通过依赖注入来相互引用，帮助构建应用的组件化结构。一个典型的案例是在一个 Web 应用中，使用 `@Service` 来标记服务层，然后通过 `@Autowired` 将服务注入到控制器中，实现业务逻辑的分离和重用。

Spring Bean 是由 Spring 容器管理的对象实例，其目的是帮助实现松耦合、可维护和可测试的应用。Spring 容器负责 Bean 的生命周期和依赖注入。它们的实现原理是在应用上下文中注册 Bean 定义，根据配置或注解创建和管理 Bean 实例。优势在于提供了灵活的依赖注入方式，但可能存在的局限是配置过多可能导致复杂性增加。未来，Spring 会继续演进，优化注解驱动的开发和简化配置。

### Spring 中 bean 的作用域

Spring 框架中的 Bean 作用域定义了 Bean 实例的生命周期范围和可见性，它们决定了在不同情况下创建和销毁 Bean 实例的方式。Spring 提供了以下标准的作用域：

1. **Singleton**（默认）：单例作用域的 Bean 在整个应用程序上下文中只有一个实例。每次对该 Bean 的请求都会返回同一个实例。在应用启动时创建，在应用关闭时销毁。
2. **Prototype**：原型作用域的 Bean 每次请求时都会创建一个新的实例。不同请求返回不同的实例。Spring 不管理该 Bean 的生命周期，需要手动销毁。
3. **Request**：请求作用域的 Bean 在每次 HTTP 请求时创建一个新实例，并且该实例仅在当前 HTTP 请求内有效。适用于 Web 应用程序。
4. **Session**：会话作用域的 Bean 在用户会话创建时创建一个实例，当会话结束时销毁。适用于 Web 应用程序。
5. **Application**：应用作用域的 Bean 在 ServletContext 初始化时创建一个实例，在 ServletContext 销毁时销毁。适用于 Web 应用程序。

除了这些标准作用域外，还可以自定义作用域。自定义作用域需要实现`org.springframework.beans.factory.config.Scope`接口，并将其注册到 Spring 应用程序上下文中。

作用域的选择取决于应用程序的需求。例如，Singleton 适用于共享的、无状态的 Bean，Prototype 适用于状态变化较多的 Bean，而 Request 和 Session 适用于 Web 应用程序中与请求和会话相关的 Bean。

### Bean 的流程

Spring 中 Bean 的生命周期主要由容器来管理，涉及创建、初始化、使用和销毁等阶段。以下是 Bean 的生命周期大致流程，简要说明其源码层面的实现：

#### 1. 加载 Bean 定义：

- **资源定位**：Spring 会读取配置文件或注解信息，将 Bean 的定义信息加载到内存中。
- **BeanDefinition**：创建 BeanDefinition 对象，记录了 Bean 的属性、依赖等信息。

#### 2. 创建 Bean 实例：

- **实例化**：根据 BeanDefinition 中的信息，使用反射或其他方式创建 Bean 的实例。
- **构造函数注入**：通过构造函数注入依赖。

#### 3. 属性设置（依赖注入）：

- **属性注入**：容器通过自动装配或配置文件中的配置，将属性注入到 Bean 中。
- **Aware 接口回调**：如果 Bean 实现了 Aware 接口，容器会回调相关方法，让 Bean 得知容器的存在。

#### 4. Bean 初始化：

- **初始化前处理（BeanPostProcessor）**：执行所有注册的 BeanPostProcessor 的`postProcessBeforeInitialization`方法。
- **初始化方法调用**：如果 Bean 配置了初始化方法（如@PostConstruct 注解），容器会调用这些方法进行初始化。
- **初始化后处理（BeanPostProcessor）**：执行所有注册的 BeanPostProcessor 的`postProcessAfterInitialization`方法。

#### 5. Bean 使用阶段：

- Bean 实例在容器中被应用程序使用。

#### 6. 销毁阶段：

- **销毁前处理（DisposableBean）**：如果 Bean 实现了 DisposableBean 接口，容器会在销毁之前调用其`destroy()`方法。
- **销毁方法调用**：如果 Bean 配置了销毁方法（如@PreDestroy 注解），容器会在销毁时调用这些方法。

### 自定义 bean

在 Spring Bean 的生命周期中，可以通过特定的扩展点来自定义操作。以下是可以自定义操作的主要阶段：

#### 1. BeanPostProcessor 接口：

- **`postProcessBeforeInitialization`方法**：在 Bean 的初始化方法（如@PostConstruct 注解）之前执行自定义操作。可以对 Bean 进行自定义的预处理。
- **`postProcessAfterInitialization`方法**：在 Bean 的初始化方法之后执行自定义操作。可以对 Bean 进行自定义的后处理。

#### 2. InitializingBean 和 DisposableBean 接口：

- **`afterPropertiesSet`方法**：在 Bean 的属性设置完成后，在调用自定义的初始化方法（如@PostConstruct 注解）之前执行，可以在此处进行自定义初始化操作。
- **`destroy`方法**：在 Bean 销毁之前执行自定义的销毁操作。

#### 3. @PostConstruct 和@PreDestroy 注解：

- **@PostConstruct 注解**：使用在自定义的初始化方法上，表示该方法在 Bean 初始化时执行，可以在此方法中进行自定义初始化操作。
- **@PreDestroy 注解**：使用在自定义的销毁方法上，表示该方法在 Bean 销毁之前执行，可以在此方法中进行自定义销毁操作。

#### 4. BeanFactoryPostProcessor 接口：

- **`postProcessBeanFactory`方法**：在 BeanFactory 标准初始化之后、所有 Bean 的定义加载之前，可以修改 Bean 的定义信息，如修改属性值、替换 Bean 定义等。

#### 5. FactoryBean 接口：

- **`getObject`方法**：FactoryBean 是用来生产 Bean 实例的工厂 Bean，在此方法中可以自定义生成 Bean 实例的逻辑。

通过上述扩展点，可以在 Bean 的生命周期中的不同阶段执行自定义操作，例如在 Bean 初始化前后做一些自定义处理、在 Bean 销毁前进行一些清理操作等。

### 指定 Bean 的作用域

在 Spring 中指定 Bean 的作用域可以通过在 Bean 的定义上使用 `@Scope` 注解或者在 XML 配置文件中使用 `<bean>` 标签来实现。

#### 使用 @Scope 注解：

```

Import org. Springframework. Context. Annotation. Scope;
Import org. Springframework. Stereotype. Component;

@Component
@Scope ("singleton") // 或者 @Scope ("prototype")、@Scope ("request") 等
Public class MyBean {
    // Bean 的定义
}
```

#### 使用 XML 配置文件：

```
<beans xmlns=" http://www.springframework.org/schema/beans"
       xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation=" http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="myBean" class="com.example.MyBean" scope="singleton"/> <!-- 或者 scope="prototype"、scope="request" 等 -->

</beans>
```

以上示例分别展示了在基于注解和 XML 配置的两种方式来指定 Bean 的作用域。在使用注解时，在 Bean 类上添加`@Scope`注解并传入相应的作用域值即可。在 XML 配置中，在`<bean>`标签中使用`scope`属性来指定作用域。

可以根据需要选择适合的作用域，并在 Bean 的定义中指定相应的作用域。

### 单例 Bean 的优点

Spring 默认情况下将 Bean 配置为单例是为了提高性能、节省资源以及确保应用程序中的对象状态一致性。

#### 性能和资源节省：

1. **减少对象创建和销毁的开销**：单例 Bean 在容器启动时创建并存活于整个应用的生命周期中，避免了频繁的对象创建和销毁，减少了系统资源的消耗。
2. **减少内存消耗**：多个请求共享同一个实例，减少了多个实例带来的内存开销，提高了应用程序的性能。

#### 对象状态一致性：

1. **避免状态不一致的问题**：单例模式确保了在整个应用中只有一个共享的实例，避免了因为多个实例导致的状态不一致问题。
2. **方便共享数据和资源**：单例 Bean 可以方便地共享数据和资源，例如在缓存、数据池等方面提供更高的效率。

虽然单例 Bean 带来了上述的优点，但也要注意以下方面：

- **线程安全性**：单例 Bean 在多线程环境下共享，需要确保 Bean 的线程安全性，特别是当 Bean 状态可变时需要特别注意线程安全。
- **生命周期管理**：单例 Bean 的生命周期由 Spring 容器管理，可能会存在对象长时间占用内存等问题，需要合理管理 Bean 的生命周期。
- **状态共享问题**：如果 Bean 中存在状态共享的问题，可能导致意外的结果，需要慎重考虑 Bean 的设计和状态共享方式。

总的来说，单例 Bean 是 Spring 默认的作用域，适用于大多数情况下的对象共享和性能优化需求。但在一些情况下，如需要特定状态的对象、需要频繁重建的对象等，可能需要考虑其他作用域。

### BeanPostProcessor

BeanPostProcessor 是 Spring 框架中的一个接口，允许在 Bean 实例化、依赖注入和初始化的过程中插入自定义的处理逻辑。它允许开发者在 Bean 的初始化前后进行自定义的操作。

#### 主要功能和理解：

1. **定制 Bean 的实例化和初始化过程**：

   - BeanPostProcessor 接口提供了两个方法：`postProcessBeforeInitialization`和`postProcessAfterInitialization`。
   - `postProcessBeforeInitialization`方法在 Bean 的初始化之前被调用，允许对 Bean 进行修改或者替换。
   - `postProcessAfterInitialization`方法在 Bean 的初始化之后被调用，允许对 Bean 进行额外的处理。

2. **自定义 Bean 的初始化逻辑**：

   - 开发者可以实现 BeanPostProcessor 接口，根据业务需求自定义 Bean 的初始化逻辑，比如添加额外的校验、动态代理等。

3. **AOP 和 AspectJ 的实现**：

   - Spring AOP 中使用了 BeanPostProcessor 接口，在代理对象的创建过程中进行了相关的处理。
   - AspectJ 也使用了类似的机制，在编译期或者运行期生成代理类，并将横切逻辑织入到目标类的方法中。

#### 适用场景：

- **自定义初始化逻辑**：
  - 在 Bean 的初始化前后需要执行额外的逻辑，比如对 Bean 进行校验、添加缓存、记录日志等。
- **AOP 相关操作**：
  - 实现 AOP 的切面功能，可以在 BeanPostProcessor 中生成代理对象，并将横切逻辑织入到代理对象的方法中。
- **动态代理和增强**：
  - 可以使用 BeanPostProcessor 来实现动态代理，给 Bean 增加一些额外的功能。

BeanPostProcessor 是 Spring 框架中强大的扩展点之一，允许开发者在 Bean 实例化和初始化的过程中进行灵活的处理，是实现 AOP 等横切关注点的重要机制之一。

#### 执行顺序

BeanPostProcessor 的执行顺序由其注册的顺序决定，通常情况下，Spring 会按照以下顺序执行 BeanPostProcessor：

1. **Spring 内部的 BeanPostProcessor**：

   - Spring 内部提供的一些 BeanPostProcessor（如 AutowiredAnnotationBeanPostProcessor、InitDestroyAnnotationBeanPostProcessor）会优先执行。
   - 这些 BeanPostProcessor 用于处理自动装配、@PostConstruct、@PreDestroy 等注解。

2. **用户自定义的 BeanPostProcessor**：

   - 用户自定义的实现了 BeanPostProcessor 接口的类会按照它们在容器中注册的顺序依次执行。
   - 如果在配置中声明了多个 BeanPostProcessor，它们的执行顺序会遵循它们在容器中的注册顺序。

3. **执行顺序的影响**：

   - 具体的 BeanPostProcessor 执行顺序会影响其对 Bean 的处理逻辑。
   - 先注册的 BeanPostProcessor 会先执行`postProcessBeforeInitialization`方法，在初始化之前对 Bean 进行处理；后注册的 BeanPostProcessor 会后执行`postProcessAfterInitialization`方法，在初始化之后对 Bean 进行处理。

4. **注意事项**：

   - 如果存在多个 BeanPostProcessor，并且它们有相互依赖或者顺序关系，可以考虑使用 Ordered 接口或者@Order 注解进行优先级控制。

总体而言，BeanPostProcessor 的执行顺序由注册顺序决定，这可能涉及到 Bean 的初始化、依赖注入等阶段，影响 Bean 的最终状态。

### @Component 和@Bean 的区别

`@Component` 和 `@Bean` 都是用于创建 Spring Bean 的方式，但有一些区别。`@Component` 是用于将类标记为组件，Spring 会自动扫描并将其注册为 Bean。而 `@Bean` 通常用于方法级别，标记在方法上，该方法返回一个对象，Spring 将其注册为 Bean。我通常使用 `@Component` 来标记常规的业务组件或服务类，而 `@Bean` 则更适合用于自定义 Bean 的创建，比如第三方库的对象。

`@Component` 是基于类级别的注解，Spring 通过组件扫描自动发现和注册 Bean。而 `@Bean` 是基于方法级别的注解，通常在 `@Configuration` 类中使用，手动定义 Bean 的创建逻辑并返回一个实例。`@Component` 由 Spring 自动处理 Bean 的创建，而 `@Bean` 则允许更多的灵活性，可以在方法内进行复杂的逻辑操作来创建 Bean 实例。

### IoC 原理

控制反转（IoC）是一种软件设计思想，它将应用程序的控制权从应用代码中解耦出来，转交给容器来管理组件之间的依赖关系和生命周期。IoC 的实现基于两个核心概念：依赖注入（Dependency Injection）和控制反转（Inversion of Control）。

1. **依赖注入**：依赖注入是 IoC 的具体实现手段，它通过容器在运行时动态地将组件之间的依赖关系注入到对象中，而不是由对象自己创建或查找依赖。这样做使得组件之间的耦合度降低，使得代码更易于维护和测试。
2. **控制反转**：控制反转是 IoC 的核心概念，它是指将对象的创建、组装和管理等控制权交给了容器，由容器来负责管理对象的生命周期和依赖关系。传统的程序设计中，对象的创建和依赖关系通常由对象自己管理，而 IoC 则将这种控制权进行了反转，由外部容器负责管理。

在 Spring 框架中，IoC 的实现主要依赖于 BeanFactory 和 ApplicationContext。它们负责创建 Bean 实例并维护 Bean 之间的依赖关系。当应用启动时，容器会根据配置文件或注解等方式加载 Bean 定义，然后根据这些定义创建和管理 Bean 实例。当需要某个 Bean 时，容器会自动将依赖注入到需要的对象中。

这种 IoC 的实现使得系统更加灵活、可扩展，也更易于测试和维护。通过将控制权交给容器，使得开发者可以更专注于业务逻辑的实现，而不必过多关注对象的创建和管理。

### ioc 容器

在 Spring 框架中，主要有两种类型的 IOC（控制反转）容器：BeanFactory 和 ApplicationContext。它们都实现了 IOC 容器的功能，但在一些特性和使用场景上有所不同。

### BeanFactory：

- **特点**：
  - 是 Spring 框架最基本的 IOC 容器接口，提供了最基本的 IOC 功能。
  - 提供延迟加载（Lazy Loading），即当第一次获取 Bean 时才进行初始化。
  - 手动触发初始化或显式调用`getBean()`方法时才创建 Bean。
  - 适合资源受限的环境或对资源敏感的应用，因为它是延迟加载的。

### ApplicationContext：

- **特点**：
  - 是 BeanFactory 的扩展，提供了更多的企业级特性。
  - 在启动时就实例化所有的 Bean，提前进行依赖注入和实例化。
  - 支持国际化消息解析、事件传播、资源加载、AOP 等高级功能。
  - 适合大多数应用场景，因为它提供了更多的功能，并且在启动时就初始化了 Bean，后续获取时速度更快。

### 区别：

1. **功能差异**：

   - ApplicationContext 提供了更多的企业级功能，例如国际化消息、事件处理、AOP 等，而 BeanFactory 只提供了基本的 IOC 功能。

2. **加载时机**：

   - BeanFactory 是延迟加载，只有当使用`getBean()`获取 Bean 时才会被初始化。
   - ApplicationContext 在启动时就实例化了所有的 Bean，并进行了依赖注入和实例化。

3. **性能**：

   - BeanFactory 启动时较快，因为延迟加载不会初始化所有 Bean。
   - ApplicationContext 在启动时需要实例化所有 Bean，所以启动可能会较慢，但后续获取 Bean 时速度更快。

4. **适用场景**：

   - 如果应用对资源敏感，需要延迟加载，可以选择 BeanFactory。
   - 如果需要更多的企业级功能，并且对启动速度要求不高，可以选择 ApplicationContext。

在实际应用中，ApplicationContext 是更为常用的 IOC 容器，因为它提供了更多的功能，并且对于大多数应用场景而言，启动时稍微慢一点但后续获取 Bean 更快的特性更有利。

### AOP 原理

AOP（面向切面编程）是一种编程范式，它允许在程序运行期间动态地将代码切入到现有的类（对象）的方法中，用于解耦和增强业务逻辑。

在实际工作中，AOP 允许将那些与业务无关，但是多个地方都会使用到的代码进行抽取，形成切面（Aspect），比如日志、事务、安全性检查等，然后将这些切面与业务逻辑分开，提高了代码的模块性和可维护性。

AOP 的实现原理是通过在程序运行时动态地将额外的代码（通常被称为切面）织入到现有的类和方法中。它通过一种称为横切关注点（cross-cutting concern）的概念来解决系统中多个部分都需要某种相同功能的问题。

- **关键概念**：
  - **切面（Aspect）**：横切关注点的实现，其中包含横切逻辑。比如日志、事务管理等。
  - **连接点（Join Point）**：在程序执行过程中可能被切面拦截的点，比如方法的调用、异常的处理等。
  - **通知（Advice）**：切面在连接点执行的动作，比如在方法执行前、执行后等。
  - **切点（Pointcut）**：连接点的集合，切面可以指定在哪些连接点上执行通知。
  - **织入（Weaving）**：将切面整合到目标对象以创建新的代理对象的过程。
- **优势**：
  - **解耦**：将横切关注点与业务逻辑解耦，提高了模块化。
  - **集中管理**：将多个模块共同使用的功能集中管理。
  - **代码重用**：避免了在多个地方重复编写相同的功能代码。
- **限制和缺点**：
  - **复杂性**：过度使用 AOP 可能会增加代码的复杂性和理解难度。
  - **运行时性能**：在运行时动态植入代码可能带来一定的性能开销。

### Spring 事务

Spring 事务是 Spring 框架提供的一种管理事务的机制，用于简化和统一事务管理的操作。它主要用于保证数据库操作的一致性、完整性和隔离性，确保一系列数据库操作要么全部成功提交，要么全部回滚。

在实际工作中，Spring 事务的应用体现在以下几个方面：

- **声明式事务管理**：使用注解或 XML 配置声明式事务，简化了事务管理的操作，并将事务逻辑与业务逻辑分离。
- **编程式事务管理**：通过编程的方式进行事务管理，通过 TransactionTemplate 或 PlatformTransactionManager 等 API 手动管理事务。
- **事务传播行为**：定义不同方法间的事务传播行为，控制事务的范围和传播方式，如 REQUIRED、REQUIRES_NEW 等。
- **事务隔离级别**：配置事务的隔离级别，定义事务对并发操作的控制程度，如 READ_COMMITTED、SERIALIZABLE 等。

Spring 事务的实现主要涉及以下核心概念：

- **事务管理器（Transaction Manager）**：负责管理事务的开始、提交、回滚和事务的隔离级别等，Spring 提供了多种事务管理器的实现，如 DataSourceTransactionManager、JpaTransactionManager 等。
- **事务代理对象**：Spring 通过 AOP 实现事务，通过代理对象对方法进行增强，在方法执行前后开启、提交或回滚事务，保证事务的一致性。
- **事务注解**：Spring 提供了一系列的事务注解（如@Transactional），通过在方法或类上使用这些注解来声明事务，简化了事务管理的配置。
- **事务拦截器**：使用 AOP 实现，拦截标记了事务注解的方法，启动或加入事务。

Spring 事务管理的优点在于其灵活性、可扩展性和适用性，能够轻松地应对不同的数据库访问需求和事务管理的场景。

### spring 事务和数据库事务的区别

Spring 事务和数据库事务之间有一些关键的区别：

1. **概念层面的区别**：

   - **Spring 事务**：Spring 事务是在应用层面实现的事务管理机制，通过 Spring 框架提供的事务管理功能来控制事务的边界、隔离级别和提交/回滚操作。
   - **数据库事务**：数据库事务是数据库引擎提供的一种机制，用于确保一组数据库操作要么全部成功提交，要么全部回滚，保证数据的一致性和完整性。

2. **作用范围的不同**：

   - **Spring 事务**：Spring 事务是在应用层面进行管理的，可以跨越多个数据库操作或其他操作，并提供更大的灵活性，不局限于数据库操作。
   - **数据库事务**：数据库事务是对数据库操作的原子性保证，通常局限于数据库连接内的操作，只能针对单个数据库或多个相互关联的数据库。

3. **实现方式的不同**：

   - **Spring 事务**：Spring 事务可以使用编程式事务管理或声明式事务管理，在代码中进行显式地编写或通过注解、XML 等配置实现。
   - **数据库事务**：数据库事务是数据库引擎提供的原生支持，在 SQL 语句中使用事务控制语句（如 BEGIN TRANSACTION、COMMIT、ROLLBACK 等）来实现。

4. **事务管理的抽象层级**：

   - **Spring 事务**：Spring 提供了抽象层来处理不同数据访问技术的事务，支持多种数据访问技术（如 JDBC、Hibernate、JPA 等）的事务管理。
   - **数据库事务**：数据库事务是针对特定数据库引擎提供的，不同数据库引擎可能对事务的支持和实现方式有所不同。

虽然 Spring 事务和数据库事务都涉及事务的概念，但 Spring 事务提供了更高层次的抽象和更大的灵活性，不仅仅局限于数据库操作，可以更加灵活地管理事务边界和事务的行为。

### spring 事务传播行为

Spring 框架中定义了七种事务传播行为，用来控制事务方法的行为和相互之间的交互。这些传播行为在`@Transactional`注解或编程式事务管理中使用，来决定在当前事务存在时，新的事务方法如何参与到已存在的事务中。

以下是 Spring 事务中的七种事务传播行为：

1. **REQUIRED（默认）**：

   - 如果当前存在事务，则加入该事务，如果不存在事务，则创建一个新的事务。这是最常见的传播行为，适用于大多数情况。

2. **SUPPORTS**：

   - 如果当前存在事务，则加入该事务，如果不存在事务，则以非事务的方式执行。适用于不需要事务支持的场景。

3. **MANDATORY**：

   - 要求当前存在事务，如果没有事务则抛出异常。用于要求方法在已有事务中运行的情况。

4. **REQUIRES_NEW**：

   - 创建一个新的事务，并挂起当前事务（如果存在）。如果当前存在事务，则将其挂起并创建一个新的事务，新事务结束后，原来的事务将恢复执行。

5. **NOT_SUPPORTED**：

   - 以非事务方式执行，并挂起当前事务（如果存在）。用于不需要事务支持的情况，不管当前是否存在事务，都会以非事务方式执行。

6. **NEVER**：

   - 以非事务方式执行，如果当前存在事务则抛出异常。用于确保当前方法不在事务中执行。

7. **NESTED**：

   - 如果当前存在事务，则在嵌套事务中执行，如果不存在事务则创建一个新的事务。它创建了一个嵌套事务，如果嵌套事务失败，则只有它自己回滚，而不会影响外部事务。

这些传播行为可以根据业务需求和事务边界的需要来灵活地进行配置，以确保事务的一致性和正确性。

---

下面是一些常见的选择策略：

1. **默认策略**：

   - 对于大多数业务方法，采用默认的`REQUIRED`传播行为，即如果当前已存在事务则加入，如果不存在则创建新的事务。这是最常用的传播行为。

2. **精细控制**：

   - 针对某些特定的方法或业务场景，根据具体需求选择不同的传播行为，如使用`REQUIRES_NEW`来确保独立的事务、使用`SUPPORTS`在无需事务的情况下执行等。

3. **事务嵌套**：

   - 对于一些需要嵌套事务的场景，使用`NESTED`传播行为，允许在外部事务的范围内创建一个独立的嵌套事务。

4. **异常处理**：

   - 根据异常处理的需求选择合适的传播行为，例如，如果某个方法内部抛出了异常，希望它影响整个事务的回滚，则选择`REQUIRED`或`REQUIRES_NEW`等行为。

5. **性能考虑**：

   - 考虑事务传播行为对性能的影响，例如，`REQUIRES_NEW`可能会创建较多的事务，影响性能，需要谨慎使用。

在实际项目中，根据不同的业务场景和需求，经验和对业务逻辑的理解会指导我们选择合适的事务传播行为，确保事务的一致性、正确性和性能。

### 事务隔离级别

Spring 事务定义了五种隔离级别，用于控制多个并发事务之间的相互影响程度。这些隔离级别定义了一个事务能够看到其他事务执行过程中产生的影响的程度。

以下是 Spring 事务中定义的五种隔离级别：

1. **DEFAULT（默认）**：

   - 使用数据库默认的隔离级别。不同的数据库有不同的默认级别，通常是数据库的默认隔离级别。在大多数情况下等同于`READ_COMMITTED`。

2. **READ_UNCOMMITTED**：

   - 最低的隔离级别，允许一个事务看到另一个事务未提交的数据变化。该级别可能导致脏读、不可重复读和幻读等问题。

3. **READ_COMMITTED**：

   - 保证一个事务不会读取另一个未提交事务的数据，只能读取到已提交事务的数据。这样可以避免脏读，但是可能出现不可重复读和幻读。

4. **REPEATABLE_READ**：

   - 确保一个事务在多次读取同一数据时，会得到相同的数据。在事务执行期间阻止其他事务对这些行的插入、更新或删除操作，避免不可重复读和幻读。

5. **SERIALIZABLE**：

   - 最高的隔离级别，通过强制事务串行执行来避免脏读、不可重复读和幻读等问题。该级别会导致最高的并发性能损失。

不同的隔离级别提供了不同程度的数据一致性和并发控制。隔离级别越高，事务对数据的锁定程度越高，能够保证的数据一致性越高，但并发性能可能会受到影响。

### Spring 中用到的设计模式

Spring 框架中运用了多种设计模式来实现其不同的功能和组件，其中一些主要的设计模式包括：

1. **单例模式（Singleton Pattern）**：

   - Spring 容器默认创建的 Bean 是单例的，这意味着容器中的一个 Bean 实例在整个应用程序中只有一个共享的实例。

2. **工厂模式（Factory Pattern）**：

   - Spring 通过 Bean 工厂来管理和创建 Bean 对象，这些工厂包括 BeanFactory 和 ApplicationContext。ApplicationContext 更像是工厂模式的变种，它不仅负责创建 Bean，还提供了一些其他的服务。

3. **依赖注入模式（Dependency Injection Pattern）**：

   - 这是 Spring 框架最重要的模式之一。通过依赖注入，Spring 容器可以管理对象之间的依赖关系，将对象的依赖关系外部化配置，从而实现了解耦和灵活性。

4. **观察者模式（Observer Pattern）**：

   - Spring 中的事件机制借鉴了观察者模式，通过 ApplicationEvent 和 ApplicationListener 来实现对象间的事件通知和处理。

5. **模板模式（Template Pattern）**：

   - Spring 的 JdbcTemplate 和 HibernateTemplate 等模板类使用了模板模式，提供了固定的算法结构，允许子类为一个或多个步骤提供具体实现。

6. **代理模式（Proxy Pattern）**：

   - Spring AOP 中使用了代理模式来实现面向切面编程，通过代理对象来控制对原始对象方法的访问，实现横切逻辑的注入。

7. **策略模式（Strategy Pattern）**：

   - Spring 中的策略模式常用于实现不同的数据验证、转换和处理逻辑，例如在数据绑定、数据校验等方面。

8. **适配器模式（Adapter Pattern）**：

   - Spring 中的适配器模式主要体现在 HandlerAdapter 的使用上，用于适配不同类型的处理器，使它们能够适配到统一的处理接口。

这些设计模式的运用使得 Spring 框架具备了高度的灵活性、可扩展性和易维护性。

### SpringMVC 运行流程

```
客户端发送请求                   DispatcherServlet 接收请求
      |                                   |
      |                                   |
      v                                   v
  HandlerMapping          找到合适的 Controller 处理请求
      |                                   |
      |                                   |
      v                                   v
  处理器(Controller)       执行业务逻辑并返回 ModelAndView
      |                                   |
      |                                   |
      v                                   v
    ViewResolver            解析视图名为真正的 View
      |                                   |
      |                                   |
      v                                   v
    视图渲染                      将模型数据渲染到视图
      |                                   |
      |                                   |
      v                                   v
  返回响应给客户端              客户端接收处理后的响应

```

### @ComponentScan 和@Configuration 的区别

`@ComponentScan` 和 `@Configuration` 都是 Spring 中用于配置和管理 Bean 的注解。`@ComponentScan` 用于指示 Spring 在指定的包及其子包中扫描并注册带有 `@Component` 及其衍生注解（如 `@Service`、`@Repository` 等）的类作为 Bean。而 `@Configuration` 用于标记一个类作为配置类，在该类中可以使用 `@Bean` 注解来定义 Bean 的创建和配置。

`@ComponentScan` 通过自动扫描的方式，发现并注册带有特定注解的类作为 Spring Bean，减少了手动配置的工作量。而 `@Configuration` 用于定义配置类，其中包含了 Bean 的定义，通常配合 `@Bean` 一起使用，手动定义和配置 Bean 的创建逻辑。`@Configuration` 注解的类相当于 XML 配置文件的替代者，提供了一种 JavaConfig 的方式来配置 Spring 应用。

在实际工作中，`@ComponentScan` 用于告诉 Spring 在指定的包及其子包中扫描并注册带有特定注解的类作为 Spring Bean。一个常见的案例是在 Spring Boot 应用中，我们通常在主应用程序类（通常带有 `@SpringBootApplication` 注解）上使用 `@ComponentScan`。

```java
@SpringBootApplication
@ComponentScan (basePackages = "com. Example. Package")
Public class YourApplication {
    Public static void main (String[] args) {
        SpringApplication.Run (YourApplication. Class, args);
    }
}
```

这段代码中的 `@ComponentScan` 注解告诉 Spring Boot 在 `com.example.package` 及其子包中扫描带有 `@Component` 及其衍生注解的类，并注册为 Spring Bean。这样就可以使用自动装配（`@Autowired`）来注入这些 Bean，无需手动配置。

`@ComponentScan` 可以用于不同层次的组件扫描，从而实现模块化开发和组件化管理。通过指定不同的包名，可以控制 Spring 容器扫描哪些包以及包含哪些类作为 Bean。这种方式可以帮助保持代码结构清晰，避免不必要的组件扫描和注册。

### @componentScan 的规则

在 Spring Boot 中，默认的 `@ComponentScan` 规则是扫描主应用程序类所在的包及其子包。通常情况下，Spring Boot 应用的主应用程序类会使用 `@SpringBootApplication` 注解，这个注解实际上整合了三个注解：`@Configuration`、`@EnableAutoConfiguration` 和 `@ComponentScan`。

默认情况下，`@SpringBootApplication`会扫描主应用程序类所在的包及其子包，以查找带有`@Component`及其衍生注解（`@Service`、`@Repository`、`@Controller`等）的类，并将其注册为 Spring Bean。这样可以自动发现和注册应用中的各种组件，减少了手动配置的工作量。

如果没有显式指定`@ComponentScan`的`basePackages`参数，Spring Boot 会从主应用程序类所在的包开始扫描，即默认情况下扫描主应用程序类所在的包及其子包。

这种默认规则可以简化项目的配置，但在特殊情况下，如果需要修改扫描的包或者指定特定的扫描路径，就需要显式地使用`@ComponentScan`注解并指定`basePackages`参数来覆盖默认行为。

举例来说，如果在 `com.example.package` 的子目录下定义了一个类 `Student`，并且标记了 `@Component` 或其他符合条件的注解，那么它就有可能被扫描并注册为一个 Spring Bean。

### 注入 Bean 的注解

在 Spring 中，用于注入 Bean 的主要注解包括以下几种：

1. **@Autowired**：最常用的注解之一，通过类型进行自动装配。可以标注在构造函数、字段、Setter 方法或普通方法上，Spring 会自动查找匹配的 Bean 并注入。
2. **@Resource**：也用于注入 Bean，但是与@Autowired 略有不同，它默认通过名称进行装配，通过指定 name 或者 type 属性来指定注入的 Bean。
3. **@Inject**：与@Autowired 类似，也是通过类型进行装配，是 Java 规范中的注解，在使用时需要导入`javax.inject`的包。

这些注解都可以用于依赖注入，其中 `@Autowired` 是 Spring 框架特有的，而 `@Resource` 和 `@Inject` 是 Java EE 的规范。

1. **@Autowired**：

   - **优势**：
     - 使用方便，简化了依赖注入的配置，不需要手动指定名称或类型。
     - Spring 特有，更好地与其他 Spring 功能整合。
   - **局限性**：
     - 当有多个匹配项时，依赖歧义性，可能需要配合`@Qualifier`或者其他方式解决。
     - 对 Java EE 标准支持不如其他两个注解。

2. **@Resource**：

   - **优势**：
     - 根据名称进行注入，较为直观。
     - 是 Java EE 标准的一部分，具有较好的平台兼容性。
   - **局限性**：
     - 对于类型的匹配不如`@Autowired`灵活。
     - 在某些情况下可能需要手动指定名称或者类型。

3. **@Inject**：

   - **优势**：
     - 与`@Autowired`相似，可以根据类型进行注入。
     - 是 Java EE 标准的一部分，具有较好的平台兼容性。
   - **局限性**：
     - 与`@Autowired`类似，也会存在依赖歧义性的问题。
     - 在 Spring 应用中需要导入`javax.inject`的包，不如`@Autowired`直接。

选择使用哪种注解通常取决于具体的需求和项目的环境，一般来说，`@Autowired` 是 Spring 中最常用的，而 `@Resource` 和 `@Inject` 在一些特定场景下会更为合适。

### 自动装配

自动装配（Autowired）是 Spring 框架的一个核心特性，它通过扫描应用上下文中的 Bean，并将它们自动连接（注入）到需要依赖的地方。这种自动装配可以减少手动配置的工作量，提高了代码的灵活性和可维护性。

在实际工作中，自动装配使得我们可以使用 `@Autowired` 注解来标注需要注入的字段、构造函数、Setter 方法或普通方法，Spring 会根据类型或者名称来查找匹配的 Bean，并将其注入进来。这样我们就不需要手动编写大量的 Bean 配置，而是让 Spring 根据规则来完成注入。

自动装配背后的原理是依赖注入（DI），它基于 IoC（控制反转）的思想。Spring 容器负责管理 Bean 的生命周期，它会根据装配规则，比如 `@Autowired` 注解，自动解析依赖关系并注入相应的 Bean。根据类型或名称的匹配规则，Spring 会在应用上下文中寻找匹配的 Bean 进行装配。

---

Spring 中的自动装配有以下几种模式：

1. **按照类型自动装配（byType）**：

   - 这种模式下，Spring 容器会自动在上下文中查找和目标类型相匹配的 Bean，并将其注入到需要依赖的地方。如果找到多个匹配的 Bean，会抛出异常。

2. **按照名称自动装配（byName）**：

   - 根据依赖对象的名称与容器中 Bean 的名称匹配来进行注入。当容器中存在一个与属性名相同的 Bean 时，将其注入到对应的属性中。

3. **构造器自动装配（constructor）**：

   - 通过构造函数实现自动装配，Spring 会在容器中查找匹配参数的 Bean，并自动将其注入到构造函数中。

4. **自动装配失效（no）**：

   - 禁用自动装配，需要手动指定 Bean 之间的依赖关系。这种模式下，所有的依赖注入需要通过`@Autowired`或`@Resource`等显式指定。

这些模式的区别在于匹配方式和规则，它们决定了 Spring 容器如何自动查找并注入 Bean 到目标对象中。按类型自动装配和按名称自动装配是最常用的两种模式，分别根据类型和名称进行匹配，而构造器自动装配则是通过构造函数的方式进行注入。

---

`@Autowired` 和 `@Resource` 这两个注解在 Spring 中分别使用不同的装配模式：

- **@Autowired**：使用按照类型自动装配（byType）的模式。它会在 Spring 容器中按照属性的类型寻找匹配的 Bean，并自动注入到需要的地方。如果找到多个匹配的 Bean，会抛出异常，除非使用`@Qualifier`注解指定具体要注入的 Bean。
- **@Resource**：使用按照名称自动装配（byName）的模式。它默认按照属性名作为 Bean 的名称在 Spring 容器中查找匹配的 Bean，并注入到对应的属性中。也可以通过指定`name`或`type`属性来显式指定要注入的 Bean。

这两种注解的使用方式和匹配规则不同，`@Autowired`更注重类型的匹配，而`@Resource`更注重名称的匹配。因此，它们在查找和注入 Bean 时的行为略有不同。

### 自动装配匹配到多个 Bean

遇到多个匹配的 Bean 情况下，可以通过不同的方式来处理 `@Autowired` 或 `@Resource` 的自动装配：

### @Autowired 处理多个匹配的 Bean：

1. **使用 @Qualifier 注解**：

   - 搭配`@Qualifier`注解来指定具体要注入的 Bean，可以在`@Autowired`注解上配合使用。例如：

   `@Autowired @Qualifier("specificBean") private MyInterface myBean;`

2. **使用集合类型注入**：

   - 将多个匹配的 Bean 注入到集合中。例如，使用`List`或`Set`类型接收所有匹配的 Bean：

   `@Autowired private List<MyInterface> myBeans;`

### @Resource 处理多个匹配的 Bean：

1. **使用 name 属性指定具体 Bean 名称**：

   - 通过指定`name`属性来明确指定要注入的 Bean 的名称：

   `@Resource(name = "specificBean") private MyInterface myBean;`

2. **结合 @Qualifier 注解**：
   - 虽然`@Resource`没有内置的类似`@Qualifier`的方式，但可以结合使用，类似`@Autowired`的方式来处理。

以上方式可以根据具体情况，指定或选择要注入的 Bean，避免自动装配时的歧义性。

### Spring 中的 Controller 和 Service 是线程安全的吗？

```
在 Spring 中，Controller 和 Service 默认情况下是单例的，也就是说它们在应用程序的整个生命周期内只会被实例化一次。因此，如果它们没有状态（即不包含可变的实例变量），它们是线程安全的。但是，如果它们包含可变状态，你需要确保状态的同步以确保线程安全。通常推荐避免在 Controller 和 Service 中使用实例变量来保存状态，而是尽可能使用方法内的局部变量，或者使用线程安全的数据结构来管理状态。
```

### 包含可变状态是怎么样呢？

假设类里面有一个计数器的变量，同时有查询计数值的方法，那么多个线程同时访问这个方法的时候，会有竞争的问题，导致数值不准确。可以使用 `AtomicInteger` 类来管理计数器，它提供了原子性的操作，避免了多线程访问时的竞态条件问题。

### 说下你对原子类的理解？

原子类是 Java 中提供的一组特殊数据类型，它们能够在多线程环境下进行原子操作，保证了特定操作的原子性。原子性指的是一个操作是不可中断的，要么全部执行成功，要么完全不执行，不会出现部分执行的情况。

Java 中的 `java.util.concurrent.atomic` 包提供了多种原子类，比如 `AtomicInteger`、`AtomicLong`、`AtomicBoolean` 等。这些类提供了一些常见的原子操作，比如增加值、减少值、设置值等，这些操作是线程安全的，不需要额外的同步手段就可以保证多线程环境下的正确性。

原子类的主要特点包括：

1. **原子操作：** 原子类的操作是原子的，不会被线程调度机制打断。
2. **线程安全：** 在多线程环境下，原子类提供了线程安全的操作，无需额外的同步措施。
3. **底层实现：** 这些类使用了底层的 CAS（Compare and Swap）操作来实现原子性，即比较并交换操作，保证了并发情况下的线程安全性。

原子类通常用于需要在多线程环境下进行操作的场景，比如计数器、标志位的更新等。它们能够提供高效且线程安全的解决方案，避免了使用锁所带来的开销和复杂性。

### Bean 的生命周期

Spring 容器管理 Bean 的生命周期，其生命周期包括以下阶段：

1. **实例化（Instantiation）**：

   - 当 Spring 容器接收到 Bean 的定义后，会通过构造函数或工厂方法创建 Bean 的实例。

2. **属性设置（Population）**：

   - Spring 容器将 Bean 的属性值和依赖注入到 Bean 实例中，包括使用`@Autowired`、`@Value`等进行注入。

3. **初始化（Initialization）**：

   - 在 Bean 实例化和依赖注入完成后，Spring 容器会调用特定的回调方法来执行一些初始化操作。这些方法可以使用`@PostConstruct`注解或实现`InitializingBean`接口的`afterPropertiesSet()`方法。

4. **使用（In Use）**：

   - Bean 实例在容器中被使用，执行它的业务逻辑。

5. **销毁（Destruction）**：

   - 当容器关闭时或者特定条件满足时，Spring 容器会调用 Bean 的特定方法进行销毁操作。这些方法可以使用`@PreDestroy`注解或实现`DisposableBean`接口的`destroy()`方法。

### @PostConstruct 和@PreDestroy 注解

` @PostConstruct` 和 `@PreDestroy` 注解分别在 Bean 的生命周期中的特定阶段被调用：

- **@PostConstruct**：
  - `@PostConstruct`注解标注的方法会在 Bean 的初始化阶段之后、依赖注入完成之后被调用。也就是说，在 Bean 的属性注入完成后，初始化方法执行之前会调用被`@PostConstruct`注解标注的方法。
- **@PreDestroy**：
  - `@PreDestroy`注解标注的方法会在 Bean 销毁之前被调用。当容器关闭或者 Bean 被销毁之前，会先调用`@PreDestroy`注解标注的方法来执行清理、释放资源等操作。

这两个注解提供了在 Bean 生命周期中的特定时机进行初始化和销毁操作的能力。

### @PostConstruct 和构造函数的区别

在 Spring 中，`@PostConstruct` 注解标注的方法和构造函数的执行顺序如下：

1. **构造函数执行**：

   - 当容器创建一个 Bean 的实例时，首先会调用该 Bean 的构造函数来创建对象实例。

2. **依赖注入**：

   - 构造函数执行完成后，Spring 会执行依赖注入，将 Bean 所需的依赖注入到 Bean 中。

3. **@PostConstruct 方法执行**：

   - 在依赖注入完成后，Spring 会查找并调用被`@PostConstruct`注解标注的方法，执行一些额外的初始化操作。

所以执行顺序是：构造函数 -> 依赖注入 -> @PostConstruct 方法。

这个顺序保证了在 Bean 对象实例化、构造完成，并且依赖注入完成后，才会调用 `@PostConstruct` 注解标注的初始化方法，以确保对象的完整性和依赖的准备就绪。

### BeanFactory

BeanFactory 是 Spring 框架中最核心的接口之一，它提供了一个工厂模式的实现，用于管理和装配 Bean 对象。BeanFactory 主要负责 Spring 中 Bean 的创建、管理、装配和生命周期的管理。

以下是 BeanFactory 的一些关键职责和特性：

1. **Bean 的管理和装配**：

   - BeanFactory 负责管理应用中的 Bean 对象，根据配置文件或注解创建和装配 Bean，并且可以通过依赖注入将 Bean 之间的关系进行建立。

2. **延迟加载和懒初始化**：

   - BeanFactory 支持延迟加载和懒初始化，在需要时才真正创建和初始化 Bean，节省资源和提高性能。

3. **Bean 的生命周期管理**：

   - BeanFactory 负责管理 Bean 的生命周期，包括 Bean 的创建、初始化、使用和销毁等各个阶段。它通过 Bean 的生命周期回调方法（如初始化回调和销毁回调）来管理 Bean 的状态。

4. **多种实现**：

   - Spring 提供了多种 BeanFactory 的实现，如 DefaultListableBeanFactory、XmlBeanFactory 等，用于支持不同的配置方式和应用场景。

5. **依赖注入**：

   - BeanFactory 支持依赖注入，通过依赖注入将 Bean 之间的依赖关系进行解耦，提高了组件的可重用性和灵活性。

6. **IOC 容器**：

   - BeanFactory 作为 Spring 的 IOC 容器的核心，负责管理和维护应用中的 Bean 对象，提供了一种松耦合、可扩展的组件化方式。

BeanFactory 是 Spring 框架的核心组件之一，它通过 IOC 和依赖注入等特性，实现了灵活、可维护和可测试的应用开发。

### BeanFactory 和 FactoryBean 的区别

BeanFactory 和 FactoryBean 是 Spring 框架中两个不同的概念，它们之间有一些重要的区别：

1. **BeanFactory**：

   - BeanFactory 是 Spring 框架的核心接口之一，它是用于管理和装配 Bean 的工厂。BeanFactory 负责整个 Bean 的生命周期管理、依赖注入、延迟加载等，是 Spring IOC 容器的基础。它用于创建和管理应用中的各种 Bean 对象。

2. **FactoryBean**：

   - FactoryBean 是一个特殊的 Bean，实现了 FactoryBean 接口的类在 Spring IOC 容器中也会被视为一个 Bean。FactoryBean 的作用是用于创建其他 Bean，它允许开发者定制 Bean 的创建逻辑。FactoryBean 接口定义了一个方法`getObject()`，该方法返回一个对象实例，这个对象实例可以是某个类的实例，也可以是某个对象的代理。

主要区别在于：

- **BeanFactory**是 Spring IOC 容器的基础，负责整个容器中 Bean 的管理和装配；
- **FactoryBean**是一个特殊的 Bean，它本身也是一个 Bean，但它的作用是用于创建其他 Bean，通过实现 FactoryBean 接口的类可以定制 Bean 的创建过程，返回特定的对象实例。

举个例子，假设有一个实现了 FactoryBean 接口的类，当它被注册到 Spring IOC 容器时，容器并不会直接将它作为 Bean 来使用，而是通过它的 `getObject()` 方法创建其他 Bean 的实例，这个实例才是最终可以被容器管理的 Bean。

### FactoryBean 和传统创建 Bean 的区别

Spring 框架提供 FactoryBean 是为了让开发者能够更加灵活地定制 Bean 的创建过程。FactoryBean 允许开发者通过实现 FactoryBean 接口，控制 Bean 的创建、初始化和返回过程，这与传统的直接创建 Bean 有所不同。

主要区别在于：

1. **FactoryBean 定制化创建**：

   - FactoryBean 允许开发者在 getObject()方法中进行一些特殊逻辑，这些逻辑可能包括创建特定类型的 Bean、根据条件创建不同的 Bean 实例等。通过 FactoryBean，可以在 Bean 创建的过程中加入更多自定义的逻辑。

2. **传统创建 Bean**：

   - 传统的创建 Bean 通常是直接在配置文件或代码中声明 Bean 的定义，由 Spring 容器根据定义创建 Bean 对象。这种方式相对固定，不能像 FactoryBean 那样动态地创建不同类型的 Bean 实例或进行更多的定制化操作。

FactoryBean 的存在让 Bean 的创建过程更加灵活、可定制，适用于那些需要动态创建 Bean 或者在创建过程中需要进行一些特殊处理的场景。但相对地，FactoryBean 的使用可能增加了一些复杂性，需要开发者自行处理 Bean 的创建逻辑。

### 动态代理

动态代理是 AOP 实现的关键之一，Spring 利用动态代理机制创建代理对象，将横切逻辑织入到目标 Bean 的方法中。这些代理对象在运行时会拦截对目标 Bean 方法的调用，并在方法执行前后执行额外的逻辑，比如日志记录、权限校验、事务控制等。

Spring 框架中主要使用了两种动态代理方式：

1. **JDK 动态代理**：

   - 基于接口的动态代理，利用`java.lang.reflect.Proxy`和`java.lang.reflect.InvocationHandler`实现。只能代理实现了接口的目标类，通过接口生成代理对象。

2. **CGLIB 动态代理**：

   - 基于类的动态代理，利用 CGLIB 库实现。可以代理没有实现接口的类，通过继承目标类生成代理对象。

Spring AOP 默认情况下会根据目标类是否实现接口来选择使用 JDK 动态代理还是 CGLIB 动态代理。如果目标类实现了接口，则使用 JDK 动态代理；如果没有实现接口，则使用 CGLIB 动态代理。

在 Spring Boot 源码中，并非所有的 Bean 都会使用动态代理，但是在涉及到 AOP 的场景，例如通过 `@Transactional` 添加事务，`@Aspect` 定义切面等情况下，Spring 会利用动态代理机制生成代理对象，以实现横切关注点的功能。

#### 使用场景选择：

- **JDK 动态代理适用于**：
  - 目标类实现了接口的情况。
  - 适合对接口方法的代理，比如 Spring 中的事务处理、权限校验等。
- **CGLIB 动态代理适用于**：
  - 目标类没有实现接口的情况。
  - 适合对类的方法进行代理，比如对类的继承、构造函数、final 方法等的代理。

在 Spring 中，默认情况下，如果目标类实现了接口，则使用 JDK 动态代理；如果目标类没有实现接口，则使用 CGLIB 动态代理。但可以通过配置强制使用某种代理方式。

### 循环依赖

循环依赖指的是多个 Bean 之间相互依赖，形成了一个循环的引用关系。这种情况下，A 依赖 B，B 又依赖 A，导致它们无法正确地被实例化和初始化。

在 Spring 中，存在循环依赖时，通常有两种情况：

1. **构造器注入的循环依赖**：

   - 当 Bean 的构造函数中存在循环依赖时，Spring 无法完成 Bean 的实例化，因为它需要实例化 A 来注入到 B 中，同时也需要实例化 B 来注入到 A 中，导致无法解决初始化顺序的问题。

2. **属性注入的循环依赖**：

   - 在属性注入的情况下，Spring 容器可以处理一定程度的循环依赖，通过提前暴露半初始化状态的 Bean 来解决循环引用的问题。

#### Spring 如何处理循环依赖：

- **构造器注入的循环依赖**：
  - Spring 无法解决构造器注入的循环依赖，会抛出 BeanCurrentlyInCreationException 异常，表明当前 Bean 正在创建中。
  - 解决方法是尽量避免构造器注入的循环依赖，或者考虑通过重构代码来解决循环依赖的问题。
- **属性注入的循环依赖**：
  - Spring 在属性注入时，会提前暴露半初始化状态的 Bean。
  - 首先创建 Bean A，并将其放入缓存，然后创建 Bean B，发现 B 依赖 A，但 A 还没有完全初始化，此时 Spring 会返回一个尚未初始化的 A 给 B。
  - 接着完成 B 的初始化，将 B 注入到 A 中，最终完成 A 和 B 的初始化。

循环依赖可能导致程序的不可预测性和不稳定性，因此在设计和开发过程中，应尽量避免循环依赖的出现。

如果你在项目中遇到了循环依赖，解决的方法通常包括：

- 重构代码结构，消除循环依赖；
- 将相关的部分解耦，通过事件机制或消息队列等方式进行解耦合；
- 考虑使用延迟初始化或者通过接口抽象等方式来解决。

#### 三级缓存

Spring 在解决循环依赖时使用了三级缓存来管理 Bean 的创建过程。这个三级缓存包括 singletonObjects、earlySingletonObjects 和 singletonFactories。

1. **singletonObjects**：这是最常用的单例对象缓存，用于存储完全初始化的 Bean 实例。
2. **earlySingletonObjects**：这个缓存用于存储早期创建但尚未完全初始化的 Bean 实例。
3. **singletonFactories**：这个缓存保存了用于创建 Bean 的工厂实例，当 Bean 正在创建时，它允许我们在实际完成 Bean 创建之前提前返回 Bean 实例。

Spring 的循环依赖解决机制依赖于这些缓存，以下是它们的典型使用流程：

1. **首次调用**：当容器加载 Bean 时，首先会将 Bean 的定义信息加载到 BeanFactory 中，并将 Bean 的名称放入 singletonFactories 缓存中。
2. **第一次获取 Bean**：当第一次获取一个 Bean 时，Spring 会尝试创建 Bean 实例。如果 Bean 之间存在循环依赖，其中一个 Bean 的创建过程中会遇到另一个尚未完成初始化的 Bean。
3. **尝试提前暴露 Bean**：Spring 会提前暴露正在创建的 Bean 实例，使其可以在创建过程中被引用，这样就可以解决循环依赖的问题。Spring 会将正在创建但尚未完成初始化的 Bean 放入 earlySingletonObjects 缓存中。
4. **完成 Bean 的初始化**：当循环依赖被解决后，容器会完成 Bean 的初始化，并将其放入 singletonObjects 缓存中，以备后续使用。
5. **之后的 Bean 获取**：当后续请求获取这些 Bean 时，Spring 直接从 singletonObjects 缓存中返回已初始化的 Bean 实例。

通过这种三级缓存的机制，Spring 能够解决一定程度上的循环依赖问题，但在复杂的依赖关系或特定情况下，仍可能存在无法解决的循环依赖问题，这时可能会抛出`BeanCurrentlyInCreationException`异常。

#### 二级缓存为什么不行？

在 Spring 中，为了解决循环依赖的问题，需要使用三级缓存而不是二级缓存的主要原因是解决创建中的循环依赖。

二级缓存（即一级缓存和二级缓存）无法有效处理创建中的循环依赖。一级缓存（singletonObjects）存储已完全初始化的 Bean 实例，在创建过程中会发现循环依赖问题，无法提供尚未完成初始化的 Bean 实例。二级缓存（earlySingletonObjects）是用于解决创建中的循环依赖问题，但也仅限于未完成初始化的 Bean 实例。

因此，引入三级缓存（singletonFactories）是为了更好地管理创建中的 Bean 实例，并在创建过程中允许提前暴露尚未完成初始化的 Bean 实例。这样可以有效解决循环依赖问题，通过三级缓存的机制，Spring 能够在创建过程中合理地管理和提前引用 Bean 实例，从而解决复杂的循环依赖情况。

简而言之，二级缓存不足以有效解决创建中的循环依赖问题，因此需要引入三级缓存来提前暴露尚未完成初始化的 Bean 实例，从而更好地处理循环依赖情况。

### aware 接口

在实际项目中，通常会利用 `Aware` 接口来完成一些特定的需求。这些接口提供了访问 Spring 容器内部资源的便利途径，以下是一些使用 `Aware` 接口的实际场景：

1. **BeanNameAware**：在某些需要动态生成 Bean 名称的场景下，实现这个接口可以获取到 Bean 的名称，并根据特定逻辑自定义 Bean 名称。
2. **BeanFactoryAware**：如果在 Bean 的初始化过程中需要获取其他 Bean，可以通过这个接口获得 BeanFactory 实例，然后使用 BeanFactory 来获取其他 Bean。
3. **ApplicationContextAware**：在需要访问 ApplicationContext 的情况下，可以通过这个接口获取 ApplicationContext 实例，从而获取更多应用上下文的信息。
4. **EnvironmentAware**：当需要在 Bean 初始化时获取环境信息或配置属性时，实现这个接口可以获取 Environment 实例，用于获取配置属性等信息。

### @Controller 和 @RestController 的区别

` @Controller` 和 `@RestController` 是 Spring MVC 中用于标识 Controller 的注解，它们之间的区别在于返回值和默认行为上有所不同。

- **@Controller**：这个注解表明一个类是 Spring MVC 中的 Controller，它处理 HTTP 请求，并返回一个视图（通常是 HTML）作为响应。这意味着当一个方法被`@Controller`注解标记时，方法返回的对象会被解析为视图名称（View Name），Spring 会根据这个视图名称去寻找相应的视图模板。
- **@RestController**：`@RestController`是`@Controller`和`@ResponseBody`的组合注解。它表示这个类的所有方法都以 JSON 或 XML 格式直接返回数据，而不是视图。这意味着在使用`@RestController`标记的 Controller 中，每个方法都会将方法的返回值序列化为 JSON 或 XML，并将其作为 HTTP 响应的主体内容返回给客户端，而不会进行视图解析。

总体而言，`@Controller` 主要用于传统的 Web 应用程序，返回视图作为响应，而 `@RestController` 用于构建 RESTful 风格的 API，直接返回数据（通常是 JSON 或 XML）而不是视图。

### BeanPostProcessor 和 BeanFactoryPostProcessor 的区别

`BeanPostProcessor` 和 `BeanFactoryPostProcessor` 是 Spring 框架中用于定制和修改 Bean 定义及实例化过程的接口，它们在 Bean 的生命周期中扮演不同的角色。

#### BeanFactoryPostProcessor：

- **作用时机**：在 Spring 容器实例化 Bean 之前对 BeanDefinition 进行修改。
- **触发时间**：在 Bean 实例化之前，但在 Bean 的生命周期开始之前。
- **常见实现类**：常用的实现类包括`PropertySourcesPlaceholderConfigurer`用于处理属性占位符等。
- **使用场景**：主要用于在 Bean 的实例化之前修改 Bean 的定义，例如修改属性值、添加新属性等。可以对容器中所有的 BeanDefinition 进行操作。

#### BeanPostProcessor：

- **作用时机**：在 Bean 实例化和初始化过程中对 Bean 进行加工处理。
- **触发时间**：在 Bean 的生命周期的初始化阶段，即 Bean 实例化后，在调用 Bean 的初始化方法前后。
- **常见实现类**：常用的实现类包括`AutowiredAnnotationBeanPostProcessor`用于处理自动装配等。
- **使用场景**：用于对容器中的 Bean 实例进行个性化定制，比如添加切面、动态代理、属性填充等操作。可以针对每个具体的 Bean 进行个性化的定制操作。

#### 使用场景：

- 当你需要在 Bean 的定义阶段进行修改时，例如修改属性值，添加新属性等，你可以使用`BeanFactoryPostProcessor`。
- 当你需要对容器中所有的 Bean 实例进行处理，例如添加某些共通的逻辑、动态代理等操作时，你可以使用`BeanPostProcessor`。

### springboot 启动

当谈及 Spring Boot 的核心注解时，每个注解都有其独特的作用和功能：

1. **@SpringBootApplication**：

   - 这是 Spring Boot 应用程序的入口点。它是一个组合注解，包含了`@Configuration`、`@EnableAutoConfiguration`和`@ComponentScan`。
   - `@Configuration`：声明这是一个配置类，用于定义 Bean。
   - `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制。
   - `@ComponentScan`：指定要扫描的基本包路径，寻找和注册 Bean。

2. **@EnableAutoConfiguration**：

   - 这个注解启用 Spring Boot 的自动配置功能，它会根据类路径上的依赖和配置自动配置 Spring 应用程序上下文所需的 Bean。

3. **@ComponentScan**：

   - 用于指定 Spring 应用程序上下文中需要扫描的基本包路径。它会自动扫描并注册被`@Controller`、`@Service`、`@Repository`和`@Component`等注解标记的类作为 Bean。

4. **@Configuration**：

   - 这个注解表示这是一个配置类，通常与`@Bean`注解一起使用，用于声明 Bean。
   - 在这个类中，可以使用`@Bean`注解声明 Bean 实例。

5. **@Bean**：

   - 在`@Configuration`类中使用，用于声明一个 Bean 实例。Spring Boot 在启动时会自动扫描并注册这些 Bean。

这些注解共同作用于 Spring Boot 应用程序的启动和配置过程中，确保应用程序能够正确地加载、配置和管理 Bean，并启用自动配置功能。

### 约定大于配置

"约定大于配置"是指在软件开发中，框架或工具默认使用一组约定（规则），而不是强制要求开发人员提供详尽的配置来使其工作。这个概念旨在简化开发人员的工作，减少配置的复杂性，提高开发效率。

在 Spring Boot 中，“约定大于配置”的思想体现在很多方面：

1. **默认配置**：Spring Boot 提供了许多默认配置，使得开发者可以直接开始编写应用程序而无需过多配置。例如，它会自动配置数据库连接、日志、Web 服务器等常见功能，遵循一些通用的最佳实践。
2. **自动配置**：Spring Boot 通过自动配置机制来减少手动配置的需求。它会根据应用程序中引入的依赖，自动配置相关的功能，例如，如果添加了数据库依赖，Spring Boot 会尝试自动配置数据库连接。
3. **约定的目录结构**：Spring Boot 鼓励使用特定的目录结构组织代码，例如，在`src/main/java`中放置 Java 代码，在`src/main/resources`中放置资源文件。这种目录结构可以使得 Spring Boot 能够自动识别并配置应用程序。
4. **默认 Bean 命名**：Spring Boot 根据一定的命名规范来创建 Bean，例如，`@Component`注解的类默认会以类名的小写形式作为 Bean 的名称。

这种设计理念使得 Spring Boot 更加易用，开发者可以更快速地构建应用程序，同时避免了大量的手动配置。但是，有时候也可能需要根据实际需求对默认行为进行定制或覆盖，这时可以通过提供自定义的配置或注解来修改默认行为。

总的来说，“约定大于配置”使得开发者可以专注于业务逻辑而不是底层的配置细节，提高了开发效率和整体一致性。

[[chatGPT]]

---

### 参考文献

- [Spring](https://spring.io/)
- [SpringAdvance](https://github.com/DespairYoke/java-advance)
- [Spring 框架的设计理念与设计模式分析](https://www.ibm.com/developerworks/cn/java/j-lo-spring-principle/)
- [Spring：源码解读 Spring IOC 原理](https://www.cnblogs.com/ITtangtang/p/3978349.html)
