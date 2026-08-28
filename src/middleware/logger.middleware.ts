import { createMiddleware } from 'hono/factory'

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now()

  console.log(`[${c.req.method}] ${c.req.path}`)

  await next()

  const duration = Date.now() - start

  console.log(
    `[${c.req.method}] ${c.req.path} - ${c.res.status} (${duration}ms)`
  )
})