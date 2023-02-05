package main

import (
	"fmt"
	"time"
)
import "github.com/confluentinc/confluent-kafka-go/kafka"

func Produce(msg []byte, topic string) {
	configMap := &kafka.ConfigMap{
		"bootstrap.servers": "host.docker.internal:9094",
	}

	kafkaProducer, err := kafka.NewProducer(configMap)
	if err != nil {
		panic(err)
	}

	kafkaProducer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{
			Topic: &topic,
			Partition: kafka.PartitionAny,
		},
		Value: msg,
	}, nil)
}

func main() {
	// fmt.Println("Hello World")
	i := 0
	for {
		time.Sleep(2 * time.Second)
		i += 1
		Produce([]byte(fmt.Sprintf("NFE %d emitida\n", i)), "nfe")
		fmt.Println("NFE emitida: ", i)
	}
}