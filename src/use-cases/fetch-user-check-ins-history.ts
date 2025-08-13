// Importa o tipo CheckIn gerado pelo Prisma
import { CheckIn } from 'generated/prisma'
// Importa a interface do repositório de check-ins
import { CheckInsRepository } from '@/repositories/check-ins-repository'

// Interface que define os dados necessários para buscar histórico de check-ins
interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string // ID do usuário para buscar o histórico
  page: number // Número da página para paginação
}

// Interface que define o que será retornado com o histórico
interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[] // Lista de check-ins do usuário
}

// Use Case responsável por buscar histórico de check-ins do usuário
export class FetchUserCheckInsHistoryUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private checkInsRepository: CheckInsRepository) { }

  // Método principal que executa a lógica de busca do histórico
  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    // Busca check-ins do usuário com paginação
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    // Retorna a lista de check-ins
    return { checkIns }
  }
}
