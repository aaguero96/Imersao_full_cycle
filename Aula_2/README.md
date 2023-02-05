# Introdução

## Nestjs

- Node framework para construir grandes aplicações

# Download

- Install nodejs
- `npm install -g @nestjs/cli`

# Aplicação Nest

- O padrão é typescript
- Quando rodo a aplicação ele compilar os arquivos em typescript na pasta src para arquivos javascript na pasta dist
- o projeto se inicia no arquivo src/main.ts
- Tudo feito no nest precisa estar em modulos (src/app.modules)
- Utiliza decorators nos modulos @Module
- Cada modulo possui um controller e um provider
- O nest possui os controler na pasta src/app.controllers
- Utiliza decorators nos controllers @Controller
- Cada metodo do controller possui um decorator indicando o metodo HTTP (@Get)
- Os controller chamam os services (src/app.services)
- Em cada service se encontra a regra do negocio
- Os servicos possuem decorators @Injectable que marca a classe como um provider
- Podemos modificar a rota no decotator do metodo do controller (@Get, @Post, @Delete, @Patch)
- Podemos modificar o prefixo da rota no decotator do controller (@Controller)

# Arquitetura Hexagonal

- A arquitetura hexagonal é dividida em duas partes: `Driving side` e `Driven side`
- O objetivo é fazer o `Driven side` conversar com o `Driving side`
- Para fazermos a comunicacao precisamos de um conceito chamado `ports`
- Todos os lados se cominicam pelas `ports`
- Os metodos que sao inseridos nos `ports` sao chamados de `adapters`

## Driving side (lado que dirige)

- Os agentes consumidores do projeto
- exemplo: Usuarios, REST API, TESTS, ...

## Driven side (lado dirigido)

- Objetivo final quando se projeta a regra de negocio
- exemplo: Banco de dados, Envio de email, Chamadas http, ...

## Ports

- Regem o core ou dominio da minha aplicacao
- O `driving side` acessa o `domain` da aplicacao atravez de uma `port`
- O `driven side` acessa o `domain` da aplicacao atravez de uma `port`

# Exemplos

- Iniciar aplicacao nest
- `nest new nest-hexagonal-arch`
- Selecionar npm como gerenciador de pacotes
- Foi criada uma pasta com nome nest-hexagonal-arch
- `cd nest-hexagonal-arch`
- Rodar a aplicacao
- `npm run start:dev`
- Verificar a aplicacao rodando com base nos logs no terminal e no localhost:3000
- Podemos alterar a rota modificando o decorator do metodo do controller para @Get('/test')
- Nao ha necessidade de salvar uma vez que foi dado npm run start:dev na aplicacao
- Agora essa rota esta funcionando em localhost:3000/test
- Podemos alterar o prefixo da rota modificando o decorator do controller para @Controller('/prefix')
- Agora essa rota esta funcionando em localhost:3000/prefix/test
- Iremos agora criar novos recursos na nossa API
- Como estamos utilizando nest isso pode ser feito de maneira simples
- `nest generate resource`
- O nome do recurso é lists
- Esse recurso é uma REST API
- E sera necessario gerar um CRUD
- Foi criada uma nova pasta lists com o mesmo modelo da pasta src
- O modulo novo criado (src/lists) é registrado no src/app.module na secao de imports
- Dentro da pasta raiz iremos criar um arquivo API.http
- `touch API.http`
- Caso prefira usar postman, insomnia ou outro software que faca requisicoes tudo bem
- Agora nesse arquivo podemos fazer as requisições por exemplo digitando `GET http://localhost:3000/lists` e pressionando `Send Request` a resposta sera dada no vscode
- Os separadores de requisicoes sao uma linha entre as requisicaoes com `###`
- Podemos colocar no arquivo API.http `GET http://localhost:3000/lists/1` para encontrar um elemento especifico
- Podemos colocar no arquivo API.http `POST http://localhost:3000/lists` para adicionar elementos na lista, entretanto apos ele precisamos indicar o `Content-Type: application/json` e o corpo abaixo

```
   {
      "name": "My List"
   }
```

