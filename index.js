const path = require('path');
const { getIpAddress } = require('./utils')

const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const http = require('http')

const server = http.createServer(app);

const io = require('socket.io')(server);

const routes = require('./configs/routes')
const WsController = require('./controllers/WsController')

const address = getIpAddress()[0]
const port = process.env.PORT || 3000;

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)
app.use('/', express.static(`${__dirname}/public`));

//Routes
routes(app)

io.on('connection', (socket) => {
    WsController(io, socket)
});



server.listen(port, address, () => {
    console.log(`Server listening on address: ${address} on port: ${port}`)
});

