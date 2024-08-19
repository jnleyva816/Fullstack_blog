import { app } from './app.js'
import dotenv from 'dotenv'
import { initDatabase } from './db/init.js'

// Load environment variables from .env file
dotenv.config()

// Start the server
try {
  await initDatabase()
  const PORT = process.env.PORT
  app.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.error('Error connecting to database: ', err)
}
