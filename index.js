/*
 * Arquivo primário para API 
 * 
 * */

// Dependências
const http = require('http')

// O server deve responder aos req com uma string
const server = http.createServer((req, res) => {
  res.end('Hello World!\n')
})

server.listen(3000, () => {
  console.log("O server está escutando a porta 3000")  
})

// Startar o server, e fazê-lo ouvir a porta 3000
