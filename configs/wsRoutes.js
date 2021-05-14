const WsController = require('../controllers/WsController')

module.exports = function(socket) { 
    WsController(socket)
}