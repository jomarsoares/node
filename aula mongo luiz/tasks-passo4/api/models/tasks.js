'use strict'

// Carrega modulos
const database = require('../database')

var _tasks
var getCollection = () => {
    if (_tasks == null) {
        _tasks = database.getDB().collection('tasks')
    }
}

module.exports = {
    getOne: (id) => {
        var task = new Promise((resolve, reject) => {
            try {
                getCollection()
                var oi = database.getOI(id)
                _tasks.findOne({_id: oi}, (err, res) => {
                    if (err) {
                        reject(err)
                    }                    
                    resolve(res)
                })
            } catch (err) {
                reject(err)
            }
        })

        return task
    },

    getAll: () => {
        var tasks = new Promise((resolve, reject) => {
            try {
                getCollection()
                _tasks.find({}, (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    res.toArray().then((data) => {
                        resolve(data)
                    })
                })
            } catch (err) {
                reject(err)
            }
            
        })

        return tasks
    },

    create: (obj) => {
        var task = new Promise((resolve, reject) => {
            try {
                getCollection()
                _tasks.insertOne(obj, (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                })
            } catch (err) {
                reject(err)
            }
        })

        return task
    },

    update: (id, obj) => {
        var task = new Promise((resolve, reject) => {
            try {
                getCollection()
                var oi = database.getOI(id)
                _tasks.findOneAndUpdate({_id: oi},
                                        {$set: obj},
                                        {returnOriginal: false},
                                        (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                })
            } catch (err) {
                reject(err)
            }
        })

        return task
    },

    remove: (id) => {
        var task = new Promise((resolve, reject) => {
            try {
                getCollection()
                var oi = database.getOI(id)
                _tasks.deleteOne({_id: oi}, (err, res) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(res)
                })
            } catch (err) {
                reject(err)
            }
        })

        return task
    }
}
