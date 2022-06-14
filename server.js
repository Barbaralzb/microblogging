const app = require('./app')
const server = require('http').Server(app)
const debug = require('debug')('app:server')
const port = process.env.PORT || 3000
server.listen(port, () => {
  debug(`Servidor corriento en el puerto : ${server.address().port}`)
})
