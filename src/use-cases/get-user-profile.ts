// Importa a interface do repositório de usuários
import { UsersRepository } from '@/repositories/users-repository'
// Importa o tipo User gerado pelo Prisma
import { User } from 'generated/prisma'
// Importa erro customizado para recurso não encontrado
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// Interface que define os dados necessários para buscar perfil do usuário
interface GetUserProfileUseCaseRequest {
  userId: string // ID do usuário para buscar o perfil
}

// Interface que define o que será retornado com o perfil
interface GetUserProfileUseCaseResponse {
  user: User // Dados completos do usuário
}

// Use Case responsável por buscar perfil do usuário
export class GetUserProfileUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private usersRepository: UsersRepository) { }

  // Método principal que executa a lógica de busca do perfil
  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // Busca o usuário pelo ID
    const user = await this.usersRepository.findById(userId)

    // Se não encontrar o usuário, lança erro
    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    // Retorna os dados do usuário
    return { user }
  }
}
