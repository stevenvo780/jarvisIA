const { notFount } = require('../corteza/cagorizacionProcessExecute');
const { razonLearn, bodyLearn, discernmentLearn } = require('./aprender');
const { recordar } = require('./cortoplazo');
const { addIdeaSombra, getSombra, somaticMarkers } = require('./cortoplazo');
const { respuestaConversations, speak } = require('../corteza/voz');
const {
  runCommandSentiment
} = require('../corteza/osBash');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

exports.recordarAction = async (question) => {
  return new Promise((resolve, reject) => {
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Esto es un comando o una conversación?");
    recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando, conversacion o un discernimiento: ', async response => {
      recordarRequest.close();
      if (response !== "comando" && response !== "conversacion" && response !== "discernimiento") {
        await respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
        resolve(false);
      } else {
        const saveRequest = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        let textQuestion = null;
        if (response === "comando") {
          textQuestion = '¿Que comando debería responder a esta acción?: ';
        }
        if (response === "conversacion") {
          textQuestion = '¿Que conversación debería responder a esta acción?: ';
        }
        if (response === "discernimiento") {
          textQuestion = '¿Que discernimiento debería responder a esta acción?: ';
        }
        speak(textQuestion);
        saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
          saveRequest.close();
          if (responseSave === "cancelar") {
            await respuestaConversations("Sera a la proxima");
            resolve(false);
          }
          let zona = null;
          if (response === "comando") {
            zona = "body";
          }
          if (response === "conversacion") {
            zona = "razon";
          }
          if (response === "discernimiento") {
            zona = "discernment";
          }
          await recordar(question, responseSave, zona);
          await respuestaConversations("Estudiando lo aprendido");
          if (zona === "body") {
            await recordar(question, "execute.body", "discernment");
            await bodyLearn();
          }
          if (zona === "razon") {
            await recordar(question, "execute.razon", "discernment");
            await razonLearn();
          }
          await discernmentLearn();
          resolve(true);
        });
      }
    });
  });
}

exports.newIdea = () => {
  return new Promise((resolve, reject) => {
    const inputRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Cual es la entrada?");
    inputRequest.question("Jarvis: " + '¿Cual es la entrada?: ', async question => {
      inputRequest.close();
      await this.recordarAction(question);
      resolve(true);
    });
  });
}

exports.addLastIdea = async () => {
  const sombra = await getSombra();
  const question = sombra[sombra.length - 2].input;
  await this.recordarAction(question);
  resolve(true);
}

exports.fixLastIdea = () => {
  return new Promise(async (resolve, reject) => {
    const sombra = await getSombra();
    const question = sombra[sombra.length - 2].input;
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Esto es un comando o una conversación?");
    recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando, conversacion o un discernimiento: ', async response => {
      recordarRequest.close();
      if (response !== "comando" && response !== "conversacion" && response !== "discernimiento") {
        await respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
        resolve(false);
      } else {
        const saveRequest = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        let textQuestion = null;
        if (response === "comando") {
          textQuestion = '¿Que comando debería responder a esta acción?: ';
        }
        if (response === "conversacion") {
          textQuestion = '¿Que conversación debería responder a esta acción?: ';
        }
        if (response === "discernimiento") {
          textQuestion = '¿Que discernimiento debería responder a esta acción?: ';
        }
        speak(textQuestion);
        saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
          saveRequest.close();
          if (responseSave === "cancelar") {
            await respuestaConversations("Sera a la proxima");
            resolve(false);
          }
          if (response === "comando") {
            zona = "body";
          }
          if (response === "conversacion") {
            zona = "razon";
          }
          if (response === "discernimiento") {
            zona = "discernment";
          }
          let dirSave = null;
          let fileData = null
          async function readDirectory(dir) {
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
                  const fileDataJson = await JSON.parse(fs.readFileSync(path.join(dir, file)));
                  for (let index = 0; index < fileDataJson.length; index++) {
                    const idea = fileDataJson[index];
                    if (idea.input === question) {
                      dirSave = dir;
                      fileDataJson[index].output = responseSave;
                      fileData = fileDataJson;
                    }
                  }
                }
              }
            }
          }
          // Inicia la lectura de la carpeta raíz
          await readDirectory("memoria/" + zona);
          if (dirSave !== null) {
            fs.writeFileSync(path.join(dirSave, 'ideas.json'), JSON.stringify(fileData));
            if (zona === "body") {
              await bodyLearn();
              await recordar(question, "execute.body", "discernment");
            }
            if (zona === "razon") {
              await razonLearn();
              await recordar(question, "execute.razon", "discernment");
            }
          } else {
            await recordar(question, responseSave, zona);
            await respuestaConversations("Estudiando lo aprendido");
            if (zona === "body") {
              await recordar(question, "execute.body", "discernment");
              await bodyLearn();
            }
            if (zona === "razon") {
              await recordar(question, "execute.razon", "discernment");
              await razonLearn();
            }
          }
          await discernmentLearn();
          resolve(true);
        });
      }
    });
  });
}

exports.handleNotFount = (action, intuition = null, discernment) => {
  return new Promise(async (resolve, reject) => {
    const greatOrNot = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Mi respuesta fue satisfactoria?");
    await addIdeaSombra(action, intuition, "intuition", discernment);
    greatOrNot.question("Jarvis: " + '¿Mi respuesta fue satisfactoria? ', async responseGreat => {
      greatOrNot.close();
      const somaticEmotional = await runCommandSentiment(responseGreat);
      if (somaticEmotional.score > 0) {
        await recordar(action, intuition, "razon");
        await recordar(action, "execute.razon", "discernment");
        await razonLearn();
        await discernmentLearn();
        resolve(true);
      } else {
        const createCommandRequest = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        speak("¿Me puedes enseñar como responder?");
        createCommandRequest.question("Jarvis: " + '¿Me puedes enseñar como responder? ', async responseSave => {
          createCommandRequest.close();
          const somaticEmotional = await runCommandSentiment(responseSave);
          if (somaticEmotional.score > 0) {
            await this.recordarAction(action);
            resolve(true);
          } else if (somaticEmotional.score < 0) {
            const searchGoogleCommand = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            speak("¿Desea buscarlo en internet?");
            searchGoogleCommand.question("Jarvis: " + '¿Desea buscarlo en internet? ', async responseSearch => {
              searchGoogleCommand.close();
              const somaticEmotional = await runCommandSentiment(responseSearch);
              if (somaticEmotional.score > 0) {
                await notFount(action);
              }
              resolve(true);
            });
          } else {
            resolve(true);
          }
        });
      }
      await somaticMarkers(responseGreat);
    });
  });
}