const { addIdeaSombra, getSombra } = require('./gestionMemoria/cortoplazo');
const { respuestaConversations } = require('./corteza/voz');
const {
  runCommandBlenderbot,
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
  runCommandBetty,
  runCommandMycroft,
  runCommandSentiment
} = require('./corteza/osBash');
const { actionHandler } = require('./corteza/actionsBody');
const { pensarBody } = require('./NLP/body');
const { pensarRazon } = require('./NLP/razon');
const { pensarDiscernment } = require('./NLP/discernment');
const { newIdea, fixLastIdea, addLastIdea, handleNotFount } = require('./gestionMemoria/learning');
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

exports.medula = async (question) => {
  const discernment = await pensarDiscernment(question);
  const discernmentProm = await classificationMaxima(discernment.classifications, "discernment");
  if (discernmentProm.intent == "None") {
    await intuitionResponse(question, discernmentProm);
    return;
  }
  if (discernmentProm.intent == "learn.new" && discernmentProm.score > 0.5) {
    await newIdea();
    return;
  }
  if (discernmentProm.intent == "mycroft" && discernmentProm.score > 0.5) {
    const mycroft = await runCommandMycroft(translateEs_En.response);
    const sentiment = await runCommandSentiment(mycroft);
    if (sentiment.score > 0) {
      translateEn_Es = await runCommandTranslateEn_Es(mycroft);
      await respuestaConversations(translateEn_Es.response);
      return;
    } else {
      await intuitionResponse(question, discernmentProm);
    }
    return;
  }
  if (discernmentProm.intent == "learn.last" && discernmentProm.score > 0.5) {
    await fixLastIdea();
    return;
  }
  if (discernmentProm.intent == "learn.new.last" && discernmentProm.score > 0.5) {
    await addLastIdea();
    return;
  }
  if (discernmentProm.intent === "execute.body" && discernmentProm.score > 0.5) {
    const bodySomatic = await pensarBody(question);
    const bodySomaticProm = await classificationMaxima(bodySomatic.classifications, "body");
    if (bodySomaticProm.score < 0.5) {
      await intuitionResponse(question, discernmentProm);
    } else {
      if (bodySomaticProm.intent == "None") {
        await intuitionResponse(question, discernmentProm);
        return;
      }
      addIdeaSombra(question, bodySomaticProm.intent, "body", discernmentProm);
      await respuestaConversations(bodySomaticProm.intent);
      await actionHandler(bodySomaticProm.intent, question);
    }
  } else if (discernmentProm.intent === "execute.razon" && discernmentProm.score > 0.5) {
    const razonSomatic = await pensarRazon(question);
    const razonSomaticProm = await classificationMaxima(razonSomatic.classifications, "razon");
    if (razonSomaticProm.score < 0.3) {
      await intuitionResponse(question, discernmentProm);
    } else {
      if (razonSomaticProm.intent == "None") {
        await intuitionResponse(question, discernmentProm);
        return;
      }
      addIdeaSombra(question, razonSomaticProm.intent, "razon", discernmentProm);
      await respuestaConversations(razonSomaticProm.intent);
    }
  } else if (discernmentProm.intent === "execute.intuition" && discernmentProm.score > 0.5) {
    await intuitionResponse(question, discernmentProm);
  } else {
    await intuitionResponse(question, discernmentProm);
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

const intuitionResponse = async (question, discernment) => {
  await respuestaConversations("Pensando una respuesta");
  const translateEs_En = await runCommandTranslateEs_En(question);
  // betty intent
  const bettyIntent = await runCommandBetty(translateEs_En.response);
  let translateEn_Es = null;
  if (bettyIntent != null) {
    translateEn_Es = await runCommandTranslateEn_Es(bettyIntent);
    await respuestaConversations(translateEn_Es.response);
  } else {
    const mycroft = await runCommandMycroft(translateEs_En.response);
    const sentiment = await runCommandSentiment(mycroft);
    if (sentiment.score > 0) {
      translateEn_Es = await runCommandTranslateEn_Es(mycroft);
      await respuestaConversations(translateEn_Es.response);
      return;
    } else {
      const result = await runCommandBlenderbot(translateEs_En.response);
      translateEn_Es = await runCommandTranslateEn_Es(result.response);
      await respuestaConversations(translateEn_Es.response);
    }
  }
  await handleNotFount(question, translateEn_Es.response, discernment);
  return translateEn_Es?.response;
}