// Importa o framework Fastify para criar a aplicação web
import fastify from 'fastify'
// Importa o tipo de erro do Zod para validação
import { ZodError } from 'zod'
// Importa as configurações de ambiente
import { env } from './env'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

// Cria uma nova instância do Fastify
export const app = fastify()

// Registra o plugin do JWT para autenticação
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

// Registra todas as rotas da aplicação
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

// Configura o tratamento global de erros
app.setErrorHandler((error, _, reply) => {
  // Se for um erro de validação do Zod, retorna 400 com detalhes
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  // Em desenvolvimento, loga o erro no console para debug
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  // Para outros erros, retorna 500 genérico
  return reply.status(500).send({
    message: 'Internal server error',
  })
})
