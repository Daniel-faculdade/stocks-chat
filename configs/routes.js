const rooms = require('../data/stocks-rooms')

module.exports = function(app) {
    app.get('/', (req, res, next) => {
        res.render('index')
    })

    app.get('/rooms', (req, res) => {
        res.render('rooms', { room: rooms })
    })

    app.get('/room/:id', (req, res) => {
        
        const foundedRooms = rooms.filter(room => room.ticket == req.params.id)    

        if (foundedRooms.length <= 0)
            res.render('404')
        else 
            res.render('room', { room: foundedRooms[0]})
    })
}