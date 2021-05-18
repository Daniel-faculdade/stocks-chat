var instanceSocket = null;
var isConnectionStablish = false;

(_ => {
    const socket = io(window.location.origin, { transports: ['websocket'] });

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

        let msgObj = JSON.parse(msg);

        addMsgDOM(msgObj.user, msgObj.message);
    })

    instanceSocket = socket;
})()

const addMsgDOM = (user, msg) => {
    let messageList = document.getElementById('messages')

    messageList.innerHTML += `<li class="from">
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

    let user = {
        name: inputName.value || 'John Doe'
    }

    instanceSocket.emit('new user', user)
    document.cookie = `userInfo=${user.name}`;
}

const fn_enviarMensagem = () => {
    let inputMessage = document.getElementById('input')
    let user = getUserFromCookie();

    let msgObj = { message: inputMessage.value, user };

    instanceSocket.emit('send message', JSON.stringify(msgObj))
    addMsgDOM(user, inputMessage.value);
}
