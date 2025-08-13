// Importa a interface do repositório de check-ins
import { CheckInsRepository } from '@/repositories/check-ins-repository'

// Interface que define os dados necessários para buscar métricas do usuário
interface GetUserMetricsUseCaseRequest {
  userId: string // ID do usuário para buscar métricas
}

// Interface que define o que será retornado com as métricas
interface GetUserMetricsUseCaseResponse {
  checkInsCount: number // Total de check-ins realizados pelo usuário
}

// Use Case responsável por buscar métricas do usuário
export class GetUserMetricsUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private checkInsRepository: CheckInsRepository) { }

  // Método principal que executa a lógica de busca de métricas
  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    // Conta quantos check-ins o usuário já realizou
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    // Retorna o total de check-ins
    return { checkInsCount }
  }
}
