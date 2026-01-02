export interface User {
  id: string
  phone: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  phone: string
  name?: string
}

export interface AuthData {
  phone: string
  code?: string
}
