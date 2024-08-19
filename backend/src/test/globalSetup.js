import { MongoMemoryServer } from 'mongodb-memory-server'

// global setup fle for jest
export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  })
  global.__MONGOINSTANCE__ = instance
  process.env.DATABASE_URL = await instance.getUri()
}
