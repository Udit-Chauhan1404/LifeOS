const BASE = import.meta.env.VITE_API_URL || 'https://lifeos-backend.onrender.com/api'

let accessToken = null

export const setToken  = (t) => { accessToken = t }
export const getToken  = () => accessToken
export const clearToken = () => { accessToken = null }

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Auth
export const register = (name, email, password) =>
  req('POST', '/auth/register', { name, email, password })

export const login = (email, password) =>
  req('POST', '/auth/login', { email, password })

export const logout = () =>
  req('POST', '/auth/logout')

// Tasks
export const getTasks   = ()          => req('GET',    '/tasks')
export const createTask = (data)      => req('POST',   '/tasks', data)
export const updateTask = (id, data)  => req('PUT',    `/tasks/${id}`, data)
export const deleteTask = (id)        => req('DELETE', `/tasks/${id}`)

// Habits
export const getHabits   = ()   => req('GET',  '/habits')
export const createHabit = (d)  => req('POST', '/habits', d)
export const toggleHabit = (id) => req('POST', `/habits/${id}/toggle`)
export const deleteHabit = (id) => req('DELETE', `/habits/${id}`)

// Goals
export const getGoals   = ()         => req('GET',    '/goals')
export const createGoal = (d)        => req('POST',   '/goals', d)
export const updateGoal = (id, d)    => req('PUT',    `/goals/${id}`, d)
export const deleteGoal = (id)       => req('DELETE', `/goals/${id}`)

// Notes
export const getNotes   = ()         => req('GET',    '/notes')
export const createNote = (d)        => req('POST',   '/notes', d)
export const updateNote = (id, d)    => req('PUT',    `/notes/${id}`, d)
export const deleteNote = (id)       => req('DELETE', `/notes/${id}`)

// Events
export const getEvents   = ()        => req('GET',    '/events')
export const createEvent = (d)       => req('POST',   '/events', d)
export const deleteEvent = (id)      => req('DELETE', `/events/${id}`)

// AI
export const aiChat        = (message, history) => req('POST', '/ai/chat',     { message, history })
export const aiAdvice      = ()                  => req('GET',  '/ai/advice')
export const aiDailyPlan   = ()                  => req('GET',  '/ai/daily-plan')
export const aiWeeklyReport= ()                  => req('GET',  '/ai/weekly-report')

// Analytics
export const getDashboard = () => req('GET', '/analytics/dashboard')

// Notifications
export const getNotifications = () => req('GET',   '/notifications')
export const markAllRead      = () => req('PATCH', '/notifications/read-all')

// Stripe
export const getSubscription = ()      => req('GET',  '/stripe/status')
export const createCheckout  = (plan)  => req('POST', '/stripe/checkout', { plan })