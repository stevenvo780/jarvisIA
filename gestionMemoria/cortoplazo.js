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
const skipResponse = {
  skipSomaticMarkers:  0,
};
exports.addIdeaSombra = async (input, output, zone, discernment) => {
  if(skipResponse.skipSomaticMarkers > 0){
    skipResponse.skipSomaticMarkers--;
    return;
  }
  const conocimiento = JSON.parse(fs.readFileSync(path.join("memoria", '', 'sombra.json')));
  const somaticEmotional = await runCommandSentiment(input);
  if (conocimiento[conocimiento.length - 1]) {
    conocimiento[conocimiento.length - 1].emotionalResponse = somaticEmotional;
  }
  if (conocimiento[conocimiento.length - 2]) {
    conocimiento[conocimiento.length - 2].emotionalResponse = somaticEmotional;
  }
  conocimiento.push({
    input: input,
    output: discernment.intent,
    zone: "discernment",
    emotionalResponse: { "negative": 0, "neutral": 0, "positive": 0, "score": 0 }
  });
  conocimiento.push({
    input: input,
    output: output,
    zone: zone,
    emotionalResponse: { "negative": 0, "neutral": 0, "positive": 0, "score": 0 }
  });
  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(conocimiento, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  try {
    fs.writeFileSync(path.join("memoria", '', 'sombra.json'), jsonString);
  } catch (error) {
    console.log(error);
  }

  return conocimiento;
}

exports.somaticMarkers = async (responseGreat) => {
  const conocimiento = JSON.parse(fs.readFileSync(path.join("memoria", '', 'sombra.json')));
  const somaticEmotional = await runCommandSentiment(responseGreat);
  if (conocimiento[conocimiento.length - 1]) {
    conocimiento[conocimiento.length - 1].emotionalResponse = somaticEmotional;
  }
  if (conocimiento[conocimiento.length - 2]) {
    conocimiento[conocimiento.length - 2].emotionalResponse = somaticEmotional;
  }
  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(conocimiento, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  try {
    fs.writeFileSync(path.join("memoria", '', 'sombra.json'), jsonString);
  } catch (error) {
    console.log(error);
  }
  skipResponse.skipSomaticMarkers++;
  return conocimiento;
}

exports.getSombra = async () => {
  const conocimiento = await JSON.parse(fs.readFileSync(path.join("memoria", '', 'sombra.json')));
  return conocimiento;
}