- Iremos criar uma entidade no arquivo /src/lists/entities/list.entity.ts
- Para criar ela utilizaremos o decorator na classe List @Table()
- Tambem iremos extender a classe Lists de uma classe Model
- Iniciaremos com a coluna column para isso criaremos um atributo da classe Lists chamada name do tipo string tendo o decorator @Column
- Utilizaremos tambem um typo que confere todos os atributos da lista ListAttributes, e iremos passa-lo a classe por meio de generics `export class List extends Model<ListAttributes>`
- Como estamos utilizando o sequelize é necessario importar o modulo SequelizeModule no imports do src/app.module
- Esse import sera feito com a propriedade .forRoot em que indicaremos o dialeto que queremos utilizar, o host, os models, autoLoadModels e outros atributos
- O dialeto sera 'sqlite'
- O host sera ':memory:' para que toda vez que salvarmos os dados sejam resetados
- Os models serao as entidades e devem ser passadas dento do array dessa propriedade, no caso so teremos a entity Lists
- No modulo lists precisamos alterar os imports tambem
- Nesse caso o unico modulo necessario sera SequelizeModule.forFeature(), onde dento dele passaremos um arrat com todas as entities utilizadas, no caso so teremos a entity Lists
- Os modulos recebem como import o que necessitam para ser construidos, no caso do app.module é necessário sequelize e lists, e no lists.module é necessario somente o sequelize
- Agora iremos alterar a regra do negocio que fica no lists.service
- Adicionaremos um constructor que recebe um parâmetro privado listModel no qual sera colocado um decorator @InjectModel(List)
- Modificaremos o metodo create, que como se nota possui um argumento, que sera validado por um dto, portanto primeiramente precisamos alterar o dto (DATA TRANSFER OBJECT) CreateListDto
- Agora modificaremos o findAll e o findOne
- Agora simularemos uma aplicacao externa utilizando json-server
- Iremos criar na raiz do projeto um arquivo crm.json (servico externo simulado)
- `touch crm.json`
- No arquivo package.json iremos incluir um comando para criar esse servico
- `"fake-api": "json-server --watch crm.json --port 8000"`
- `npm run fake-api`
- Agora temos uma API fake rodando na porta 8000, podemos ate mesmo adicionar uma nova linha no API.http `GET http://localhost:800/lists`
- Adicionaremos no list.module o httpModule para o servico externo
- Podemos agora fazer requisicoes para api externa dentro do lists.service uma vez que o elemento da lista deve ser cadastrado tanto no banco de dados (sqlite) como no servico simulado (crm)
- Precisamos somente adicionnar mais uma variavel no constructor, httpService
- Modificaremos a funcao create
- Ao fazermos novamente a chamada POST para a porta 8000, agora tanto o banco local é modificado quanto o arquivo crm.json
- É notado que ha algo estranho no novo create, embora de certo ha um problema, caso uma requisicao falhe a outra pode ocorrer
- Tentaremos criar um teste unitario para verificar se esta bom esse codigo
- Percebe-se que o codigo demanda de muitos mocks para construir um teste devido ao extremo acoplamento com o banco de dados
- Para solucao desse problema introduzimos a arquitetura hexagonal
- Criaremos uma porta
- Para isso iniciaremos criando uma pasta dentro de lists com nome `gateways`
- Dentro dessa pasta teremos um arquivo chamado `list-gateway-interface.ts` e nele tera uma interface `ListGatewayInterface`
- Tambem na pasta entities criaremos uma nova entidade `list.model.ts`
- Essa entidade tera o mesmo codigo da `list.entity.ts`, inclusive ela sera usada no lugar da `list.entity.ts` em todos os arquivos, ou seja, mudaremos todas as chamadas de `list.entity.ts` para `list.model.ts`
- Iremos modificar o `list.entity.ts` para nao depender do sequelize, somente deixaremos uma classe
- Agora podemos adicionar a `list.entity.ts` como parametros das funcoes da interface `ListGatewayInterface`
- Agora podemos trocar no service o uso do ListModel pelo ListGateway
- Finalmente criamos uma porta, pois o ListModule nao depende mais do sequelize somente do ListGateway
- Com a porta criada, criaremos um adaptador, pois precisamos conectar o ListGateway ao ListModel (sequelize)
- Na pasta gateways criaremos outro arquivo `list-gateways-sequelize.ts` que tera uma classe nova `ListGatewaySequelize` que implementa `ListGatewayInterface`
- O que entra e o que sai da classe `ListGatewaySequelize` é sempre a lista `ListGatewayInterface`
- Entretanto o service nao reconhece as funcoes do listGateway pois ele nao é provider
- Colocaremos entao o `ListGatewaySequelize` como providers no `lists.module.ts`
- Mas isso nao ira adiantar pois a interface ainda deve receer o sequelize para funcionar, entao faremos uma mudanca, iremos prover o `ListGatewayInterface` usando o provider existente `ListGatewaySequelize`, isso no arquivo `lists.module.ts`
- So precisamos agora injetar o `ListGatewayInterface` no constructor da classe ListsService
- Fazendo essa "volta" agora temos um ganho nos testes, agora podemos criar um gateway novo, simulando o gateway do sequelize
- Temos entao a implemnetacao dos ports que é a inferface e os adapters que é o que é compativel com as portas
- Faremos agora um adapter para o Http seguindo o mesmo padrao
- `list-gateway-http.ts` > `ListGatewayHttp implements ListGatewayInterface` > Adicionar nos providers do modulo `list.module.ts` > Injetar no service `list.service.ts`
- Refinaremos os testes unitarios
- Retiramos o acomplamento com servicos, pela arquitetura hexagonal, entretanto temos erros a tratar, caso uma chamada falhe e uma de certo, o que deve ocorrer?
- Para resolver trabalharemos com eventos no nest
- Criaremos uma pasta chamada events dentro de lists
- Dentro de events teremos um novo arquivo `list-created.event.ts` que tera uma classe, nela deve conter por inicio um constructor que recebe uma List (entity)
- Criaremos outra pasta chamada listeners dentro de lists
- Dentro de events teremos um novo arquivo `create-list-in-crm.listener.ts` que tera uma classe
- A classe listener possuira um metodo handler que recebe um event e um metodo que cria uma list no CRM
- A classe listener e tambem injetada pelo nest e o metodo dela possui um novo decorator @OnEvent('nome do evento')
- Como ele é injetado ele deve ser colocado nos providers
- Como ja possuimos um event entao removeremos do service a parte do http
- Para hablititar o uso de eventos no nest, devemos incluilo no imports do modulo raiz `app.modulo.ts`
- Agora podemos utilizar o event criado dentro do service
- Devemos tambem criar um novo provider com um alias
- Podemos agora injetar esse provider no service eventEmitter
- O event/listener ja funciona, quando o evento de criar na api ocorre a criacao no crm, entretanto ainda ha o mesmo porblema de que se um for criado o outroo nao é
- Para isso precisaremos trabalhar com filas, utilizaremos docker nessa etapa
- Criaremos um Dockerfile na raiz do projeto
- Usaremos aqui um comando novo do Dockerfile `USER`
- Usaremos aqui um comando novo do Dockerfile `WORKDIR` para habilitar uma pasta padrao de trabalho no container
- Tambem na raiz criaremos um docker-compose
- Nesse docker compose teremos tanto nosso app, quanto o sistema de filas redis
- Ao inves do event criar o arquivo diretamente ele criara um job que sera processado
- Criaremos um novo listener `publish-list-created.ts` 
- Filas serao adicionadas no modulo principal e no modulo lists
- Podemos agora injetar (@InjectQueue) no listener `publish-list-created.ts`
- So precisamos criar um job para fazer a fila executar em paralelo
- Na pasta lists criaremos a pasta jobs
- Na pasta jobs criaremos um arquivo `create-list-in-crm.job`
- Somente resta registrar no provider o PublishListCreatedListener e CreateListInCRMJob
- Finalizaremos modificando os testes

