import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'

import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null
let samplePosts = []

beforeAll(async () => {
  testUser = await createUser({ username: 'joshua', password: 'password' })
  //Array of sample posts
  samplePosts = [
    { title: 'My first post', author: testUser._id, tags: ['first', 'post'] },
    {
      title: 'My second post',
      author: testUser._id,
      tags: ['second', 'post'],
    },
    {
      title: 'My third post',
      author: testUser._id,
      tags: ['third', 'post', 'mongoose'],
    },
  ]
})

// Grouping of createPost tests
describe('creating a post', () => {
  // This test case verifies that a post can be created.
  test('should create a post', async () => {
    const post = {
      title: 'My first post',
      contents: 'Hello, world!',
      tags: ['mongodb', 'mongoose'],
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
    expect(String(foundPost.author?._id)).toMatch(String(testUser?._id))
  })
  // This test case verifies that a post cannot be created without a title.
  test('should require a title', async () => {
    const post = {
      content: 'Hello, world!',
      tags: ['empty'],
    }
    try {
      await createPost(testUser._id, post)
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
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany()
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createPost = new Post(post)
    createdSamplePosts.push(await createPost.save())
  }
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
    const posts = await listPostsByAuthor(testUser.username)
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
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Hello, world!',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('Hello, world!')
  })
  // This test should not update other properties.
  test('shold not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Hello World',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('My first post')
  })
  // This test should update the updateAt timestamp.
  test('should update the updateAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'Hello World',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      contents: 'Hello World',
    })
    expect(post).toBeNull()
  })
})

describe('Deleting a post', () => {
  // This test should delete a post
  test('should delete a post', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toBeNull()
  })
  // This test should return 0 if the id does not exist.
  test('should fail if the id does not exist', async () => {
    const result = await deletePost(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
