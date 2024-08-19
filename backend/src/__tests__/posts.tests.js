import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts'

import { Post } from '../db/models/post'

//Array of sample posts
const samplePosts = [
  { title: 'My first post', author: 'Joshua Leyva', tags: ['first', 'post'] },
  { title: 'My second post', author: 'Joshua Leyva', tags: ['second', 'post'] },
  {
    title: 'My third post',
    author: 'Joshua Leyva',
    tags: ['third', 'post', 'mongoose'],
  },
  { title: 'My forth post' },
]

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany()
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createPost = new Post(post)
    createdSamplePosts.push(await createPost.save())
  }
})

// Grouping of createPost tests
describe('creating a post', () => {
  // This test case verifies that a post can be created.
  test('should create a post', async () => {
    const post = {
      title: 'My first post',
      content: 'Hello, world!',
      author: 'Joshua Leyva',
      tags: ['mongodb', 'mongoose'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  // This test case verifies that a post cannot be created without a title.
  test('should require a title', async () => {
    const post = {
      author: 'Joshua Leyva',
      content: 'Hello, world!',
      tags: ['empty'],
    }
    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  // This test case verifies that a post can be created with minimal parameters.
  test('with minimal parameter should succeed', async () => {
    const post = {
      title: 'My first post',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

// Grouping of listPosts tests
describe('Listing posts', () => {
  // This test case verifies that all posts can be retrieved.
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  // This test should return post sorted by crerating date descending by default.
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  // This test should take into account provided sorting options.
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
  // This test should be able to filter posts by author.
  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Joshua Leyva')
    expect(posts.length).toEqual(3)
  })
  // This test should be able to filter posts by tag.
  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('post')
    expect(posts.length).toEqual(3)
  })
})

// Grouping of getPostById tests
describe('Getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toBeNull()
  })
})

// Grouping of updatePost tests
describe('Updating a post', () => {
  // This test should update the specific property.
  test('should update the specific property', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })
  // This test should not update other properties.
  test('shold not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('My first post')
  })
  // This test should update the updateAt timestamp.
  test('should update the updateAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, { author: 'Test Author' })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(post).toBeNull()
  })
})

describe('Deleting a post', () => {
  // This test should delete a post
  test('should delete a post', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toBeNull()
  })
  // This test should return 0 if the id does not exist.
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