## Conclusao

- Criamos portas atraves de interfaces (gateway)
- Aplicamos as interfaces como tipo de cada service
- Criamos classes que implementam as portas chamadas adapters (gateway)
- Essas classes serao colocadas nos providers do modulo e injetadas no servico
- Criando assim a nao dependencia de servicos externos, pois uma vez que queiramos instanciar novamente a classe com valores mockados para teste, é só alterarmos seu valor seguindo a porta, criado um adapter para o teste

# Comandos Terminal

1. Criar aplicação nest com nome informado (<APP_NAME>) - `nest new <APP_NAME>`

   - Deve-se selecionar um gerenciador de pacotes

2. Rodar a aplicacao em modo dev, ou seja, sempre quando o arquivo é modificado nao é necessario rodar novamente - `npm run start:dev`

3. Criar uma aplicacao fake com json-server, que tem como base o arquivo json (<JSON_FILE>) e roda na porta indicada (<PORT>) `json-server --watch <JSON_FILE> --port <PORT>`

# Blibliotecas externas

1. sequelize

   - `npm install sequelize sequelize-typescript @nestjs/sequelize`

2. sqlite3

   - `npm install sqlite3`

3. json-server

   - `npm install json-server --save-dev`
   - A tag --save-dev serve para indicar que nao sera um pacote que sera instalado no npm install somente em dev
   - Utilizado para criar uma api fake

4. axios

   - `npm install @nestjs/axios`

5. rxjs

   - Utilizado no exemplo para transformar Observable em Promise

6. event-emitter

   - `npm install @nestjs/event-emitter`

7. @nestjs/bull

   - `npm install @nestjs/bull bull`
   - `npm install --save @types/bull`

# Extensoes recomendadas

- Prettier
- REST Client
- Jest Runner
