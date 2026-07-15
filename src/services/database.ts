import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { stickersData } from '@/data/stickers'

const dbName = 'appdata'
let db: SQLiteDBConnection | null = null
let initialized = false
let sqliteUnavailable = false
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)

type LocalUser = {
  nome: string
  email: string
  senha: string
}

type LocalAlbumItem = {
  stickerId: number
  coletada: number
  favorite: number
  collected_at: string | null
}

type AchievementRule =
  | { kind: 'total'; target: number }
  | { kind: 'rare'; target: number }
  | { kind: 'shiny'; target: number }
  | { kind: 'percentage'; target: number }
  | { kind: 'collection'; selecao: string }

type AchievementDefinition = {
  id: string
  nome: string
  descricao: string
  icone: string
  rule: AchievementRule
}

const defaultUser: LocalUser = {
  nome: 'Administrador',
  email: 'admin@admin.com',
  senha: '123456'
}

function normalizeLogin(login: string) {
  return login.trim().toLowerCase()
}

function getLocalUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem('users') || 'null')
    return Array.isArray(saved) && saved.length ? saved as LocalUser[] : [defaultUser]
  } catch {
    return [defaultUser]
  }
}

function saveLocalUsers(users: LocalUser[]) {
  localStorage.setItem('users', JSON.stringify(users))
}

function getLocalAlbum(login: string) {
  try {
    const saved = JSON.parse(localStorage.getItem(`album:${normalizeLogin(login)}`) || '[]')
    return Array.isArray(saved) ? saved as LocalAlbumItem[] : []
  } catch {
    return []
  }
}

