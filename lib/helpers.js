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

//Cria uma string aleatória com caracteres alfanuméricos com um tamanho n
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false

  if(strLength){
    // Definir todos os caracteres possíveis que podem compor a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    // Startar a string final
    let str = ''
    
    for(let i = 1; i < strLength; i++){
      // Pegar um caracter aleatório da possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
      // Adicionar esse caracter a str
      str += randomCharacter
    }

    //Retornar a string final
    return str

  } else {
    return false
  }
}


module.exports = helpers
