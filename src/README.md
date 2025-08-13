# Pasta `src/`

## 🏗️ Visão Geral da Arquitetura

Esta pasta contém todo o código fonte da aplicação, organizado seguindo os princípios da **Arquitetura Limpa** e **SOLID**.

## 📁 Estrutura das Pastas

### `env/`

- **Objetivo**: Configuração e validação de variáveis de ambiente
- **Responsabilidade**: Centralizar configurações e garantir que a aplicação só rode com configurações válidas
- **Tecnologia**: Zod para validação de schemas

### `http/`

- **Objetivo**: Camada de apresentação HTTP da aplicação
- **Responsabilidade**: Receber requisições HTTP, validar dados de entrada e delegar para os use cases
- **Estrutura**: Controllers e rotas organizados por funcionalidade

### `lib/`

- **Objetivo**: Bibliotecas e configurações externas
- **Responsabilidade**: Configurar bibliotecas externas e fornecer instâncias configuradas
- **Exemplo**: Cliente Prisma configurado para conexão com banco de dados

### `repositories/`

- **Objetivo**: Implementar o padrão Repository para abstrair acesso aos dados
- **Responsabilidade**: Definir contratos (interfaces) e implementações para operações de dados
- **Estrutura**: Interfaces base + implementações (Prisma, In-Memory para testes)

### `use-cases/`

- **Objetivo**: Implementar a lógica de negócio da aplicação
- **Responsabilidade**: Orquestrar operações, validar regras de negócio e lançar erros apropriados
- **Estrutura**: Cada use case tem uma responsabilidade específica e bem definida

### `utils/`

- **Objetivo**: Funções utilitárias reutilizáveis
- **Responsabilidade**: Fornecer funções auxiliares que não pertencem a nenhuma camada específica
- **Características**: Funções puras, stateless e facilmente testáveis

## 🔄 Fluxo de Dados

```
HTTP Request → Controller → Use Case → Repository → Database
                ↓
HTTP Response ← Controller ← Use Case ← Repository ← Database
```

## 🎯 Princípios Aplicados

### Clean Architecture

- **Independência de Frameworks**: O código não depende diretamente do Fastify
- **Testabilidade**: Fácil de testar cada camada isoladamente
- **Independência de UI**: A lógica de negócio não depende da interface HTTP
- **Independência de Banco**: O acesso a dados é abstraído via interfaces

### SOLID

- **Single Responsibility**: Cada classe tem uma responsabilidade única
- **Open/Closed**: Fácil extensão sem modificar código existente
- **Liskov Substitution**: Implementações podem ser substituídas por suas abstrações
- **Interface Segregation**: Interfaces específicas para cada necessidade
- **Dependency Inversion**: Depende de abstrações, não de implementações concretas

## 🧪 Testabilidade

- **Controllers**: Testáveis isoladamente com mocks dos use cases
- **Use Cases**: Testáveis isoladamente com mocks dos repositories
- **Repositories**: Testáveis com implementações in-memory
- **Utils**: Funções puras facilmente testáveis

## 📚 Convenções de Nomenclatura

- **Controllers**: Nomes descritivos da funcionalidade (ex: `register`, `authenticate`)
- **Use Cases**: Sufixo `UseCase` (ex: `RegisterUseCase`, `AuthenticateUseCase`)
- **Repositories**: Sufixo `Repository` (ex: `UsersRepository`, `CheckInsRepository`)
- **Interfaces**: Nomes descritivos sem sufixos (ex: `Coordinate`, `CheckIn`)

## 🚀 Como Adicionar Novas Funcionalidades

1. **Use Case**: Crie a lógica de negócio em `use-cases/`
2. **Repository**: Defina a interface e implementação em `repositories/`
3. **Controller**: Crie o endpoint HTTP em `http/controllers/`
4. **Rota**: Registre a rota em `http/routes.ts`
5. **Testes**: Adicione testes unitários para cada camada
