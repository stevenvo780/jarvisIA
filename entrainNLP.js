const fs = require('fs');
const { NlpManager } = require('node-nlp');
const { uuidv4 } = require('uuid');

const manager = new NlpManager({ languages: ['es'] });

async function entrain() {
  // Lee el archivo conocimiento.json y lo parse a formato JSON
  const conocimiento = fs.readFileSync('./conocimiento.json');
  const data = JSON.parse(conocimiento);

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    manager.addDocument('es', dataEntrain.input, dataEntrain.output);
  }

  for (let index = 0; index < data.length; index++) {
    const dataEntrain = data[index];
    manager.addAnswer('es', dataEntrain.output, dataEntrain.output);
  }

  await manager.train();
  manager.save();
}

entrain();
