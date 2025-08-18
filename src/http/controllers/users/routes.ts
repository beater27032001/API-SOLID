// Importa o tipo FastifyInstance para tipagem
import { FastifyInstance } from 'fastify'
// Importa o controller de registro de usuários
import { register } from './register'
// Importa o controller de autenticação
import { authenticate } from './authenticate'
// Importa o controller de perfil de usuário
import { profile } from './profile'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

// Função que registra todas as rotas da aplicação
export async function usersRoutes(app: FastifyInstance) {
  // Rota para criar novos usuários (POST /users)
  app.post('/users', register)

  // Rota para autenticar usuários (POST /sessions)
  app.post('/sessions', authenticate)

  // Rota para atualizar o token de acesso (PATCH /token/refresh)
  app.patch('/token/refresh', refresh)

  // Autenticação
  // Rota para obter informações do usuário logado (GET /me)
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
