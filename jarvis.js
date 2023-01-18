require('dotenv').config()
const { entrain } = require('./gestionMemoria/aprender');
const { respuestaConversations } = require('./corteza/voz');
const {
  openSession,
  openSessionBetty,
  openSessionMimic,
  openSessionMycroft
} = require('./corteza/osBash');
const { loadLobules } = require('./corteza/loadLobulosPy');
const { findBinaries, commandDirect, medula } = require('./ego');
const readline = require('readline');

const initSystem = async () => {
  console.log("Iniciando sistemas");
  openSession();
  openSessionBetty();
  if (process.env.SPEACK === "mimic3") {
    openSessionMimic();
  }
  if (process.env.MYCROFT) {
    openSessionMycroft();
  }
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
        try {
          await medula(question);
        } catch (error) {
          //console.log(error);
        }
        think();
      }
    }
  });
}

initSystem();