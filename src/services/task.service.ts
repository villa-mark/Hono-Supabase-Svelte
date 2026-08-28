import { supabase } from '../lib/supabase.js'

export const getTasks = async () => {
  return await supabase
    .from('tasks')
    .select('*')
}

export const getTaskById = async (id: number) => {
  return await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()
}

export const createTask = async (
  title: string,
  completed: boolean
) => {
  return await supabase
    .from('tasks')
    .insert({
      title,
      completed
    })
    .select()
}

export const updateTask = async (
  id: number,
  data: {
    title?: string
    completed?: boolean
  }
) => {
  return await supabase
    .from('tasks')
    .update(data)
    .eq('id', id)
    .select()
}

export const deleteTask = async (id: number) => {
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
}