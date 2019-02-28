/* 
 * Handlers de requisições 
 */

// Dependências
const _data = require('./data')
const helpers = require('./helpers')
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
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 9 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false

  if(firstName && lastName && phone && password && tosAgreement) {
    // Se certificar de que o usuário não existe
    _data.read('users', phone, (err, data)=> {
      if(err) {
        // Hash the password
        const hashedPassword = helpers.hash(password)
        
        if(hashedPassword){
          // Criar o objeto do usuário
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement
          }

          // Armazenar o usuário
          _data.create('users',phone,userObject,(err)=>{
            if(!err){
              callback(200)
            } else {
              console.log(err)
              callback(500, {'Erro': 'Não foi possível criar o novo usuário'})
            }
          })
        } else {
          callback(500, {'Erro': 'Não foi possível criar um hash para o password'})
        }
      } else {
        // Usuário já existe
        callback(400, {'Erro' : 'Um usuário como esse telefone já existe'})
      }
    })
  } else {
    callback(400, {'Error' : 'Campos preenchidos incorretamente'})
  }
}
// Users - get
// Dados requiridos: phone
// Dados opcionais: none
// @TODO Permitir que o usuário autenticado acesse apenas um seu proprio userObject, não permitir que acesse nenhum outro 
handlers._users.get = function(data, callback) {
  // Checar se o phone number é válido
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false 
  if(phone){
    // Buscar o usuário
    _data.read('users',phone,(err, data)=>{
      if(!err && data){
        // Remover o hash password antes de retorná-lo para o requester
        delete data.hashedPassword
        callback(200, data)
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, {'Erro': 'O número de telefone não foi preenchido'})
  }
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
