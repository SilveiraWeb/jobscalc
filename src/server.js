const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")
const bodyParser = require('body-parser')
const fs = require('fs')
const morganBody = require('morgan-body')
const moment = require('moment')

server.use(bodyParser.json())
const log = fs.createWriteStream(
  path.join(__dirname, "./logs", `jobscalc-${moment().format('YYYY-MM-DD')}.log`), {flags:"a"}
)
morganBody(server,
  {
    noColors:true,
    stream:log
  })

const port= normalizePort(process.env.PORT || 3000);//normalizando porta
server.set('port',  port)// definindo porta

// usando template engine
server.set('view engine',  'ejs')

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos statics
server.use(express.static("public"))

// usar o req.body
server.use(express.urlencoded({ extended: true }))

// Habilita o CORS
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// routes
server.use(routes)

//console.clear(); 
// aponta para a aporta onde devera rodar o servidor 
server.listen(port, () => console.log(`Servidor rodando em (${__dirname}) em http://localhost:${port}`));

// onError
server.on('error', onError);
// onListenig
server.on('listening', onListening);
// function abaixo
// tratando erros
function onError(error) {
  if(error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port ==='string' ? 
    'Pipe ' + port :
    'Port ' + port;
  switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privilegies.' );
        process.exit(1);
    case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
    default:
        throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug(`Listening on ${bind}`);
}
// ----
function normalizePort(val){
    const port = parseInt(val, 10);
    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
}


// diretorio do servidor
//console.log(`Server dir: `+ __dirname);

// para rodar o servidor com nodemon
// npm run dev