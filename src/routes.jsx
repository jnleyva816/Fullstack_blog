import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { useLoaderData } from 'react-router-dom'
import { getPosts, getPostById } from './api/posts'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { getUserInfo } from './api/users'
import { ViewPost } from './pages/ViewPost'

export const routes = [
  {
    path: '/',
    loader: async () => {
      const queryClient = new QueryClient()
      const author = ''
      const sortBy = 'createdAt'
      const sortOrder = 'descending'
      const posts = await getPosts({ author, sortBy, sortOrder })
      await queryClient.prefetchQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => posts,
      })
      const uniqueAuthors = posts
        .map((post) => post.author)
        .filter((value, index, array) => array.indexOf(value) === index)
      for (const userId of uniqueAuthors) {
        await queryClient.prefetchQuery({
          queryKey: ['users', userId],
          queryFn: () => getUserInfo(userId),
        })
      }
      return dehydrate(queryClient)
    },
    Component() {
      const dehydratedState = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <Blog />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/posts/:postId/:slug?',
    loader: async ({ params }) => {
      const queryClient = new QueryClient()
      const postId = params.postId
      const post = await getPostById(postId)
      await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => post,
      })
      await queryClient.prefetchQuery({
        queryKey: ['users', post.author],
        queryFn: () => getUserInfo(post.author),
      })
      return { dehydratedState: dehydrate(queryClient), postId }
    },
    Component() {
      const { dehydratedState, postId } = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <ViewPost postId={postId} />
        </HydrationBoundary>
      )
    },
  },
]
