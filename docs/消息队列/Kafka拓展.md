---
title: Kafka拓展
date: 2024-01-21 12:32:20
Tags:
  - tech
Draft: true
HideInList: false
Feature: 
IsTop: false
---

## 生产者

这些内容主要描述的是 Kafka 的生产者端的用法，下面我来分别说明一下它们的使用场景：

1. **生产消息的 API**：这是 Kafka 的 Java 客户端提供的生产者 API 对象，用于创建消息并发送到 Kafka 的 topic 中。在实际业务中，假设你的系统需要将日志或处理结果写入到 Kafka 中以供其他系统消费，你就需要使用这个 API。

2. **配置**：这些配置参数包括 **broker 的地址、发布确认机制、重试次数、批次大小和等待时长、缓冲区大小**等，这些参数影响到生产者发送消息的效率和可靠性。例如，publish confirmation mechanism 能够保证生产者能够得到消息是否发布成功的确认，对于数据可靠性要求高的场景非常重要。

3. **Topic 和分区指定**：你可以在生产消息时指定消息发送到哪个 topic 和分区，这可以根据业务需求来决定。例如，你可能会根据用户 ID 的 hash 值来选择分区，这样所有同一个用户的消息都会在同一个分区。

4. **回调函数**：当生产者发布消息后，你可能需要执行一些额外的动作，例如记录日志、发送通知等，这些都可以通过注册回调函数来实现。

5. **自定义拦截器**：可以对发送的消息做一些预处理，例如修改消息内容、变更消息格式、添加额外的元数据等。通过实现`ProducerInterceptor`接口，并注册到生产者配置中，可以实现这个功能。

6. **实现 ProducerInterceptor 接口**：通过实现接口中的`onSend`，`onAcknowledgement`和`close`方法，你可以在消息发送前、发送后和生产者关闭时执行自定义的逻辑。

7. **自定义分区**：当 Kafka 的默认分区规则不能满足你的业务需求时，你可以实现自定义的分区逻辑。例如，你可能想要按照业务属性来对消息进行分区，可以通过实现`Partitioner`接口的`partition`和`close`方法来实现。

这些内容基本涵盖了 Kafka 生产者的使用，包括消息生产、配置优化、处理逻辑自定义等方面，对于使用 Kafka 处理大数据场景非常重要，从而提高处理效率和保证数据的正确性。

## 案例

当然了，让我来为你一一举例说明：

1. **生产消息的 API**：生产消息就是创建 ProducerRecord 对象，然后使用 producer.send()方法发送出去。

   ```
   KafkaProducer<String, String> producer = new KafkaProducer<>(props);
   ProducerRecord<String, String> record = new ProducerRecord<>("topic", "key", "value");
   producer.send(record);
   producer.close();
   ```

2. **配置**：这主要就是通过 Properties 对象进行，例如我们可以设置 broker 的地址，重试次数等。

   ```
   Properties props = new Properties();
   props.put("bootstrap.servers", "localhost:9092");
   props.put("retries", 3);
   ```

3. **指定 Topic 和 Partition**：当你创建 ProducerRecord 对象时，可以指定消息发送到哪个 Topic 和分区。

   ```
   ProducerRecord<String, String> record = new ProducerRecord<>("topic", 1, "key", "value");
   ```

4. **回调函数**：在消息发送后，你可能想要确认消息是否发送成功，就可以使用回调函数。

   ```
   producer.send(record, (metadata, exception) -> {
       if (exception != null) {
           exception.printStackTrace();
       } else {
           System.out.println("The offset of the record we just sent is: " + metadata.offset());
       }
   });
   ```

5. **自定义拦截器**：比如我们要在每条消息前面加上时间戳：

   ```
   public class TimeStampPrependerInterceptor implements ProducerInterceptor<String, String> {
       @Override
       public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
           return new ProducerRecord<>(
                   record.topic(),
                   record.partition(),
                   record.timestamp(),
                   record.key(),
                   System.currentTimeMillis() + "," + record.value()
           );
       }
       ...
   }
   ```

6. **实现 ProducerInterceptor 接口**：在自定义拦截器时需要实现此接口的各个方法，上面的例子就是实现了 onSend 方法。

