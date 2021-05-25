var instanceSocket = null;
var isConnectionStablish = false;

(_ => {
    const socket = io(window.location.origin, { transports: ['websocket'] });

    socket.on('connection', () => {
        socket.emit('connection')
        isConnectionStablish = true;
        sessionStorage.setItem("@id/wsId", socket.id)
        window.location.replace('/rooms')
    })

    socket.on('joined room', (room) => {
        console.log(`User joined room: ${room}`)
    })

    socket.on('received message', (msg) => {
        const {userId, user, content} = msg;
        const userSessionId = sessionStorage.getItem('@id/wsId')

        if (userId != userSessionId)
            return;

        addMsgDOM(user, content, 'to');
    })

    socket.on('received typing', (message) => {
        if (message.typing)  
            addIsTypingDOM(message.user, message.room)
        else
            removeIsTypingDOM(message.user, message.room)
        
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

    messageList.scrollTop = messageList.scrollHeight - messageList.clientHeight
};

const addIsTypingDOM = (user, room) => {
    let messageList = document.getElementById('messages')

    let typingAlert = document.getElementById(`${user}_${room}`)

    if (!typingAlert)
        messageList.innerHTML += `<p id="${user}_${room}" class="message-typing">
                                ${user} está digitando...
                            </p>`;

    setTimeout(() => {
        removeIsTypingDOM(user, room)
    }, 3000)   
};


const removeIsTypingDOM = (user, room) => {
    document.getElementById(`${user}_${room}`).remove();
};


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
    sessionStorage.setItem(`@ws/userName`, JSON.stringify(user));
    window.location.replace('/rooms')
}

function fn_entrarSala(room) {
    if (!room)
        return;

    instanceSocket.emit('join room', room)
}

const fn_sairSala = (room) => {
    event.preventDefault()

    if (!room)
        return;

    instanceSocket.emit('leave room', room)
    window.location.replace(`/rooms`)
}

const fn_typingMessage = () => {
    let user = JSON.parse(sessionStorage.getItem('@ws/userName'))
    let room = document.getElementById('room').value

    let msgObj = { user: user.name, room };

    if (event.keyCode === 13) {
        fn_enviarMensagem()
        msgObj.typing = false;
    } else {
        msgObj.typing = true;
    }

    instanceSocket.emit('typing', JSON.stringify(msgObj))
}

const fn_enviarMensagem = (event) => {
    let inputMessage = document.getElementById('inputMessage')
    let user = JSON.parse(sessionStorage.getItem('@ws/userName'))
    let room = document.getElementById('room').value

    if(!user) {
        window.location.replace(`/`)
        return;
    }
    if (!inputMessage.value)
        return;
        

    let msgObj = { content: inputMessage.value, user: user.name, room };
        
    instanceSocket.emit('send message', JSON.stringify(msgObj))
    addMsgDOM(user.name, inputMessage.value, 'from');
    inputMessage.value = ''
}
