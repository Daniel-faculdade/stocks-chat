module.exports = function(io, socket) {
     // when the client emits 'new message', this listens and executes
    socket.on('new user', (data) => {
        socket.username = data.name
        
        // we tell the client to execute 'new message'
        socket.emit('user logged', socket.id)
    });

    socket.on('join room', (room) => {
        socket.join(`room${room}`)
        room.userId = socket.id
        socket.broadcast.to("room" + room).emit('joined room', room)
        console.log('Joined room: ' + socket.id)
    })

    socket.on('leave room', (room) => {
        socket.leave(`room${room}`)
        socket.emit('leaved room', room)
        console.log('Leave room: ' + room)
    })

    socket.on('send message', (msg) => {
        const message = JSON.parse(msg)

        socket.broadcast.to(`room${message.room}`).emit('received message', message)
        console.log(message)
    })
}