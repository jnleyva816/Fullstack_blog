import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(readFileSync('backend/users.json', 'utf-8'))
})

const host = 'localhost'
const port = 3000

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}/`)
})
// Output: Server is running at http://localhost:3000/
