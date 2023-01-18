const fs = require('fs');
const { NlpManager } = require('node-nlp');

const path = require('path');
const dormir = require('./dormir');

exports.entrain = async () => {
  await this.bodyLearn();
  await this.razonLearn();
  await this.discernmentLearn();
  console.log("Se han guardado los recuerdos");
}

exports.bodyLearn = async () => {
  const managerBody = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
  let answers = {};
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
  readDirectory("memoria" + "/body/");

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerBody.addDocument('es', dataEntrain.input, dataEntrain.output);
    if (!answers[dataEntrain.input]) {
      answers[dataEntrain.input] = [dataEntrain.output];
    } else {
      answers[dataEntrain.input].push(dataEntrain.output);
    }
  }

  for (const question in answers) {
    for (const answer of answers[question]) {
      managerBody.addAnswer('es', question, answer);
    }
  }

  await managerBody.train();
  await managerBody.save(path.join("memoria", 'body', 'body.nlp'));
  dormir(answers, "body");
}

exports.razonLearn = async () => {
  const managerRazon = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
  let answers = {};

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
  readDirectory("memoria" + "/razon/");

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerRazon.addDocument('es', dataEntrain.input, dataEntrain.output);
    if (!answers[dataEntrain.input]) {
      answers[dataEntrain.input] = [dataEntrain.output];
    } else {
      answers[dataEntrain.input].push(dataEntrain.output);
    }
  }

  for (const question in answers) {
    for (const answer of answers[question]) {
      managerRazon.addAnswer('es', question, answer);
    }
  }

  await managerRazon.train();
  await managerRazon.save(path.join("memoria", 'razon', 'razon.nlp'));
  dormir(answers, "razon");
}

exports.discernmentLearn = async () => {
  const managerDiscernment = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
  let answers = {};

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
  readDirectory("memoria" + "/discernment/");

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    managerDiscernment.addDocument('es', dataEntrain.input, dataEntrain.output);
    if (!answers[dataEntrain.input]) {
      answers[dataEntrain.input] = [dataEntrain.output];
    } else {
      answers[dataEntrain.input].push(dataEntrain.output);
    }
  }

  for (const question in answers) {
    for (const answer of answers[question]) {
      managerDiscernment.addAnswer('es', question, answer);
    }
  }

  await managerDiscernment.train();
  await managerDiscernment.save(path.join("memoria", 'discernment', 'discernment.nlp'));
  dormir(answers, "discernment");
}