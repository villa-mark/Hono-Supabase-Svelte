import {
    OpenAPIHono,
    createRoute
  } from '@hono/zod-openapi'
  
  import { loginSchema } from '../schemas/auth.schema.js'
  import { supabase } from '../lib/supabase.js'
  
  const authRoutes = new OpenAPIHono()
  
  const loginRoute = createRoute({
    method: 'post',
    path: '/login',
  
    tags: ['Authentication'],
  
    summary: 'Login',
    description: 'Login using email and password',
  
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: loginSchema
          }
        }
      }
    },
  
    responses: {
      200: {
        description: 'Login successful'
      },
  
      400: {
        description: 'Invalid credentials'
      }
    }
  })
  
  authRoutes.openapi(loginRoute, async (c) => {
    const { email, password } = c.req.valid('json')
  
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })
  
    if (error) {
      return c.json({
        error: error.message
      }, 400)
    }
  
    return c.json({
      message: 'Login successful',
      access_token: data.session.access_token,
      user: data.user
    }, 200)
  })
  
  export default authRoutes