import { ref } from 'vue'
import { users } from '../data/users'

const currentUser = ref<any>(null)

export function useAuth() {
  const login = (email: string, senha: string) => {
    const user = users.find(
      u => u.email === email && u.senha === senha
    )

    if (user) {
      currentUser.value = user
      return true
    }

    return false
  }

const register = (
  nome: string,
  email: string,
  senha: string
) => {

  const existe = users.find(
    u => u.email === email
  )

  if (existe) {
    return false
  }

  users.push({
    nome,
    email,
    senha
  })

  localStorage.setItem(
    'users',
    JSON.stringify(users)
  )

  return true
}

  const logout = () => {
    currentUser.value = null
  }

  const resetPassword = (email: string) => {
    const user = users.find(
      u => u.email === email
    )

    return !!user
  }

  return {
    currentUser,
    login,
    register,
    logout,
    resetPassword
  }
}