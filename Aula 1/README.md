# Introducao

# # Sem container (antigamente)

- Uso de maquinas virtuais
- Virtualiza o sistema operacional inteiro
- "Roubo" de memoria RAM do computador
- Varias maquinas virtuais geram muito custo

# # Container (hoje)

- Apenas um processo
- Não precisa do "Roubo" de memória do computador
- Solução barata e eficiente

# Instalação

- https://github.com/codeedu/wsl2-docker-quickstart

# Agentes do docker

# # Docker Deamon

- Servidor que administra os containers

# # Docker Client

- Se comunica com o deamon
- Chama o deamon por comandos no terminal

# Container e Imagem

# # Imagem

- Define o ambiente em que será executado
- "Como se fosse uma classe"

# # Container

- Inicia a imagem tornando-a um container
- "Como se fosse a instancia da classe"

# DockerHub

- `https://hub.docker.com/`
- Repositório de imagens
- Quando a imagem não é encontrada localmente ele procura no docker hub

# Volumes

- Dentro do root do container temos pastas igualmente o local (/usr, /var, ...)
- Passa projetos da minha maquina para uma pasta do container
- Cria um bind com ação dupla, qualquer alteracao em um arquivo na minha maquina muda no container e qualquer alteracao em um arquivo no container muda na minha maquina

# Imagens personalizadas

- Para criar imagens personalizadas iremos criar um arquivo Dockerfile
- Esse arquivo ficarao comandos que criarao a imagem personalizada

# # Comandos Dockerfile

1. FROM <IMG_BASE> - A imagem será criada com uma imagem base (<IMG_BASE>)

2. COPY <PATH_TO_COPY_MAQ> <PATH_TO_PASTE_DOCKER> - Copia o arquivo ou pasta informada (<PATH_TO_COPY_MAQ>) para a pasta informada no docker (<PATH_TO_PASTE_DOCKER>)

# Exemplos

1. Exemplo 1

   - Levantar um container hello-world
   - `docker run hello-world`
   - Notar que a imagem não estava na maquina e foi procurada online

2. Exemplo 2

   - Levantar um servidor web
   - `docker run nginx:1.19.10-alpine`
   - Imagem do nginx na versão 1.19.10 com linux alpine (linux pequeno)
   - O container roda na porta 80 mas não é acessado no nosso computador
   - Nossa maquina (host) não tem conhecimento de que o contanier está rodando nessa porta
   - Devemos fazer um bind de potas: qual a porta que vou habilitar no host que será acessado pelo container
   - `docker run -p 8000:80 nginx:1.19.10-alpine`
   - Iremos agora executar no modo iteravel o container, isso fara com que possamos entrar dentro do container e utilizar comandos em seu terminal, ao inves de utilizarmos comandos na nossa maquina (host)
   - Para isso é necessário o ID do container (<CONTAINER_ID>), então verificaremos ele:
   - `docker ps`
   - Ao executarmos o modo iteravel do container é necessário informar qual shell script será usado, exemplo: bash, sh, ... . Isso irá depender da sua imagem
   - `docker exec -it <CONTAINER_ID> bash`
   - Entraremos na pasta que contem o html no container
   - `cd /usr/share/nginx/html/`
   - Verificaremos os arquivos na pasta
   - `ls`
   - Leremos o arquivo html do container
   - `cat index.html`
   - Editaremos o arquivo
   - `vi index.html`
   - Sairemos no modo de edição
   - `CRTL + C + :wq + ENTER`
   - Sairemos do modo execução
   - `exit`
   - Podemos agora recarregar a página no localhost:8000 e ver a mudança

3. Exemplo 3

   - Rodaremos agora o servidor mas sem travar o terminal e com uso de volumes
   - O uso de $(pwd) pega a pasta atual de trabalho da maquina
   - `docker run -v $(pwd):/usr/share/nginx/html -d -p 8000:80 nginx:1.19.10-alpine`
   - Podemos alterar agora arquivos na pasta que estamos e isso ira alterar o container

