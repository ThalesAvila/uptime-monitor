/* 
 * Funções Helpers para uma variedade de tarefas
 */

//Dependências
const crypto = require('crypto')
const config = require('./config')

// Container para todos os helpers
const helpers = {}

// Criar um hash SHA256
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hash
  } else {
    return false
  }
}

// Parse um string Json em todos os casos, sem throwing
helpers.parseJsonToObject = function(str){
  try{
    const obj = JSON.parse(str)
    return obj
  } catch(e) {
    return {}
  }
}

module.exports = helpers
