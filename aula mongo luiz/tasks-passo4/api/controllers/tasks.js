'use strict'

// Carrega modulos
var taskModel = require('../models/tasks')

exports.list = (req, res) => {
    taskModel.getAll().then((val) => {
        res.json({success: true, action: 'list', tasks: val})
    }, (err) => {
        res.json({success: false, action: 'list', err: err})
    })
    
}

exports.create = (req, res) => {
    var task = {
        title: req.body.title,
        description: req.body.description
    }

    taskModel.create(task).then((val) => {
        res.json({success: true, action: 'create', task: val.ops[0]})
    }, (err) => {
        res.json({success: false, action: 'create', err: err})
    })
    
}

exports.show = (req, res) => {
    taskModel.getOne(req.params.id).then((val) => {
        res.json({success: true, action: 'show', task: val})
    }, (err) => {
        res.json({success: false, action: 'show', err: err})
    })
}

exports.edit = (req, res) => {
    var task = {
        title: req.body.title,
        description: req.body.description
    }
    var id = req.params.id

    taskModel.update(id, task).then((val) => {
        res.json({success: true, action: 'edit', task: val.value})
    }, (err) => {
        res.json({success: false, action: 'edit', err: err})
    })
}

exports.remove = (req, res) => {
    taskModel.remove(req.params.id).then((val) => {
        res.json({success: true, action: 'remove', delCount: val.deletedCount})
    }, (err) => {
        res.json({success: false, action: 'remove', err: err})
    })
}
