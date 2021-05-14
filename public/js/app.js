var instanceSocket = null;
var isConnectionStablish = false;

(_ => {
    const socket = io(window.location.origin, {transports: ['websocket']});

    socket.on('connection', () => { 
        socket.emit('connection')
        isConnectionStablish = true;

        console.log(isConnectionStablish)       
    })

    socket.on('user logged', (id) => {
        sessionStorage.setItem('@id/wsconn', id)
        window.location.replace('/rooms')
    })
    
    socket.on('received message', (msg) => {
        console.log('Mensagem Recebida:' + msg)
    })

    instanceSocket = socket;
})()


const fn_entrar = function fn_entrar() {
    const inputName = document.getElementById('input-nickname') 

    let user = {
        name: inputName.value || 'John Doe'
    }

    instanceSocket.emit('new user', user)
}

const fn_enviarMensagem = () => {
    let inputMessage = document.getElementById('input')
    
    instanceSocket.emit('send message', inputMessage.value)
}
