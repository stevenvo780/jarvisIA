const fs = require('fs');
const path = require('path');
module.exports = function recordar(recuerdos, zona) {
  // Usamos JSON.stringify para convertir el JSON en una cadena de texto
  const jsonString = JSON.stringify(recuerdos, null, 2);

  // Usamos fs.writeFileSync para escribir la cadena de texto en un archivo llamado 'data.json'
  fs.writeFileSync(path.join("memoria", zona, 'conocimiento.json'), jsonString);
}