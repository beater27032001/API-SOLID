import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-ins-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    userLatitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }, 'Latitude must be between -90 and 90'),
    userLongitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }, 'Longitude must be between -180 and 180'),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
    request.body,
  )

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude,
    userLongitude,
  })

  return reply.status(201).send()
}
