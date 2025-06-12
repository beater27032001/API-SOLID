# Comandos utilizados

## Estrutura do projeto

- npm init -y
- npm i typescript @types/node tsx tsup -D
- npx tsc --init
- npm i fastify
- npm i dotenv
- npm i zod
- npm i eslint @rocketseat/easlint-config -D

## Integração com o PRISMA

- npm i prisma -D
- npx prisma init
- npx prisma generate (criar de forma automatizada a tipagem do schema)
- npx prisma migrate dev (para subir as migrations procurando as alterações)
- npx prisma migrate deploy (para subir as migrations)
- npm i @prisma/client

## Integração com o docker

- docker compose up -d

## Integração com o bcrypt

- npm i bcryptjs
- npm i -D @types/bcryptjs

## Configurando os tests

- npm i vitest vite-tsconfig-paths -D
- npm i -D @vitest/ui