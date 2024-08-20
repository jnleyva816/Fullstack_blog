import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { Helmet } from 'react-helmet-async'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  const posts = postQuery.data ?? []
  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title> Full Stack React Blog</title>
        <meta
          name='description'
          content='A blog about full stack React development'
        />
      </Helmet>
      <Header />
      <br />
      <br />
      <br />
      <CreatePost />
      <br />
      <br />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        field={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
