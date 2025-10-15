'use client'

export interface FamilyMember {
  id: string
  name: string
  email: string
  role: 'parent' | 'teenager' | 'kid'
  avatar?: string
  joinedAt: string
}

export interface Family {
  id: string
  code: string // Código para filhos entrarem
  codeExpires: number // Timestamp de expiração
  parentId: string
  parentEmail: string
  members: FamilyMember[]
  createdAt: string
}

export class FamilyManager {
  private static FAMILIES_KEY = 'organizekids_families'
  private static CODE_EXPIRY_HOURS = 24 // Código válido por 24h

  // Gerar código único de 6 caracteres
  static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

    // Criar família (pai)
  static createFamily(parentId: string, parentEmail: string, parentName: string): Family {
    if (typeof window === 'undefined') return {} as Family

    const families = this.getAllFamilies()
    
    // Verificar se já existe
    let family = families.find(f => f.parentId === parentId)
    if (family) return family

    // Criar nova família
    family = {
      id: `family-${Date.now()}`,
      code: this.generateCode(),
      codeExpires: Date.now() + (this.CODE_EXPIRY_HOURS * 60 * 60 * 1000),
      parentId,
      parentEmail,
      members: [{
        id: parentId,
        name: parentName,
        email: parentEmail,
        role: 'parent',
        joinedAt: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    }

    families.push(family)
    this.saveFamilies(families)
    return family
  }

  // Filho entra na família usando código
  static joinFamily(code: string, childId: string, childEmail: string, childName: string, childRole: 'teenager' | 'kid'): { success: boolean; message: string; family?: Family } {
    if (typeof window === 'undefined') return { success: false, message: 'Erro' }

    const families = this.getAllFamilies()
    const family = families.find(f => f.code === code.toUpperCase())

    if (!family) {
      return { success: false, message: 'Código inválido!' }
    }

    if (Date.now() > family.codeExpires) {
      return { success: false, message: 'Código expirado! Peça um novo código aos pais.' }
    }

    // Verificar se já está na família
    if (family.members.some(m => m.id === childId)) {
      return { success: true, message: 'Você já está nesta família!', family }
    }

    // Adicionar filho
    const newMember: FamilyMember = {
      id: childId,
      name: childName,
      email: childEmail,
      role: childRole,
      joinedAt: new Date().toISOString()
    }

    family.members.push(newMember)
    this.saveFamilies(families)

    return { success: true, message: 'Conectado com sucesso!', family }
  }

  // Renovar código (quando expirar)
  static renewCode(parentId: string): Family | null {
    if (typeof window === 'undefined') return null

    const families = this.getAllFamilies()
    const family = families.find(f => f.parentId === parentId)

    if (!family) return null

    family.code = this.generateCode()
    family.codeExpires = Date.now() + (this.CODE_EXPIRY_HOURS * 60 * 60 * 1000)
    
    this.saveFamilies(families)
    return family
  }

  // Pegar família do usuário
  static getUserFamily(userId: string): Family | null {
    if (typeof window === 'undefined') return null

    const families = this.getAllFamilies()
    return families.find(f => 
      f.parentId === userId || f.members.some(m => m.id === userId)
    ) || null
  }

  // Pegar todos os filhos de um pai
  static getChildren(parentId: string): FamilyMember[] {
    const family = this.getUserFamily(parentId)
    if (!family) return []
    
    return family.members.filter(m => m.role !== 'parent')
  }

  // Remover membro da família
  static removeMember(parentId: string, memberId: string): boolean {
    if (typeof window === 'undefined') return false

    const families = this.getAllFamilies()
    const family = families.find(f => f.parentId === parentId)

    if (!family) return false

    family.members = family.members.filter(m => m.id !== memberId)
    this.saveFamilies(families)
    return true
  }

  // Helpers privados
  private static getAllFamilies(): Family[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.FAMILIES_KEY)
    return data ? JSON.parse(data) : []
  }

  private static saveFamilies(families: Family[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.FAMILIES_KEY, JSON.stringify(families))
  }
}
