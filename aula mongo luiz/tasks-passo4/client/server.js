// Carrega modulos
const express    = require('express')
const http       = require('http')
const bodyParser = require('body-parser')

// Dados da API
const API_HOST = 'localhost'
const API_PORT = '3000'
const API_URL = `http://${API_HOST}:${API_PORT}/`

// Inicia obj express
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
const PORT = 8080

var getAndRend = (res, url, template) => {
    http.get(url, (result) => {
        var data = ''

        result.on('data', (chunk) => {
            data += chunk
        })

        result.on('end', () => {
            var content = JSON.parse(data)
            res.render(template, {content: content})
        })
    })
}

var reqAndRedirect = (res, success, error, opts, params) => {
    var req = http.request(opts, (result) => {
        var data = ''
        result.on('data', (chunk) => {
            data += chunk
        })
        result.on('end', () => {
            res.redirect(success)
        })
    })

    req.on('error', (err) => {
        res.redirect(error)
    })

    if (params) {
        req.write(params)
    }
    
    req.end()
}

app.get('/', (req, res) => {
    getAndRend(res, API_URL + 'tasks', 'pages/index')
})

app.get('/create', (req, res) => {
    res.render('pages/create')
})

app.post('/create', (req, res) => {
    var params = JSON.stringify({
        title: req.body.title,
        description: req.body.description
    })

    var opts = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/tasks',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(params)
        }
    }

    reqAndRedirect(res, '/', '/create', opts, params)
})

app.get('/show/:id', (req, res) => {
    var id = req.params.id
    getAndRend(res, API_URL + 'tasks/' + id, 'pages/task')
})

app.get('/edit/:id', (req, res) => {
    var id = req.params.id
    getAndRend(res, API_URL + 'tasks/' + id, 'pages/edit')
})

app.post('/edit', (req, res) => {
    var id = req.body.id

    var params = JSON.stringify({
        title: req.body.title,
        description: req.body.description
    })
    
    var opts = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/tasks/' + id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(params)
        }
    }

    reqAndRedirect(res, '/show/' + id, '/edit/' + id, opts, params)
})

app.post('/remove', (req, res) => {
    var id = req.body.id

    var opts = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/tasks/' + id,
        method: 'DELETE'
    }
    
    reqAndRedirect(res, '/', '/', opts, null)
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
