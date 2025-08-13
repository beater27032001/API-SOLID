// Importa a interface do repositório de check-ins
import { CheckInsRepository } from '@/repositories/check-ins-repository'
// Importa erro customizado para recurso não encontrado
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
// Importa biblioteca para manipulação de datas
import dayjs from 'dayjs'
// Importa o tipo CheckIn gerado pelo Prisma
import { CheckIn } from 'generated/prisma'
// Importa erro customizado para validação tardia
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

// Interface que define os dados necessários para validar um check-in
interface ValidateCheckInUseCaseRequest {
  checkInId: string // ID do check-in a ser validado
}

// Interface que define o que será retornado após a validação
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn // Check-in validado
}

// Use Case responsável por validar check-ins
export class ValidateCheckInUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private checkInsRepository: CheckInsRepository) { }

  // Método principal que executa a lógica de validação
  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    // Busca o check-in pelo ID
    const checkIn = await this.checkInsRepository.findById(checkInId)

    // Se não encontrar o check-in, lança erro
    if (!checkIn) {
      throw new ResourceNotFoundError('CheckIn')
    }

    // Calcula quantos minutos se passaram desde a criação do check-in
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    // Se passou mais de 20 minutos, lança erro de validação tardia
    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // Marca o check-in como validado com timestamp atual
    checkIn.validated_at = new Date()

    // Salva as alterações no banco de dados
    await this.checkInsRepository.save(checkIn)

    // Retorna o check-in validado
    return {
      checkIn,
    }
  }
}
