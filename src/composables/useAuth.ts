import { ref } from 'vue'
import { autenticarUsuario, cadastrarUsuario, usuarioExiste } from '@/services/database'

const currentUser = ref<{ nome: string; email: string } | null>(null)

export function useAuth() {
  const login = async (email: string, senha: string) => {
    const user = await autenticarUsuario(email, senha)
    if (!user) return false
    currentUser.value = { nome: user.nome, email: user.login }
    return true
  }

  const register = async (nome: string, email: string, senha: string) =>
    cadastrarUsuario(nome.trim(), email, senha)

  const logout = () => { currentUser.value = null }
  const resetPassword = async (email: string) => usuarioExiste(email)

  return { currentUser, login, register, logout, resetPassword }
}
