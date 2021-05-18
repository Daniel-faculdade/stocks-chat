const WsController = require('../controllers/WsController')

module.exports = function(io, socket) { 
    WsController(io, socket)
}