/*
 * Arquivo primário para API 
 * 
 * */

// Dependências
const http = require('http')
const url = require('url')

// O server deve responder aos req com uma string
const server = http.createServer((req, res) => {
  // Get e parse a URL 
  const parsedURL = url.parse(req.url, true)
  // Get path
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g,'')

  // Get método HTTP
  const method = req.method.toLowerCase();

  // Mandar response
  res.end('Hello World!\n')

  // Log o request path
  console.log(`Request recebido no path: ${trimmedPath} com o método: ${method}`)
  
})

server.listen(3000, () => {
  console.log("O server está escutando a porta 3000")  
})

// Startar o server, e fazê-lo ouvir a porta 3000
