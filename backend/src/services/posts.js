import { Post } from '../db/models/post.js'

// The createPost function creates a new post.
export async function createPost({ title, content, author, tags }) {
  const post = new Post({
    title,
    content,
    author,
    tags,
  })
  return await post.save()
}

// The listPosts function retrieves a list of post Objects and returns them in descending order by default.
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

// The listAllPosts function retrieves a list of all posts.
export async function listAllPosts(options) {
  return await listPosts({}, options)
}

// The listPostsByAuthor function retrieves a list of posts by author.
export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

// The listPostsByTag function retrieves a list of posts by tag.
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

// The getPostById function retrieves a post by its ID.
export async function getPostById(Postid) {
  return await Post.findById(Postid)
}

// The updatePost function updates a post by its ID. Takes title, author, content, and tags as arguments.
export async function updatePost(postId, { title, author, content, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, content, tags } },
    { new: true },
  )
}

// The deletePost function deletes a post by its ID.
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
