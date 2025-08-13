# Pasta `middlewares/`

## 🔐 Visão Geral

Esta pasta contém middlewares HTTP que interceptam requisições para executar lógica comum como autenticação, validação e logging.

## 🎯 Objetivo

- **Interceptar** requisições antes de chegarem aos controllers
- **Executar** lógica comum como autenticação e validação
- **Reutilizar** código entre diferentes rotas
- **Garantir** segurança e consistência da aplicação

## 📁 Estrutura

### `verify-jwt.ts`

- **Objetivo**: Verificar se o usuário está autenticado via JWT
- **Uso**: Proteger rotas que requerem autenticação
- **Comportamento**: Retorna 401 se JWT for inválido ou ausente
- **Implementação**: Usa `request.jwtVerify()` do Fastify

## 🏗️ Como Funciona

### Fluxo de Execução

```
HTTP Request → Middleware → Controller → Response
                ↓
            Validação/Autenticação
```

### Ordem de Execução

Os middlewares são executados na ordem em que são definidos nas rotas:

```typescript
app.get("/me", { onRequest: [verifyJwt] }, profile);
// ↑ Middleware executado antes do controller
```

## 📝 Implementação

### Estrutura Padrão

```typescript
export async function nomeDoMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Lógica do middleware
    await algumaValidacao(request);

    // Se passar, continua para o próximo middleware/controller
  } catch (error) {
    // Se falhar, retorna erro e para a execução
    return reply.status(400).send({ message: error.message });
  }
}
```

### Exemplo Completo

```typescript
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verifica se o JWT é válido
    await request.jwtVerify();

    // Se válido, continua para o controller
  } catch (error) {
    // Se inválido, retorna 401
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
```

## 🔧 Configuração

### Aplicando Middleware em Rotas

```typescript
// Middleware em rota específica
app.get("/me", { onRequest: [verifyJwt] }, profile);

// Múltiplos middlewares
app.post(
  "/check-ins",
  {
    onRequest: [verifyJwt, validateCoordinates],
  },
  checkIn
);

// Middleware global para todas as rotas
app.addHook("onRequest", globalMiddleware);
```

### Hooks Disponíveis

- **`onRequest`**: Executado antes de qualquer coisa
- **`preHandler`**: Executado após parsing mas antes do controller
- **`onResponse`**: Executado após o response ser enviado
- **`onError`**: Executado quando há erro

## 🧪 Testes

### Testando Middlewares

```typescript
describe("VerifyJWT Middleware", () => {
  it("should pass with valid JWT", async () => {
    // Arrange
    const request = { jwtVerify: vi.fn().mockResolvedValue(true) };
    const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

    // Act
    await verifyJwt(request as any, reply as any);

    // Assert
    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.status).not.toHaveBeenCalled();
  });

  it("should return 401 with invalid JWT", async () => {
    // Arrange
    const request = {
      jwtVerify: vi.fn().mockRejectedValue(new Error("Invalid JWT")),
    };
    const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

    // Act
    await verifyJwt(request as any, reply as any);

    // Assert
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
  });
});
```

### Mockando Middlewares nos Controllers

```typescript
// Mock do middleware para testar controller isoladamente
vi.mock("@/http/middlewares/verify-jwt", () => ({
  verifyJwt: vi.fn().mockImplementation((req, reply, next) => {
    req.user = { sub: "user-id" };
    next();
  }),
}));
```

## 🚀 Como Adicionar Novos Middlewares

### 1. Crie o Middleware

```typescript
// src/http/middlewares/validate-coordinates.ts
export async function validateCoordinates(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { latitude, longitude } = request.body as any;

  if (latitude < -90 || latitude > 90) {
    return reply.status(400).send({
      message: "Latitude deve estar entre -90 e 90",
    });
  }

  if (longitude < -180 || longitude > 180) {
    return reply.status(400).send({
      message: "Longitude deve estar entre -180 e 180",
    });
  }
}
```

### 2. Use nas Rotas

```typescript
// src/http/routes.ts
import { validateCoordinates } from "./middlewares/validate-coordinates";

app.post(
  "/gyms",
  {
    onRequest: [verifyJwt, validateCoordinates],
  },
  createGym
);
```

### 3. Teste o Middleware

```typescript
// src/http/middlewares/validate-coordinates.spec.ts
describe("ValidateCoordinates Middleware", () => {
  it("should pass with valid coordinates", async () => {
    const request = { body: { latitude: 0, longitude: 0 } };
    const reply = { status: vi.fn().mockReturnThis(), send: vi.fn() };

    await validateCoordinates(request as any, reply as any);

    expect(reply.status).not.toHaveBeenCalled();
  });
});
```

## 📚 Boas Práticas

### ✅ Recomendado

- Mantenha middlewares simples e focados
- Use try-catch para tratamento de erros
- Retorne status HTTP apropriados
- Documente o comportamento esperado
- Teste todos os cenários de sucesso e erro

### ❌ Evite

- Lógica de negócio complexa
- Múltiplas responsabilidades em um middleware
- Dependências desnecessárias
- Falta de tratamento de erros
- Middlewares muito lentos

## 🔍 Debugging

### Logs de Execução

```typescript
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  console.log("Executando middleware verifyJwt");

  try {
    await request.jwtVerify();
    console.log("JWT válido, continuando...");
  } catch (error) {
    console.log("JWT inválido:", error.message);
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
```

### Verificar Ordem de Execução

```typescript
// Adicione logs para ver a ordem
app.addHook("onRequest", async (request, reply) => {
  console.log("Global middleware executado");
});

app.get(
  "/me",
  {
    onRequest: [verifyJwt],
  },
  profile
);
// Logs: Global middleware → verifyJwt → profile
```

### Performance

```typescript
// Medir tempo de execução do middleware
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  const start = Date.now();

  try {
    await request.jwtVerify();
    const duration = Date.now() - start;
    console.log(`JWT verification took ${duration}ms`);
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
```
