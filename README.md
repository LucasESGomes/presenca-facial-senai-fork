# Presença Facial SENAI

Sistema enterprise de controle de presença baseado em reconhecimento facial para instituições educacionais.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Fluxo de Funcionamento](#fluxo-de-funcionamento)
- [Reconhecimento Facial](#reconhecimento-facial)
- [Perfis e Permissões](#perfis-e-permissões)
- [Testes](#testes)
- [Segurança](#segurança)
- [Escalabilidade](#escalabilidade)
- [Documentação de APIs](#documentação-de-apis)
- [Autores](#autores)

## 🎯 Visão Geral

O **Presença Facial SENAI** é uma solução completa de automação de registro de presença utilizando reconhecimento facial como método exclusivo de identificação. O sistema elimina métodos tradicionais e proporciona uma experiência segura, rápida e auditável para ambientes educacionais.

### Objetivos

- Automação completa do processo de chamada
- Eliminação de fraudes em registros de presença
- Centralização de dados e relatórios gerenciais
- Interface administrativa para professores e coordenadores
- Auditoria completa de registros de presença

## 🏗️ Arquitetura

O sistema segue uma arquitetura de **microserviços em monorepositório**, com serviços independentes comunicando-se via APIs REST internas.

### Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────┐
│                     Frontend Web                         │
│                 (React + Vite + Axios)                   │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP/REST
                        ▼
┌──────────────────────────────────────────────────────────┐
│                    Backend API (Node.js)                 │
│  ┌────────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │Controllers │→ │ Services │→ │ Models (Mongoose)  │   │
│  └────────────┘  └──────────┘  └────────────────────┘   │
│         │                │                │              │
│         │                ▼                ▼              │
│         │           ┌────────┐      ┌─────────┐         │
│         │           │ Redis  │      │ MongoDB │         │
│         │           └────────┘      └─────────┘         │
│         │                                                │
│         │ HTTP/REST                                      │
│         ▼                                                │
│  ┌──────────────────────────────────────────┐           │
│  │         Engine Facial (Python)           │           │
│  │  ┌────────────┐  ┌──────────────────┐   │           │
│  │  │  FastAPI   │→ │ Face Recognition │   │           │
│  │  └────────────┘  └──────────────────┘   │           │
│  └──────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────┘
```

### Componentes Principais

#### 1. Backend API (Node.js + Express)

Responsabilidades:
- Gerenciamento de entidades (Usuários, Turmas, Alunos, Salas, Totens)
- Controle de sessões de aula e registros de presença
- Autenticação JWT e autorização baseada em perfis
- Orquestração de comunicação com Engine Facial
- Validação de dados e sanitização de inputs
- Cache de operações via Redis
- Rate limiting e proteções de segurança

#### 2. Engine Facial (Python + FastAPI)

Responsabilidades:
- Processamento de imagens faciais
- Extração de embeddings (face-recognition + dlib)
- Comparação de similaridade entre embeddings
- Sincronização periódica de dados faciais com backend
- Identificação de alunos via threshold configurável
- API REST isolada para operações faciais

#### 3. Camada de Persistência

**MongoDB**:
- Armazenamento de todas as entidades do sistema
- Índices otimizados para consultas frequentes
- Schema validation via Mongoose

**Redis**:
- Cache de queries frequentes
- Armazenamento de sessões temporárias
- Otimização de performance do sistema

## 🛠️ Stack Tecnológica

### Backend API

| Categoria | Tecnologia | Versão |
|-----------|-----------|---------|
| Runtime | Node.js | >= 18.x |
| Framework | Express | 5.1.0 |
| Database ODM | Mongoose | 8.19.3 |
| Cache | ioredis | 5.8.2 |
| Authentication | jsonwebtoken | 9.0.2 |
| Password Hashing | bcrypt | 6.0.0 |
| Validation | Joi | 18.0.1 |
| HTTP Client | axios | 1.13.2 |
| File Upload | multer | 2.0.2 |
| Security | helmet, express-rate-limit, express-mongo-sanitize, xss-clean | - |
| Testing | Jest + Supertest | 30.2.0 |
| In-Memory DB | mongodb-memory-server | 10.3.0 |

### Engine Facial

| Categoria | Tecnologia | Versão |
|-----------|-----------|---------|
| Language | Python | >= 3.10 |
| Framework | FastAPI | 0.124.4 |
| Server | Uvicorn | 0.38.0 |
| Face Recognition | face-recognition | 1.3.0 |
| Image Processing | opencv-python-headless | 4.11.0.86 |
| Numerical Computing | numpy | 1.26.4 |
| HTTP Client | httpx | 0.28.1 |
| Settings Management | pydantic-settings | 2.12.0 |

### Frontend

| Categoria | Tecnologia |
|-----------|-----------|
| Bundler | Vite |
| Framework | React (JSX) |
| HTTP Client | Axios |
| State Management | Context API |
| Routing | React Router |

### Infraestrutura

- **Docker** & **Docker Compose** para orquestração de containers
- **MongoDB** como banco de dados principal
- **Redis** para cache e otimizações

## 📁 Estrutura do Projeto

```
presenca-facial/
│
├── server/                      # Backend API (Node.js)
│   ├── src/
│   │   ├── config/             # Configurações (DB, Redis, CORS)
│   │   ├── controllers/        # Controllers da aplicação
│   │   ├── middlewares/        # Auth, validação, rate limiting
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Definição de rotas Express
│   │   ├── services/           # Lógica de negócio
│   │   ├── validations/        # Validações Joi
│   │   ├── utils/              # Utilitários e helpers
│   │   └── errors/             # Tratamento de erros
│   ├── tests/                  # Testes Jest
│   ├── docs/                   # Postman collection
│   ├── Dockerfile
│   ├── package.json
│   └── routes.md               # 📄 Documentação de rotas
│
├── facial/                      # Engine de Reconhecimento Facial (Python)
│   ├── app/
│   │   ├── core/               # Settings e segurança
│   │   ├── models/             # Pydantic models
│   │   ├── routes/             # FastAPI routes
│   │   ├── services/           # Lógica de reconhecimento
│   │   │   ├── face_service.py         # Extração de embeddings
│   │   │   ├── recognition_service.py  # Comparação facial
│   │   │   └── sync_service.py         # Sincronização com backend
│   │   └── utils/              # Codecs e helpers
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── facial_routes.md        # 📄 Documentação de rotas
│
├── client/                      # Frontend Web (React + Vite)
│   ├── src/
│   │   ├── api/                # API clients
│   │   ├── components/         # React components
│   │   ├── context/            # Context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Pages
│   │   ├── routes/             # Routing config
│   │   ├── services/           # Services layer
│   │   └── utils/              # Utilities
│   ├── public/                 # Assets estáticos
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # Orquestração de serviços
└── README.md                    # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Git

### Configuração de Variáveis de Ambiente

#### 1. Backend API (`server/.env`)

```env
# ============================
# 🌐 SERVER CONFIGURATION
# ============================
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:3000

# ============================
# 🗄️ DATABASE (MongoDB)
# ============================
MONGO_URI=mongodb://localhost:27017/presenca_facial_senai

# ============================
# 🔐 AUTHENTICATION / SECURITY
# ============================
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=1d
X-API-KEY=super_secret_api_key

# Hash de senhas (bcrypt ou argon2)
BCRYPT_SALT_ROUNDS=10

# ============================
# 🧠 REDIS (Cache / Rate limiting)
# ============================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================
# 🤖 FACIAL RECOGNITION SERVICE
# ============================
FACIAL_API_URL=http://localhost:8000
FACIAL_API_KEY=your_facial_recognition_api_key_here

# ============================
# 📄 LOGGING & MONITORING
# ============================
LOG_LEVEL=info
ENABLE_HTTP_LOGS=true

# ============================
# 🔧 FRONTEND CONFIG
# ============================
CLIENT_URL=http://localhost:5173
```

#### 2. Engine Facial (`facial/.env`)

```env
FACIAL_API_KEY=supersecretfacialapikey
FACIAL_API_URL=http://localhost:8000
MAIN_API_URL=http://localhost:5000/api
SYNC_INTERVAL_SECONDS=60
FACE_MATCH_THRESHOLD=0.6
PRODUCTION=false
```

#### 3. Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### Inicialização com Docker Compose

```bash
# Clone o repositório
git clone <repository-url>
cd presenca-facial

# Configure as variáveis de ambiente
cp server/.env.example server/.env
cp facial/.env.example facial/.env
cp client/.env.example client/.env

# Edite os arquivos .env conforme necessário
# vim server/.env
# vim facial/.env
# vim client/.env

# Inicie todos os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

### Acesso aos Serviços

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Engine Facial**: http://localhost:8000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🔄 Fluxo de Funcionamento

### 1. Cadastro de Aluno com Dados Faciais

```
┌──────────┐      ┌──────────────┐      ┌────────────────┐
│ Frontend │─────>│  Backend API │─────>│ Engine Facial  │
└──────────┘      └──────────────┘      └────────────────┘
     │                    │                       │
     │ 1. Captura foto    │                       │
     │ do aluno           │                       │
     │                    │                       │
     │ 2. POST /encode    │                       │
     │ x-facial-api-key   │                       │
     │ image=foto.jpg     │                       │
     │────────────────────┼──────────────────────>│
     │                    │                       │
     │                    │                       │ Detecta rosto
     │                    │                       │ Extrai embedding
     │                    │                       │ Codifica base64
     │<───────────────────┼───────────────────────│
     │ { embedding: "..." }                       │
     │                    │                       │
     │ 3. POST /api/students                     │
     │ Authorization: JWT │                       │
     │ {                  │                       │
     │   name,            │                       │
     │   registration,    │                       │
     │   facialId: embedding,                    │
     │   classCode        │                       │
     │ }                  │                       │
     │───────────────────>│                       │
     │                    │ Salva no MongoDB      │
     │<───────────────────│                       │
     │ { student }        │                       │
```

### 2. Registro de Presença via Reconhecimento

```
┌────────┐      ┌──────────────┐      ┌────────────────┐      ┌──────────┐
│ Totem  │─────>│  Backend API │─────>│ Engine Facial  │─────>│ MongoDB  │
└────────┘      └──────────────┘      └────────────────┘      └──────────┘
    │                  │                       │                     │
    │ 1. Captura foto  │                       │                     │
    │                  │                       │                     │
    │ 2. POST /api/attendances/facial         │                     │
    │ x-totem-api-key  │                       │                     │
    │ room=roomId      │                       │                     │
    │ image=foto.jpg   │                       │                     │
    │─────────────────>│                       │                     │
    │                  │                       │                     │
    │                  │ 3. POST /recognize    │                     │
    │                  │ room=roomId           │                     │
    │                  │ image=foto.jpg        │                     │
    │                  │──────────────────────>│                     │
    │                  │                       │ Extrai embedding    │
    │                  │                       │ Busca no cache      │
    │                  │                       │ Compara distância   │
    │                  │                       │ Valida threshold    │
    │                  │<──────────────────────│                     │
    │                  │ { studentId }         │                     │
    │                  │                       │                     │
    │                  │ 4. Valida sessão      │                     │
    │                  │ 5. Registra presença  │                     │
    │                  │──────────────────────────────────────────────>│
    │                  │                       │                     │
    │<─────────────────│                       │                     │
    │ 6. { success,    │                       │                     │
    │    attendance }  │                       │                     │
```

### 3. Sincronização Automática

A Engine Facial mantém sincronização periódica com o backend:

```
┌────────────────┐                    ┌──────────────┐
│ Engine Facial  │◄──────────────────►│ Backend API  │
└────────────────┘   A cada 60s       └──────────────┘
        │                                     │
        │ GET /api/students/faces             │
        │ x-facial-api-key                    │
        │────────────────────────────────────>│
        │                                     │
        │                                     │ Busca MongoDB
        │                                     │ Serializa dados
        │<────────────────────────────────────│
        │ {                                   │
        │   data: [                           │
        │     {                               │
        │       _id,                          │
        │       name,                         │
        │       facial: "base64...",          │
        │       rooms: [roomId1, ...]         │
        │     }                               │
        │   ]                                 │
        │ }                                   │
        │                                     │
        │ Decodifica base64                   │
        │ Converte para NumPy arrays          │
        │ Atualiza cache em memória           │
        │ (STUDENTS global list)              │
```

**Intervalo:** 60 segundos (configurável via `SYNC_INTERVAL_SECONDS`)

**O que é sincronizado:**
- ID do aluno (`_id`)
- Nome do aluno (`name`)
- Embedding facial em base64 (`facial`)
- Lista de salas associadas (`rooms`)

### 4. Consulta de Relatórios

```
┌──────────┐      ┌──────────────┐      ┌─────────┐
│ Frontend │─────>│  Backend API │─────>│ MongoDB │
└──────────┘      └──────────────┘      └─────────┘
     │                    │                    │
     │ GET /api/attendances/session/:id/full-report
     │ Authorization: JWT │                    │
     │───────────────────>│                    │
     │                    │                    │
     │                    │ Busca sessão       │
     │                    │ Busca presenças    │
     │                    │ Calcula ausentes   │
     │                    │───────────────────>│
     │                    │                    │
     │                    │<───────────────────│
     │                    │ Aggregate result   │
     │<───────────────────│                    │
     │ {                  │                    │
     │   presentCount,    │                    │
     │   lateCount,       │                    │
     │   absentCount,     │                    │
     │   attendances[],   │                    │
     │   absent[]         │                    │
     │ }                  │                    │
```

## 🧠 Reconhecimento Facial

### Conceito de Embeddings

O sistema utiliza **embeddings faciais** - representações vetoriais de alta dimensionalidade que capturam características únicas de cada rosto.

#### Processo de Extração

1. **Detecção Facial**: Localiza face na imagem
2. **Alinhamento**: Normaliza posição e escala
3. **Extração de Features**: Gera vetor de 128 dimensões
4. **Normalização**: Vetor unitário para comparação

```python
# Representação conceitual
embedding = [0.234, -0.145, 0.892, ..., 0.567]  # 128 valores
```

### Processo de Identificação

#### Comparação por Distância Euclidiana

```
Distância = √(Σ(embedding1[i] - embedding2[i])²)

Se distância < FACE_MATCH_THRESHOLD:
    → Rostos são da mesma pessoa
Senão:
    → Rostos são de pessoas diferentes
```

#### Threshold Configurável

O parâmetro `FACE_MATCH_THRESHOLD` (padrão: 0.6) define o limiar de decisão:

- **Valores menores (0.4-0.5)**: Mais rigoroso, menos falsos positivos
- **Valores maiores (0.6-0.7)**: Mais tolerante, menos falsos negativos

### Otimizações de Performance

- **Vetorização NumPy**: Operações paralelas em batch
- **Cache de Embeddings**: Evita reprocessamento
- **Sincronização Assíncrona**: Não bloqueia operações principais
- **Comparação Otimizada**: Algoritmos eficientes de busca

## 👤 Perfis e Permissões

### Professor

**Permissões**:
- Iniciar/encerrar sessões de chamada
- Visualizar presenças de turmas atribuídas
- Consultar relatórios das próprias turmas
- Gerenciar alunos das turmas sob responsabilidade

### Coordenador (Admin)

**Permissões**:
- Todas as permissões de Professor
- Gerenciar usuários do sistema (CRUD)
- Gerenciar todas as turmas e salas
- Acessar relatórios globais
- Configurar totens e dispositivos
- Aprovar solicitações de acesso

## 🧪 Testes

### Backend (Jest)

```bash
cd server

# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm test -- --coverage
```

**Cobertura de Testes**:
- Services (UserService, ClassService, StudentService, AttendanceService, ClassSessionService)
- Regras de negócio
- Validações
- Integração com MongoDB (in-memory)

**Setup de Testes**:
- MongoDB Memory Server para testes isolados
- Mock de dependências externas
- Dados de teste padronizados

## 🔐 Segurança

### Implementações

| Categoria | Implementação |
|-----------|---------------|
| Autenticação | JWT com expiração configurável |
| Hash de Senhas | Bcrypt com salt rounds |
| Sanitização | express-mongo-sanitize, xss-clean |
| Rate Limiting | express-rate-limit por IP |
| Headers Seguros | Helmet.js |
| CORS | Whitelist configurável |
| Validação | Joi schemas em todas as rotas |
| API Keys | Validação de chaves para serviços internos |

### Boas Práticas

- Variáveis de ambiente para credenciais
- Princípio do menor privilégio
- Validação em múltiplas camadas (frontend, middleware, service)
- Logs estruturados sem dados sensíveis
- Tokens de curta duração
- Isolamento de serviços via Docker

### Conformidade

⚠️ **LGPD**: Este sistema processa dados biométricos. Certifique-se de:
- Obter consentimento explícito dos alunos
- Implementar política de retenção de dados
- Garantir direitos de acesso, retificação e exclusão
- Documentar base legal para tratamento

## 📈 Escalabilidade

### Arquitetura Escalável

- **Horizontal**: Múltiplas instâncias de cada serviço via load balancer
- **Vertical**: Otimização de recursos por container
- **Isolamento**: Serviços podem escalar independentemente

### Estratégias de Escala

```
Frontend: N instâncias atrás de CDN/Load Balancer
Backend API: N instâncias com Redis compartilhado
Engine Facial: N instâncias com pool de workers
MongoDB: Replica Set ou Sharding
Redis: Redis Cluster ou Redis Sentinel
```

### Performance

- Cache Redis para queries frequentes
- Índices MongoDB otimizados
- Processamento assíncrono de imagens
- Batch operations para embeddings
- Connection pooling

## 📚 Documentação de APIs

### Documentações Disponíveis

- **[Backend API Routes](./server/routes.md)** - Documentação completa das rotas do backend
- **[Facial API Routes](./facial/facial_routes.md)** - Documentação da API de reconhecimento facial

### Endpoints Principais

**Backend API**:
- `/api/auth` - Autenticação
- `/api/users` - Gerenciamento de usuários
- `/api/classes` - Turmas
- `/api/students` - Alunos
- `/api/attendance` - Registros de presença
- `/api/class-sessions` - Sessões de aula
- `/api/rooms` - Salas
- `/api/totems` - Totens

**Engine Facial**:
- `/facial/register` - Cadastro de embedding
- `/facial/identify` - Identificação facial
- `/facial/sync` - Sincronização de dados
- `/health` - Health check

## 👥 Autores

Este projeto foi desenvolvido por:

- **[Otávio Vinícius Flauzino de Souza](https://github.com/tavinv)** - Backend (Node.js + Python)
- **[Lucas do Espírito Santo Gomes](https://github.com/lucasesgomes)** - Frontend (React + Vite)

---

**Presença Facial SENAI** | Sistema Enterprise de Reconhecimento Facial

> Desenvolvido com foco em segurança, performance e conformidade regulatória.