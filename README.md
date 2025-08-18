# API SOLID - Sistema de Check-in em Academias

## 📋 Descrição

API REST desenvolvida seguindo os princípios SOLID e arquitetura limpa, para gerenciar check-ins de usuários em academias. O sistema permite que usuários se registrem, façam check-in em academias próximas e acompanhem seu histórico de atividades.

## 🏗️ Arquitetura

### Princípios SOLID Aplicados

- **S** - Single Responsibility: Cada classe tem uma responsabilidade única
- **O** - Open/Closed: Fácil extensão sem modificar código existente
- **L** - Liskov Substitution: Implementações podem ser substituídas por suas abstrações
- **I** - Interface Segregation: Interfaces específicas para cada necessidade
- **D** - Dependency Inversion: Depende de abstrações, não de implementações concretas

### Estrutura de Pastas

```
src/
├── env/           # Configurações de ambiente
├── http/          # Camada de apresentação HTTP
├── lib/           # Bibliotecas e configurações externas
├── repositories/  # Padrão Repository para acesso a dados
├── use-cases/     # Lógica de negócio (casos de uso)
└── utils/         # Funções utilitárias
```

## 🔐 Sistema de Autenticação

### JWT (JSON Web Token)

A API utiliza JWT para autenticação de usuários. O sistema implementa dois tipos de tokens:

- **Access Token**: Token de acesso com duração de 10 minutos
- **Refresh Token**: Token de renovação com duração de 7 dias

### Sistema de Roles

O sistema implementa controle de acesso baseado em roles:

- **User**: Usuário comum com acesso às funcionalidades básicas
- **Admin**: Administrador com acesso total ao sistema
- **Manager**: Gerente com acesso limitado a certas funcionalidades

### Como Funciona

1. **Login**: Usuário faz login com email e senha
2. **Autenticação**: Sistema valida credenciais e retorna access token + refresh token (incluindo role)
3. **Acesso**: Usuário usa access token para acessar rotas protegidas
4. **Renovação**: Quando o access token expira, usa refresh token para obter novo access token
5. **Autorização**: Sistema verifica role do usuário para controle de acesso

### Refresh Token

O refresh token serve para:

- **Segurança**: Evita que o usuário precise fazer login toda vez que o access token expira
- **Experiência**: Mantém o usuário logado por mais tempo sem comprometer a segurança
- **Performance**: Reduz a necessidade de consultas ao banco para validação de credenciais
- **Persistência**: Mantém o role do usuário entre renovações de token

### Configuração de Cookies

- **httpOnly**: Previne acesso via JavaScript (proteção contra XSS)
- **secure**: Só é enviado em conexões HTTPS
- **sameSite**: Protege contra ataques CSRF

## 🚀 Funcionalidades

### Usuários

- ✅ Registro de novos usuários
- ✅ Autenticação de usuários com JWT
- ✅ Refresh de tokens de acesso
- ✅ Busca de perfil do usuário
- ✅ Métricas do usuário (total de check-ins)
- ✅ Sistema de roles (User, Admin, Manager)

### Academias

- ✅ Criação de novas academias
- ✅ Busca de academias por nome
- ✅ Busca de academias próximas (por coordenadas)

### Check-ins

- ✅ Realizar check-in em academia
- ✅ Validação de check-ins (até 20 minutos após criação)
- ✅ Histórico de check-ins do usuário
- ✅ Validação de distância (máximo 100 metros)

## 🛠️ Tecnologias

- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + Cookies + Roles
- **Testing**: Vitest
- **Architecture**: Clean Architecture + SOLID

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### Passos

