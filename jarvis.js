require('dotenv').config()
const { entrain } = require('./gestionMemoria/aprender');
const { addIdeaSombra, getSombra } = require('./gestionMemoria/cortoplazo');
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
const { newIdea, fixLastIdea, handleNotFount } = require('./gestionMemoria/learning');
const readline = require('readline');
const { spawn } = require('child_process');
const { systemAction } = require('./corteza/cagorizacionProcessExecute');

const binaries = {
  programs: []
};

const initSystem = async () => {
  console.log("Iniciando sistemas");
  openSession();
  await findBinaries();
  await loadLobules();
  await entrain();
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  await respuestaConversations("Sistema inicializado, recuerde que aun estoy en periodo de aprendizaje");
  await think();
}
async function think() {
  // Carga el modelo guardado en el archivo model.nlp
  const jarvisQuestion = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // Realiza la predicción con el texto de entrada
  jarvisQuestion.question('Jarvis $: ', async question => {
    jarvisQuestion.close();
    if (question === 'clear') {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      think();
    } else {
      const commandExecuteValide = await commandDirect(question);
      if (commandExecuteValide === true) {
        think();
      } else {
        await medula(question);
        think();
      }
    }
  });
}
// TODO: esto no termina de funcionar
async function findBinaries() {
  return new Promise((resolve, reject) => {
    const find = spawn("find", ["/usr/bin", "/usr/local/bin", "/usr/sbin", "/usr/local/sbin", "/sbin", "-type", "f", "-perm", "/u=x,g=x,o=x"]);
    let dataReceived = false;
    find.stdout.on("data", (data) => {
      dataReceived = true;
      const ls = data.toString().split("\n");
      ls.forEach((line) => {
        binaries.programs.push(line);
      });
      console.log("Binarios cargados", binaries.programs.length);
    });
    find.on('close', (code) => {
      if (code !== 0) {
        reject(`El proceso falló con código ${code}`);
      }
      if (dataReceived) {
        console.log("Binarios cargados", binaries.programs.length);
        resolve(binaries);
      } else {
        reject(`No se recibieron datos del proceso`);
      }
    });
  });
}


async function commandDirect(command) {
  let commandExecute = null;
  for (let index = 0; index < binaries.programs.length; index++) {
    const program = binaries.programs[index];
    if (program.includes(command)) {
      commandExecute = program;
      break;
    }
  }
  if (commandExecute !== null) {
    await systemAction("konsole --noclose -e " + command);
    return true;
  } else {
    return false;
  }
}

async function promedioSentiment(score, output, zone) {
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
  const response = promedioSombraQuestion + score;
  return response;
}

async function classificationMaxima(classifications, zone) {
  let classificationMaxima = classifications[0];
  let scoreMax = 0;
  for (let classification of classifications) {
    const scoreClassificationSombra = await promedioSentiment(classification.score, classification.intent, zone);
    if (scoreClassificationSombra > scoreMax) {
      scoreMax = scoreClassificationSombra + classification.score;
      classificationMaxima = classification;
      classificationMaxima.score = scoreMax;
    }
  }
  return classificationMaxima;
}


const medula = async (question) => {
  const discernment = await pensarDiscernment(question);
  const discernmentProm = await classificationMaxima(discernment.classifications, "discernment");
  if (discernmentProm.intent == "None") {
    const chatGPT = await lobuleChat(question);
    await respuestaConversations(chatGPT);
    await handleNotFount(question, chatGPT, discernment);
  }
  if (discernmentProm.intent == "learn.new" && discernmentProm.score > 0.5) {
    await newIdea();
  }
  if (discernmentProm.intent == "learn.last" && discernmentProm.score > 0.5) {
    await fixLastIdea();
  }
  if (discernmentProm.intent === "execute.body" && discernmentProm.score > 0.5) {
    const bodySomatic = await pensarBody(question);
    const bodySomaticProm = await classificationMaxima(bodySomatic.classifications, "body");
    if (bodySomaticProm.score < 0.5) {
      const chatGPT = await lobuleChat(question);
      await respuestaConversations(chatGPT);
      await handleNotFount(question, chatGPT, discernment);
    } else {
      addIdeaSombra(question, bodySomaticProm.intent, "body", discernmentProm);
      await respuestaConversations(bodySomatic.intent);
      await actionHandler(bodySomatic.intent, question);
    }
  } else if (discernmentProm.intent === "execute.razon" && discernmentProm.score > 0.5) {
    const razonSomatic = await pensarRazon(question);
    const razonSomaticProm = await classificationMaxima(razonSomatic.classifications, "razon");
    if (razonSomaticProm.score < 0.3) {
      const chatGPT = await lobuleChat(question);
      await respuestaConversations(chatGPT);
      await handleNotFount(question, chatGPT, discernment);
    } else {
      addIdeaSombra(question, razonSomaticProm.intent, "razon", discernmentProm);
      await respuestaConversations(razonSomaticProm.intent);
    }
  } else if (discernmentProm.intent === "execute.intuition" && discernmentProm.score > 0.5) {
    const chatGPT = await lobuleChat(question);
    await respuestaConversations(chatGPT);
    await handleNotFount(question, chatGPT, discernment);
  } else {
    const chatGPT = await lobuleChat(question);
    await respuestaConversations(chatGPT);
    await handleNotFount(question, chatGPT, discernment);
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