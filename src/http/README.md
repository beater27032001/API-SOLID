# Pasta `http/`

## Objetivo

Esta pasta contém toda a camada de apresentação HTTP da aplicação, seguindo os princípios da arquitetura limpa.

## Estrutura

- `controllers/` - Controladores que recebem requisições HTTP e delegam para os use cases
- `routes.ts` - Definição das rotas da API

## Responsabilidade

- Receber requisições HTTP
- Validar dados de entrada
- Delegar lógica de negócio para os use cases
- Retornar respostas HTTP apropriadas
- Tratar erros de validação e aplicação

## Princípios

- Controllers devem ser "magros" (thin controllers)
- Não devem conter lógica de negócio
- Responsáveis apenas pela comunicação HTTP
