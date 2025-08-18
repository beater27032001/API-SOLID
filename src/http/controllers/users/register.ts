// Importa Zod para validação de schemas
import { z } from 'zod'
// Importa tipos do Fastify para request e response
import { FastifyReply, FastifyRequest } from 'fastify'
// Importa erro customizado para usuário já existente
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
// Importa factory para criar instância do use case de registro
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

// Controller responsável por registrar novos usuários
export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Define o schema de validação para o corpo da requisição
  const registerBodySchema = z.object({
    name: z.string(), // Nome deve ser uma string
    email: z.string().email(), // Email deve ser uma string válida
    password: z.string().min(6), // Senha deve ter pelo menos 6 caracteres
  })

  // Valida e extrai os dados do corpo da requisição
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    // Cria uma instância do use case de registro
    const registerUseCase = makeRegisterUseCase()

    // Executa a lógica de negócio para registrar o usuário
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    // Se o erro for de usuário já existente, retorna 409 (Conflict)
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // Para outros erros, repassa para o handler global de erros
    throw error
  }

  // Retorna 201 (Created) em caso de sucesso
  return reply.status(201).send()
}
