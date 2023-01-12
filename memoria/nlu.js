const { containerBootstrap } = require('@nlpjs/core');
const { NluManager, NluNeural } = require('@nlpjs/nlu');
const { LangEs } = require('@nlpjs/lang-es');
const fs = require('fs');
const path = require('path');
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

readDirectory(__dirname + "/body/");

(async () => {
  const container = await containerBootstrap();
  container.use(LangEs);
  container.use(NluNeural);
  const manager = new NluManager({
    container,
    locales: ['es'],
    trainByDomain: false,
  });
  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    manager.add('es', dataEntrain.input, dataEntrain.output);
  }

  await manager.train();
  // You can provide the locale of the language
  let actual = await manager.process('es', 'que tal');
  console.log(actual);
})();