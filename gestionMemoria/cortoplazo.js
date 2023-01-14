const fs = require('fs');
const path = require('path');
const {
  runCommandSentiment
} = require('../corteza/osBash');
exports.recordar = (input, output, zona) => {
  const conocimiento = JSON.parse(fs.readFileSync(path.join("memoria", zona + '/recuerdos', 'ideas.json')));
  // Supongamos que nuestro JSON se encuentra en la variable 'jsonData'
  conocimiento.push({ input: input, output: output });

  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(conocimiento, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  fs.writeFileSync(path.join("memoria", zona + '/recuerdos', 'ideas.json'), jsonString);
  return conocimiento;
}

exports.addIdeaSombra = async (input, output, zone) => {
  const conocimiento = JSON.parse(fs.readFileSync(path.join("memoria", '', 'sombra.json')));
  // Supongamos que nuestro JSON se encuentra en la variable 'jsonData'
  conocimiento.push({
    input: input,
    output: output,
    zone: zone,
    emotionalResponse: { "negative": 0, "neutral": 0, "positive": 0, "score": 0 }
  });
  const somaticEmotional = await runCommandSentiment(input);
  if (conocimiento[conocimiento.length - 2]) {
    conocimiento[conocimiento.length - 2].emotionalResponse = somaticEmotional;
  }
  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(conocimiento, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  fs.writeFileSync(path.join("memoria", '', 'sombra.json'), jsonString);
  return conocimiento;
}

exports.getSombra = async () => {
  const conocimiento = JSON.parse(fs.readFileSync(path.join("memoria", '', 'sombra.json')));
  return conocimiento;
}