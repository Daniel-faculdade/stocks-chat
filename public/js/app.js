var instanceSocket = null;
var isConnectionStablish = false;

(_ => {
    const socket = io(window.location.origin, { transports: ['websocket'] });

    socket.on('connection', () => {
        socket.emit('connection')
        isConnectionStablish = true;

        console.log(socket.rooms)
    })

    socket.on('user logged', (id) => {
        sessionStorage.setItem('@id/wsconn', id)
        window.location.replace('/rooms')
    })

    socket.on('joined room', (room) => {
        window.location.replace(`/room/${room}`)
    })

    socket.on('leaved room', (room) => {
        window.location.replace('/rooms')
    })

    socket.on('received message', (msg) => {
        console.log('Mensagem Recebida:' + msg)

        let msgObj = JSON.parse(msg);

        addMsgDOM(msgObj.user, msgObj.message, 'to');
    })

    instanceSocket = socket;
})()

const addMsgDOM = (user, msg, typeClass) => {
    let messageList = document.getElementById('messages')

    messageList.innerHTML += `<li class="message ${typeClass}">
        <div class="profile-pic"></div>
        <div class="content">
            <b>${user}</b>
            <p>${msg}</p>
        </div>
    </li>`;
};

const getUserFromCookie = () => {
    return document.cookie.replace("userInfo=", "");
}

const fn_entrar = function fn_entrar() {
    const inputName = document.getElementById('input-nickname')

    if (!inputName.value || inputName.value.length < 3) {
        inputName.classList.add('error')
        return;
    }
    
    let user = {
        name: inputName.value || ''
    }

    instanceSocket.emit('new user', user)
    document.cookie = `userInfo=${user.name}`;
}

const fn_entrarSala = (room) => {
    event.preventDefault()
    
    if (!room)
        return;

    instanceSocket.emit('join room', room)
}

const fn_sairSala = (room) => {
    event.preventDefault()

    if (!room)
        return;
    instanceSocket.emit('leave room', room)
}

const fn_typingMessage = () => {
    if (event.keyCode === 13)
        fn_enviarMensagem()
}

const fn_enviarMensagem = (event) => {
    let inputMessage = document.getElementById('input')
    let user = getUserFromCookie();

    if (!inputMessage.value)
        return;
        

    let msgObj = { message: inputMessage.value, user };
        
    instanceSocket.emit('send message', JSON.stringify(msgObj))
    addMsgDOM(user, inputMessage.value, 'from');
    inputMessage.value = ''
}
