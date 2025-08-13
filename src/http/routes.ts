// Importa o tipo FastifyInstance para tipagem
import { FastifyInstance } from 'fastify'
// Importa o controller de registro de usuários
import { register } from './controllers/register'
// Importa o controller de autenticação
import { authenticate } from './controllers/authenticate'
// Importa o controller de perfil de usuário
import { profile } from './controllers/profile'

// Função que registra todas as rotas da aplicação
export async function appRoutes(app: FastifyInstance) {
  // Rota para criar novos usuários (POST /users)
  app.post('/users', register)

  // Rota para autenticar usuários (POST /sessions)
  app.post('/sessions', authenticate)

  // Autenticação
  // Rota para obter informações do usuário logado (GET /me)
  app.get('/me', profile)
}
