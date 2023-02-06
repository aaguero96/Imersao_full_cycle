# Introducao

- Framwork para aplicacoes frontent
- Utiliza o Reactjs
- O Browser faz o download do inde.html e JS
- Precisa iniciar React e ReactDOM para montar a pagina
- Todas as paginas navegaveis ja estarao no proprop JS baixado
- Renderiza no lado do servidor

## Alguns problemas no lado do browser

- Mais dificil para manter dados de navegacao
- Precisa de recursos no cliente para renderizacao
- Pode ser complexo criar indicadores de carregamento
- Memory leaks

# Nextjs

- Nao precisa de setup
- O padrao e typescript
- Melhora performance para renderizacao usando server em vez do client
- Possui parte backend embora o principal seja frontend
- Retrocompatibilidade
- Possibilidade de ter "zero" JS no browser
- Recurso API routes

## Tipos de pagina

- 

# Exemplo

1. Exemplo pasta pages

- Criaremos uma aplicacao nextjs
- `npx create-next-app --typexscript`
- Daremos o nome da aplicacao
- `iniciando next`
- Projeto sera construido com typescript
- Projeto tera ESlint
- Trabalharemos com a pasta /src
- Usaremos a pasta experimental app/
- Nao tera alias
- Entraremos na pasta do projeto
- `cd iniciando-next`
- Iniciaremos a aplicacao
- `npm run dev`
- Acessaremos a pagina `localhost:3000`
- Dentro da pasta `/src/pages` criaremos um arquivo `home.tsx`
- Nesse arquivo criaremos uma HomePage como uma funcao
- Assim que criado a aplicacao ja ira identificar a pagina pelo url que esta no nome do arquivo, ou seja, para visualizar a pagina basta entrar em `localhost:3000/home`
- Caso queiramos uma rota `localhost:3000/home/xpto/pagina1` basta criar um arquivo em `src/pages/home/xpto/` com o nome de `pagina1.tsx`
- Podemos abrir o Network da nossa pagina e verificar que a pagina é enviada completa pelo servidor
- Rodaremos agora o comando `npm run build`
- Esse comando fala para nos as paginas estaticas que sao geradas
- Para vermos o acesso a informacoes por paginas criaremos um novo arquivo em `/src/pages` chamado `static-side-render.tsx`
- Tambem ciraremos um arquivo em `src/util` (necessario criar pasta util) com nome `models.ts` que tera uma type
- O que gostariamos de fazer é que a pagina nova renderize os produtos de uma fonte externa
- Para isso usaremos o json-server criando um arquivo chamado `api.json` na pasta raiz do projeto e populando ele de acordo com o que queremos que seja renderizado
- Tambem criaremos um novo comando no package.json
- `"json-server --watch api.json -p 8000 -w"`
- Iniciaremos nossa fake-api com o comando `npm run fake-api`
- Agora iremos alterar o arquivo `static-side-render.tsx` para que faca o request para essa API e renderize na tela
- Para isso devemos fazer nesse arquivo o export de uma funcao asincrona `getStaticProps`
- Essa funcao deve chamar a API e retornar um objeto com a propriedade props, sendo esse tambem um objeto com a propriedade que recebe a resposta da API
- Acessando a pagina `localhost:3000/static-side-render` notamos que a pagina é renderizada sem requisicao http
- Novamente rodando o comando `npm run build` notamos que essa nova pagina nao é mais estatica e sim SSG (Static Side Generating)
- Entretanto o dinamismo nao faz parte dessa pagina, caso mudemos os produtos temos que dar um novo start na aplicacao, para esse dinamismo vamos criar mais uma pagina
- A nova pagina ira chamar `incremental-side-regeneration.tsx` e seu local ser `/src/pages`, essa pagina sera uma copia da anterior porem no retorno da duncao getStaticProps colocaremos uma propriedade chamada `revalidate` com um tempo em segundos para o reprocesso da informacao (semi-estatico)
- Para testarmos isso desabilitaremos o modo dev (`npm run dev`) e iniciaremos a aplicacao normalmente
- Primeiramente excluimos o arquivo .next (`rm -rf .next`)
- Depois iniciaremos o build da aplicacao para ver as caracteristicas da pagina (`npm run build`)
- A nova pagina é do tipo ISR (Incremental static regenerarion)
- Iniciamos entao a aplicacao `npm run start`
- Agora faremos mudancas no arquivo `api.json` e observaremos mudancas na pagina de acordo com o tempo passado
- Apos o tempo as mudancas so ocorrerao com o reload da pagina
- No entanto caso o tempo nao seja uma boa feature para atualizacao dos dados, podemos incrementar algumas regras novas usando o revalidate do nextjs
- Apos esse caso, veremos a como fazer uma pagina totalmente dinamica
- Para isso criaremos um arquivo chamado `server-side-render.tsx` na pasta `/src/pages`
- Esse arquivo sera uma copia do `incremental-side-regeneration.tsx`
- A unica mudanca é ao inves da funcao ser `getStaticProps` sera `getServerSideProps`
- Para rodar a aplicacao devemos deletar o antigo .next, buildar a aplicacao e iniciar ela
- `rm -rf .next`
- `npm run build`
- Apos o build notamos que essa nova pagina é do tipo Server
- `npm run start`
- Sempre que darmos um reload na pagina `http://localhost:3000/server-side-render` ele ira criar a pagina novamente
- Criaremos agora um contador de cliques
- Para isso teremos um novo arquivo chamado `clicks-counter.tsx` na pasta `/src/pages`
- Usaremos para isso o `useState` do react (sera usado do lado client) mesmo a pagina sendo static
- Iremos rodar a aplicacao
- `rm -rf .next` > `npm run build` > `npm run start`
- Essa pagina nova ira fazer o necessario entretanto sempre quando dermos reload o contador comeca do zero
- Para finalizarmos, vamos modificar a pagina `clicks-counter.tsx` para informar ao nextjs que essa pagina nao sera rodada no server e sim no client
- Para isso basta adicionar um string no inicio do codigo 'use-client'

