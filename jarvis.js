const { notFount } = require('./corteza/cagorizacionProcessExecute');
const { entrain, razonLearn, bodyLearn, discernmentLearn } = require('./memoria/aprender');
const recordar = require('./memoria/cortoplazo');
const { respuestaConversations, speak } = require('./corteza/voz');
const {
  openRootSession,
  openSession,
  //runCommandGPT3Chat,
  //runCommandChatbot,
  runCommandBlenderbot,
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
} = require('./corteza/osBash');
const { actionHandler } = require('./corteza/actionsBody');
const { loadLobules } = require('./corteza/loadLobulosPy');
const { getSentiment } = require('./lobulosProcesativos/googleNLPfeelings');
const { pensarBody } = require('./NLP/body');
const { pensarRazon } = require('./NLP/razon');
const { pensarDiscernment } = require('./NLP/discernment');

const readline = require('readline');
const initSystem = async () => {
  console.log("Iniciando sistemas");
  await openSession();
  await openRootSession();
  await loadLobules();
  await entrain();
  await respuestaConversations("Sistema inicializado, recuerde que aun estoy en periodo de aprendizaje");
  await predict();
}
async function predict() {
  // Carga el modelo guardado en el archivo model.nlp
  const jarvisQuestion = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // Realiza la predicción con el texto de entrada
  jarvisQuestion.question('Jarvis $: ', async question => {
    jarvisQuestion.close();
    await medula(question);
    predict();
  });
}

const medula = async (question) => {
  const discernment = await pensarDiscernment(question);
  //console.log("discernment", discernment.intent);
  if (discernment.intent == "None") {
    const chatGPT = await lobuleChat(question);
    respuestaConversations(chatGPT);
    await handleNotFount(question);
  }
  if (discernment.intent === "execute.body") {
    const bodySomatic = await pensarBody(question);
    //console.log("Body", bodySomatic.classifications[0].score);
    if (bodySomatic.classifications[0].score < 0.8) {
      const chatGPT = await lobuleChat(question);
      respuestaConversations(chatGPT);
      await handleNotFount(question, chatGPT);
    } else {
      await actionHandler(bodySomatic.intent, question);
    }
  } else if (discernment.intent === "execute.razon") {
    const razonSomatic = await pensarRazon(question);
    //console.log("Razon", razonSomatic.classifications[0].score);
    if (razonSomatic.classifications[0].score < 0.8) {
      const chatGPT = await lobuleChat(question);
      respuestaConversations(chatGPT);
      await handleNotFount(question, chatGPT);
    } else {
      respuestaConversations(razonSomatic.intent);
    }
  } else if (discernment.intent === "execute.intuition") {
    //console.log("discernment", discernment.classifications[0].score);
    const chatGPT = await lobuleChat(question);
    respuestaConversations(chatGPT);
    await handleNotFount(question, chatGPT);
  }
}

const lobuleChat = async (question) => {
  respuestaConversations("Pensando una respuesta");
  const translateEs_En = await runCommandTranslateEs_En(question);
  const result = await runCommandBlenderbot(translateEs_En.response);
  const translateEn_Es = await runCommandTranslateEn_Es(result.response);
  return translateEn_Es.response;
}

const recordarAction = async (question) => {
  return new Promise((resolve, reject) => {
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Esto es un comando o una conversación?, responde comando o conversacion");
    recordarRequest.question("Jarvis: " + '¿Esto es un comando o una conversación?, responde comando o conversacion: ', async response => {
      recordarRequest.close();
      if (response !== "comando" && response !== "conversacion") {
        respuestaConversations("Recuerda que entre mas me corrijas mas puedo aprender");
        resolve(false);
      }
      const saveRequest = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      const textQuestion = response === "comando" ? '¿Que comando debería responder a esta acción?: ' : '¿Que conversación debería responder a esta acción?: ';
      speak(textQuestion);
      saveRequest.question("Jarvis: " + textQuestion, async responseSave => {
        saveRequest.close();
        if (responseSave === "cancelar") {
          respuestaConversations("Sera a la proxima");
          resolve(false);
        }
        const zona = response === "comando" ? "body" : "razon"
        await recordar(question, responseSave, zona);
        respuestaConversations("Estudiando lo aprendido");
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
    });
  });
}

const handleNotFount = (action, intuition = null) => {
  //respuestaConversations("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  return new Promise((resolve, reject) => {
    const greatOrNot = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Mi respuesta fue satisfactoria?");
    greatOrNot.question("Jarvis: " + '¿Mi respuesta fue satisfactoria? ', async responseGreat => {
      greatOrNot.close();
      const somaticEmotional = await getSentiment(responseGreat);
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
          const somaticEmotional = await getSentiment(responseSave);
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
              const somaticEmotional = await getSentiment(responseSearch);
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

initSystem();