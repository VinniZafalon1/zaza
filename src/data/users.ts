export interface User {
  nome: string
  email: string
  senha: string
}

export const users: User[] =
  JSON.parse(
    localStorage.getItem('users') || 'null'
  ) || [
    {
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: '123456'
    }
  ]