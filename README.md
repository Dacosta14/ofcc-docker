# OFCC — Sistema de Gestão para Oficina Mecânica

Sistema web full stack desenvolvido para gerenciamento completo de uma oficina mecânica. A aplicação cobre todo o fluxo operacional — do cadastro de clientes à emissão de ordens de serviço em PDF — com uma interface moderna e responsiva construída em React e uma API RESTful em Node.js com persistência em MySQL.

O projeto foi containerizado com Docker e Docker Compose, permitindo execução consistente em qualquer ambiente com um único comando.

---

## Tecnologias utilizadas

### Frontend
- **React 19** com Vite para bundling e desenvolvimento
- **Tailwind CSS** para estilização utilitária
- **React Router DOM** para navegação entre páginas
- **jsPDF** e **html2canvas** para geração de PDF no cliente
- **Framer Motion** para animações de interface

### Backend
- **Node.js** com **Express** para a API RESTful
- **MySQL2** para conexão e consultas ao banco de dados
- Arquitetura em camadas com separação de **controllers** e **routes**

### Infraestrutura
- **Docker** e **Docker Compose** para containerização dos serviços
- **Nginx** para servir o build estático do frontend em produção
- Inicialização automática do banco de dados via script SQL no container MySQL

---

## Funcionalidades

### Clientes
- Cadastro em duas etapas: dados do cliente seguido do cadastro do veículo vinculado
- Edição e exclusão com tratamento de integridade referencial (exclusão em cascata de veículos e ordens)
- Modal de detalhes com histórico completo: veículos cadastrados e ordens de serviço relacionadas com status e valores

### Veículos
- Gerenciamento integrado ao fluxo de clientes, sem página separada
- Adição de múltiplos veículos por cliente diretamente no modal de detalhes
- Edição inline e exclusão com confirmação

### Ordens de serviço
- Visualização em Kanban com três colunas: Aberta, Em andamento e Concluída
- CRUD completo com seleção de cliente e veículo no momento da criação
- Regra de negócio: ordens concluídas não podem ser excluídas
- Modal de detalhe com dados completos: cliente, veículo, peças utilizadas, serviços executados e valor total
- Geração de PDF da ordem de serviço diretamente pelo modal, com layout na paleta visual do sistema

### Peças
- Controle de estoque com cadastro, edição e exclusão
- Campos: nome, valor e loja fornecedora

### Dashboard (Home)
- Métricas em tempo real: total de clientes, ordens abertas e peças em estoque
- Listagem das últimas ordens de serviço com status colorido

---

## Estrutura do projeto

```
ofcc-docker/
├── ofcc/
│   ├── backend/
│   │   ├── controllers/        — lógica de negócio por entidade
│   │   ├── routes/             — definição das rotas da API
│   │   ├── db.js               — conexão com o banco de dados
│   │   ├── server.js           — entrada da aplicação
│   │   └── Dockerfile
│   └── banco/
│       └── script.sql          — script de criação das tabelas
├── ofcc-front/
│   ├── src/
│   │   ├── pages/              — páginas principais (Home, Clientes, Ordens, Peças)
│   │   └── components/         — componentes reutilizáveis (Navbar)
│   ├── Dockerfile
│   └── vite.config.js
└── docker-compose.yml
```

---

## Modelo de dados

```
clientes
└── veiculos (cliente_id)
        └── ordens_servico (veiculo_id)
                ├── os_pecas (os_id, peca_id) → pecas
                └── os_servicos (os_id, servico_id) → servicos
```

As relações são gerenciadas por chaves estrangeiras no banco, com exclusão em cascata tratada no backend para garantir integridade dos dados.

---

## Como executar

### requisito
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ofcc-docker.git
cd ofcc-docker

# Suba todos os serviços
docker-compose up --build
```


| Serviço   | Endereço                  |
|-----------|---------------------------|
| Frontend  | http://localhost           |
| API       | http://localhost:3000      |
| MySQL     | localhost:3306             |

---

## Rotas da API

| Método | Rota                              | Descrição                        |
|--------|-----------------------------------|----------------------------------|
| GET    | /clientes                         | Lista todos os clientes          |
| POST   | /clientes                         | Cadastra um cliente              |
| PUT    | /clientes/:id                     | Atualiza um cliente              |
| DELETE | /clientes/:id                     | Remove cliente e dados vinculados|
| GET    | /clientes/:id/detalhes            | Retorna cliente, veículos e OSs  |
| GET    | /veiculos                         | Lista todos os veículos          |
| POST   | /veiculos                         | Cadastra um veículo              |
| PUT    | /veiculos/:id                     | Atualiza um veículo              |
| DELETE | /veiculos/:id                     | Remove um veículo                |
| GET    | /ordens                           | Lista todas as ordens            |
| POST   | /ordens                           | Cria uma ordem de serviço        |
| PUT    | /ordens/:id                       | Atualiza uma ordem               |
| DELETE | /ordens/:id                       | Remove uma ordem                 |
| GET    | /pecas                            | Lista todas as peças             |
| POST   | /pecas                            | Cadastra uma peça                |
| PUT    | /pecas/:id                        | Atualiza uma peça                |
| DELETE | /pecas/:id                        | Remove uma peça                  |
| GET    | /relatorio/ordem/:id              | Retorna OS completa para PDF     |
