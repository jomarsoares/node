const http = require("http");

const host = "127.0.0.1";
const port = 3000;

const onRequest = function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    let jsonBody = {
        message: "Hello, World!"
    };

    let txtBody = JSON.stringify(jsonBody);

    res.end(txtBody);
};

const onStart = function () {
    console.log(`Server running at http://${host}:${port}/`);
}

http.createServer(onRequest).listen(port, host, onStart);
