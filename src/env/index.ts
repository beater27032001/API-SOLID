// Carrega as variáveis de ambiente do arquivo .env
import 'dotenv/config'
// Importa Zod para validação de schemas
import { z } from 'zod'

// Define o schema de validação para as variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'), // Ambiente da aplicação
  PORT: z.coerce.number().default(3333), // Porta do servidor
})

// Valida as variáveis de ambiente contra o schema
const _env = envSchema.safeParse(process.env)
if (!_env.success) {
  // Se a validação falhar, exibe o erro e para a aplicação
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

// Exporta as variáveis validadas e tipadas
export const env = _env.data
