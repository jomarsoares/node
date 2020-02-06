const http = require("http");
const fs = require("fs");

const host = "127.0.0.1";
const port = 8000;

const apiHost = "127.0.0.1";
const apiPort = 3000;

// Carrega template
let template = fs.readFileSync("view/index.thtml", "utf8");

// Resposta desse servidor a requisicoes
const onRequest = function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    // Requisicao a API
    http.get(`http://${apiHost}:${apiPort}/`, (apiRes) => {
        let { statusCode } = apiRes;
        if (statusCode == 200) {
            // Buffer para receber mensagem da API
            let rawData = "";
            apiRes.on("data", (chunk) => { rawData += chunk; });

            // Quando mensagem for recebido
            apiRes.on("end", () => {
                // Converte mensagem texto para JSON
                var jsonData = JSON.parse(rawData);
                
                // Substitui texto no template por mensagem vinda de API
                var html = "";
                html = template.replace("<%message%>", jsonData.message);

                res.end(html);
            });
        }
    });
};

const onStart = function () {
    console.log(`Server running at http://${host}:${port}/`);
};

// Inicia servidor
http.createServer(onRequest).listen(port, host, onStart);