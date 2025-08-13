// Importa a interface do repositório de usuários
import { UsersRepository } from '@/repositories/users-repository'
// Importa erro customizado para credenciais inválidas
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
// Importa função para comparar senhas hasheadas
import { compare } from 'bcryptjs'
// Importa o tipo User gerado pelo Prisma
import { User } from 'generated/prisma'

// Interface que define os dados necessários para autenticação
interface AuthenticateUseCaseRequest {
  email: string // Email do usuário
  password: string // Senha em texto plano
}

// Interface que define o que será retornado após autenticação
interface AuthenticateUseCaseResponse {
  user: User // Usuário autenticado
}

// Use Case responsável por autenticar usuários
export class AuthenticateUseCase {
  // Injeção de dependência do repositório via construtor
  constructor(private usersRepository: UsersRepository) { }

  // Método principal que executa a lógica de autenticação
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // Busca usuário pelo email
    const user = await this.usersRepository.findByEmail(email)

    // Se não encontrar usuário, lança erro de credenciais inválidas
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Compara a senha fornecida com o hash armazenado
    const doesPasswordMatch = await compare(password, user.password_hash)

    // Se a senha não coincidir, lança erro de credenciais inválidas
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    // Retorna o usuário autenticado
    return { user }
  }
}
