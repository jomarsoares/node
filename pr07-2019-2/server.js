/*
   TI0080 - Des de Aplicações Web

   Exemplo de implementação do UPLOAD com o NodeJs
   Usando os módulos Express e Multer  

*/

const express = require('express')
    , app = express()
    , multer = require('multer')
    , path = require('path')
    , fs = require("fs");

app.use(express.static('public'));
app.set('view engine', 'ejs')

var maxSize = 10*1024*1024; // 10MB
var nomearqup = "";  // armazena o nome do arquivo de UPLOAD

const storage = multer.diskStorage({
    // destino do arquivo
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    // nome do arquivo
    filename: function (req, file, cb) {
//        cb(null, file.originalname + '-' + Date.now());
        nomearqup = file.originalname;
        cb(null, file.originalname);
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({
    storage : storage,
    limits  : { fileSize: maxSize }
}).single('file');

/* 
    POST para fazer upload de um arquivo e envio de dados

    O template ejs msgUpload apresenta mensagem indicando o 
    sucesso da operação.   

*/
app.post('/file/upload', function(req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send(' <h2>O seu upload NÃO foi realizado! <h2>');
            return console.log(err);
        }

        var direct = path.join(__dirname + '/public/data/');
        var data = {
            campo1 : req.body.campo1,
            campo2 : req.body.campo2,
            campo3 : req.body.campo3
        };

        var new_data = JSON.stringify({data});
        fs.writeFile(direct + '/test.json', new_data, function (err, data){
            if (err) {
                console.log('Erro gravando o arquivo test.json');
                return console.error(err);
            }
        });

        msg = {"arqeup" : nomearqup ,
               "dados" : data};
        res.render('msgUpload', msg);  

    });
});

/* 
    GET para listar os arquivos disponiveis no diretório de uploads
    
    O template ejs arqDisp apresenta a lista e permite a escolha de 
    um arquivo para eliminação.   

*/

app.get('/arqs', (req, res) => {
	var dirData = path.join(__dirname+'/uploads');
	fs.readdir(dirData, function(err, items) {
        arqdisp = { "arqelim" : "",
                    "item" : items};
        
		res.render('arqsDisp', arqdisp);
	});
})	

/* 
    GET para verificar se o arquivo indicado para eliminação 
    existe no diretório de uploads e solicitar a confirmação.
    
    O template ejs confDel é usado para confirmação da exclusão.
    
*/
app.get('/del', (req, res) => {
    var dirData = path.join(__dirname+'/uploads/'+req.query.name);
    fs.access(dirData, function(err, items) {
            if (err) {
            res.send(' <h3>Arquvo '+req.query.name+' não encontrado! <h3>');
            return console.log(err);
        }
        res.render('confDel',{"arqdel" : req.query.name});
	});
})

/* 
    GET para deletar uma arquivo do diretório de uploads
    
    O template ejs msgElim é usado para mostrar se houve sucesso na exclusão.
    
*/
app.get('/confdel', (req, res) => {
    var dirData = path.join(__dirname+'/uploads');
    var arq = path.join(__dirname+'/uploads/'+req.query.name);
    if (req.query.conf == "SIM") {
        fs.unlink(arq, function(err, items) {
            if (err) {
                res.send(' <h3>Erro na eliminação do Arquivo '+req.query.name+' ! <h3>');
                return console.log(err);
            }
            msg = {"arqelim" : req.query.name};
            res.render('msgElim', msg);
        });
    } else {
        msg = {"arqelim" : ""};
        res.render('msgElim', msg);
    }
})

app.listen(3000, () => console.log('App linstening on port 3000'));
