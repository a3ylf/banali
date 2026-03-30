# Sistema de Gestão de Banco de Alimentos – Back-end

## 📌 Descrição

Este projeto consiste no desenvolvimento de uma **API REST** para gerenciamento de um **Banco de Alimentos** utilizado por uma ONG.

A API permite o controle de:

* usuários do sistema
* produtos
* categorias
* movimentações de alimentos
* controle de estoque

O objetivo do sistema é **facilitar a gestão de alimentos recebidos e distribuídos**, permitindo rastreabilidade e organização das operações da instituição.

A aplicação foi desenvolvida utilizando **Python** e o framework **FastAPI**, seguindo boas práticas de desenvolvimento de APIs REST.

---

# 🚀 Tecnologias Utilizadas

Principais tecnologias utilizadas no projeto:

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* JWT (JSON Web Token)
* Passlib (hash de senhas)
* Uvicorn (servidor ASGI)

---

# 🏗️ Arquitetura do Projeto

A API segue uma arquitetura modular, separando responsabilidades entre **modelos, schemas, rotas e configurações**.

Principais camadas:

* **Models** → representação das tabelas do banco de dados
* **Schemas** → validação e serialização de dados com Pydantic
* **Routers** → definição dos endpoints da API
* **Core / Config** → configurações da aplicação e autenticação
* **Database** → conexão com o banco de dados

Essa estrutura facilita:

* manutenção
* escalabilidade
* organização do código

---

# 📂 Estrutura do Projeto

```
backend/
│
├── app/
│   │
│   ├── models/            # Modelos do banco de dados
│   │
│   ├── schemas/           # Schemas Pydantic
│   │
│   ├── routers/           # Rotas da API
│   │
│   ├── core/              # Configurações (JWT)
│   │
│   ├── database/          # Conexão com banco de dados
│   │
│   └── utils/             # Função auxiliar
│
├── main.py                # Arquivo principal
├── requirements.txt       # Dependências do projeto
└── README.md
```

---

# ⚙️ Como Rodar o Projeto Localmente

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd backend
```

---

## 2️⃣ Criar ambiente virtual

```bash
python -m venv venv
```

### Ativar ambiente virtual

Mac / Linux

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

---

## 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco_alimentos
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 5️⃣ Criar as tabelas do banco de dados

Antes de iniciar o servidor, é necessário executar o script responsável por criar as tabelas no banco de dados.

Execute o seguinte comando:

```bash
python -m utils.create_tables
```

Esse script irá criar automaticamente todas as tabelas definidas nos modelos da aplicação.

---

## 6️⃣ Rodar o servidor

```bash
uvicorn main:app --reload
```

O servidor iniciará em:

```
http://localhost:8000
```


---

# 📖 Documentação Automática da API

Após iniciar o servidor, acesse:

### Swagger UI

```
http://localhost:8000/docs
```

### ReDoc

```
http://localhost:8000/redoc
```

Essas interfaces permitem:

* visualizar endpoints
* testar requisições
* visualizar schemas de resposta

---

# 🔐 Autenticação

A API utiliza **autenticação baseada em JWT (JSON Web Token)**.

Fluxo de autenticação:

1. Usuário realiza login
2. API retorna um **access token**
3. O token deve ser enviado nas requisições protegidas

Exemplo de header:

```
Authorization: Bearer SEU_TOKEN
```

---

# 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|-------------|----------|-----------|
| `POST` | `/api/authentication/register` | Registra um novo usuário |
| `POST` | `/api/authentication/login` | Realiza login e retorna um access token |
| `POST` | `/api/authentication/refresh` | Atualiza o AccessToken|

---

### Usuários

| Método | Endpoint | Descrição |
|-------------|----------|-----------|
| `GET`| `api/core/users` | Lista todos os usuários |
| `GET` | `api/core/users/me` | Retorna dados do próprios usuário |
| `PATCH` | `api/core/users/me` | Atualiza dados do usuário |

---

### Produtos

| Método | Endpoint | Descrição |
|-------------|----------|-----------|
| `GET`| `/products` | Lista todos os produtos |
| `POST` | `/products` | Cria um novo produto |
| `GET` | `/products/{id}` | Retorna um produto específico |
| `PUT` | `/products{id}` | Atualiza novo produto específico |
| `DELETE` | `/products/{id}` | Remove um produto |

---

### Categorias

| Método | Endpoint | Descrição |
|-------------|----------|-----------|
| `GET` | `/categories` | Lista todas as categorias |
| `POST` | `/categories` | Cria uma nova categoria |
| `GET` | `/categories/{id}` | Retorna uma categoria específica |
| `PUT` | `/categories/{id}` | Atualiza uma categoria específica |
| `DELETE` | `/categories/{id}` | Remove uma categoria |

---