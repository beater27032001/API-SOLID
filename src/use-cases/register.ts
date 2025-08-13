// Importa a interface do repositório de usuários
import { UsersRepository } from '@/repositories/users-repository'
// Importa função para hash de senha
import { hash } from 'bcryptjs'
// Importa erro customizado para usuário já existente
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
// Importa o tipo User gerado pelo Prisma
import { User } from 'generated/prisma'

// Interface que define os dados necessários para registro
interface RegisterUseCaseRequest {
  name: string // Nome do usuário
  email: string // Email único do usuário
  password: string // Senha em texto plano
}

// Interface que define o que será retornado após o registro
interface RegisterUseCaseResponse {
  user: User // Usuário criado com dados completos
}

// Use Case responsável por registrar novos usuários
export class RegisterUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private usersRepository: UsersRepository) { }

  // Método principal que executa a lógica de negócio
  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Cria hash da senha com salt rounds = 6
    const password_hash = await hash(password, 6)

    // Verifica se já existe usuário com o mesmo email
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    // Se existir, lança erro customizado
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // Cria o usuário no banco de dados
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash, // Salva o hash, não a senha em texto plano
    })

    // Retorna o usuário criado
    return { user }
  }
}
