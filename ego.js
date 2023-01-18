const { addIdeaSombra, getSombra } = require('./gestionMemoria/cortoplazo');
const { respuestaConversations } = require('./corteza/voz');
const {
  runCommandBlenderbot,
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
  runCommandBetty,
  runCommandMycroft
} = require('./corteza/osBash');
const { actionHandler } = require('./corteza/actionsBody');
const { consumeWolfram } = require('./corteza/apis');
const { pensarBody } = require('./NLP/body');
const { pensarRazon } = require('./NLP/razon');
const { pensarDiscernment } = require('./NLP/discernment');
const { newIdea, fixLastIdea, addLastIdea, rememberLastResponse, handleNotFount } = require('./gestionMemoria/learning');
const { spawn } = require('child_process');
const { systemAction } = require('./corteza/cagorizacionProcessExecute');

const binaries = {
  programs: []
};

// TODO: esto no termina de funcionar
exports.findBinaries = () => {
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


exports.commandDirect = async (command) => {
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
let timerId;

function startTimer(stop = false) {
  return new Promise((resolve, reject) => {
    if (stop) {
      clearTimeout(timerId);
      resolve(false);
    } else {
      timerId = setTimeout(() => {
        resolve(true);
      }, 20000);
    }
  });
}


exports.medula = async (question) => {
  return new Promise(async (resolve, reject) => {
    startTimer().then((data) => {
      if (data === true) {
        resolve(data);
      }
      return;
    });
    const discernment = await pensarDiscernment(question);
    const discernmentProm = await classificationMaxima(discernment.classifications, "discernment");
    if (discernmentProm.intent == "None") {
      startTimer(true);
      await intuitionResponse(question, discernmentProm);
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "learn.new" && discernmentProm.score > 0.5) {
      startTimer(true);
      await newIdea();
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "learn.last" && discernmentProm.score > 0.5) {
      startTimer(true);
      await fixLastIdea();
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "learn.new.last" && discernmentProm.score > 0.5) {
      startTimer(true);
      await addLastIdea();
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "learn.last.remember" && discernmentProm.score > 0.5) {
      startTimer(true);
      await rememberLastResponse();
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "wolfram" && discernmentProm.score > 0.5) {
      startTimer(true);
      await wolframIntent(question);
      resolve(true);
      return;
    }
    if (discernmentProm.intent == "mycroft" && discernmentProm.score > 0.5) {
      await respuestaConversations("Preguntando a mycroft");
      const translateEs_En = await runCommandTranslateEs_En(question);
      const mycroft = await mycroftIntent(translateEs_En.response);
      if (mycroft === null) {
        startTimer(true);
        await intuitionResponse(question, discernmentProm);
      } else {
        const translateEn_Es = await runCommandTranslateEn_Es(mycroft.response);
        await respuestaConversations(translateEn_Es.response);
      }
      startTimer(true);
      resolve(true);
      return;
    }
    if (discernmentProm.intent === "execute.body" && discernmentProm.score > 0.5) {
      const bodySomatic = await pensarBody(question);
      const bodySomaticProm = await classificationMaxima(bodySomatic.classifications, "body");
      if (bodySomaticProm.score < 0.5) {
        startTimer(true);
        await intuitionResponse(question, discernmentProm);
      } else {
        if (bodySomaticProm.intent == "None") {
          startTimer(true);
          await intuitionResponse(question, discernmentProm);
          resolve(true);
          return;
        }
        addIdeaSombra(question, bodySomaticProm.intent, "body", discernmentProm);
        await respuestaConversations(bodySomaticProm.intent);
        await actionHandler(bodySomaticProm.intent, question);
        startTimer(true);
        resolve(true);
        return;
      }
    } else if (discernmentProm.intent === "execute.razon" && discernmentProm.score > 0.5) {
      const razonSomatic = await pensarRazon(question);
      const razonSomaticProm = await classificationMaxima(razonSomatic.classifications, "razon");
      if (razonSomaticProm.score < 0.3) {
        startTimer(true);
        await intuitionResponse(question, discernmentProm);
      } else {
        if (razonSomaticProm.intent == "None") {
          startTimer(true);
          await intuitionResponse(question, discernmentProm);
          resolve(true);
          return;
        }
        addIdeaSombra(question, razonSomaticProm.intent, "razon", discernmentProm);
        await respuestaConversations(razonSomaticProm.intent);
        startTimer(true);
        resolve(true);
        return;
      }
    } else if (discernmentProm.intent === "execute.intuition" && discernmentProm.score > 0.5) {
      startTimer(true);
      await intuitionResponse(question, discernmentProm);
    } else {
      startTimer(true);
      await intuitionResponse(question, discernmentProm);
    }
    startTimer(true);
    resolve(true);
    return;
  });
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

const intuitionResponse = async (question, discernment) => {
  startTimer(true);
  await respuestaConversations("Pensando una respuesta");
  const translateEs_En = await runCommandTranslateEs_En(question);
  const betty = await bettyIntent(translateEs_En.response);
  let translateEn_Es = null;
  if (betty != null) {
    translateEn_Es = await runCommandTranslateEn_Es(bettyIntent);
    await respuestaConversations(translateEn_Es.response);
  } else {
    const mycroft = await mycroftIntent(translateEs_En.response);
    if (mycroft !== null) {
      translateEn_Es = await runCommandTranslateEn_Es(mycroft.response);
    } else {
      const result = await runCommandBlenderbot(translateEs_En.response);
      translateEn_Es = await runCommandTranslateEn_Es(result.response);
    }
    await respuestaConversations(translateEn_Es.response);
  }
  await handleNotFount(question, translateEn_Es.response, discernment);
  return translateEn_Es?.response;
}

const bettyIntent = async (question) => {
  if (process.env.BETTY) {
    const bettyIntent = await runCommandBetty(question);
    if (bettyIntent != null) {
      return bettyIntent;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const mycroftIntent = async (question) => {
  if (process.env.MYCROFT) {
    const mycroft = await runCommandMycroft(question);
    const discernmentFailed = await pensarDiscernment(mycroft.response);
    const discernmentFailedProm = await classificationMaxima(discernmentFailed.classifications, "discernment");
    if (discernmentFailedProm.intent !== "mycroft.fail") {
      return mycroft;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const wolframIntent = async (question) => {
  if (process.env.API_WOLFRAM) {
    const wolfram = await consumeWolfram(question);
    if (wolfram != null) {
      await respuestaConversations(wolfram);
      return wolfram;
    } else {
      return null;
    }
  } else {
    return null;
  }
}