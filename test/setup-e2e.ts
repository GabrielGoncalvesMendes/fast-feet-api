import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const prismaClient = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseUrl

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prismaClient.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  )
  await prismaClient.$disconnect()
})
