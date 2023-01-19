const { runCommandRoot, runCommand, runCommandMimic } = require('./osBash');
const chalk = require('chalk');
const emoji = require('node-emoji')
const { getSombra } = require('../gestionMemoria/cortoplazo');
exports.respuestaConversations = async (texto) => {
  const sombra = await getSombra();
  let promedioSombraQuestionSuma = 0;
  for (let index = (sombra.length - process.env.SENTIMENTAL_REMEMBER); index < sombra.length; index++) {
    const response = sombra[index];
    promedioSombraQuestionSuma += response.emotionalResponse.score;
  }
  const somaticResponseJarvis = promedioSombraQuestionSuma / process.env.SENTIMENTAL_REMEMBER;
  let stateJarvis = "Jarvis: "
  if (somaticResponseJarvis > 0.8) {
    stateJarvis = "Jarvis " + emoji.get('satisfied') + ": ";
    console.log(stateJarvis + chalk.blue(texto));
  } else if (somaticResponseJarvis > 0.5 && somaticResponseJarvis < 0.8) {
    stateJarvis = "Jarvis " + emoji.get('sunglasses') + ": ";
    console.log(stateJarvis + chalk.blue(texto));
  } else if (somaticResponseJarvis > 0 && somaticResponseJarvis < 0.5) {
    stateJarvis = "Jarvis " + emoji.get('smile') + ": ";
    console.log(stateJarvis + chalk.green(texto));
  } else if (somaticResponseJarvis < 0 && somaticResponseJarvis > -0.3) {
    stateJarvis = "Jarvis " + emoji.get('expressionless') + ": ";
    console.log(stateJarvis + chalk.yellow(texto));
  } else if (somaticResponseJarvis > -0.5 && somaticResponseJarvis < -0.3) {
    stateJarvis = "Jarvis " + emoji.get('sweat') + ": ";
    console.log(stateJarvis + chalk.yellow(texto));
  } else if (somaticResponseJarvis > -0.8 && somaticResponseJarvis < -0.5) {
    stateJarvis = "Jarvis " + emoji.get('cry') + ": ";
    console.log(stateJarvis + chalk.red(texto));
  } else if (somaticResponseJarvis > -1 && somaticResponseJarvis < 0.8) {
    stateJarvis = "Jarvis " + emoji.get('rage') + ": ";
    console.log(stateJarvis + chalk.red(texto));
  } else {
    stateJarvis = "Jarvis " + emoji.get('neutral_face') + ": ";
    console.log(stateJarvis + texto);
  }
  this.speak(texto);
};

exports.speak = async (texto) => {
  //runCommandRoot("skill $(pidof espeak)")
  if (process.env.SPEACK === "espeak") {
    return runCommand(`espeak -p20 -s130 -v es-la "${texto}"`)
  } else if (process.env.SPEACK === "mimic3") {
    return runCommandMimic(texto)
  }
  else {
    return;
  }
}