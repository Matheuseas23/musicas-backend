import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import "dotenv/config" // é ele que carrega o .env

const app = express()

app.use(express.json()) // o backend entende JSON
app.use(cors())         // libera o frontend para conversar com o backend

// conexão com o banco: cada valor vem do .env (a senha não aparece no código)
const sql = mysql2.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
})

// etapa 3: listar todas as músicas
app.get("/", (request, response) => {
    const comandoSelect = "SELECT * FROM musicas_matheusgarcia"

    sql.query(comandoSelect, (error, data) => {
        if (error) {
            console.log(error) // mostra o erro no terminal
            return
        }

        response.json(data) // devolve as músicas em JSON
    })
})

// etapa 7: cadastrar uma música
app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body // dados que vieram do frontend

    const comandoInsert = "INSERT INTO musicas_matheusgarcia(titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)"

    sql.query(comandoInsert, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error) // mostra o erro no terminal
            return
        }

        response.status(201).json({ mensagem: "Música cadastrada com sucesso!" })
    })
})

app.listen(3000, () => {
    console.log("Servidor online")
})

export default app