2. Exemplo pasta app

- O intuito da pasta app é trabalhar com server components
- Embora seja outro exemplo é uma continuacao direta do arquivo anterior
- Dentro da pasta `src/app` iremos gerar uma pasta com nome `my-dashboard`
- Dentro dessa pasta tera um arquivo `page.tsx` que ira possuir um render, em primeiro momento, somente um h1
- Acessando `localhost:3000/my-dashboard` percebemos ja que o h1 aparece mas a tela esta com um formato diferente, isso se deve pois caso voce nao defina um layout, o next ira pegar o `layout.tsx` da raiz
- Com a pasta /app podemos acessar o arquiv `layout.tsx` e adicionar outros componentes comoum nav bar
- Tambem podemos adicionar um arquivo `layout.tsx` para dentro do `/my-dashboard`
- O arquivo /app (versao beta - 05/02/2023) faz somente a renderizacao do layoff, caso tenha alguma mudanca no component, ele faz o stream e manda essa mudanca para a pagina ja renderizada
- Faremos outro componente dentro da pasta `/my-dashboard` com nome `list-products.tsx` com intuito de listar os produtos pela API, como visto anteriormente
- Para listar os produtos no componente podemos criar uma funcao asincrona, e deixamos o componente asincrono
- Iremos agora demonstrar como essa geracao de componente se comporta com uma demora na chamada da API
- Faremos isso adicionando a tag `-d 5000` para adicionar um delay de 5000 ms na fake-api (mudaca feita no package.json)
- Percebemos que a pagina so foi criada apos 5 segundos
- Podemos entao trabalhar com um loading component
- Criaremos na pasta `/my-dashboard` um arquivo com nome `loading.tsx`
- Enquanto o componente nao for carregado na pagina ele chama o component loading automaticamente
- Tambem podemos acrescentar no page um Suspense para que so carregue o componente assim que for inteiramente gerado o interno ao Suspense