4. Exemplo 4

   - Criaremos um arquivo Dockerfile
   - `touch Dockerfile`
   - linha 1 do Dockerfile: `FROM nginx:1.19.10-alpine`
   - Ou seja, a imagem base para criação da nossa imagagem será nginx:1.19.10-alpine
   - Criaremos um arquivo index.html com somente uma tag h1
   - linha 2 do Dockerfile: `COPY index.html /usr/share/nginx/html`
   - sera copiado o index.html criado na nossa maquina para o path /usr/share/nginx/html do container
   - Criaremos a nossa imagem
   - `docker build -t custom-nginx .`
   - Criaremos nosso container com base na imagem feita
   - `docker run -d -p 8000:80 custom-nginx`
   - Agora poderemos ver no localhost:8000 o arquivo index feito
   - Podemos tambem alterar o arquivo index.html para ver que ainda não modificou o container, para modificar o container devemos parar ele com o comando `docker stop <CONTAINER_ID>`, criar novamente a imagem com o comando `docker run -d -p 8000:80 custom-nginx` e por fim ver a alteração feita no localhost:8000
   - Iremos agora enviar nossa imagem para o dockerHub
   - Para isso faremos o login no docker hub
   - `docker login`
   - Criaremos novamente a imagem, mas agora com o padrao de nome
   - `docker build -t aaguero96/custom-nginx:latest .`
   - Publicaremos a imagem no dockerHub
   - `docker push aaguero96/custom-nginx:latest`
   - Excluiremos a imagem feita
   - `docker rmi aaguero96/custom-nginx:latest`
   - E para efeitos de verificacao iremos criar um container com a nossa imagem publicada e nao mais a local, ja que ela está excluida
   - `docker run -d -p 8000:80 aaguero96/custom-nginx:latest`
   - Todos os arquivos produzidos nesse exemplo serao colocados para uma pasta nginx

5. Exemplo 5

   - Criaremos um container para mysql
   - `docker run mysql:5.7`
   - Aparecera um erro, pois é necessario mandar juntamente usuario, senha e database como env, faremos isso entao
   - `docker run -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=meu_banco mysql:5.7`
   - Entraremos no terminal do container
   - `docker exec -it <CONTEINER_ID> bash`
   - Acessaremos o mysql
   - `mysql -uroot -p`
   - Digitaremos a senha (admin) passada como env
   - Mostraremos os bancos de dados
   - `SHOW DATABASES;`
   - Entraremos no banco criado por env (meu_banco)
   - `USE meu_banco`
   - Criaremos um novo Dockerfile para uma imagem com base no node
   - `touch Dockerfile`
   - linha 1 do Dockerfile: `FROM node:14.17.0-slim`
   - linha 2 do Dockerfile: `CMD ["tail", "-f", "/dev/null"]`
   - Criaremos a imagem com base no node
   - `docker build -t custom-node .`
   - Criaremos o container
   - `docker run -v $(pwd):/home/node/app custom-node` se usar powershell colocar `${pwd}`
   - Entrar no container com o comando `docker exec -it <CONTAINER_ID> bash`
   - Agora estamos dentro do container que possui um volume, ou seja, o que mudarmos no container mudaremos automaticamente muda no local, portanto seria mais apropriado agora mencionar local, para alteracoes no local, e container para alteracoes e comandos no container
   - Iniciaremos o gerenciador de pacotes npm de forma padrao
   - `npm init -y` (container)
   - Instalaremos o express
   - `npm install express` (container)
   - Veja que esses dois passo embora feitos no container sao transparecidos no local
   - No arquivo index (local) escrevermos um codigo simples com express (hello-world)
   - Pararemos o container pois devemos agora fazer o bind da porta 3000 usada no express do container
   - `docker run -v $(pwd):/home/node/app -p 3001:3000 custom-node` (local)
   - Voltaremos ao container
   - `docker exec -it <CONTAINER_ID> bash`
   - Rodaremos a api
   - `node index.js` (container)
   - É muito legal perceber que por mais que esteja escrito no terminal `Example app listening on port 3000` como fizemos o bind para 3001 local, ele esta rodando no localhost:3001
   - Faremos agora uma alteracao local no arquivo index.js
   - E quando rodarmos novamente o comando `node index.js` no conatainer, tera modificado o localhost:3001
   - Pararemos os containers ativos
   - E agora caso queiramos voltar os containers teriamos que fazer dois comandos no terminal, entretanto, para facilidade utilizaremos o docker-compose
   - `touch docker-compose.yaml`
   - Escreveremos no nosso docker compose, quais container gostariamos de criar
   - Agora pormos criar todos os containers ao mesmo tempo
   - `docker compose up`
   - Percebemos agora que tem dois containers rodando ao mesmo tempo
   - Para entrar nos containers agora ficara mais facil, pois os nomes colocados nos services sao os nomes dos containers
   - `docker compose exec app bash`
   - Rodaremos o app no container
   - `node home/node/app/index.js`
   - A ideia de container por mais que seja interessante tem que trazer junto a ideia de algo temporario, que sera finalizado alguma hora, portanto caso queiramos manter os dados devemos configurar volumes
   - Devemos entao criar um volume para mysql
   - Algo interessante é que caso nao tenhamos a pasta localmente e citamos ela no volume, o docker compose criara ela

