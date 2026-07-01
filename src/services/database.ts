import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
 
const dbName = 'appdata' // variavel que nao pode ser modificada
let db: SQLiteDBConnection | null = null// variavel que pode ser modificada
let initialized = false // variavel feita pra quando carregar o banco nao ter carregado
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)
 
async function ensureDatabase() {
    if (initialized && db) {         // se o banco ja ta inicializado ele so retorna e nn executa as tabelas pq ja ta carregado
        return
    }
   
    if (!db) {
        db = await sqliteConnection.createConnection(dbName, false, 'no-encryption', 1, false) //  se nao tiver ele cria a conecção
    }
 
    await db.open()
    await db.execute( `CREATE TABLE IF NOT EXISTS usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                login TEXT NOT NULL UNIQUE,
                senha TEXT
                );`,
           
    )
 
await db.execute(`
CREATE TABLE IF NOT EXISTS album (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL,
    stickerId INTEGER NOT NULL,
    coletada INTEGER NOT NULL,
    UNIQUE(login, stickerId)
);
`)
    initialized = true
}
 
function getDb() {
    if(!db) {
        throw new Error('Banco de dados ainda nao incializado')
   
    }
    return db
}
 
    export async function initDatabase() {
        try{
            await ensureDatabase()
        } catch (error) {
            console.error('Erro ao iniciar DB', error )
            throw error
        }
    }
 
export async function addUsuario(
    nome: string,
    login: string,
    senha: string
) {
    await ensureDatabase()

    const query = `
    INSERT INTO usuario
    (nome, login, senha)
    VALUES (?, ?, ?);
    `

    await getDb().run(query, [
        nome,
        login,
        senha
    ])
}
 
export async function listUsuario() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM usuario ;`) // funcao para listar todos os campos da tabela
    return result.values || []
 
}
 
export async function deleteusuarioByid(id: number){
    await ensureDatabase()
    const query = `DELETE FROM usuario where id = ?`;  // função para deletar algum campo da tabela
    return await getDb().run(query, [id]);
}
export async function UPDATEUsuario(id: number, login: string, email: string, senha: string,){
        await ensureDatabase()
       const query = `UPDATE usuario SET login = ?, email = ?, senha = ? WHERE id = ?);`            // atualizar algum campo da tabela
    await getDb().run( query, [login, email, senha, id])
 
}
export async function findusuarioById(id: number){
    await ensureDatabase()
    const query = `SELECT * FROM usuario where id = ? `  // listar um campo especifico da tabela
    const result = await getDb().query(query, [id])
    return result.values || []
}
 
export async function realizarlogin(login: string, senha:string){
    await ensureDatabase()
    const query = `SELECT * FROM usuario where login = ? and senha = ? `  // listar um campo especifico da tabela
    const result = await getDb().query(query, [login, senha ])
    return result.values || []
}
 
 
 
 
 
 
export async function salvarFigurinha(
    login: string,
    stickerId: number,
    coletada: boolean
) {
    try {
        await ensureDatabase()

        const existe = await buscarFigurinha(login, stickerId)

        if (existe.length > 0) {
            await getDb().run(
                `UPDATE album
                 SET coletada = ?
                 WHERE login = ?
                 AND stickerId = ?`,
                [
                    coletada ? 1 : 0,
                    login,
                    stickerId
                ]
            )
        } else {
            await getDb().run(
                `INSERT INTO album
                 (login, stickerId, coletada)
                 VALUES (?, ?, ?)`,
                [
                    login,
                    stickerId,
                    coletada ? 1 : 0
                ]
            )
        }

        const dados = await getDb().query(
  "SELECT * FROM album"
)

alert(JSON.stringify(dados.values))

        console.log("Figurinha salva com sucesso")
    } catch (e) {
        console.error("Erro ao salvar figurinha:", e)
    }
}

export async function carregarAlbum(login: string) {

    await ensureDatabase()

    console.log('CARREGANDO ÁLBUM DE:', login)

    const result = await getDb().query(
        `SELECT * FROM album WHERE login = ?`,
        [login]
    )

    console.log('RESULTADO:', result.values)

    return result.values || []
}

export async function buscarFigurinha(
    login: string,
    stickerId: number
) {
    await ensureDatabase()

    const query = `
    SELECT *
    FROM album
    WHERE login = ?
      AND stickerId = ?
    `

    const result = await getDb().query(query, [
        login,
        stickerId
    ])

    return result.values || []
}

export async function removerFigurinha(
    login: string,
    stickerId: number
) {
    await ensureDatabase()

    const query = `
    DELETE FROM album
    WHERE login = ?
      AND stickerId = ?
    `

    await getDb().run(query, [
        login,
        stickerId
    ])
}

export async function limparAlbum(login: string) {
    await ensureDatabase()

    await getDb().run(
        `DELETE FROM album WHERE login = ?`,
        [login]
    )
}

export async function listarAlbum() {
    await ensureDatabase()

    const result = await getDb().query(
        `SELECT * FROM album`
    )

    console.log(result.values)

    return result.values || []
}