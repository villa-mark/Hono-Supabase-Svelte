import { z } from '@hono/zod-openapi'

export const taskSchema = z.object({
  id: z.number().int().positive().openapi({
    example: 1
  }),

  title: z.string().min(1).openapi({
    example: 'Learn Hono'
  }),

  completed: z.boolean().openapi({
    example: false
  })
}).openapi('Task')

export const createTaskSchema = z.object({
  title: z.string().min(1).openapi({
    example: 'Learn Hono'
  }),

  completed: z.boolean().optional().openapi({
    example: false
  })
}).openapi('CreateTask')

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional().openapi({
    example: 'Learn Hono and Supabase'
  }),

  completed: z.boolean().optional().openapi({
    example: true
  })
}).openapi('UpdateTask')

export const taskParamsSchema = z.object({
  id: z.coerce.number().int().positive().openapi({
    param: {
      name: 'id',
      in: 'path'
    },
    example: 1
  })
})