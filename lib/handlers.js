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
// Dados requeridos: firstName, LastName, phone, password, tosAgreemete
// Dados opciionais: none
handlers._users.post = function(data, callback) {
  // Checar se todos os dados requeridos foram preenchidos
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false 
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement === true ? true : false

  if(firstName && lastName && phone && password && tosAgreement) {
    // Se certificar de que o usuário não existe
  } else {
    callback(400, {'Error' : 'Missing required fields'})
  }
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
