import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from 'generated/prisma/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Register Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: 'A gym for JavaScript enthusiasts',
      phone: '123456789',
      latitude: -8.026048,
      longitude: -34.898346,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.026048,
      userLongitude: -34.898346,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.026048,
      userLongitude: -34.898346,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -8.026048,
        userLongitude: -34.898346,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in twice but in diferrent days', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.026048,
      userLongitude: -34.898346,
    })

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.026048,
      userLongitude: -34.898346,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on sitant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Gym 02',
      description: '',
      phone: '',
      latitude: new Decimal(-8.032376),
      longitude: new Decimal(-34.902518),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -8.026048,
        userLongitude: -34.898346,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
