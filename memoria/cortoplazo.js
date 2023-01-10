const fs = require('fs');
const path = require('path');
module.exports = async function recordar(input, output) {
  const conocimiento = JSON.parse(fs.readFileSync(path.join(__dirname, 'recuerdos', 'ideas.json')));
  // Supongamos que nuestro JSON se encuentra en la variable 'jsonData'
  conocimiento.push({ input: input, output: output });

  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(conocimiento, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  fs.writeFileSync(path.join(__dirname, 'recuerdos', 'ideas.json'), jsonString);

  return conocimiento;
}