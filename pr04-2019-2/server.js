/*
 * Servidor simples para carga de arquivos fixos e de 
 * scripts em EJS 
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const fs = require("fs");
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})

/* 1a ROTA   

	usar: http://localhost:8080/

	A estrutura Json é passada para o template index.ejs; 
	o valor do atributo "teste" é substituído no template e apresentado 
	na página HTML
	
*/

app.get('/', function (req, res) {
  res.render('index', {teste: 
	 "1o exemplo de uso de templates EJS"});
})

/* 2a ROTA   

	usar: http://localhost:8080/teste/QUALQUERCOISA

	A estrutura Json é passada para o template index.ejs; 
	o valor do atributo "teste" será o que você digitar na url
	no lugar de QUALQUERCOISA. Esse valor é substituído no template 
	e apresentado na página HTML
	
*/

app.get('/teste/:tst', function (req, res) {
	res.render('index', {teste: req.params.tst});
})
  

/* 3a ROTA   

	usar: http://localhost:8080/cv/fulano 

	Será usado o template cv.ejs para formatar as linhas carregadas dos arquivos
	s1.txt e s2.txt armazenados em data/fulano na estrutura deste projeto.

*/
app.get('/cv/:usu', function(req,res) {
	var arr1 = [], arr2 = [];
	var diret; 
	diret = path.join(__dirname+'/public/data/'+req.params.usu);
	var dadosCV = 
	{ 
	  userName : req.params.usu,
	  linesSec1 : [], 
      linesSec2 : []
	}	

	// Leitura dos dados da 1a secao
	fs.readFile(diret+'/s1.txt', 
	    function (err, data) {
		if (err) {
			res.send('Dados inexistentes ou incompletos para '+req.params.usu);
			return console.error(err);
		}  
		dadosCV.linesSec1 = data.toString().split("\n")

		// Leitura dos dados da 2a secao
		fs.readFile(diret+'/s2.txt', 
			function (err, data) {
			if (err) {
				res.send('Dados inexistentes ou incompletos para '+req.params.usu);
				return console.error(err);
			}
			dadosCV.linesSec2 = data.toString().split("\n")
		
			// processa cv.ejs para gerar o html enviado ao cliente
			res.render('cv',dadosCV);
		});
	});
})

app.listen(8080, function () {
  console.log('Server listening on port 8080!')
})
