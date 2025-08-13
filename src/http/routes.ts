// Importa o tipo FastifyInstance para tipagem
import { FastifyInstance } from 'fastify'
// Importa o controller de registro de usuários
import { register } from './controllers/register'
// Importa o controller de autenticação
import { authenticate } from './controllers/authenticate'

// Função que registra todas as rotas da aplicação
export async function appRoutes(app: FastifyInstance) {
  // Rota para criar novos usuários (POST /users)
  app.post('/users', register)

  // Rota para autenticar usuários (POST /sessions)
  app.post('/sessions', authenticate)
}
