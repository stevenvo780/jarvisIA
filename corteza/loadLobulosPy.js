const {
  openSessionGPT3,
  openSessionGPT3Chat,
  openSessionChatbot,
  openSessionTranslateEn_Es,
  openSessionTranslateEs_En,
} = require('./osBash');
const path = require('path');
const fs = require('fs');
exports.loadLobules = function () {
  return new Promise(function (resolve, reject) {
    const allModules = 0;
    fs.readFile(path.join(__dirname, '../memoria', 'stateLobules.json'), 'utf8', (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err)
        return
      }
      try {
        const result = JSON.parse(jsonString)
        const allModules = Object.keys(result).length;
        // Serialize el objeto de nuevo en una cadena de texto
        for (const key in result) {
          result[key] = 0;
        }
        const json = JSON.stringify(result)
        // Escribir el archivo con el json modificado
        fs.writeFile(path.join(__dirname, '../memoria', 'stateLobules.json'), json, 'utf8', (err) => {
          if (err) {
            //console.log("Error writing file:", err)
          } else {
            //openSessionGPT3();
            //openSessionGPT3Chat();
            openSessionChatbot();
            openSessionTranslateEn_Es();
            openSessionTranslateEs_En();
            const watcher = fs.watch(path.join(__dirname, '../memoria', 'stateLobules.json'), function (eventType, filename) {
              if (eventType === 'change') {
                const file = fs.readFileSync(path.join(__dirname, '../memoria', 'stateLobules.json'));
                try {
                  var result = JSON.parse(file);
                  let validate = allModules;
                  for (const key in result) {
                    //console.log(key + ': ' + result[key]);
                    if (result[key] == 1) {
                      validate = validate - 1
                    }
                  }
                  console.log(result)
                  //console.log(validate);
                  if (validate === 0) {
                    watcher.close();
                    resolve(result);
                  }
                } catch (error) {
                  // aveces falla
                }
              }
            });
          }
        });
      } catch (err) {
        //console.log('Error parsing JSON string:', err)
      }
    })
  });
}