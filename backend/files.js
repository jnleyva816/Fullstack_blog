import { writeFileSync, readFileSync } from 'node:fs'

const users = [
  {
    name: 'John Doe',
    email: 'johntest@email.com',
  },
]

const usersJson = JSON.stringify(users)
writeFileSync('backend/users.json', usersJson)

const readUserJson = readFileSync('backend/users.json', 'utf-8')
const readUsers = JSON.parse(readUserJson)
console.log(readUsers)
// Output: [ { name: 'John Doe', email: '
