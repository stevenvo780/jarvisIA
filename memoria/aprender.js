const fs = require('fs');
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['es'] });
const path = require('path');
const dormir = require('./dormir');

module.exports = async function entrain() {
  // Array para almacenar los datos de todos los archivos JSON
  let data = [];

  // Función recursiva que recorre una carpeta y todas sus subcarpetas
  // y agrega los datos de todos los archivos JSON encontrados al array data
  function readDirectory(dir) {
    // Lee el contenido de la carpeta
    const files = fs.readdirSync(dir);
    // Para cada archivo o carpeta en la carpeta actual
    for (const file of files) {
      // Si es una carpeta, llama recursivamente a la función con la ruta de la carpeta
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        readDirectory(path.join(dir, file));
      } else {
        // Si es un archivo JSON, lee el contenido y lo agrega al array data
        if (file == 'ideas.json') {
          const fileData = fs.readFileSync(path.join(dir, file));
          data = data.concat(JSON.parse(fileData));
        }
      }
    }
  }
  // Inicia la lectura de la carpeta raíz
  readDirectory(__dirname);

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    manager.addDocument('es', dataEntrain.input, dataEntrain.output);
  }

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    manager.addAnswer('es', dataEntrain.output, dataEntrain.output);
  }

  await manager.train();
  await manager.load();
  dormir(data);
  console.log("Se han guardado los recuerdos");
}
