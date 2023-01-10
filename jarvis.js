const fs = require('fs');
const { NlpManager } = require('node-nlp');
const { exec } = require('child_process');
const traductor = require('./lobulosProcesativos/googleTraductor');
const recordar = require('./lobulosProcesativos/cortoplazo');
const path = require('path');

async function predict() {
  // Crea una instancia de NlpManager
  const manager = new NlpManager({ languages: ['es'] });

  // Carga el modelo guardado en el archivo model.nlp
  await manager.load();

  // Realiza la predicción con el texto de entrada
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.question('¿En que puedo serte de ayuda?: ', async question => {
    const result = await manager.process('es', question);
    //console.log(result)
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
        searchVideoOnYouTube(newStr);
        break;
      case "open.search":
        searchGoogle(question);
        break;
      case "open.translate":
        const translate = await traductor(question);
        console.log("Traducción: " + translate);
        break;
      case "learn":
        recordar(question);
        break;
      default:
        systemAction(result.intent);
        break;
    }
    readline.close();
    predict();
  });
}

const recordar = (question) => {
  readline.question('¿Que comando debería responder a esta acción?: ', async response => {
    recordar(question, response);
    readline.close();
  });
}

const systemAction = (action) => {
  exec(action, (error, stdout, stderr) => {
    if (error) {
      //console.error(`error: ${error.message}`);
      console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
      notFount(question);
      recordar(question);
      return;
    }
    if (stderr) {
      console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
      notFount(question);
      recordar(question);
      return;
    }
    console.log("Ejecutando: " + action);
  });
}

const searchVideoOnYouTube = (searchTerm) => {
  exec(`google-chrome "https://www.youtube.com/results?search_query=${searchTerm}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`error: ${stderr.message}`);
      return;
    }
    console.log("Buscando video en YouTube...");
  });
}

const searchGoogle = (question) => {
  console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  exec(`google-chrome "http://www.google.com/search?q=${question}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`error: ${stderr.message}`);
      return;
    }
    console.log("Buscando en internet...");
  });
}

// TODO: remplace for GPT3 model or similar
const notFount = (question) => {
  console.log("Lo siento no existe esa acción en el sistema o mal interprete la pregunta")
  exec(`google-chrome "http://www.google.com/search?q=${question}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`error: ${stderr.message}`);
      return;
    }
    console.log("Buscando en internet...");
  });
}

predict();