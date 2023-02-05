# Introdução

- O problema a ser resolvido sao diversas requisicoes feitas de um sistema (A) para outro (B), podendo causar bloqueios e travamentos
- Requisicoes sincornas nao sao boas em alguns sistemas (nao escalaveis)
- A resolucao desse problema sera criar um sistema intermediario (K) que recebe as requisicoes do sistema (A) de forma asincrona e quando processar envia para o outro sistema (B) evitando bloqueio
- Entretanto a desvantagem é que a resposta da solicitacao tem um tempo de processamento e nao saberemos quando ira ocorrer
- Trabalharemos orientado a eventos
- O sistema intermediario pode enviar a sua resposta para diversos outros sistemas tambem
- O sistema intermediario é chamado de KAFKA

# KAFKA

- Sistema de plataforma de stream de eventos, aguenta muito volume de dados (high throughput)
- Alta escalabilidade
- O KAFKA recebera um dado de um `producer`
- O KAFKA é dividido em `brokers` (sistema rodando KAFKA)
- O conjunto de `brokers` é denominado `cluster`
- Os dados recebidos pelo KAFKA sao imutaveis
- Podemos entender o KAFKA como um banco de dados que possui diversos logs de um dado apos o outro
- O `consumer` le as mensagens enviada pelo KAFKA
- Cada dado mandado ou enviado ao KAFKA esta disponibilizado em um `topic`
- Temos a opcao de discartar dados (notificacoes) ou persistir eles por um tempo

# Exemplo

- Iniciaremos nosso exemplo com um arquivo `docker-compose.yaml` que contem um app com go rodando, um zookeper, um kafka e um control-center
- Tambem precisamos de um `Dockerfile` para o uso desse docker-compose
- Rodaremos os containers `docker compose up -d`
- Abrirmos `localhost:9021` onde esta rodando o control-center onde vemos quantos clusters estao rodando e a informacao sobre ele
- Entraremos no cluster `CONTROLCENTER_CLUSTER`
- Na aba `TOPICS` criaremos nosso primeiro topico chamado `nfe`
- Com o topico criado entraremos na aba `Messages` e criaremos uma mensagem
- Podemos usar o valor padrao definido pelo central-center e iremos produzir essa mensagem
- Novamente no aba de mensagens daremos play para solicitar a busca de mensagens mas devemos modificar para `Jump to offset` e `0/Partition:0`
- Entraremos no container kafka
- `docker compose exec kafka bash`
- Agora podemos ler o que o consumer esta recebendo na porta 9092 no topic nfe
- `kafka-console-consumer --bootstrap-server=localhost:9092 --topic=nfe --from-beginning`
- Abriremos outro terminal novamente no container kafka
- `docker compose exec kafka bash`
- Mas agora iremos avaliar o funcionamento do producer
- `kafka-console-producer --bootstrap-server=localhost:9092 --topic=nfe`
- Apos o comando podemos mandar mensagens nas proximas linhas do terminal
- `{"status": 1}`
- Percebe-se que apos mandar a mensagem no terminal rodando o producer o terminal rodando o consumer reccebera ela
- caso eu retire o `--from-begining` do consumer ele somente lera as mensagens novas
- Podemos notar que a leitura das mensagens pode ocorrer a qualquer momento, caso nao sejam removidas
- Faremos um teste, no terminal consumer rodar o comando `kafka-console-consumer --bootstrap-server=localhost:9092 --topic=nfe`
- E no terminal producer mandar uma nova mensagem `{"status": 2}`
- Somente aparecera essa mensagem nova no terminal consumer pois nao foi passada a tag `--from-begining`
- Mas para nao ficarmos presos ao terminal faremos um programa para enviar e ler mensagens usando golang