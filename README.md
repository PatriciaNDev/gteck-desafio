# Gteck — Desafio Técnico Backend Developer

Este repositório contém a solução do desafio técnico, contemplando o desenvolvimento de uma API RESTful com autenticação JWT, rotinas de cadastro, listagem e remoção de campanhas, além de uma interface frontend básica para o consumo desses dados.

O foco principal do desenvolvimento foi o backend, priorizando boas práticas, organização e legibilidade do código.


## Tecnologias Implementadas

* **Backend:** Node.js utilizando TypeScript para melhor tipagem e segurança, e Express como framework web.
* **Persistência de Dados:** Foi escolhido o SQLite, orquestrado através do ORM Prisma.
* **Segurança e Validação:** A autenticação utiliza JWT e as senhas são protegidas com hash utilizando bcryptjs. A validação dos dados de entrada é feita através da biblioteca Zod.
* **Frontend:** Construído com Vue 3, Vite, TypeScript, PrimeVue e Axios, entregando uma interface simples e funcional sem foco em design elaborado.


## Arquitetura do Projeto

### Backend

- **Separação por responsabilidades**: o backend foi organizado em camadas simples (`routes` → `controllers` → `services`) para manter cada parte com uma responsabilidade clara.
  - **Routes**: definem rotas e aplicam middlewares (ex: proteção JWT em `/campaigns`).
  - **Controllers**: lidam com HTTP (status codes, parsing de params/body, retorno JSON).
  - **Services**: concentram regras de negócio e acesso a dados (Prisma) — facilitando refatorações.

- **Validação na borda (Zod)**: validação de entrada acontece antes de qualquer operação no banco, evitando estados inválidos e garantindo mensagens de erro consistentes.

- **Autenticação e rotas protegidas**: um middleware valida o header `Authorization: Bearer <token>`, verifica o JWT e bloqueia acesso não autenticado às rotas de campanhas.

- **Persistência com Prisma + SQLite**: Prisma adiciona tipagem e uma camada de acesso ao banco mais segura, enquanto SQLite atende bem o escopo do desafio (execução simples, sem dependências externas).

- **Cálculos no backend**: as métricas (Lucro Bruto, Lucro Real e ROAS) são calculadas no backend para consistência do contrato e para evitar divergências entre clientes. Para melhorar precisão em valores decimais, é utilizado **`big.js`**.

- **Contrato de API estável**: o backend expõe campos em inglês (`name`, `cost`, `revenue`, `tax`, `expense`, etc.), mantendo o contrato consistente para o frontend e reduzindo acoplamento com detalhes internos.

### Frontend

- **Router guard**: rotas que exigem autenticação redirecionam para `/login` quando não há token, melhorando UX e evitando chamadas 401 desnecessárias.
- **Consumo da API**: `axios` com interceptor para anexar o token automaticamente no header.

## Como rodar o projeto localmente

É necessário ter o **Node.js** (versão LTS recomendada) e o **npm** instalados na sua máquina.

### 1. Backend

1. Acesse o diretório do backend e instale as dependências:
   ```bash
   cd backend
   npm install
   ```

2. Configure as variáveis de ambiente:
   * Crie uma cópia do arquivo de exemplo `backend/.env.example` e renomeie para `backend/.env`.
   * O arquivo deve conter os caminhos para o banco (ex: `DATABASE_URL="file:./dev.db"`) e a chave secreta (`JWT_SECRET`).

3. Execute as migrações, gere o Prisma Client e popule o banco com dados iniciais para facilitar os testes:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npx prisma db seed
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```
   *A API estará disponível em `http://localhost:3333`.*

### 2. Frontend

1. Acesse o diretório do frontend e instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

2. Inicie a aplicação:
   ```bash
   npm run dev
   ```
   *A interface subirá em `http://localhost:5173`.*


## Dados Iniciais (Seed)

O comando de seed (`npx prisma db seed`) é executado para facilitar a demonstração do projeto. Ele cria automaticamente:
* **Usuário admin**
  * **E-mail**: `admin@gteck.com`
  * **Senha**: `admin`
* **10 campanhas** de exemplo pré-cadastradas.


## Autenticação (JWT)

A API implementa fluxos obrigatórios de autenticação com geração de token válido. Todas as rotas de gerenciamento de campanhas são protegidas e exigem a presença do token JWT no header da requisição:

**Header esperado:**
`Authorization: Bearer <token>`

No frontend, o token é armazenado no `localStorage` após o login bem-sucedido. Caso a API retorne um erro **401** (token inválido ou expirado), o token é removido e o usuário é redirecionado para a tela de autenticação.


## Endpoints da API

Os seguintes endpoints foram desenvolvidos conforme o contrato esperado:

### Autenticação
* **`POST /auth/register`** — Cadastro de novo usuário. Requer o envio de nome, e-mail e senha.
* **`POST /auth/login`** — Login na plataforma. Requer e-mail e senha e retorna o token JWT e dados do usuário.

### Campanhas (Rotas Protegidas)
* **`POST /campaigns`** — Criar nova campanha. O body da requisição exige o preenchimento do modelo:
  * `name`: string, obrigatório
  * `cost`: number, obrigatório
  * `revenue`: number, obrigatório
  * `tax`: number, opcional (default: 0)
  * `expense`: number, opcional (default: 0)
* **`GET /campaigns`** — Listar todas as campanhas cadastradas. Retorna os dados do banco acrescidos das métricas calculadas.
* **`DELETE /campaigns/:id`** — Remover campanha por ID.


## Regras de Negócio

Todos os cálculos de métricas são realizados estritamente no backend e os resultados são devolvidos nos retornos dos endpoints de criação e listagem. As fórmulas aplicadas são:

* **Lucro Bruto** (`grossProfit`): Receita - Custo
* **Lucro Real** (`profit`): Receita - Custo - Taxas - Despesas
* **ROAS** (`roas`): Receita / Custo

### Biblioteca utilizada nos cálculos

Para evitar erros clássicos de ponto flutuante em JavaScript, os cálculos são feitos com a biblioteca **`big.js`** no backend.

**Vantagens**:

- **Mais precisão e previsibilidade** ao lidar com valores monetários (centavos) e divisões (como ROAS)
- **Redução de inconsistências** entre o valor calculado e o valor exibido no frontend
- **Cálculos determinísticos** mesmo com números decimais comuns em campanhas


## Interface

O frontend implementa os módulos essenciais solicitados:
* **Tela de Login:** Possui os campos de e-mail e senha.
* **Tela de Cadastro:** Permite criar um novo usuário via `POST /auth/register`.
* **Listagem de Campanhas:** Uma tabela que exibe as colunas de Nome, Custo, Receita, Lucro Real e ROAS. Permite a exclusão de registros.
* **Criar Campanha:** Formulário modal com os campos obrigatórios e opcionais do modelo, enviando corretamente o token de autenticação via header no momento do salvamento.


## Comandos Úteis

Caso deseje inspecionar o banco de dados diretamente pelo navegador utilizando a interface do Prisma:

```bash
cd backend
npx prisma studio
```
