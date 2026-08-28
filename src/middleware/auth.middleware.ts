import { createMiddleware } from 'hono/factory'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.js'
import type { AppEnv } from '../types.js'

export const authMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {

    const authorization = c.req.header('Authorization')

    if (!authorization) {
      return c.json({
        error: 'Authorization header required'
      }, 401)
    }

    const token = authorization.replace('Bearer ', '')

    if (!token) {
      return c.json({
        error: 'Bearer token required'
      }, 401)
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return c.json({
        error: 'Invalid or expired token'
      }, 401)
    }

    c.set('user', user)

    await next()
  }
)