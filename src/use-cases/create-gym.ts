// Importa o tipo Gym gerado pelo Prisma
import { Gym } from 'generated/prisma'
// Importa a interface do repositório de academias
import { GymsRepository } from '@/repositories/gyms-repository'

// Interface que define os dados necessários para criar uma academia
interface CreateGymUseCaseRequest {
  title: string // Nome da academia
  description: string | null // Descrição opcional da academia
  phone: string | null // Telefone opcional da academia
  latitude: number // Latitude da localização da academia
  longitude: number // Longitude da localização da academia
}

// Interface que define o que será retornado após criar a academia
interface CreateGymUseCaseResponse {
  gym: Gym // Academia criada
}

// Use Case responsável por criar novas academias
export class CreateGymUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private gymsRepository: GymsRepository) { }

  // Método principal que executa a lógica de criação da academia
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    // Cria a academia no banco de dados
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    // Retorna a academia criada
    return { gym }
  }
}