7. **自定义分区**：比如我们要把含有特定字符串的消息发送到特定的分区：
   ```
   public class CustomPartitioner implements Partitioner {
       @Override
       public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
           List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
           int numPartitions = partitions.size();
           if (((String) key).equals("specialKey")) {
               return numPartitions;  // specialKey消息总是发到最后一个分区
           } else {
               return (Math.abs(Utils.murmur2(keyBytes)) % (numPartitions - 1));  // 其他消息发到其他分区
           }
       }
       ...
   }
   ```

## 消费者

Kafka 的消费 API 关键参数包括：

1. **broker_ip_port**：这是 Kafka broker 的地址和端口号。消费者需要知道至少一个 broker 的地址来获取 topic 的元数据，从而找到所有分区的 leader broker，以便从这些 leader 消费消息。

2. **消费组**：消费者组是每个 Kafka 消费者必须设置的参数。如果多个消费者有相同的消费者组，则它们会负载均衡地消费数据，互相之间不重复。

3. **offset 是否自动提交**：这个设置指的是 Kafka 是否自动地提交消费者的 offset。如果设置为自动提交，当消费者 poll 数据后，Kafka 会在一定的时间间隔后自动提交 offset。但是如果你希望有更精细的控制，比如只有当消息真正被成功处理后再提交 offset，那么就需要把自动提交关闭，改为手动提交。

4. **offset 提交的间隔**：这个设置指的是自动提交 offset 的时间间隔，单位是毫秒。如果消费者在此间隔内挂掉，那么它可能会重复处理某些消息。

5. **offset 是否重置**：这个设置用于指定当消费者的 offset 不存在或者 offset 超出了范围时，应该从哪里开始消费。这个参数可以设置为"earliest"或者"latest"。"earliest"表示从最早的消息开始消费，"latest"表示从最新的消息开始消费。

6. **keyvalue 反序列化的类**：这个设置用于指定用什么反序列化器去反序列化从 Kafka 收到的消息。Kafka 自带了 ByteArrayDeserializer, StringDeserializer, IntegerDeserializer 等多种反序列化器。根据你的消息类型选择合适的反序列化器即可。

除了这些，还有一个重要的方法是 subscribe，用于订阅 topic。比如 `consumer.subscribe(Arrays.asList("test"))`，这行代码表示你创建的消费者订阅了名为"test"的 topic。Kafka 的消费者是面向 topic 的，所以你需要告诉 Kafka，你的消费者需要消费哪些 topic 的数据。Kafka 会根据你的消费组和订阅的 topic，决定把这些 topic 的哪些分区分配给你的消费者。

## 消息的提交

在处理消息队列中的消息时，消费者通常需要向服务器发送一个确认，称为"提交"，以标记它已经处理了这个消息，从而避免重复处理。这个提交步骤可以是同步的，也可以是异步的。

**同步提交**意味着消费者在处理完一个消息后，会立即发出一个确认请求并等待服务器的回应。这种模式是阻塞的，也就是说，在确认请求得到回应之前，消费者会停止处理新的消息。同步提交有一个好处，那就是它提供了更准确的错误处理，因为你可以立即知道确认请求是否成功。但是，因为它是阻塞的，所以同步提交可能会降低处理速度。

**异步提交**则是非阻塞的。消费者在处理完一个消息后会立即开始处理下一个，而提交请求则是在后台发送的。这种模式可以显著提升处理速度，但是它也有一个缺点，那就是如果提交请求因为某种原因失败了，消费者可能不会立即得知。

至于提交和消费的顺序：

1. **先消费后提交**：这意味着只有当消费者处理完一条消息后，才会向服务器发送确认请求。这样可以确保消费者不会错过任何消息，因为只有当消息被成功处理后才会被标记为已消费。同时，这个模式也可能导致重复消费。如果在消费完消息后和提交确认请求之间，消费者出现了故障，那么这条消息可能会被再次消费。

2. **先提交后消费**：这个模式中，消费者会在处理消息之前就发送确认请求。这可以减少重复消费的可能，因为一旦一条消息被标记为已消费，就不会再被送给消费者。但是，这个模式也有可能导致漏消费问题。如果在提交确认请求后和处理消息之间，消费者出现了故障，那么这条消息就会丢失。

在实际使用中，要根据具体的业务场景和需求，选择最适合自己的消费和提交模式。
