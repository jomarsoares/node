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

var maxSize = 10*1024*1024; // 10MB

const storage = multer.diskStorage({
    // destino do arquivo
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    // nome do arquivo
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({
    storage : storage,
    limits  : { fileSize: maxSize }
}).single('file');

app.post('/file/upload', function(req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send(' <h2>O seu upload NÃO foi realizado! <h2>');
            return console.log(err);
        }
       
        res.send('<h2>Upload realizado com sucesso! </h2>'+
        '<p> os demais campos enviados no formulário foram '
        +req.body.campo1 + ', '
        +req.body.campo2 + ', '
        +req.body.campo3 + '! </p>');
       
        var direct = path.join(__dirname + '/public/data/');
       
        var new_data = JSON.stringify({
            campo1 : req.body.campo1,
            campo2 : req.body.campo2,
            campo3 : req.body.campo3
        });
       
        fs.writeFile(direct + '/test.json', new_data, function (err, data){
            if (err) {
                console.log('Erro gravando o arquivo test.json');
                return console.error(err);
            }
        });
    });
});

app.listen(3000, () => console.log('App linstening on port 3000'));