import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
await initDatabase()

const post = new Post({
  title: 'My first post',
  content: 'Hello, world!',
  author: 'Joshua Leyva',
  tags: ['mongodb', 'mongoose'],
})

const createdPosted = await post.save()

await Post.findByIdAndUpdate(createdPosted._id, {
  $set: { title: 'Hello again, Mongoose!' },
})

const posts = await Post.find()
console.log(posts)
