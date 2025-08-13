// Importa as configurações de ambiente
import { env } from '@/env'
// Importa o cliente Prisma gerado automaticamente
import { PrismaClient } from 'generated/prisma'

// Cria uma instância do cliente Prisma configurada
export const prisma = new PrismaClient({
  // Em desenvolvimento, loga todas as queries SQL para debug
  // Em produção, não loga nada para melhor performance
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
