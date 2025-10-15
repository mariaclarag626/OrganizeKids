'use client'

export interface LocalUser {
  id: string
  email: string
  name: string
  password: string
  role: 'teenager' | 'parent' | 'kid'
  createdAt: string
}

export class LocalAuthManager {
  private static USERS_KEY = 'organizekids_users'
  private static CURRENT_USER_KEY = 'organizekids_current_user'

  // Get all users
  static getAllUsers(): LocalUser[] {
    if (typeof window === 'undefined') return []
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  // Save users
  private static saveUsers(users: LocalUser[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    const users = this.getAllUsers()
    return users.some(user => user.email.toLowerCase() === email.toLowerCase())
  }

  // Get user by email
  static getUserByEmail(email: string): LocalUser | null {
    const users = this.getAllUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  // Register new user (Sign Up)
  static registerUser(email: string, password: string, name: string, role: 'teenager' | 'parent' | 'kid'): { success: boolean; message: string; user?: LocalUser } {
    if (this.emailExists(email)) {
      return { 
        success: false, 
        message: 'Este email já está cadastrado. Faça login!' 
      }
    }

    const users = this.getAllUsers()
    const newUser: LocalUser = {
      id: Date.now().toString(),
      email,
      password, // Em produção, deve ser hasheada!
      name,
      role,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    this.saveUsers(users)
    
    // Fazer login automático após criar a conta
    this.setCurrentUser(newUser)

    return { 
      success: true, 
      message: 'Conta criada com sucesso!',
      user: newUser 
    }
  }

  // Login
  static login(email: string, password: string): { success: boolean; message: string; user?: LocalUser } {
    const user = this.getUserByEmail(email)

    if (!user) {
      return { 
        success: false, 
        message: 'Email não encontrado. Crie uma conta primeiro!' 
      }
    }

    if (user.password !== password) {
      return { 
        success: false, 
        message: 'Senha incorreta!' 
      }
    }

    // Save current user
    this.setCurrentUser(user)

    return { 
      success: true, 
      message: 'Login realizado com sucesso!',
      user 
    }
  }

  // Set current user
  static setCurrentUser(user: LocalUser): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
  }

  // Get current user
  static getCurrentUser(): LocalUser | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(this.CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  }

  // Logout
  static logout(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  // Check if user is logged in
  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }

  // Update user role
  static updateUserRole(email: string, newRole: 'teenager' | 'parent' | 'kid'): boolean {
    if (typeof window === 'undefined') return false
    
    const users = this.getAllUsers()
    const userIndex = users.findIndex(u => u.email === email)
    
    if (userIndex === -1) return false
    
    // Atualizar role do usuário
    users[userIndex].role = newRole
    this.saveUsers(users)
    
    // Atualizar também o current user se for o mesmo
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.email === email) {
      currentUser.role = newRole
      this.setCurrentUser(currentUser)
    }
    
    return true
  }

  // Get dashboard route by role
  static getDashboardRoute(role: 'teenager' | 'parent' | 'kid'): string {
    const routes = {
      teenager: '/dashboard/teenagers',
      parent: '/dashboard/parents',
      kid: '/dashboard/kids'
    }
    return routes[role]
  }
}
