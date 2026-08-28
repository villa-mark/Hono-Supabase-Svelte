import 'dotenv/config'

import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

import { loggerMiddleware } from './middleware/logger.middleware.js'
import { authMiddleware } from './middleware/auth.middleware.js'

import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'


const app = new OpenAPIHono()


// ======================================================
// Global Middleware
// ======================================================

app.use('*', loggerMiddleware)


// ======================================================
// Auth Routes
// ======================================================

app.route('/auth', authRoutes)


// ======================================================
// Task Authentication Middleware
// ======================================================

// Protect only /tasks routes
app.use('/tasks/*', authMiddleware)


// ======================================================
// Task Routes
// ======================================================

app.route('/', taskRoutes)


// ======================================================
// OpenAPI Specification
// ======================================================

app.doc('/doc', {
  openapi: '3.0.0',

  info: {
    version: '1.0.0',
    title: 'Task API',
    description: 'Task API built with Hono and Supabase'
  }
})


// ======================================================
// Swagger UI
// ======================================================

app.get(
  '/docs',
  swaggerUI({
    url: '/doc'
  })
)


// ======================================================
// Server
// ======================================================

const port = 3000

console.log(
  app.routes.map(route => ({
    method: route.method,
    path: route.path
  }))
)

serve({
  fetch: app.fetch,
  port
})

console.log(`🚀 Server running at http://localhost:${port}`)
console.log(`📚 Swagger UI: http://localhost:${port}/docs`)
console.log(`📄 OpenAPI JSON: http://localhost:${port}/doc`)