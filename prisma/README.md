# Pasta `prisma/`

## 🗄️ Visão Geral

Esta pasta contém toda a configuração e estrutura do banco de dados PostgreSQL usando o Prisma ORM.

## 📁 Estrutura

### `schema.prisma`

- **Objetivo**: Define o schema do banco de dados e gera tipos TypeScript automaticamente
- **Responsabilidade**: Modelar entidades, relacionamentos e configurações do banco
- **Tecnologia**: Prisma Schema Language (PSL)

### `migrations/`

- **Objetivo**: Contém todas as migrações do banco de dados
- **Responsabilidade**: Controlar mudanças na estrutura do banco de forma versionada
- **Estrutura**: Cada migração tem um timestamp e um arquivo SQL

### `migration_lock.toml`

- **Objetivo**: Garantir que apenas um processo execute migrações por vez
- **Responsabilidade**: Prevenir conflitos em ambientes com múltiplas instâncias

## 🏗️ Modelos do Banco

### User (Usuário)

- **Campos**: id, name, email, password_hash, created_at
- **Relacionamentos**: Um usuário pode ter muitos check-ins
- **Validações**: Email único, senha hasheada

### Gym (Academia)

- **Campos**: id, title, description, phone, latitude, longitude, created_at
- **Relacionamentos**: Uma academia pode ter muitos check-ins
- **Validações**: Coordenadas obrigatórias para localização

### CheckIn

- **Campos**: id, user_id, gym_id, validated_at, created_at
- **Relacionamentos**: Pertence a um usuário e uma academia
- **Validações**: Apenas um check-in por usuário por dia

## 🔧 Comandos Prisma

### Desenvolvimento

```bash
# Gerar cliente Prisma com tipos TypeScript
npx prisma generate

# Criar nova migração baseada em mudanças no schema
npx prisma migrate dev

# Aplicar migrações em desenvolvimento
npx prisma migrate dev --name nome_da_migracao

# Resetar banco de dados (cuidado em produção!)
npx prisma migrate reset
```

### Produção

```bash
# Aplicar migrações existentes
npx prisma migrate deploy

# Verificar status das migrações
npx prisma migrate status
```

### Utilitários

```bash
# Abrir interface visual do banco
npx prisma studio

# Gerar seed do banco
npx prisma db seed

# Verificar conexão com banco
npx prisma db pull
```

## 🚀 Configuração

### Variáveis de Ambiente

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid"
```

### Docker Compose

O projeto inclui configuração Docker para PostgreSQL:

- **Imagem**: bitnami/postgresql
- **Porta**: 5432
- **Usuário**: docker
- **Senha**: docker
- **Database**: apisolid

## 📊 Estrutura das Tabelas

### users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### gyms

```sql
CREATE TABLE gyms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### check_ins

```sql
CREATE TABLE check_ins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  gym_id TEXT NOT NULL,
  validated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (gym_id) REFERENCES gyms(id)
);
```

## 🔍 Índices e Performance

### Índices Recomendados

```sql
-- Índice para busca de usuário por email
CREATE INDEX idx_users_email ON users(email);

-- Índice para busca de check-ins por usuário e data
CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, created_at);

-- Índice para busca de academias próximas
CREATE INDEX idx_gyms_coordinates ON gyms(latitude, longitude);
```

## 🧪 Testes

### Banco de Teste

Para testes, o projeto usa implementações in-memory dos repositories, mas você pode configurar um banco de teste separado:

```env
DATABASE_URL_TEST="postgresql://docker:docker@localhost:5433/apisolid_test"
```

### Seeds

Crie dados de teste usando o Prisma:

```bash
npx prisma db seed
```

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/concepts/tools/prisma-studio)
