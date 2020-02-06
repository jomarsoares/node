// Carrega modulos
const express     = require('express')
const bodyParser  = require('body-parser')
const database    = require('./database')

// Inicia obj express
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Configuracoes do servidor
const PORT = 3000

// Inicia servidor
app.listen(PORT, () => {
    // Conecta ao DB
    database.connect((err) => {
        if (err) {
            throw err
        }
        console.log('API connected to the database')
    })
    console.log(`API listening on port ${PORT}`)
})
