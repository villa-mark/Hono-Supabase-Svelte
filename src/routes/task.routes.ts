import {
  OpenAPIHono,
  createRoute,
  z
} from '@hono/zod-openapi'

import {
  taskSchema,
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema
} from '../schemas/task.schema.js'

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../services/task.service.js'

const taskRoutes = new OpenAPIHono()


// ======================================================
// GET /tasks
// ======================================================

const getTasksRoute = createRoute({
  method: 'get',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Get all tasks',
  description: 'Returns a list of all tasks',

  responses: {
    200: {
      description: 'Tasks retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(taskSchema)
        }
      }
    },

    500: {
      description: 'Internal server error'
    }
  }
})

taskRoutes.openapi(getTasksRoute, async (c) => {
  const { data, error } = await getTasks()

  if (error) {
    return c.json({
      error: error.message
    }, 500)
  }

  return c.json(data, 200)
})


// ======================================================
// GET /tasks/{id}
// ======================================================

const getTaskRoute = createRoute({
  method: 'get',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  summary: 'Get a task by ID',
  description: 'Returns a single task using its ID',

  request: {
    params: taskParamsSchema
  },

  responses: {
    200: {
      description: 'Task retrieved successfully',
      content: {
        'application/json': {
          schema: taskSchema
        }
      }
    },

    404: {
      description: 'Task not found'
    },

    500: {
      description: 'Internal server error'
    }
  }
})

taskRoutes.openapi(getTaskRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { data, error } = await getTaskById(id)

  if (error) {
    return c.json({
      error: 'Task not found'
    }, 404)
  }

  return c.json(data, 200)
})


// ======================================================
// POST /tasks
// ======================================================

const createTaskRoute = createRoute({
  method: 'post',
  path: '/tasks',
  tags: ['Tasks'],
  summary: 'Create a new task',
  description: 'Creates a new task',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: createTaskSchema
        }
      }
    }
  },

  responses: {
    201: {
      description: 'Task created successfully',
      content: {
        'application/json': {
          schema: taskSchema
        }
      }
    },

    400: {
      description: 'Invalid request body'
    },

    500: {
      description: 'Internal server error'
    }
  }
})

taskRoutes.openapi(createTaskRoute, async (c) => {
  const body = c.req.valid('json')

  const { data, error } = await createTask(
    body.title,
    body.completed ?? false
  )

  if (error) {
    return c.json({
      error: error.message
    }, 500)
  }

  return c.json(data, 201)
})


// ======================================================
// PATCH /tasks/{id}
// ======================================================

const updateTaskRoute = createRoute({
  method: 'patch',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  summary: 'Update a task',
  description: 'Updates an existing task',

  request: {
    params: taskParamsSchema,

    body: {
      required: true,

      content: {
        'application/json': {
          schema: updateTaskSchema
        }
      }
    }
  },

  responses: {
    200: {
      description: 'Task updated successfully',
      content: {
        'application/json': {
          schema: taskSchema
        }
      }
    },

    404: {
      description: 'Task not found'
    },

    500: {
      description: 'Internal server error'
    }
  }
})

taskRoutes.openapi(updateTaskRoute, async (c) => {
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')

  const { data, error } = await updateTask(id, body)

  if (error) {
    return c.json({
      error: error.message
    }, 500)
  }

  return c.json(data, 200)
})


// ======================================================
// DELETE /tasks/{id}
// ======================================================

const deleteTaskRoute = createRoute({
  method: 'delete',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  summary: 'Delete a task',
  description: 'Deletes a task using its ID',

  request: {
    params: taskParamsSchema
  },

  responses: {
    200: {
      description: 'Task deleted successfully'
    },

    404: {
      description: 'Task not found'
    },

    500: {
      description: 'Internal server error'
    }
  }
})

taskRoutes.openapi(deleteTaskRoute, async (c) => {
  const { id } = c.req.valid('param')

  const { error } = await deleteTask(id)

  if (error) {
    return c.json({
      error: error.message
    }, 500)
  }

  return c.json({
    message: 'Task deleted successfully'
  }, 200)
})


export default taskRoutes

