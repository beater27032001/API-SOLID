// Importa a interface do repositório de academias
import { GymsRepository } from '@/repositories/gyms-repository'
// Importa o tipo Gym gerado pelo Prisma
import { Gym } from 'generated/prisma'

// Interface que define os dados necessários para buscar academias próximas
interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number // Latitude atual do usuário
  userLongitude: number // Longitude atual do usuário
}

// Interface que define o que será retornado após a busca
interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[] // Lista de academias próximas
}

// Use Case responsável por buscar academias próximas ao usuário
export class FetchNearbyGymsUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private gymsRepository: GymsRepository) { }

  // Método principal que executa a lógica de busca de academias próximas
  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    // Busca academias próximas usando as coordenadas do usuário
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    // Retorna a lista de academias encontradas
    return {
      gyms,
    }
  }
}
