module.exports = function(socket) {


     // when the client emits 'new message', this listens and executes
    socket.on('new user', (data) => {
        socket.username = data.name
        
        // we tell the client to execute 'new message'
        socket.emit('user logged', socket.id)
    });

    socket.on('send message', (msg) => {
        socket.broadcast.emit('received message', msg)
        console.log(msg)
    })
}