const fs = require('fs');
const { NlpManager } = require('node-nlp');

async function predict() {
  // Crea una instancia de NlpManager
  const manager = new NlpManager({ languages: ['es'] });

  // Carga el modelo guardado en el archivo model.nlp
  await manager.load();

  // Realiza la predicción con el texto de entrada
  const result = await manager.process('es', 'abrir explorador de archivos');

  //console.log(result);
  // Imprime el resultado de la predicción
  console.log(result.utterance + " = "+ result.intent);
}

predict();