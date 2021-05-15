const port = process.env.PORT || 3000;
const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const server = require('http').createServer(app).listen(port);
const io = require('socket.io')(server);

const routes = require('./configs/routes')
const WsController = require('./controllers/WsController')


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
    WsController(socket)
});

