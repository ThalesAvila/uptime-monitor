/* 
 * Handlers de requisições 
 */

// Dependências

// Definir handlers
const handlers = {}

// Users
handlers.users = function(data, callback){
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback)
  } else {
    callback(405)
  }
}

// Container para os sub métodos dos users
handlers._users = {}

// Users - post
handlers._users.post = function(data, callback) {
  
}

// Users - get
handlers._users.get = function(data, callback) {
  
}

// Users - put
handlers._users.put = function(data, callback) {
  
}

// Users - delete
handlers._users.delete = function(data, callback) {
  
}
// Not found handler
handlers.notFound = function(data, callback) {
  callback(404)
}
// Ping
handlers.ping = function(data, callback){
  callback(200)
}
//Exportar o módulo
module.exports = handlers
