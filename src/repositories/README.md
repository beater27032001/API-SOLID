# Pasta `repositories/`

## Objetivo

Esta pasta implementa o padrão Repository, abstraindo o acesso aos dados e permitindo diferentes implementações (banco real, memória, etc.).

## Estrutura

- `in-memory/` - Implementações em memória para testes
- `prisma/` - Implementações usando Prisma ORM para banco real
- Interfaces base que definem contratos para implementações

## Responsabilidade

- Abstrair acesso aos dados
- Definir contratos (interfaces) para operações de dados
- Permitir diferentes implementações (banco real, memória, etc.)
- Facilitar testes com implementações em memória
- Seguir o princípio de inversão de dependência

## Princípios SOLID

- **Dependency Inversion**: Depende de abstrações, não de implementações concretas
- **Interface Segregation**: Interfaces específicas para cada tipo de entidade
- **Open/Closed**: Fácil adicionar novas implementações sem modificar código existente
