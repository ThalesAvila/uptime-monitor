/* 
 * Lib para armazenamento de edição de dados 
*/

// Dependências
const fs = require('fs')
const path = require('path')

// Container para o módulo (para ser exportado)
const lib = {}

// Diretório base para o data folder
lib.baseDir = path.join(__dirname,'/../.data/')

// Adicionar dados a um arquivo
lib.create = function(dir,file,data,callback){
  // Abrir o arquivo para escrita
  fs.open(`${lib.baseDir + dir}/${file}.json`,'wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      // Converter dados para string
      const stringData = JSON.stringify(data)

      // Escrever no arquivo e fechá-lo
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err){
              callback(false)
            } else {
              callback('Erro ao fechar o arquivo')
            }
          })
        } else {
          callback('Erro ao escrever o arquivo')
        }
      })
    } else {
      callback('Não foi possível criar o novo arquivo, ele possivelmente já exista.')
    }
  })
}
// Exportar modulo
module.exports = lib
