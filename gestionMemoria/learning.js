const { notFount } = require('../corteza/cagorizacionProcessExecute');
const { razonLearn, bodyLearn, discernmentLearn } = require('../memoria/aprender');
const { recordar } = require('../memoria/cortoplazo');
const { getSombra } = require('../memoria/cortoplazo');
const { respuestaConversations, speak } = require('../corteza/voz');
const {
  runCommandSentiment
} = require('../corteza/osBash');
const readline = require('readline');

exports.recordarAction = async (question) => {
  return new Promise((resolve, reject) => {
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Esto es un comando o una conversación?, responde comando o conversacion");
    recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando o conversacion: ', async response => {
      recordarRequest.close();
      if (response !== "comando" && response !== "conversacion") {
        await respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
        resolve(false);
      } else {
        const saveRequest = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        const textQuestion = response === "comando" ? '¿Que comando debería responder a esta acción?: ' : '¿Que conversación debería responder a esta acción?: ';
        speak(textQuestion);
        saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
          saveRequest.close();
          if (responseSave === "cancelar") {
            await respuestaConversations("Sera a la proxima");
            resolve(false);
          }
          const zona = response === "comando" ? "body" : "razon"
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
    speak("¿Cual es la entrada de este comando?");
    inputRequest.question("Jarvis: " + '¿Cual es la entrada de este comando?: ', async question => {
      inputRequest.close();
      const recordarRequest = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      speak("¿Esto es un comando o una conversación?, responde comando o conversacion");
      recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando o conversacion: ', async response => {
        recordarRequest.close();
        if (response !== "comando" && response !== "conversacion") {
          await respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
          resolve(false);
        } else {
          const saveRequest = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          const textQuestion = response === "comando" ? '¿Que comando debería responder a esta acción?: ' : '¿Que conversación debería responder a esta acción?: ';
          speak(textQuestion);
          saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
            saveRequest.close();
            if (responseSave === "cancelar") {
              await respuestaConversations("Sera a la proxima");
              resolve(false);
            }
            const zona = response === "comando" ? "body" : "razon"
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
  });
}

exports.fixLastIdea = () => {
  return new Promise(async (resolve, reject) => {
    const sombra = await getSombra();
    const question = sombra[sombra.length - 2].input;
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Esto es un comando o una conversación?, responde comando o conversacion");
    recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando o conversacion: ', async response => {
      recordarRequest.close();
      if (response !== "comando" && response !== "conversacion") {
        await respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
        resolve(false);
      } else {
        const saveRequest = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        const textQuestion = response === "comando" ? '¿Que comando debería responder a esta acción?: ' : '¿Que conversación debería responder a esta acción?: ';
        speak(textQuestion);
        saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
          saveRequest.close();
          if (responseSave === "cancelar") {
            await respuestaConversations("Sera a la proxima");
            resolve(false);
          }
          const zona = response === "comando" ? "body" : "razon"
          console.log(question, responseSave, zona);
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

exports.handleNotFount = (action, intuition = null) => {
  //await respuestaConversations("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  return new Promise((resolve, reject) => {
    const greatOrNot = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Mi respuesta fue satisfactoria?");
    greatOrNot.question("Jarvis: " + '¿Mi respuesta fue satisfactoria? ', async responseGreat => {
      greatOrNot.close();
      const somaticEmotional = await runCommandSentiment(responseGreat);
      if (somaticEmotional.score > 0) {
        await recordar(action, intuition, "razon");
        await razonLearn();
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
            await recordarAction(action);
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
    });
  });
}