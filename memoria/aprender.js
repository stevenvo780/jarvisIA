const fs = require('fs');
const { NlpManager } = require('node-nlp');

const path = require('path');
const dormir = require('./dormir');

exports.entrain = async () => {
  await this.bodyLearn();
  await this.razonLearn();
  console.log("Se han guardado los recuerdos");
}

exports.bodyLearn = async () => {
  const managerBody = new NlpManager({ languages: ['es'], autoSave: false });
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
  readDirectory(__dirname + "/body/");

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerBody.addDocument('es', dataEntrain.input, dataEntrain.output);
  }

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerBody.addAnswer('es', dataEntrain.output, dataEntrain.output);
  }

  await managerBody.train();
  await managerBody.save(path.join(__dirname, 'body', 'body.nlp'));
  dormir(data, "body");
}

exports.razonLearn = async () => {
  const managerRazon = new NlpManager({ languages: ['es'], autoSave: false });
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
  readDirectory(__dirname + "/razon/");
  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerRazon.addDocument('es', dataEntrain.input, dataEntrain.output);
  }

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerRazon.addAnswer('es', dataEntrain.output, dataEntrain.output);
  }

  await managerRazon.train();
  await managerRazon.save(path.join(__dirname, 'razon', 'razon.nlp'));
  dormir(data, "razon");
}
