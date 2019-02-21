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
  // Mandar response
  res.end('Hello World!\n')

  // Log o request path
  console.log(`Request recebido no path: ${trimmedPath} com o método: ${method} e com esses parâmetros query string`, queryStringObject)
  console.log(`Requisição recebida com os seguintes headers:`, headers)
  
})

server.listen(3000, () => {
  console.log("O server está escutando a porta 3000")  
})

// Startar o server, e fazê-lo ouvir a porta 3000
