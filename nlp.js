const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['es'], forceNER: true });
const fs = require('fs')

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

// Train and save the model.
(async () => {
  await manager.train();
  manager.save();
  const response = await manager.process('es', 'abrir terminal');
  console.log(response);
})();