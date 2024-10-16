const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const port = 3000

// Configuracao express
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Controllers
const maloteController = require("./controllers/maloteController")

// Rotas 
app.get('/', (req, res) => { res.send("Hello World!")} )
app.post('/malotes/adicionar', maloteController.adicionarMalote)
app.post('/malotes/editar', maloteController.editarMalote)
app.post('/malotes/deleta/:id', maloteController.removerMalote)
app.get('/malotes', maloteController.obterMalotes)

app.listen(port, (req, res) => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})