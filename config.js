/* 
 * Criar e exportar variáveis de configuração 
 */

// Container para todos os enviroments
const enviroments = {}

// Staging(default) enviroment
enviroments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging'
}

// Production Enviroment
enviroments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName': 'production'
}

// Definir qual enviroment foi passado como um argumento de linha de comando
const currentEnviroment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// Checar se o currentEnviroment é um enviroments acima, se não, staging é default
const enviromentToExport = typeof(enviroments[currentEnviroment]) === 'object' ? enviroments[currentEnviroment] : enviroments.staging

// Exportar o module
module.exports = enviromentToExport
