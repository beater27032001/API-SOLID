// Importa o tipo Gym gerado pelo Prisma
import { Gym } from 'generated/prisma'
// Importa a interface do repositório de academias
import { GymsRepository } from '@/repositories/gyms-repository'

// Interface que define os dados necessários para buscar academias
interface SearchGymsUseCaseRequest {
  query: string // Termo de busca (nome da academia)
  page: number // Número da página para paginação
}

// Interface que define o que será retornado após a busca
interface SearchGymsUseCaseResponse {
  gyms: Gym[] // Lista de academias encontradas
}

// Use Case responsável por buscar academias por nome
export class SearchGymsUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private gymsRepository: GymsRepository) { }

  // Método principal que executa a lógica de busca de academias
  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    // Busca academias pelo termo de busca com paginação
    const gyms = await this.gymsRepository.searchMany(query, page)

    // Retorna a lista de academias encontradas
    return { gyms }
  }
}