# Comandos terminal

1. Rodar container da imagem (<IMAGE_NAME>) - `docker run <IMAGE_NAME>`

2. Listar imagens na sua máquina (local) - `docker image ls`

3. Listar imagens na sua máquina (local) com filtro (<FILTRO>) - `docker image ls | grep <FILTRO>`

4. Forçar o container a parar - `CRTL + C`

5. Rodar container da imagem fazendo bind da porta local (<PORTA_LOCAL>) para porta do container (<PORTA_CONTAINER>) - `docker run -p <PORTA_LOCAL>:<PORTA_CONTAINER> <IMAGE_NAME>`

6. Listar containers na sua máquina (local) que estão rodando - `docker ps`

7. Executar um comando em um container (<CONTAINER_ID>/<CONTAINER_NAME>) que está sendo executado, com modo iterativo, ou seja, podemos descrever varios comandos no terminal escolhendo o shell script (<SHELL_SCRIPT>), o container deve estar obrigatoriamente em execução para isso.

   - `docker exec -it <CONTAINER_ID> <SHELL_SCRIPT>`
   - `docker exec -it <CONTAINER_NAME> <SHELL_SCRIPT>`

8. Rodar container da imagem fazendo bind da porta local (<PORTA_LOCAL>) para porta do container (<PORTA_CONTAINER>) mas sem travarar o terminal (deteach) - `docker run -d -p <PORTA_LOCAL>:<PORTA_CONTAINER> <IMAGE_NAME>`

9. Para o container (<CONTAINER_ID>/<CONTAINER_NAME>)

- `docker stop <CONTAINER_ID>`
- `docker stop <CONTAINER_NAME>`

10. Rodar container da imagem fazendo bind da porta local (<PORTA_LOCAL>) para porta do container (<PORTA_CONTAINER>), sem travarar o terminal (deteach) e fazendo o bind de pastas (volume) da pasta da maquina (<DIR_MAQ>) para pasta do docker (<DIR_DOCKER>) - `docker run -v <DIR_MAQ>:<DIR_DOCKER> -d -p <PORTA_LOCAL>:<PORTA_CONTAINER> -v <IMAGE_NAME>`

11. Criar uma imagem com nome/tag informado (<IMAGE_NAME>) com base em um arquivo Dockerfile localizado no path informado da sua maquina (<PATH_DOCKERFILE>) - `docker build -t <IMAGE_NAME> <PATH_DOCKERFILE>`

12. Fazer o login no dockerHub - `docker login`

13. Publicar uma imagem no dockerHub, a tag dessa imagem devera ter um usuario do dockerHub (<USER_DOCKERHUB>), um nome para o diretorio do dockerHub em que a imagem ficara (<DIR_DOCKERHUB>) e caso queira uma versão (<IMAGE_VERSION>), caso não tenha sido informado a versao o padrao é latest, ou seja, o nome da imagem (<IMAGE_NAME>) deve estar no padrao `<USER_DOCKERHUB>/<DIR_DOCKERHUB>:<IMAGE_VERSION>` - `docker push <IMAGE_NAME>`

14. Exclui imagens (<IMAGE_NAME>) da maquina (local) - `docker rmi <IMAGE_NAME>`

15. Criar um container, com base em uma imagem (<IMAGE_NAME>), passando variaveis de ambiente (<ENV_1>, <ENV_2>, ...)

    - `docker run --env <ENV_1> --env <ENV_2> <IMAGE_NAME> `
    - `docker run -e <ENV_1> -e <ENV_2> <IMAGE_NAME> `

16. Criar varios containers com um arquivo `docker-compose.yaml` - `docker compose up`

17. Entrar dentro de um container (<SERVICE_NAME>) gerado por docker compose, so devemos informar o shell script (<SHELL_SCRIPT>) - `docker compose exec <SERVICE_NAME> <SHELL_SCRIPT>`

18. Parar todos os containers que foram gerados por docker compose - `docker compose stop`

19. Remover todos os containers que foram gerados por docker compose - `docker compose kill`

# Extensões uteis no vscode

- Dev Containers
- Docker
