const tf = require('@tensorflow/tfjs-node');
const gpt2 = require('@tensorflow-models/gpt2');

async function completarFrase(frase) {
  // Carga el modelo GPT-2
  const model = await gpt2.load();

  // Ejecuta el modelo para completar la frase dada
  const completado = await model.complete(frase);

  console.log(completado);
}

completarFrase('Hola, ¿cómo estás hoy?');
