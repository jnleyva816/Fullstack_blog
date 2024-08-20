import ReactDOMServer from 'react-dom/server'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { routes } from './routes'
import { createFetchRequest } from './requests'
import { App } from './App'

const handler = createStaticHandler(routes)
export async function render(req) {
  const fetchRequest = createFetchRequest(req)
  const context = await handler.query(fetchRequest)
  const router = createStaticRouter(handler.dataRoutes, context)
  return ReactDOMServer.renderToString(
    <App>
      <StaticRouterProvider router={router} context={context} />
    </App>,
  )
}