function saveLocalAlbum(login: string, album: LocalAlbumItem[]) {
  localStorage.setItem(`album:${normalizeLogin(login)}`, JSON.stringify(album))
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getAchievementDefinitions(): AchievementDefinition[] {
  const fixed: AchievementDefinition[] = [
    {
      id: 'primeira-figurinha',
      nome: 'Primeira Figurinha',
      descricao: 'Desbloquear ao coletar a primeira figurinha.',
      icone: 'sparkles',
      rule: { kind: 'total', target: 1 }
    },
    {
      id: 'iniciante',
      nome: 'Iniciante',
      descricao: 'Coletar 10 figurinhas.',
      icone: 'ribbon',
      rule: { kind: 'total', target: 10 }
    },
    {
      id: 'colecionador',
      nome: 'Colecionador',
      descricao: 'Coletar 25 figurinhas.',
      icone: 'albums',
      rule: { kind: 'total', target: 25 }
    },
    {
      id: 'album-em-construcao',
      nome: 'Album em Construcao',
      descricao: 'Coletar 50 figurinhas.',
      icone: 'construct',
      rule: { kind: 'total', target: 50 }
    },
    {
      id: 'cacador-de-raras',
      nome: 'Cacador de Raras',
      descricao: 'Coletar 5 figurinhas raras.',
      icone: 'search',
      rule: { kind: 'rare', target: 5 }
    },
    {
      id: 'especialista-em-raras',
      nome: 'Especialista em Raras',
      descricao: 'Coletar 15 figurinhas raras.',
      icone: 'medal',
      rule: { kind: 'rare', target: 15 }
    },
    {
      id: 'brilho-inicial',
      nome: 'Brilho Inicial',
      descricao: 'Coletar 3 figurinhas brilhantes.',
      icone: 'diamond',
      rule: { kind: 'shiny', target: 3 }
    },
    {
      id: 'mestre-das-brilhantes',
      nome: 'Mestre das Brilhantes',
      descricao: 'Coletar 10 figurinhas brilhantes.',
      icone: 'trophy',
      rule: { kind: 'shiny', target: 10 }
    },
    {
      id: 'album-quase-completo',
      nome: 'Album Quase Completo',
      descricao: 'Completar 80% do album.',
      icone: 'trending-up',
      rule: { kind: 'percentage', target: 80 }
    },
    {
      id: 'campeao-da-copa',
      nome: 'Campeao da Copa',
      descricao: 'Completar 100% do album.',
      icone: 'football',
      rule: { kind: 'percentage', target: 100 }
    }
  ]

  const collections = Array.from(new Set(stickersData.map(sticker => sticker.selecao))).map(selecao => ({
    id: `colecao-${slugify(selecao)}`,
    nome: `Colecao ${selecao}`,
    descricao: `Completar todas as figurinhas da selecao ${selecao}.`,
    icone: 'flag',
    rule: { kind: 'collection', selecao } as AchievementRule
  }))

  return [...fixed, ...collections]
}

function getLocalAchievements(login: string) {
  try {
    const saved = JSON.parse(localStorage.getItem(`achievements:${normalizeLogin(login)}`) || '[]')
    return Array.isArray(saved) ? saved as Array<{ achievement_id: string; data_desbloqueio: string }> : []
  } catch {
    return []
  }
}

function saveLocalAchievements(login: string, achievements: Array<{ achievement_id: string; data_desbloqueio: string }>) {
  localStorage.setItem(`achievements:${normalizeLogin(login)}`, JSON.stringify(achievements))
}

function getUnlockedAchievementIds(stats: { collected: number; rareCollected: number; shinyCollected: number; percentage: number }, album: LocalAlbumItem[]) {
  return getAchievementDefinitions()
    .filter(achievement => {
      const rule = achievement.rule

      switch (rule.kind) {
        case 'total':
          return stats.collected >= rule.target
        case 'rare':
          return stats.rareCollected >= rule.target
        case 'shiny':
          return stats.shinyCollected >= rule.target
        case 'percentage':
          return stats.percentage >= rule.target
        case 'collection': {
          const collectionStickers = stickersData.filter(sticker => sticker.selecao === rule.selecao)
          return collectionStickers.length > 0 && collectionStickers.every(sticker =>
            album.some(item => item.stickerId === sticker.id && item.coletada === 1)
          )
        }
      }
    })
    .map(achievement => achievement.id)
}

async function ensureColumn(column: string, definition: string) {
  const columns = await getDb().query('PRAGMA table_info(album)')
  if (!columns.values?.some((item: any) => item.name === column)) {
    await getDb().execute(`ALTER TABLE album ADD COLUMN ${column} ${definition}`)
  }
}

async function ensureDatabase() {
  if (initialized && db) return
  if (sqliteUnavailable) throw new Error('SQLite indisponivel neste ambiente')
  if (!db) db = await sqliteConnection.createConnection(dbName, false, 'no-encryption', 1, false)

  await db.open()
  await db.execute(`CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    senha TEXT
  )`)
  await db.run('INSERT OR IGNORE INTO usuario (nome, login, senha) VALUES (?, ?, ?)', ['Administrador', 'admin@admin.com', '123456'])
  await db.execute(`CREATE TABLE IF NOT EXISTS figurinhas (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    selecao TEXT NOT NULL,
    foto TEXT,
    raridade TEXT NOT NULL
  )`)
  await db.execute(`CREATE TABLE IF NOT EXISTS album (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL,
    stickerId INTEGER NOT NULL,
    coletada INTEGER NOT NULL DEFAULT 0,
    favorite INTEGER NOT NULL DEFAULT 0,
    collected_at DATETIME,
    UNIQUE(login, stickerId)
  )`)
  await db.execute(`CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    icone TEXT NOT NULL,
    desbloqueada INTEGER NOT NULL DEFAULT 0,
    data_desbloqueio DATETIME
  )`)
  await db.execute(`CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    data_desbloqueio DATETIME NOT NULL,
    UNIQUE(user_id, achievement_id)
  )`)
  await ensureColumn('favorite', 'INTEGER NOT NULL DEFAULT 0')
  await ensureColumn('collected_at', 'DATETIME')

  for (const sticker of stickersData) {
    await db.run(`INSERT OR IGNORE INTO figurinhas (id, nome, selecao, foto, raridade)
      VALUES (?, ?, ?, ?, ?)`, [sticker.id, sticker.nome, sticker.selecao, sticker.foto, sticker.raridade])
  }

  for (const achievement of getAchievementDefinitions()) {
    await db.run(`INSERT OR IGNORE INTO achievements (id, nome, descricao, icone, desbloqueada)
      VALUES (?, ?, ?, ?, 0)`, [achievement.id, achievement.nome, achievement.descricao, achievement.icone])
  }
  initialized = true
}

function getDb() {
  if (!db) throw new Error('Banco de dados ainda nao inicializado')
  return db
}

export async function initDatabase() {
  try {
    await ensureDatabase()
  } catch (error) {
    sqliteUnavailable = true
    saveLocalUsers(getLocalUsers())
    console.warn('SQLite indisponivel, usando armazenamento local.', error)
  }
}

export async function cadastrarUsuario(nome: string, login: string, senha: string) {
  const normalizedLogin = normalizeLogin(login)
  if (!nome.trim() || !normalizedLogin || !senha) return false

  try {
    await ensureDatabase()
    const existing = await getDb().query('SELECT id FROM usuario WHERE login = ?', [normalizedLogin])
    if (existing.values?.length) return false
    await getDb().run('INSERT INTO usuario (nome, login, senha) VALUES (?, ?, ?)', [nome.trim(), normalizedLogin, senha])
    return true
  } catch {
    const users = getLocalUsers()
    if (users.some(user => normalizeLogin(user.email) === normalizedLogin)) return false
    users.push({ nome: nome.trim(), email: normalizedLogin, senha })
    saveLocalUsers(users)
    return true
  }
}

export async function autenticarUsuario(login: string, senha: string) {
  const normalizedLogin = normalizeLogin(login)
  try {
    await ensureDatabase()
    const result = await getDb().query('SELECT nome, login FROM usuario WHERE login = ? AND senha = ?', [normalizedLogin, senha])
    return result.values?.[0] || null
  } catch {
    const user = getLocalUsers().find(item => normalizeLogin(item.email) === normalizedLogin && item.senha === senha)
    return user ? { nome: user.nome, login: user.email } : null
  }
}

export async function usuarioExiste(login: string) {
  const normalizedLogin = normalizeLogin(login)
  try {
    await ensureDatabase()
    const result = await getDb().query('SELECT id FROM usuario WHERE login = ?', [normalizedLogin])
    return !!result.values?.length
  } catch {
    return getLocalUsers().some(user => normalizeLogin(user.email) === normalizedLogin)
  }
}

export async function salvarFigurinha(login: string, stickerId: number, coletada: boolean) {
  const collectedAt = coletada ? new Date().toISOString() : null
  try {
    await ensureDatabase()
    const current = await buscarFigurinha(login, stickerId)
    if (current.length) {
      await getDb().run(`UPDATE album SET coletada = ?, collected_at = ? WHERE login = ? AND stickerId = ?`,
        [coletada ? 1 : 0, collectedAt, normalizeLogin(login), stickerId])
    } else {
      await getDb().run(`INSERT INTO album (login, stickerId, coletada, favorite, collected_at) VALUES (?, ?, ?, 0, ?)`,
        [normalizeLogin(login), stickerId, coletada ? 1 : 0, collectedAt])
    }
    await recalcularConquistas(login)
  } catch {
    const album = getLocalAlbum(login)
    const current = album.find(item => item.stickerId === stickerId)
    if (current) {
      current.coletada = coletada ? 1 : 0
      current.collected_at = collectedAt
    } else {
      album.push({ stickerId, coletada: coletada ? 1 : 0, favorite: 0, collected_at: collectedAt })
    }
    saveLocalAlbum(login, album)
    await recalcularConquistas(login)
  }
}

export async function salvarFavorita(login: string, stickerId: number, favorite: boolean) {
  try {
    await ensureDatabase()
    const current = await buscarFigurinha(login, stickerId)
    if (current.length) {
      await getDb().run('UPDATE album SET favorite = ? WHERE login = ? AND stickerId = ?', [favorite ? 1 : 0, normalizeLogin(login), stickerId])
    } else {
      await getDb().run('INSERT INTO album (login, stickerId, coletada, favorite) VALUES (?, ?, 0, ?)', [normalizeLogin(login), stickerId, favorite ? 1 : 0])
    }
  } catch {
    const album = getLocalAlbum(login)
    const current = album.find(item => item.stickerId === stickerId)
    if (current) {
      current.favorite = favorite ? 1 : 0
    } else {
      album.push({ stickerId, coletada: 0, favorite: favorite ? 1 : 0, collected_at: null })
    }
    saveLocalAlbum(login, album)
  }
}

export async function carregarAlbum(login: string) {
  try {
    await ensureDatabase()
    const result = await getDb().query('SELECT * FROM album WHERE login = ?', [normalizeLogin(login)])
    return result.values || []
  } catch {
    return getLocalAlbum(login)
  }
}

export async function buscarFigurinha(login: string, stickerId: number) {
  try {
    await ensureDatabase()
    const result = await getDb().query('SELECT * FROM album WHERE login = ? AND stickerId = ?', [normalizeLogin(login), stickerId])
    return result.values || []
  } catch {
    return getLocalAlbum(login).filter(item => item.stickerId === stickerId)
  }
}

export async function obterEstatisticas(login: string) {
  try {
    await ensureDatabase()
    const result = await getDb().query(`SELECT
      COUNT(f.id) AS total,
      COALESCE(SUM(CASE WHEN a.coletada = 1 THEN 1 ELSE 0 END), 0) AS collected,
      COALESCE(SUM(CASE WHEN a.coletada = 1 AND f.raridade = 'Rara' THEN 1 ELSE 0 END), 0) AS rareCollected,
      COALESCE(SUM(CASE WHEN a.coletada = 1 AND f.raridade = 'Brilhante' THEN 1 ELSE 0 END), 0) AS shinyCollected,
      COALESCE(SUM(CASE WHEN a.coletada = 1 THEN CASE f.raridade WHEN 'Brilhante' THEN 10 WHEN 'Rara' THEN 5 ELSE 1 END ELSE 0 END), 0) AS score
      FROM figurinhas f LEFT JOIN album a ON a.stickerId = f.id AND a.login = ?`, [normalizeLogin(login)])
    const data = result.values?.[0] || {}
    const total = Number(data.total || 0)
    const collected = Number(data.collected || 0)
    return { total, collected, missing: total - collected, rareCollected: Number(data.rareCollected || 0), shinyCollected: Number(data.shinyCollected || 0), percentage: total ? Math.round((collected / total) * 100) : 0, score: Number(data.score || 0) }
  } catch {
    const album = getLocalAlbum(login)
    const collectedItems = stickersData.filter(sticker => album.some(item => item.stickerId === sticker.id && item.coletada === 1))
    const total = stickersData.length
    const collected = collectedItems.length
    const rareCollected = collectedItems.filter(sticker => sticker.raridade === 'Rara').length
    const shinyCollected = collectedItems.filter(sticker => sticker.raridade === 'Brilhante').length
    const score = collectedItems.reduce((sum, sticker) => sum + (sticker.raridade === 'Brilhante' ? 10 : sticker.raridade === 'Rara' ? 5 : 1), 0)
    return { total, collected, missing: total - collected, rareCollected, shinyCollected, percentage: total ? Math.round((collected / total) * 100) : 0, score }
  }
}

export async function listarUltimasColetas(login: string) {
  try {
    await ensureDatabase()
    const result = await getDb().query(`SELECT f.*, a.collected_at FROM album a INNER JOIN figurinhas f ON f.id = a.stickerId
      WHERE a.login = ? AND a.coletada = 1 ORDER BY a.collected_at DESC LIMIT 10`, [normalizeLogin(login)])
    return result.values || []
  } catch {
    return getLocalAlbum(login)
      .filter(item => item.coletada === 1)
      .sort((a, b) => String(b.collected_at).localeCompare(String(a.collected_at)))
      .slice(0, 10)
      .map(item => ({ ...stickersData.find(sticker => sticker.id === item.stickerId), collected_at: item.collected_at }))
  }
}

export async function recalcularConquistas(login: string) {
  const normalizedLogin = normalizeLogin(login)

  try {
    await ensureDatabase()
    const stats = await obterEstatisticas(normalizedLogin)
    const album = await carregarAlbum(normalizedLogin)
    const unlockedIds = getUnlockedAchievementIds(stats, album)
    const unlockedAt = new Date().toISOString()

    for (const achievementId of unlockedIds) {
      await getDb().run(`INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, data_desbloqueio)
        VALUES (?, ?, ?)`, [normalizedLogin, achievementId, unlockedAt])
      await getDb().run(`UPDATE achievements
        SET desbloqueada = 1, data_desbloqueio = COALESCE(data_desbloqueio, ?)
        WHERE id = ?`, [unlockedAt, achievementId])
    }
  } catch {
    const stats = await obterEstatisticas(normalizedLogin)
    const album = getLocalAlbum(normalizedLogin)
    const unlockedIds = getUnlockedAchievementIds(stats, album)
    const saved = getLocalAchievements(normalizedLogin)
    const unlockedAt = new Date().toISOString()

    for (const achievementId of unlockedIds) {
      if (!saved.some(item => item.achievement_id === achievementId)) {
        saved.push({ achievement_id: achievementId, data_desbloqueio: unlockedAt })
      }
    }

    saveLocalAchievements(normalizedLogin, saved)
  }
}

export async function listarConquistas(login: string) {
  const normalizedLogin = normalizeLogin(login)

  try {
    await ensureDatabase()
    await recalcularConquistas(normalizedLogin)
    const result = await getDb().query(`SELECT
      a.id,
      a.nome,
      a.descricao,
      a.icone,
      CASE WHEN ua.id IS NULL THEN 0 ELSE 1 END AS desbloqueada,
      ua.data_desbloqueio
      FROM achievements a
      LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
      ORDER BY desbloqueada DESC, a.nome ASC`, [normalizedLogin])

    return result.values || []
  } catch {
    await recalcularConquistas(normalizedLogin)
    const saved = getLocalAchievements(normalizedLogin)

    return getAchievementDefinitions()
      .map(achievement => {
        const unlocked = saved.find(item => item.achievement_id === achievement.id)
        return {
          id: achievement.id,
          nome: achievement.nome,
          descricao: achievement.descricao,
          icone: achievement.icone,
          desbloqueada: unlocked ? 1 : 0,
          data_desbloqueio: unlocked?.data_desbloqueio || null
        }
      })
      .sort((a, b) => Number(b.desbloqueada) - Number(a.desbloqueada) || a.nome.localeCompare(b.nome))
  }
}
