# Pasta `controllers/`

## 🎮 Visão Geral

Esta pasta contém os controllers responsáveis por receber requisições HTTP, validar dados de entrada e delegar a lógica de negócio para os use cases.

## 🎯 Objetivo

- **Receber** requisições HTTP da aplicação
- **Validar** dados de entrada usando Zod
- **Delegar** lógica de negócio para os use cases
- **Retornar** respostas HTTP apropriadas
- **Tratar** erros específicos de validação e negócio

## 📁 Estrutura

### `register.ts`

- **Endpoint**: `POST /users`
- **Responsabilidade**: Registrar novos usuários
- **Validação**: Nome, email e senha obrigatórios
- **Use Case**: `RegisterUseCase`
- **Resposta**: 201 (Created) ou 409 (Conflict)

### `authenticate.ts`

- **Endpoint**: `POST /sessions`
- **Responsabilidade**: Autenticar usuários existentes
- **Validação**: Email e senha obrigatórios
- **Use Case**: `AuthenticateUseCase`
- **Resposta**: 200 (OK) ou 400 (Bad Request)

## 🏗️ Arquitetura

### Princípio do Controller Magro

Os controllers seguem o princípio de serem "magros" (thin controllers), ou seja:

- **Não contêm** lógica de negócio
- **Não fazem** validações complexas
- **Não acessam** banco de dados diretamente
- **Apenas** orquestram o fluxo HTTP

### Fluxo de Execução

```
HTTP Request → Controller → Validação Zod → Use Case → Repository → Response
```

## 📝 Implementação

### Estrutura Padrão

```typescript
export async function nomeDoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Validação dos dados de entrada
  const schema = z.object({
    /* ... */
  });
  const data = schema.parse(request.body);

  try {
    // 2. Criação do use case via factory
    const useCase = makeNomeDoUseCase();

    // 3. Execução da lógica de negócio
    await useCase.execute(data);

    // 4. Retorno da resposta de sucesso
    return reply.status(200).send();
  } catch (error) {
    // 5. Tratamento de erros específicos
    if (error instanceof ErroCustomizado) {
      return reply.status(400).send({ message: error.message });
    }

    // 6. Repassa outros erros para handler global
    throw error;
  }
}
```

### Exemplo Completo

```typescript
export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Schema de validação usando Zod
  const registerBodySchema = z.object({
    name: z.string(), // Nome deve ser uma string
    email: z.string().email(), // Email deve ser válido
    password: z.string().min(6), // Senha deve ter pelo menos 6 caracteres
  });

  // Valida e extrai dados do corpo da requisição
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    // Cria instância do use case via factory
    const registerUseCase = makeRegisterUseCase();

    // Executa a lógica de negócio
    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    // Trata erro específico de usuário já existente
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    // Repassa outros erros para handler global
    throw error;
  }

  // Retorna sucesso
  return reply.status(201).send();
}
```

## 🔍 Validação de Dados

### Schemas Zod

```typescript
// Validação básica
const basicSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Validação com transformações
const transformSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6)
    .transform((pwd) => hash(pwd, 6)),
});

// Validação com mensagens customizadas
const customSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email deve ser válido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
```

### Validação de Parâmetros

```typescript
// Validação de parâmetros de rota
const paramsSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

const { id } = paramsSchema.parse(request.params);
```

### Validação de Query Strings

```typescript
// Validação de query parameters
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

const { page, limit, search } = querySchema.parse(request.query);
```

## 🚨 Tratamento de Erros

### Erros de Validação

```typescript
try {
  const data = schema.parse(request.body);
} catch (error) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.format(), // Retorna detalhes dos erros
    });
  }
}
```

### Erros de Negócio

```typescript
try {
  await useCase.execute(data);
} catch (error) {
  // Mapeia erros específicos para status HTTP apropriados
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  // Repassa erros desconhecidos para handler global
  throw error;
}
```

## 🧪 Testes

### Testando Controllers

```typescript
describe("Register Controller", () => {
  it("should create user successfully", async () => {
    // Arrange
    const request = {
      body: {
        name: "John Doe",
        email: "john@email.com",
        password: "123456",
      },
    };

    const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

    // Mock da factory
    vi.mocked(makeRegisterUseCase).mockReturnValue({
      execute: vi.fn().mockResolvedValue(undefined),
    });

    // Act
    await register(request as any, reply as any);

    // Assert
    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalled();
  });

  it("should return 409 when user already exists", async () => {
    // Arrange
    const request = {
      body: { name: "John", email: "john@email.com", password: "123456" },
    };

    const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

    // Mock da factory para lançar erro
    vi.mocked(makeRegisterUseCase).mockReturnValue({
      execute: vi.fn().mockRejectedValue(new UserAlreadyExistsError()),
    });

    // Act
    await register(request as any, reply as any);

    // Assert
    expect(reply.status).toHaveBeenCalledWith(409);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });
});
```

### Testando Validação

```typescript
it("should return 400 for invalid email", async () => {
  // Arrange
  const request = {
    body: {
      name: "John Doe",
      email: "invalid-email",
      password: "123456",
    },
  };

  const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

  // Act
  await register(request as any, reply as any);

  // Assert
  expect(reply.status).toHaveBeenCalledWith(400);
  expect(reply.send).toHaveBeenCalledWith({
    message: "Validation error",
    issues: expect.any(Object),
  });
});
```

## 🚀 Como Adicionar Novos Controllers

### 1. Crie o Controller

```typescript
// src/http/controllers/check-in.ts
export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
  // Validação
  const schema = z.object({
    gymId: z.string().uuid(),
    userLatitude: z.number(),
    userLongitude: z.number(),
  });

  const { gymId, userLatitude, userLongitude } = schema.parse(request.body);

  try {
    const checkInUseCase = makeCheckInUseCase();
    await checkInUseCase.execute({ gymId, userLatitude, userLongitude });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof MaxDistanceError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
```

### 2. Registre a Rota

```typescript
// src/http/routes.ts
import { checkIn } from "./controllers/check-in";

export async function appRoutes(app: FastifyInstance) {
  // ... outras rotas
  app.post("/check-ins", checkIn);
}
```

### 3. Crie a Factory

```typescript
// src/use-cases/factories/make-check-in-use-case.ts
export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository(prisma);
  const gymsRepository = new PrismaGymsRepository(prisma);

  return new CheckInUseCase(checkInsRepository, gymsRepository);
}
```

## 📚 Boas Práticas

### ✅ Recomendado

- Mantenha controllers simples e focados
- Use Zod para validação de dados
- Trate erros específicos adequadamente
- Retorne status HTTP apropriados
- Teste todos os cenários de sucesso e erro

### ❌ Evite

- Lógica de negócio nos controllers
- Validações manuais complexas
- Acesso direto ao banco de dados
- Respostas inconsistentes
- Falta de tratamento de erros

## 🔍 Debugging

### Logs de Request

```typescript
export async function register(request: FastifyRequest, reply: FastifyReply) {
  console.log("Register request:", {
    body: request.body,
    headers: request.headers,
    method: request.method,
    url: request.url,
  });

  // ... resto do código
}
```

### Logs de Validação

```typescript
try {
  const data = schema.parse(request.body);
  console.log("Validated data:", data);
} catch (error) {
  console.log("Validation error:", error);
  throw error;
}
```

### Logs de Erro

```typescript
} catch (error) {
  console.log('Controller error:', {
    error: error.constructor.name,
    message: error.message,
    stack: error.stack,
  })

  // ... tratamento do erro
}
```
