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

// Container para os métodos de users
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
// Dados requiridos: phone
// Dados opcionais: firstName, lastName, password (pelo menos um precisa ser especificado)
// @TODO Permitir que apenas um usuários autenticado atualize o seu próprio objeto, não permitir que ele atualize nenhum outro objeto 
handlers._users.put = function(data, callback) {
  // Checar dados requeridos
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false 
  
  // Checar dados opcionais
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false 
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  
  // Erro se o phone for inválido
  if(phone){
    // Erro se nada for enviado para update
    if(firstName || lastName || password){
      // Buscar usuário
      _data.read('users', phone, (err, userData) => {
        if(!err && userData){
          if(firstName){
            userData.firstName = firstName
          }
          if(lastName){
            userData.lastName = lastName
          }
          if(password){
            userData.hashedPassword = helpers.hash(password)
          }
          // Armazenar o novo update
          _data.update('users', phone, userData, (err) => {
            if(!err){
              callback(200)
            } else {
              console.log(err)              
              callback(500,{'Erro': 'Não foi possível atualizar o usuário'})
            }
          })
        } else {
          callback(400,{'Erro': 'O usuário especificado não existe'})
        }
      })
    } else {
      callback(400, {'Erro': 'Nenhum dado para update foi enviado'})
    }
  } else {
    callback(400, {'Erro': 'Campo phone preenchido incorretamente'})
  }
}

// Users - delete
// Dados requiridos: phone
// @TODO Apenas um usuário autenticado poderá deletar seu objeto
// @TODO Cleanup (deletar) qualquer outro arquivo associado com este user
handlers._users.delete = function(data, callback) {
  // Checar se o phone é válido
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false 
  if(phone){
    _data.read('users',phone,(err, data)=>{
      if(!err && data){
        _data.delete('users',phone,(err)=>{
          if(!err){
            callback(200)
          } else {
            callback(500, {'Erro': 'Não foi possível deletar o usuário'})
          }
        })
      } else {
        callback(400, {'Erro': 'Não foi possível encontrar o usuário especificado'})
      }
    })
  } else {
    callback(400, {'Erro': 'O número de telefone não foi preenchido'})
  }
}

// Tokens
handlers.tokens = function(data, callback){
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback)
  } else {
    callback(405)
  }
}

// Container para os métodos de tokens
handlers._tokens = {}

// Tokens - post
// Dados requiridos: phone, password
// Dados opcionais: none
handlers._tokens.post = function(data, callback){
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 9 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

  if(phone && password){
    // Procurar o usuário com o phone correspondente
    _data.read('users',phone, (err,userData) => {
      if(!err && userData){
        // Hash o password enviado e compará-lo ao password armazenado no user object
        const hashedPassword = helpers.hash(password)
        if(hashedPassword === userData.hashedPassword){
          // Se válido, criar token com nome aleatório, definir data de expiração para uma hora
          const tokenId = helpers.createRandomString(20)
          const expires = Date.now() + 1000 * 60 * 60
          const tokenObject = {
            phone,
            'id': tokenId,
            expires
          }

          // Armazenar o token
          _data.create('tokens',tokenId,tokenObject,(err)=>{
            if(!err){
              callback(200, tokenObject)
            } else {
              callback(500, {'Eroo':'Não foi possível criar o token'})
            }
          })
        } else {
          callback(400, {'Erro': 'Password incorreto para o usuário especificado'})
        }
      } else {
        callback(400, {'Erro': 'Não foi possível encontrar o usuário especificado'})
      }
    })
  } else {
    callback(400, {'Erro': 'Campos preenchidos incorretamente'})
  }
}

// Tokens - get
// Dados requeridos: id
// Dados opcionais: none
handlers._tokens.get = function(data, callback){
  // Checar se o id number é válido
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id : false 
  if(id){
    // Buscar o usuário
    _data.read('tokens',id,(err, tokenData)=>{
      if(!err && tokenData){
        callback(200, tokenData)
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, {'Erro': 'O número de id não foi preenchido'})
  }
}

// Tokens - put
// Dados requeridos: id, extend
// Dados opcionais: none
handlers._tokens.put = function(data, callback){
  const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false
  const extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? data.payload.extend : false

  if(id && extend){
    // Procurar o token
    _data.read('tokens',id,(err, tokenData)=>{
      if(!err && tokenData){
        // Checar se um token já não está expirado
        if(tokenData.expires > Date.now()){
          // Renovar a expiração para uma hora
          tokenData.expires = Date.now() + 1000 * 60 * 60
          // Armazenar a nova atualização
          _data.update('tokens',id,tokenData,(err)=>{
            if(!err){
              callback(200)
            } else {
              callback(500,{'Erro':'Não foi possível efetuar o update'})
            }
          })
        } else {
          callback(400, {'Erro':'O token já expirou e não pode ser extendido'})
        }
      } else {
        callback(400,{'Erro:':'O token especificado não existe'})
      }
    })
  } else {
    callback(400,{'Error':'Campos não preenchidos ou inválidos'})
  }
}

// Tokens - delete
// Dados requeridos: id
// Dados opcionais: none
handlers._tokens.delete = function(data, callback){
  // Checar se o id é válido
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id : false 
  if(id){
    _data.read('tokens',id,(err, tokenData)=>{
      if(!err && tokenData){
        _data.delete('tokens',id,(err)=>{
          if(!err){
            callback(200)
          } else {
            callback(500, {'Erro': 'Não foi possível deletar o token'})
          }
        })
      } else {
        callback(400, {'Erro': 'Não foi possível encontrar o token especificado'})
      }
    })
  } else {
    callback(400, {'Erro': 'O id do token não foi preenchido'})
  }
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
