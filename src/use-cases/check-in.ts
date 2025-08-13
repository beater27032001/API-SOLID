// Importa o tipo CheckIn gerado pelo Prisma
import { CheckIn } from 'generated/prisma'
// Importa a interface do repositório de check-ins
import { CheckInsRepository } from '@/repositories/check-ins-repository'
// Importa a interface do repositório de academias
import { GymsRepository } from '@/repositories/gyms-repository'
// Importa erro customizado para recurso não encontrado
import { ResourceNotFoundError } from './errors/resource-not-found-error'
// Importa função utilitária para calcular distância entre coordenadas
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
// Importa erro customizado para máximo de check-ins por dia
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
// Importa erro customizado para distância máxima excedida
import { MaxDistanceError } from './errors/max-distance-error'

// Interface que define os dados necessários para fazer check-in
interface CheckInUseCaseRequest {
  userId: string // ID do usuário
  gymId: string // ID da academia
  userLatitude: number // Latitude atual do usuário
  userLongitude: number // Longitude atual do usuário
}

// Interface que define o que será retornado após o check-in
interface CheckInUseCaseResponse {
  checkIn: CheckIn // Check-in criado
}

// Use Case responsável por fazer check-in em academias
export class CheckInUseCase {
  // Injeção de dependência dos repositórios via construtor
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) { }

  // Método principal que executa a lógica de check-in
  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Busca a academia pelo ID
    const gym = await this.gymsRepository.findById(gymId)

    // Se não encontrar a academia, lança erro
    if (!gym) {
      throw new ResourceNotFoundError('Gym')
    }

    // Calcula a distância entre o usuário e a academia
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    // Distância máxima permitida: 100 metros (0.1 km)
    const MAX_DISTANCE_IN_KILOMETRES = 0.1

    // Se a distância for maior que o permitido, lança erro
    if (distance > MAX_DISTANCE_IN_KILOMETRES) {
      throw new MaxDistanceError()
    }

    // Verifica se o usuário já fez check-in hoje
    const checkOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    // Se já fez check-in hoje, lança erro
    if (checkOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    // Cria o check-in no banco de dados
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    // Retorna o check-in criado
    return { checkIn }
  }
}
