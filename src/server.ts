// Importa a aplicação configurada
import { app } from './app'
// Importa as configurações de ambiente
import { env } from './env'

// Inicia o servidor na porta e host configurados
app
  .listen({
    port: env.PORT, // Porta definida nas variáveis de ambiente
    host: '0.0.0.0', // Aceita conexões de qualquer IP
  })
  .then(() => {
    console.log('🚀Server is running')
  })
