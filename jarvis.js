const fs = require('fs');
const { NlpManager } = require('node-nlp');
const { exec } = require('child_process');
const traductor = require('./lobulosProcesativos/googleTraductor');
const recordar = require('./memoria/cortoplazo');
const aprender = require('./memoria/aprender');
const path = require('path');
const readline = require('readline');

// Crea una instancia de NlpManager
const manager = new NlpManager({ languages: ['es'] });

const initSystem = async () => {
  console.log("Iniciando sistemas");
  await aprender();
  await predict();
}
async function predict() {
  // Carga el modelo guardado en el archivo model.nlp
  await manager.load();
  const jarvisQuestion = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // Realiza la predicción con el texto de entrada
  jarvisQuestion.question('Jarvis: ', async question => {
    jarvisQuestion.close();
    await medula(question);
    predict();
  });
}

const medula = async (question) => {
  const result = await manager.process('es', question);
  switch (result.intent) {
    case "open.music":
      const ideas = JSON.parse(fs.readFileSync(path.join(__dirname, 'memoria/music', 'ideas.json')));;
      let newStr = question;
      for (let index = 0; index < ideas.length; index++) {
        const idea = ideas[index];
        if (question.search(idea.input) >= 0) {
          newStr = question.toLowerCase().replace(idea.input.toLowerCase(), "");
        }
      }
      await searchVideoOnYouTube(newStr);
      break;
    case "open.search":
      await searchGoogle(question);
      break;
    case "open.translate":
      const translate = await traductor(question);
      console.log("Traducción: " + translate);
      break;
    case "learn":
      await recordarAction(question);
      break;
    default:
      if (result.intent == "None") {
        await handleNotFount(question);
      } else {
        await systemAction(result.intent);
      }
      break;
  }
}

const recordarAction = async (question) => {
  return new Promise((resolve, reject) => {
    const recordarRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    recordarRequest.question('¿Que comando debería responder a esta acción?: ', async response => {
      recordarRequest.close();
      await recordar(question, response);
      console.log("Aprendiendo de lo recordado");
      await aprender();
      await manager.load();
      resolve(true);
    });
  });

}

const handleNotFount = (action) => {
  console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  return new Promise((resolve, reject) => {
    const createCommandRequest = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    createCommandRequest.question('¿desea crear un comando de esta acción responde Y o N? ', async responseSave => {
      createCommandRequest.close();
      if (responseSave.toLowerCase() == "y") {
        await recordarAction(action);
        resolve(true);
      } else {
        const searchGoogleCommand = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        searchGoogleCommand.question('¿desea buscarlo en internet? responde con Y o N ', async responseSearch => {
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

const systemAction = (action) => {
  console.log("Ejecutando: " + action);
  return new Promise((resolve, reject) => {
    exec(action, (error, stdout, stderr) => {
      if (error) {
        handleNotFount(action);
        reject(error);
        return;
      }
      if (stderr) {
        handleNotFount(action);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

const searchVideoOnYouTube = (searchTerm) => {
  console.log("Buscando video en YouTube...");
  return new Promise((resolve, reject) => {
    exec(`google-chrome "https://www.youtube.com/results?search_query=${searchTerm}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`error: ${stderr.message}`);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

const searchGoogle = (question) => {
  console.log("Buscando en google...");
  console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  return new Promise((resolve, reject) => {
    exec(`google-chrome "http://www.google.com/search?q=${question}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`error: ${stderr.message}`);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// TODO: remplace for GPT3 model or similar
const notFount = (question) => {
  console.log("Buscando en google...");
  return new Promise((resolve, reject) => {
    exec(`google-chrome "http://www.google.com/search?q=${question}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`error: ${stderr.message}`);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

initSystem();