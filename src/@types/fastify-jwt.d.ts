// Importa o plugin do JWT
import '@fastify/jwt'

// Declara o tipo do JWT
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
    }
  }
}
