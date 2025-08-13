# Pasta `use-cases/`

## Objetivo

Esta pasta contém a lógica de negócio da aplicação, implementando os casos de uso específicos seguindo os princípios da arquitetura limpa.

## Estrutura

- `errors/` - Classes de erro customizadas para diferentes situações
- `factories/` - Fábricas para criar instâncias dos use cases com dependências injetadas
- Arquivos `.spec.ts` - Testes unitários para cada use case

## Responsabilidade

- Implementar regras de negócio específicas
- Orquestrar operações entre diferentes entidades
- Validar regras de negócio
- Lançar erros apropriados quando regras são violadas
- Seguir o princípio de responsabilidade única

## Princípios SOLID

- **Single Responsibility**: Cada use case tem uma responsabilidade específica
- **Dependency Inversion**: Depende de abstrações (repositories) via injeção de dependência
- **Open/Closed**: Fácil estender funcionalidades sem modificar código existente

## Exemplos de Use Cases

- Registro de usuário
- Autenticação
- Obtenção de perfil do usuário
- Check-in em academias
- Validação de check-ins
- Busca de academias próximas
- Histórico de check-ins
