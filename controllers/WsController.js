module.exports = function(io, socket) {
     // when the client emits 'new message', this listens and executes
    socket.on('new user', (data) => {
        socket.username = data.name
        
        // we tell the client to execute 'new message'
        socket.emit('user logged', socket.id)
    });

    socket.on('join room', (room) => {
        socket.join(`room-${room}`)
        socket.emit('joined room', room)
    })

    socket.on('leave room', (room) => {
        socket.leave(`room-${room}`)
        socket.emit('leaved room', room)
    })

    socket.on('send message', (msg) => {
        socket.broadcast.emit('received message', msg)
        console.log(msg)
    })

    socket.on('typing', (msg) => {
        socket.broadcast.emit('receive typing', msg)
        console.log(msg)
    })

}