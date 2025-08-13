# Pasta `prisma/`

## 🗄️ Visão Geral

Esta pasta contém as implementações dos repositories usando o Prisma ORM para acesso real ao banco de dados PostgreSQL.

## 🎯 Objetivo

- **Implementar** acesso real aos dados via Prisma
- **Manter** compatibilidade com as interfaces dos repositories
- **Fornecer** operações de banco de dados otimizadas
- **Garantir** consistência dos dados em produção

## 📁 Estrutura

### `prisma-users-repository.ts`

- **Implementa**: Interface `UsersRepository`
- **Usa**: Cliente Prisma para operações de usuários
- **Operações**: create, findByEmail, findById
- **Banco**: PostgreSQL via Prisma

### `prisma-check-ins-repository.ts`

- **Implementa**: Interface `CheckInsRepository`
- **Usa**: Cliente Prisma para operações de check-ins
- **Operações**: create, findById, findByUserIdOnDate, countByUserId
- **Banco**: PostgreSQL via Prisma

### `prisma-gyms-repository.ts`

- **Implementa**: Interface `GymsRepository`
- **Usa**: Cliente Prisma para operações de academias
- **Operações**: create, findById, searchMany, findManyNearby
- **Banco**: PostgreSQL via Prisma

## 🏗️ Implementação

### Estrutura Padrão

```typescript
export class PrismaUsersRepository implements UsersRepository {
  // Usa o cliente Prisma configurado
  constructor(private prisma: PrismaClient) {}

  // Implementa métodos da interface usando Prisma
  async create(data: CreateUserData): Promise<User> {
    // Usa Prisma para criar no banco
  }

  async findByEmail(email: string): Promise<User | null> {
    // Usa Prisma para buscar no banco
  }
}
```

### Exemplo Completo

```typescript
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }
}
```

## 🔧 Configuração

### Cliente Prisma

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "generated/prisma";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
```

### Injeção de Dependência

```typescript
// src/use-cases/factories/make-register-use-case.ts
import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
```

## 🚀 Operações Avançadas

### Busca com Relacionamentos

```typescript
async findByIdWithCheckIns(id: string): Promise<User | null> {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      check_ins: {
        include: {
          gym: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  })

  return user
}
```

### Busca com Filtros Complexos

```typescript
async findManyByFilters(filters: UserFilters): Promise<User[]> {
  const where: Prisma.UserWhereInput = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.email) {
    where.email = { contains: filters.email, mode: 'insensitive' }
  }

  if (filters.createdAfter) {
    where.created_at = { gte: filters.createdAfter }
  }

  const users = await this.prisma.user.findMany({
    where,
    orderBy: { created_at: 'desc' },
    take: filters.limit || 20,
    skip: (filters.page - 1) * (filters.limit || 20),
  })

  return users
}
```

### Operações em Lote

```typescript
async createMany(users: CreateUserData[]): Promise<User[]> {
  const createdUsers = await this.prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Ignora usuários com email duplicado
  })

  // Retorna usuários criados
  return this.prisma.user.findMany({
    where: {
      email: { in: users.map(u => u.email) },
    },
  })
}
```

## 🧪 Testes

### Testando com Banco Real

```typescript
describe("PrismaUsersRepository", () => {
  let prisma: PrismaClient;
  let repository: PrismaUsersRepository;

  beforeAll(async () => {
    // Conecta ao banco de teste
    prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL_TEST },
      },
    });
    repository = new PrismaUsersRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpa dados entre testes
    await prisma.user.deleteMany();
  });

  it("should create user in database", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "john@email.com",
      password_hash: "hashed_password",
    };

    // Act
    const user = await repository.create(userData);

    // Assert
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);

    // Verifica se foi salvo no banco
    const savedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(savedUser).toBeDefined();
  });
});
```

### Testando com Mocks

```typescript
describe("PrismaUsersRepository with mocks", () => {
  let mockPrisma: jest.Mocked<PrismaClient>;
  let repository: PrismaUsersRepository;

  beforeEach(() => {
    mockPrisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    repository = new PrismaUsersRepository(mockPrisma);
  });

  it("should create user", async () => {
    // Arrange
    const userData = {
      name: "John",
      email: "john@email.com",
      password_hash: "hash",
    };
    const expectedUser = { id: "1", ...userData, created_at: new Date() };

    mockPrisma.user.create.mockResolvedValue(expectedUser);

    // Act
    const result = await repository.create(userData);

    // Assert
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userData });
    expect(result).toEqual(expectedUser);
  });
});
```

## 🔍 Performance e Otimizações

### Índices Recomendados

```sql
-- Índice para busca por email
CREATE INDEX idx_users_email ON users(email);

-- Índice para busca por data de criação
CREATE INDEX idx_users_created_at ON users(created_at);

-- Índice composto para filtros múltiplos
CREATE INDEX idx_users_name_email ON users(name, email);
```

### Queries Otimizadas

```typescript
// Busca paginada otimizada
async findManyPaginated(page: number, limit: number): Promise<{
  users: User[]
  total: number
  totalPages: number
}> {
  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.user.count(),
  ])

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
  }
}
```

## 🚨 Tratamento de Erros

### Erros do Prisma

```typescript
async create(data: CreateUserData): Promise<User> {
  try {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
      },
    })

    return user
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erro conhecido do Prisma (ex: constraint violation)
      if (error.code === 'P2002') {
        throw new UserAlreadyExistsError()
      }
    }

    // Repassa erro desconhecido
    throw error
  }
}
```

### Validações

```typescript
async findByEmail(email: string): Promise<User | null> {
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a valid string')
  }

  const user = await this.prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  return user
}
```

## 📚 Boas Práticas

### ✅ Recomendado

- Use transações para operações que afetam múltiplas tabelas
- Implemente tratamento de erros específicos do Prisma
- Use índices para queries frequentes
- Mantenha queries simples e legíveis
- Implemente paginação para listas grandes

### ❌ Evite

- Queries N+1 (use include quando necessário)
- Operações em lote desnecessárias
- Falta de tratamento de erros
- Queries muito complexas
- Falta de índices em campos de busca

## 🔍 Debugging

### Logs de Queries

```typescript
// Em desenvolvimento, Prisma loga todas as queries
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

### Análise de Performance

```typescript
// Medir tempo de execução
const start = Date.now();
const users = await this.prisma.user.findMany();
const duration = Date.now() - start;

console.log(`Query took ${duration}ms`);
```

### Verificar Conexões

```typescript
// Verificar status da conexão
const connectionCount =
  await prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity`;
console.log("Active connections:", connectionCount);
```
