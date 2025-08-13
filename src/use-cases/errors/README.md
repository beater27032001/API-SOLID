# Pasta `errors/`

## 🚨 Visão Geral

Esta pasta contém todas as classes de erro customizadas da aplicação, seguindo boas práticas de tratamento de erros.

## 🎯 Objetivo

- **Centralizar** todos os tipos de erro da aplicação
- **Padronizar** mensagens e códigos de erro
- **Facilitar** o tratamento específico de cada tipo de erro
- **Melhorar** a experiência do usuário com mensagens claras

## 📁 Estrutura dos Erros

### `InvalidCredentialsError`

- **Quando ocorre**: Usuário fornece email ou senha incorretos
- **HTTP Status**: 400 (Bad Request)
- **Mensagem**: "Invalid credentials"
- **Uso**: Autenticação de usuários

### `UserAlreadyExistsError`

- **Quando ocorre**: Tentativa de registrar usuário com email já existente
- **HTTP Status**: 409 (Conflict)
- **Mensagem**: "User already exists"
- **Uso**: Registro de usuários

### `ResourceNotFoundError`

- **Quando ocorre**: Recurso solicitado não foi encontrado
- **HTTP Status**: 404 (Not Found)
- **Mensagem**: "Resource not found"
- **Uso**: Busca de usuários, academias, check-ins

### `MaxDistanceError`

- **Quando ocorre**: Usuário tenta fazer check-in muito longe da academia
- **HTTP Status**: 400 (Bad Request)
- **Mensagem**: "Max distance exceeded"
- **Uso**: Validação de check-ins

### `MaxNumberOfCheckInsError`

- **Quando ocorre**: Usuário tenta fazer mais de um check-in por dia
- **HTTP Status**: 400 (Bad Request)
- **Mensagem**: "Max number of check-ins exceeded"
- **Uso**: Validação de check-ins

### `LateCheckInValidationError`

- **Quando ocorre**: Tentativa de validar check-in após 20 minutos
- **HTTP Status**: 400 (Bad Request)
- **Mensagem**: "Late check-in validation"
- **Uso**: Validação de check-ins

## 🏗️ Estrutura das Classes de Erro

Todas as classes de erro seguem o mesmo padrão:

```typescript
export class NomeDoErro extends Error {
  constructor() {
    super("Mensagem do erro");
    this.name = "NomeDoErro";
  }
}
```

## 🔄 Fluxo de Tratamento de Erros

```
Use Case → Lança Erro Customizado → Controller → Trata Erro → HTTP Response
```

### Exemplo de Uso no Controller

```typescript
try {
  await useCase.execute(data);
} catch (error) {
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }
  throw error; // Repassa para handler global
}
```

## 📊 Mapeamento de Status HTTP

| Erro                         | Status HTTP | Descrição                    |
| ---------------------------- | ----------- | ---------------------------- |
| `InvalidCredentialsError`    | 400         | Credenciais inválidas        |
| `UserAlreadyExistsError`     | 409         | Usuário já existe            |
| `ResourceNotFoundError`      | 404         | Recurso não encontrado       |
| `MaxDistanceError`           | 400         | Distância máxima excedida    |
| `MaxNumberOfCheckInsError`   | 400         | Limite de check-ins excedido |
| `LateCheckInValidationError` | 400         | Validação tardia             |

## 🧪 Testes

### Testando Erros nos Use Cases

```typescript
it("should throw UserAlreadyExistsError when user already exists", async () => {
  // Arrange
  const user = { email: "test@email.com", name: "Test", password: "123456" };

  // Act & Assert
  await expect(() => registerUseCase.execute(user)).rejects.toBeInstanceOf(
    UserAlreadyExistsError
  );
});
```

### Testando Tratamento de Erros nos Controllers

```typescript
it("should return 409 when user already exists", async () => {
  // Arrange
  const request = {
    body: { email: "test@email.com", name: "Test", password: "123456" },
  };

  // Act
  const response = await register(request, reply);

  // Assert
  expect(response.statusCode).toBe(409);
});
```

## 🚀 Como Adicionar Novos Erros

1. **Crie a classe de erro** seguindo o padrão estabelecido
2. **Defina o status HTTP** apropriado
3. **Escreva mensagem clara** para o usuário
4. **Adicione testes** para o novo erro
5. **Documente** quando e como o erro ocorre

### Exemplo de Novo Erro

```typescript
export class InsufficientPermissionsError extends Error {
  constructor() {
    super("Insufficient permissions to perform this action");
    this.name = "InsufficientPermissionsError";
  }
}
```

## 📚 Boas Práticas

### ✅ Recomendado

- Use nomes descritivos para as classes de erro
- Mantenha mensagens claras e em português
- Escolha status HTTP apropriados
- Teste todos os cenários de erro
- Documente quando cada erro ocorre

### ❌ Evite

- Mensagens de erro muito técnicas
- Status HTTP incorretos
- Erros genéricos demais
- Falta de testes para cenários de erro
- Mensagens em inglês misturadas

## 🔍 Debugging

### Logs de Erro

Em desenvolvimento, todos os erros são logados no console:

```typescript
if (env.NODE_ENV !== "production") {
  console.error(error);
}
```

### Stack Traces

Os erros mantêm o stack trace completo para facilitar o debugging:

```typescript
console.error("Error stack:", error.stack);
```
