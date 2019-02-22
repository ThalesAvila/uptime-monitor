/*
 * Arquivo primário para API 
 * 
 * */

// Dependências
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecode
const config = require('./config')

// O server deve responder aos req com uma string
const server = http.createServer((req, res) => {
  // Get e parse a URL 
  const parsedUrl = url.parse(req.url, true)
  // Get path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g,'')
  
  // Get a query string como um objeto
  const queryStringObject = parsedUrl.query

  // Get método HTTP
  const method = req.method.toLowerCase()

  // Get os headers como um objeto
  const headers = req.headers
  
  // Get payload, se ele existir
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    // Definir o handler para qual o request deverá ir. Se o handler não for encontrado, usar o handler notFound
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    //Construir o data object para enviar ao handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      'payload' : buffer
    }

    // Rotear a requisição para o handler especificado no router
    chosenHandler(data, (statusCode, payload) => {
      // Usar o status code called back pelo o handler, ou o default 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200

      // Usar o payload called back pelo o handler, ou o default objeto vazio
      payload = typeof(payload) === 'object' ? payload : {}

      // Converter o payload para string
      const payloadString = JSON.stringify(payload)

      // Retornar a resposta
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      
      // Log a response
      console.log(`Retornando a resposta:`, statusCode,payloadString)
    })
  })
})

// Startar o server, e fazê-lo ouvir a porta 3000
server.listen(config.port, () => {
  console.log(`O server está escutando a porta ${config.port} no ambiente ${config.envName}`)  
})

// Definir handlers
const handlers = {}

// Sample Handler
handlers.sample = function(data, callback) {
  // Callback um http status code, e um payload object
  callback(406, {'name': 'sample handler'})
}
// Not found handler
handlers.notFound = function(data, callback) {
  callback(404)
}

// Definir o request routers
const router = {
  'sample': handlers.sample
}
