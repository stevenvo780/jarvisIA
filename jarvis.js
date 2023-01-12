const { notFount } = require('./corteza/cagorizacionProcessExecute');
const { entrain, razonLearn, bodyLearn } = require('./memoria/aprender');
const recordar = require('./memoria/cortoplazo');
const { respuestaConversations, speak } = require('./corteza/voz');
const {
  openRootSession,
  openSession,
  openSessionGPT3,
  openSessionGPT3Chat,
  openSessionChatbot,
  runCommandChatbot,
  openSessionTranslateEn_Es,
  openSessionTranslateEs_En,
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
} = require('./corteza/osBash');
const { actionHandler } = require('./corteza/actionsBody');
const { getSentiment } = require('./lobulosProcesativos/googleNLPfeelings');
const { pensarBody } = require('./NLP/body');
const { pensarRazon } = require('./NLP/razon');

const readline = require('readline');
const initSystem = async () => {
  console.log("Iniciando sistemas");
  await openSession();
  await openRootSession();
  await openSessionGPT3();
  await openSessionGPT3Chat();
  await openSessionChatbot();
  await openSessionTranslateEn_Es();
  await openSessionTranslateEs_En();
  await entrain();
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
  const bodySomatic = await pensarBody(question);
  // Grado de certidumbre para responder, tiene que estar bastante segura para saber si crea un nuevo comando y enriquezca la memoria
  console.log("Certidumbre de la respuesta body: " + bodySomatic.classifications[0].score)
  if (bodySomatic.classifications[0].score < 0.9) {
    const razonSomatic = await pensarRazon(question);
    // Grado de certidumbre para responder, tiene que estar bastante segura para saber si crea un nuevo comando y enriquezca la memoria
    if (razonSomatic.intent == "None") {
      await handleNotFount(question);
    }
    console.log("Certidumbre de la respuesta razon: " + razonSomatic.classifications[0].score)
    if (razonSomatic.classifications[0].score > 0.8) {
      if (razonSomatic.intent === "learn") {
        await recordarAction(question);
      } else {
        //const sentiment = await getSentiment(razonSomatic.intent)
        respuestaConversations(razonSomatic.intent);
      }
    } else {
      const translateEs_En = await runCommandTranslateEs_En(question);
      const result = await runCommandChatbot(translateEs_En);
      const translateEn_Es = await runCommandTranslateEn_Es(result);
      respuestaConversations(translateEn_Es);
      await handleNotFount(question);
    }
  } else {
    await actionHandler(bodySomatic.classifications[0].intent, question);
  }
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
          await bodyLearn();
        }
        if (zona === "razon") {
          await razonLearn();
        }
        resolve(true);
      });
    });
  });
}

const handleNotFount = (action) => {
  //respuestaConversations("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  return new Promise((resolve, reject) => {
    const createCommandRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    speak("¿Desea crear una acción para esta pregunta? responde Y o N?");
    createCommandRequest.question("Jarvis: " + '¿Desea crear una acción para esta pregunta? responde Y o N? ', async responseSave => {
      createCommandRequest.close();
      if (responseSave.toLowerCase() == "y") {
        await recordarAction(action);
        resolve(true);
      } else {
        const searchGoogleCommand = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        speak("¿Desea buscarlo en internet? responde con Y o N ");
        searchGoogleCommand.question("Jarvis: " + '¿Desea buscarlo en internet? responde con Y o N ', async responseSearch => {
          searchGoogleCommand.close();
          if (responseSearch.toLowerCase() == "y") {
            notFount(action);
          }
          resolve(true);
        });
      }
    });
  });
}

initSystem();