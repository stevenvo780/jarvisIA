const { entrain } = require('./memoria/aprender');
const { addIdeaSombra, getSombra } = require('./memoria/cortoplazo');
const { respuestaConversations } = require('./corteza/voz');
const {
  openSession,
  runCommandBlenderbot,
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
} = require('./corteza/osBash');
const { actionHandler } = require('./corteza/actionsBody');
const { loadLobules } = require('./corteza/loadLobulosPy');
const { pensarBody } = require('./NLP/body');
const { pensarRazon } = require('./NLP/razon');
const { pensarDiscernment } = require('./NLP/discernment');
const { newIdea, fixLastIdea, handleNotFount} = require('./gestionMemoria/learning');
const readline = require('readline');
const initSystem = async () => {
  console.log("Iniciando sistemas");
  openSession();
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

async function promedioEmocion(score, output, zone) {
  const sombra = await getSombra();
  const responses = sombra.filter(response => (response.output == output && response.zone == zone));
  if (responses.length === 0) {
    return score;
  }
  let promedioSombraQuestionSuma = 0;
  responses.forEach(response => {
    promedioSombraQuestionSuma += response.emotionalResponse.score;
  });
  const promedioSombraQuestion = promedioSombraQuestionSuma / responses.length;
  return promedioSombraQuestion + score;
}

const medula = async (question) => {
  const discernment = await pensarDiscernment(question);
  if (discernment.intent == "None") {
    const chatGPT = await lobuleChat(question);
    await respuestaConversations(chatGPT);
    addIdeaSombra(question, chatGPT, "intuition");
    await handleNotFount(question);
  }
  if (discernment.intent == "learn.new") {
    await newIdea();
  }
  if (discernment.intent == "learn.last") {
    await fixLastIdea();
  }
  if (discernment.intent === "execute.body") {
    const bodySomatic = await pensarBody(question);
    const bodySomaticProm = await promedioEmocion(bodySomatic.classifications[0].score, bodySomatic.intent, "body");
    if (bodySomaticProm < 0.5) {
      const chatGPT = await lobuleChat(question);
      await respuestaConversations(chatGPT);
      addIdeaSombra(question, chatGPT, "body");
      await handleNotFount(question, chatGPT);
    } else {
      addIdeaSombra(question, bodySomatic.intent, "body");
      await actionHandler(bodySomatic.intent, question);
    }
  } else if (discernment.intent === "execute.razon") {
    const razonSomatic = await pensarRazon(question);
    const razonSomaticProm = await promedioEmocion(razonSomatic.classifications[0].score, razonSomatic.intent, "razon");
    if (razonSomaticProm < 0.3) {
      const chatGPT = await lobuleChat(question);
      await respuestaConversations(chatGPT);
      addIdeaSombra(question, chatGPT, "razon");
      await handleNotFount(question, chatGPT);
    } else {
      addIdeaSombra(question, razonSomatic.intent, "razon");
      await respuestaConversations(razonSomatic.intent);
    }
  } else if (discernment.intent === "execute.intuition") {
    const chatGPT = await lobuleChat(question);
    await respuestaConversations(chatGPT);
    addIdeaSombra(question, chatGPT, "intuition");
    await handleNotFount(question, chatGPT);
  }
}

const lobuleChat = async (question) => {
  await respuestaConversations("Pensando una respuesta");
  const translateEs_En = await runCommandTranslateEs_En(question);
  const result = await runCommandBlenderbot(translateEs_En.response);
  const translateEn_Es = await runCommandTranslateEn_Es(result.response);
  return translateEn_Es.response;
}

initSystem();