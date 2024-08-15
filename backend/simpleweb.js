import { createServer } from 'node:http'

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello, World!')
})

const host = 'localhost'
const port = 3000

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}/`)
})
// Output: Server is running at http://localhost:3000/
