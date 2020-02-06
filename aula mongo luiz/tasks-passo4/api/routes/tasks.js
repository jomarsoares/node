'use strict'
const tasksController = require('../controllers/tasks')

module.exports = (app) => {
    // List tasks
    app.route('/tasks').get(tasksController.list)

    // Create task
    app.route('/tasks').post(tasksController.create)

    // Read task
    app.route('/tasks/:id').get(tasksController.show)

    // Edit task
    app.route('/tasks/:id').put(tasksController.edit)

    // Delete task
    app.route('/tasks/:id').delete(tasksController.remove)
}