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

// etapa 8: apagar uma música
app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params // o id que veio na URL

    const comandoDelete = "DELETE FROM musicas_matheusgarcia WHERE id = ?"

    sql.query(comandoDelete, [id], (error) => {
        if (error) {
            console.log(error) // mostra o erro no terminal
            return
        }

        response.json({ mensagem: "Música apagada com sucesso!" })
    })
})

// etapa 9: buscar uma música pelo id (para a página de editar)
app.get("/musica/:id", (request, response) => {
    const { id } = request.params // o id que veio na URL

    const comandoSelect = "SELECT * FROM musicas_matheusgarcia WHERE id = ?"

    sql.query(comandoSelect, [id], (error, data) => {
        if (error) {
            console.log(error) // mostra o erro no terminal
            return
        }

        response.json(data[0]) // só a primeira posição: a própria música
    })
})

// etapa 9: salvar as alterações de uma música
app.put("/editar/:id", (request, response) => {
    const { id } = request.params // o id que veio na URL
    const { titulo, artista, genero, ano, duracao } = request.body // dados que vieram do frontend

    const comandoUpdate = "UPDATE musicas_matheusgarcia SET titulo = ?, artista = ?, genero = ?, ano = ?, duracao = ? WHERE id = ?"

    sql.query(comandoUpdate, [titulo, artista, genero, ano, duracao, id], (error) => { // o id vai por último (último ?)
        if (error) {
            console.log(error) // mostra o erro no terminal
            return
        }

        response.json({ mensagem: "Música alterada com sucesso!" })
    })
})

app.listen(3000, () => {
    console.log("Servidor online")
})

export default app
