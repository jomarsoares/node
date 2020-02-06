'use strict'

// Carrega modulo
const mongoClient = require('mongodb').MongoClient
const mongoOI     = require('mongodb').ObjectID

// Configuracoes de DB
const DB_URL  = 'mongodb://127.0.0.1:27017'
const DB_NAME = 'web_app'

var client
var db

module.exports = {
    getOI: (id) => {
        return new mongoOI(id)
    },

    connect: (callback) => {
        mongoClient.connect(DB_URL, {useUnifiedTopology: true}, (err, cli) => {
            if (!err) {
                client = cli;
                db  = cli.db(DB_NAME);
            }
            
            return callback(err);
        })
    },

    getDB: () => {
        return db
    },

    disconnect: () => {
        if (client) {
            client.close()
        }
    }
}
