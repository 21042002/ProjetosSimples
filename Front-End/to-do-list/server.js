const http = require("http")
const fs = require("fs")
const path = require("path");
const sqLite3 = require("sqlite3").verbose(); // importando o sqLite3

const PORT = 3000

// Conectar ao banco 
const db = new sqLite3.Database("tarefas.db")

// Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT NOT NULL,
        concluida INTEGER DEFAULT 0
    )
`)

// Enviar JSON
function sendJSON(res, status, data) {
    res.writeHead(status, {"content-Type": "application/json"})
    res.end(JSON.stringify(data))
}

// Criação do servidor
const server = http.createServer( (req, res) => {

    // GET /tarefas - listar taefas
    if (req.url === "/tarefas" && req.method === "GET") {
        db.all("SELECT * FROM tarefas", (err, rows) => {
            if (err) return sendJSON(res, 500, { error: err.message })
                sendJSON(res, 200, rows)
        })
        return
    }

    // POST /tarefas - Listar tarefas
    if (req.url === "/tarefas" &&  req.method === "POST") {
        let body = ""; // Irá rarmazenar os dados

        req.on("data", chunk => body += chunk)
        req.on("end", () => {
            const { texto } = JSON.parse(body)

            db.run("INSERT INTO tarefas (texto) VALUES (?)",
                [texto],
                function (err) {
                    if (err) return sendJSON(res, 500, {error: err.message})
                    
                        sendJSON(res, 201,  {
                            id: this.lastID,
                            texto,
                            concluida: 0
                        })
                }
            )
        })
        return
    }

    // DEL /tarefas/:id - remover tarefa
    if (req.url.startsWith("/tarefas/") && req.method === "DELETE") {
    
        const id = req.url.split("/")[2]

        db.run("DELETE FROM tarefas WHERE id = ?", [id], function (err) {
            if (err) return sendJSON(res, 500, { erro: err.message })

            sendJSON(res, 200, {message: "Tarefa removida" })
        })
        return
    
    }

    // PATCH /tarefa/:id - Atualizar concluída
    if (req.url.startsWith("/tarefas/") && req.method === "PATCH") {
        const id = req.url.split("/")[2]
        
        let body = ""

        req.on("data", chunk => body += chunk)
        req.on("end", () => {
            const { concluida } = JSON.parse(body)

            db.run(
                "UPDATE tarefas SET concluida = ? WHERE id = ?",
                [concluida ? 1 : 0, id],
                function (err) {
                    if (err) return sendJSON(res, 500, { error: err.message })
                    
                    sendJSON(res, 200, { id, concluida })
                }
            )
        })
        return
    }

    // Servir arquivos da pasta public 
    const file = path.join(
        __dirname,
        "public",
        req.url === "/" ? "index.html" : req.url
    )

    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            return res.end("404 Not found")
        }
        res.writeHead(200)
        res.end(content)
    })

})

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
