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

## 🚀 Funcionalidades

### Usuários

- ✅ Registro de novos usuários
- ✅ Autenticação de usuários
- ✅ Busca de perfil do usuário
- ✅ Métricas do usuário (total de check-ins)

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
- **Authentication**: JWT
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
```

## 🌐 Endpoints

### Usuários

- `POST /users` - Registrar novo usuário
- `POST /sessions` - Autenticar usuário
- `GET /me` - Obter perfil do usuário logado

### Academias

- `POST /gyms` - Criar nova academia
- `GET /gyms/search` - Buscar academias por nome
- `GET /gyms/nearby` - Buscar academias próximas

### Check-ins

- `POST /check-ins` - Realizar check-in
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

### Exemplo de Check-in

```json
POST /check-ins
{
  "gymId": "uuid-da-academia",
  "userLatitude": -23.5505,
  "userLongitude": -46.6333
}
```

### Autenticação

Para rotas protegidas, inclua o token JWT no header:

```http
Authorization: Bearer seu-token-jwt-aqui
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
