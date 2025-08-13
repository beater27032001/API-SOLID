# Pasta `in-memory/`

## 🧠 Visão Geral

Esta pasta contém implementações em memória dos repositories, utilizadas principalmente para testes unitários e desenvolvimento local sem dependência de banco de dados.

## 🎯 Objetivo

- **Facilitar testes** unitários sem dependência de banco
- **Acelerar desenvolvimento** com dados em memória
- **Simular comportamento** real dos repositories
- **Permitir testes isolados** de use cases e controllers

## 📁 Estrutura

### `in-memory-users-repository.ts`

- **Implementa**: Interface `UsersRepository`
- **Armazena**: Usuários em array JavaScript
- **Operações**: create, findByEmail, findById
- **Uso**: Testes e desenvolvimento

### `in-memory-check-ins-repository.ts`

- **Implementa**: Interface `CheckInsRepository`
- **Armazena**: Check-ins em array JavaScript
- **Operações**: create, findById, findByUserIdOnDate, countByUserId
- **Uso**: Testes e desenvolvimento

### `in-memory-gyms-repository.ts`

- **Implementa**: Interface `GymsRepository`
- **Armazena**: Academias em array JavaScript
- **Operações**: create, findById, searchMany, findManyNearby
- **Uso**: Testes e desenvolvimento

## 🏗️ Implementação

### Estrutura Padrão

```typescript
export class InMemoryUsersRepository implements UsersRepository {
  // Array para armazenar dados em memória
  public items: User[] = [];

  // Implementação dos métodos da interface
  async create(data: CreateUserData): Promise<User> {
    // Lógica de criação
  }

  async findByEmail(email: string): Promise<User | null> {
    // Lógica de busca
  }
}
```

### Exemplo Completo

```typescript
export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: CreateUserData): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user || null;
  }
}
```

## 🧪 Uso em Testes

### Testando Use Cases

```typescript
describe("Register Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    // Cria repository em memória para cada teste
    usersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it("should register a new user", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "john@email.com",
      password: "123456",
    };

    // Act
    const { user } = await registerUseCase.execute(userData);

    // Assert
    expect(user.name).toBe(userData.name);
    expect(usersRepository.items).toHaveLength(1);
  });
});
```

### Testando Controllers

```typescript
describe("Register Controller", () => {
  it("should create user successfully", async () => {
    // Arrange
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    // Mock da factory
    vi.mocked(makeRegisterUseCase).mockReturnValue(registerUseCase);

    const request = {
      body: { name: "John", email: "john@email.com", password: "123456" },
    };

    // Act
    const response = await register(request, reply);

    // Assert
    expect(response.statusCode).toBe(201);
    expect(usersRepository.items).toHaveLength(1);
  });
});
```

## 🔄 Ciclo de Vida dos Dados

### Durante Testes

1. **Setup**: Repository é criado com array vazio
2. **Execução**: Dados são adicionados/modificados durante o teste
3. **Cleanup**: Array é limpo automaticamente para o próximo teste

### Vantagens

- **Isolamento**: Cada teste começa com dados limpos
- **Velocidade**: Sem overhead de banco de dados
- **Controle**: Dados exatos para cada cenário de teste
- **Reprodutibilidade**: Testes sempre executam da mesma forma

## 🚀 Como Adicionar Novos Repositories

### 1. Crie a Interface

```typescript
// src/repositories/users-repository.ts
export interface UsersRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
```

### 2. Implemente a Versão In-Memory

```typescript
// src/repositories/in-memory/in-memory-users-repository.ts
export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: CreateUserData): Promise<User> {
    const user = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }
}
```

### 3. Use nos Testes

```typescript
const usersRepository = new InMemoryUsersRepository();
const useCase = new SomeUseCase(usersRepository);
```

## 🔧 Funcionalidades Avançadas

### Busca com Filtros

```typescript
async findManyByUserId(userId: string): Promise<CheckIn[]> {
  return this.items.filter(item => item.user_id === userId)
}
```

### Paginação

```typescript
async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
  const itemsPerPage = 20
  const startIndex = (page - 1) * itemsPerPage

  return this.items
    .filter(item => item.user_id === userId)
    .slice(startIndex, startIndex + itemsPerPage)
}
```

### Ordenação

```typescript
async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
  const itemsPerPage = 20
  const startIndex = (page - 1) * itemsPerPage

  return this.items
    .filter(item => item.user_id === userId)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(startIndex, startIndex + itemsPerPage)
}
```

## 📚 Boas Práticas

### ✅ Recomendado

- Mantenha a implementação simples e focada
- Implemente todos os métodos da interface
- Use arrays nativos do JavaScript para simplicidade
- Limpe dados entre testes
- Documente comportamentos específicos

### ❌ Evite

- Lógica complexa desnecessária
- Dependências externas
- Persistência de dados entre testes
- Implementação parcial da interface
- Otimizações prematuras

## 🔍 Debugging

### Verificar Estado dos Dados

```typescript
// Durante testes
console.log("Users in repository:", usersRepository.items);
console.log("Check-ins in repository:", checkInsRepository.items);
```

### Verificar Implementação

```typescript
// Verificar se implementa a interface corretamente
expect(usersRepository).toHaveProperty("create");
expect(usersRepository).toHaveProperty("findByEmail");
expect(typeof usersRepository.create).toBe("function");
```

### Logs de Operações

```typescript
async create(data: CreateUserData): Promise<User> {
  console.log('Creating user:', data)

  const user = { /* ... */ }
  this.items.push(user)

  console.log('User created:', user)
  console.log('Total users:', this.items.length)

  return user
}
```
