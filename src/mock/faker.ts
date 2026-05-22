import { faker as fakerInstance } from '@faker-js/faker'

let globalSeed: number | undefined

export function setSeed(seed: number) {
  globalSeed = seed
}

export function getFaker(seed?: number) {
  if (seed !== undefined) {
    fakerInstance.seed(seed)
  } else if (globalSeed !== undefined) {
    fakerInstance.seed(globalSeed)
  }
  return fakerInstance
}
