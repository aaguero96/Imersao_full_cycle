package main

import "fmt"
import "github.com/confluentinc/confluent-kafka-go/kafka"

func Consume(topics []string, servers string, msgChan chan *kafka.Message) {
	kafkaConsumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": servers,
		"group.id": "myGruoup",
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		panic(err)
	}

	err = kafkaConsumer.SubscribeTopics(topics, nil)
	if err != nil {
		panic(err)
	}

	for {
		msg, err := kafkaConsumer.ReadMessage(-1)
		if err != nil {
			panic(err)
		}

		msgChan <- msg
	}
}

func main() {
	msgChan := make(chan *kafka.Message)
	topics := []string{"nfe"}
	servers := "host.docker.internal:9094"

	go Consume(topics, servers, msgChan)

	for {
		msg := <-msgChan
		fmt.Println(string(msg.Value))
	}
}