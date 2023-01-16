const { runCommandRoot, runCommand, runCommandSentiment } = require('./osBash');
const chalk = require('chalk');
const emoji = require('node-emoji')
exports.respuestaConversations = async (texto) => {
  const somaticResponseJarvis = await runCommandSentiment(texto);
  //console.log(somaticResponseJarvis);
  let stateJarvis = "Jarvis: "
  if (somaticResponseJarvis.score > 0.8) {
    stateJarvis = "Jarvis " + emoji.get('satisfied') + ": ";
    console.log(stateJarvis + chalk.blue(texto));
  } else if (somaticResponseJarvis.score > 0.5 && somaticResponseJarvis.score < 0.8) {
    stateJarvis = "Jarvis " + emoji.get('sunglasses') + ": ";
    console.log(stateJarvis + chalk.blue(texto));
  } else if (somaticResponseJarvis.score > 0 && somaticResponseJarvis.score < 0.5) {
    stateJarvis = "Jarvis " + emoji.get('smile') + ": ";
    console.log(stateJarvis + chalk.green(texto));
  } else if (somaticResponseJarvis.score < 0 && somaticResponseJarvis.score > -0.3) {
    stateJarvis = "Jarvis " + emoji.get('expressionless') + ": ";
    console.log(stateJarvis + chalk.yellow(texto));
  } else if (somaticResponseJarvis.score > -0.5 && somaticResponseJarvis.score < -0.3) {
    stateJarvis = "Jarvis " + emoji.get('sweat') + ": ";
    console.log(stateJarvis + chalk.yellow(texto));
  } else if (somaticResponseJarvis.score > -0.8 && somaticResponseJarvis.score < -0.5) {
    stateJarvis = "Jarvis " + emoji.get('cry') + ": ";
    console.log(stateJarvis + chalk.red(texto));
  } else if (somaticResponseJarvis.score > -1 && somaticResponseJarvis.score < 0.8) {
    stateJarvis = "Jarvis " + emoji.get('rage') + ": ";
    console.log(stateJarvis + chalk.red(texto));
  } else {
    stateJarvis = "Jarvis " + emoji.get('neutral_face') + ": ";
    console.log(stateJarvis + texto);
  }
  this.speak(texto);
};

exports.speak = async (texto) => {
  runCommandRoot("skill $(pidof espeak)")
  //return runCommand(`espeak -p20 -s130 -v es-la "${texto}"`)
  return;
}