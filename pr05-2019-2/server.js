/*
 * Exemplo para a prática 05
 * - uso de layouts
 * - uso de cookies  
 */

const express = require('express'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts'); 
const app = express() 
const fs = require("fs");
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

/*
 * Configuracap do uso do express-ejs-layouts na nossa aplicação
 * Ver layout.ejs no diretorio views
 */
app.use(expressLayouts) 

/* 
 * Configuração do uso do middleware de cookies
 */
app.use(cookieParser());

app.get('/', (req, res) => {
	var dirData = path.join(__dirname+'/public/data');
	fs.readdir(dirData, function(err, items) {
	    disponiveisCV = items;
		
		// Carrega cookie
		var lastCv = req.cookies.lastCv;

		// Visualizacao de conteudo do cookie
		if (lastCv != undefined) {
			console.log(`Cookie: ${lastCv}\n`);
		} else {
			console.log('Cookie: vazio!!!\n');
		}

		res.render('index', {disponiveisCV, lastCv});
	});
})	


app.get('/cv', function(req,res) {
// app.post('/cv', function(req,res) {  // Substituir para o caso de usar POST
	var arr1 = [], arr2 = [];
	/*
	* Alternativa de recuperação de dados com o POST 
	* (nesse caso, os dados do formulário devem ser recuperados no payload do HTTP)
	* O comentário abaixo deve ser removidos e a linha subsequente comentada
	* para recuperar o nome no corpo o nome do usuário     
	*/
	// var name = req.body.name; // recuperação com POST
	var name = req.query.name; // recuperação com GET
	
	var diret = path.join(__dirname+'/public/data/'+name);
	
	var dadosCV = 
	{ 
	  userName : name,
	  linesSec1 : [], 
      	  linesSec2 : []
	}	

	// Leitura dos dados da 1a secao	// var name = req.params.usu //recuperação com /cv/:usu

	fs.readFile(diret+'/s1.txt', 
	    function (err, data) {
		if (err) {
			res.send('erro na leitura do aquivo s1.txt');
			return console.error(err);
		}
		dadosCV.linesSec1 = data.toString().split("\n")
	
		// Leitura dos dados da 2a secao
		fs.readFile(diret+'/s2.txt', 
	    function (err, data) {
			if (err) {
				res.send('erro na leitura do aquivo s1.txt');
				return console.error(err);
			}
			dadosCV.linesSec2 = data.toString().split("\n")
			
			// Salva cookie com nome de cv acessado
			res.cookie('lastCv', name);

			// executa cv.ejs
			res.render('cv2',dadosCV);
		});
	});
})

app.get('/contato', (req, res) => {
    res.render('contato')
})

app.get('/config', (req, res) => {
    res.render('config')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
