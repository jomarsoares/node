var express     = require('express')
var session     = require('express-session')
var body_parser = require('body-parser')
var path        = require('path')
var fs          = require('fs')
var crypto      = require('crypto')

var app = express()

// 16bits key to crypt passowrds
const secret = 'A1B120dkOplcm4lH'

var sha512 = (pwd, salt) => {
    var hash = crypto.createHmac('sha512', salt)
    hash.update(pwd)
    return  hash.digest('hex');
}

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/login.html'))
})

app.get('/novo', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/nlogin.html'))
})

app.post('/auth', (req, res) => {
    var username = req.body.username
    var password = sha512(req.body.password, secret)

    if (username && password) {
        // Authenticate
        var users = JSON.parse(fs.readFileSync(__dirname + '/data/users.json'))
        var user = users.find((item) => {
            return (item.username == username && item.password == password)
        })

        // Login
        if (user != undefined) {
            req.session.loggedin = true
            req.session.username = username
            res.redirect('/home')
        } else {
            res.send('Incorrect username/password.')
        }
        res.end()
    } else {
        res.send('Please enter username and password.')
        res.end()
    }
})

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!')
    } else {
        res.send('Please, log in to view this page')
    }
    res.end()
})

/*

  TESTE PARA CRIAÇÃO DE USUÁRIOS

*/
app.post('/novousu', (req, res) => {
    var username = req.body.username
    var password = sha512(req.body.password, secret)

    console.log(req.body);

    if (username && password) {
        // Authenticate
        var users = JSON.parse(fs.readFileSync(__dirname + '/data/users.json'))

        var user = users.find((item) => {
//            return (item.username == username && item.password == password)
            return (item.username == username)
        })

        // Login
        if (user == undefined) { // USUÁRIO NAO EXISTE

            novousuario = {
                "username" : username,
                "password" : password 
            };

            if (req.body.adm == 'on') novousuario.adm = 1;

            users[users.length] = novousuario;
            console.log("Novo usuario:");
            console.log(novousuario);

            /*
            console.log("Numero de usuarios:");
            console.log(users.length);
            console.log(users);
            */

            data = JSON.stringify(users);
            fs.writeFileSync(__dirname + '/data/users.json',data);
            req.session.loggedin = true
            req.session.username = username
            res.redirect('/home')
            /*
            */

        } else {
            res.send('User already exists!')
        }
        res.end()
    } else {
        res.send('Please enter username and password.')
        res.end()
    }
})

app.listen(8081, () => console.log('App linstening on port 8081'))