1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd API-SOLID
```

2. Instale as dependências

```bash
npm install
```

3. Inicie o banco de dados

```bash
docker compose up -d
```

4. Execute as migrações

```bash
npx prisma migrate dev
```

5. Inicie a aplicação

```bash
npm run dev
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes end-to-end
npm run test:e2e
```

## 🌐 Endpoints

### Usuários

- `POST /users` - Registrar novo usuário
- `POST /sessions` - Autenticar usuário
- `PATCH /token/refresh` - Renovar token de acesso
- `GET /me` - Obter perfil do usuário logado

### Academias

- `POST /gyms` - Criar nova academia
- `GET /gyms/search` - Buscar academias por nome
- `GET /gyms/nearby` - Buscar academias próximas

### Check-ins

- `POST /gyms/:gymId/check-ins` - Realizar check-in
- `PATCH /check-ins/:id/validate` - Validar check-in
- `GET /check-ins/history` - Histórico de check-ins
- `GET /check-ins/metrics` - Métricas do usuário

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid"
JWT_SECRET="sua-chave-secreta-jwt-aqui"
```

### Docker

O projeto inclui um `docker-compose.yml` configurado com:

- PostgreSQL 15
- Porta: 5432
- Usuário: docker
- Senha: docker
- Database: apisolid

## 📚 Documentação da API

### Exemplo de Registro de Usuário

```json
POST /users
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### Exemplo de Autenticação

```json
POST /sessions
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies:**

- `refreshToken`: Token de renovação (httpOnly, secure, sameSite)

**Nota:** O token JWT inclui o role do usuário para controle de acesso.

### Exemplo de Renovação de Token

```http
PATCH /token/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota:** O novo token mantém o role do usuário do refresh token.

### Exemplo de Check-in

```json
POST /gyms/:gymId/check-ins
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "userLatitude": -23.5505,
  "userLongitude": -46.6333
}
```

### Autenticação

Para rotas protegidas, inclua o token JWT no header:

```http
Authorization: Bearer seu-token-jwt-aqui
```

## 🏗️ Padrões de Projeto

### Repository Pattern

- **Interface**: Define contratos para acesso a dados
- **Implementação**: Classes concretas que implementam as interfaces
- **Testes**: Repositórios em memória para testes unitários

### Use Case Pattern

- **Lógica de Negócio**: Cada funcionalidade é um caso de uso isolado
- **Injeção de Dependência**: Dependências são injetadas via construtor
- **Testabilidade**: Fácil de testar isoladamente

### Factory Pattern

- **Criação de Instâncias**: Factories criam instâncias dos use cases
- **Configuração**: Centraliza a configuração de dependências
- **Flexibilidade**: Permite trocar implementações facilmente

## 🔒 Controle de Acesso

### Sistema de Roles

- **User**: Acesso às funcionalidades básicas (check-ins, perfil, métricas)
- **Admin**: Acesso total ao sistema (criar academias, validar check-ins)
- **Manager**: Acesso limitado (visualizar dados, algumas operações)

### Middleware de Autorização

- **verifyJwt**: Verifica se o token JWT é válido
- **Role-based Access**: Controle de acesso baseado no role do usuário
- **Proteção de Rotas**: Rotas sensíveis requerem roles específicos

## 🧪 Estratégia de Testes

### Testes Unitários

- **Use Cases**: Testados isoladamente com repositórios mock
- **Repositórios**: Testados com dados em memória
- **Validações**: Schemas Zod testados com dados válidos e inválidos

### Testes E2E

- **HTTP Controllers**: Testados com banco de dados real
- **Autenticação**: JWT tokens e cookies testados end-to-end
- **Schemas Isolados**: Cada teste roda em schema separado do PostgreSQL

## 🚀 Como Usar

### Desenvolvimento

```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm run build        # Compila TypeScript para JavaScript
npm run start        # Inicia servidor em modo produção
```

### Testes

```bash
npm test             # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
npm run test:e2e     # Executa testes end-to-end
npm run test:coverage # Executa testes com relatório de cobertura
```

### Banco de Dados

```bash
npx prisma studio    # Abre interface visual do Prisma
npx prisma migrate dev # Executa migrações em desenvolvimento
npx prisma generate  # Gera cliente Prisma atualizado
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido seguindo os princípios da arquitetura limpa e SOLID para criar um código limpo, testável e manutenível.
