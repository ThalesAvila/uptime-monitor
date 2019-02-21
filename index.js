/*
 * Arquivo primário para API 
 * 
 * */

// Dependências
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

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
    // Mandar response
    res.end('Hello World!\n')

    // Log o request path
    console.log(`Requisição recebida com o seguinte payload:`, buffer)
  })

  
  
})

server.listen(3000, () => {
  console.log("O server está escutando a porta 3000")  
})

// Startar o server, e fazê-lo ouvir a porta 3000
