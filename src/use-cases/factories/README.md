# Pasta `factories/`

## 🏭 Visão Geral

Esta pasta implementa o padrão **Factory** para criar instâncias dos use cases com todas as dependências injetadas automaticamente.

## 🎯 Objetivo

- **Centralizar** a criação de instâncias dos use cases
- **Gerenciar** injeção de dependências automaticamente
- **Facilitar** a criação de objetos complexos
- **Manter** a separação de responsabilidades

## 📁 Estrutura

### `make-register-use-case.ts`

- **Objetivo**: Criar instância do `RegisterUseCase` com dependências injetadas
- **Dependências**: `UsersRepository` (implementação Prisma)
- **Retorno**: Instância configurada do use case

### `make-authenticate-use-case.ts`

- **Objetivo**: Criar instância do `AuthenticateUseCase` com dependências injetadas
- **Dependências**: `UsersRepository` (implementação Prisma)
- **Retorno**: Instância configurada do use case

## 🏗️ Padrão Factory

### Conceito

O padrão Factory é um padrão de criação que encapsula a lógica de instanciação de objetos complexos, especialmente quando há dependências que precisam ser injetadas.

### Vantagens

- **Separação de responsabilidades**: Controllers não precisam conhecer como criar use cases
- **Reutilização**: Mesma lógica de criação em diferentes lugares
- **Manutenibilidade**: Mudanças na criação centralizadas em um lugar
- **Testabilidade**: Fácil de mockar factories para testes

## 🔄 Fluxo de Criação

```
Controller → Factory → Use Case com Dependências → Execução
```

### Exemplo de Uso

```typescript
// No controller
export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Factory cria o use case com todas as dependências
  const registerUseCase = makeRegisterUseCase();

  // Use case já está pronto para uso
  await registerUseCase.execute({ name, email, password });
}
```

## 📝 Implementação das Factories

### Estrutura Padrão

```typescript
export function makeRegisterUseCase() {
  // Cria implementação concreta do repository
  const usersRepository = new PrismaUsersRepository();

  // Injeta a dependência no use case
  const useCase = new RegisterUseCase(usersRepository);

  // Retorna instância configurada
  return useCase;
}
```

### Exemplo Completo

```typescript
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  // 1. Cria implementação concreta do repository
  const usersRepository = new PrismaUsersRepository();

  // 2. Injeta a dependência no use case
  const registerUseCase = new RegisterUseCase(usersRepository);

  // 3. Retorna instância pronta para uso
  return registerUseCase;
}
```

## 🧪 Testes

### Testando Factories

```typescript
it("should create register use case with dependencies", () => {
  // Act
  const useCase = makeRegisterUseCase();

  // Assert
  expect(useCase).toBeInstanceOf(RegisterUseCase);
  expect(useCase.usersRepository).toBeInstanceOf(PrismaUsersRepository);
});
```

### Mockando Factories nos Controllers

```typescript
// Mock da factory
vi.mock("@/use-cases/factories/make-register-use-case", () => ({
  makeRegisterUseCase: vi.fn(),
}));

// No teste
const mockUseCase = { execute: vi.fn() };
makeRegisterUseCase.mockReturnValue(mockUseCase);
```

## 🚀 Como Adicionar Novas Factories

### 1. Crie o Use Case

```typescript
// src/use-cases/check-in.ts
export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  // ... implementação
}
```

### 2. Crie a Factory

```typescript
// src/use-cases/factories/make-check-in-use-case.ts
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in";

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();

  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

  return checkInUseCase;
}
```

### 3. Use no Controller

```typescript
// src/http/controllers/check-in.ts
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute(data);
}
```

## 🔧 Configuração de Dependências

### Repositories Disponíveis

- `PrismaUsersRepository` - Acesso a usuários via Prisma
- `PrismaCheckInsRepository` - Acesso a check-ins via Prisma
- `PrismaGymsRepository` - Acesso a academias via Prisma

### Para Testes

Para testes, você pode criar factories que retornam implementações in-memory:

```typescript
export function makeTestRegisterUseCase() {
  const usersRepository = new InMemoryUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  return registerUseCase;
}
```

## 📚 Boas Práticas

### ✅ Recomendado

- Mantenha factories simples e focadas
- Use nomes descritivos para as funções
- Injete todas as dependências necessárias
- Documente quais dependências cada factory cria
- Teste as factories isoladamente

### ❌ Evite

- Lógica complexa dentro das factories
- Criação de dependências desnecessárias
- Factories que fazem mais do que criar objetos
- Dependências circulares entre factories
- Falta de testes para as factories

## 🔍 Debugging

### Logs de Criação

Para debug, você pode adicionar logs nas factories:

```typescript
export function makeRegisterUseCase() {
  console.log("Creating RegisterUseCase with PrismaUsersRepository");

  const usersRepository = new PrismaUsersRepository();
  const useCase = new RegisterUseCase(usersRepository);

  console.log("RegisterUseCase created successfully");
  return useCase;
}
```

### Verificação de Dependências

```typescript
// Verificar se todas as dependências foram injetadas
console.log("Use case dependencies:", {
  usersRepository: useCase.usersRepository.constructor.name,
  hasExecute: typeof useCase.execute === "function",
});
```
