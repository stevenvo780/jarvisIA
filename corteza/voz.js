const { runCommandRoot, runCommand } = require('./osBash');
const chalk = require('chalk');
exports.respuestaConversations = async (texto, sentiment = { score: 0, magnitude: 0 }) => {
  this.speak(texto);
  if (sentiment.score !== 0) {
    if (sentiment.score > 0.8) {
      console.log(chalk.blue(texto));
    } else if (sentiment.score < -0.8) {
      console.log(chalk.red(texto));
    } else if (sentiment.score > 0.3 && sentiment.score < 0.8) {
      console.log(chalk.green(texto));
    } else if (sentiment.score < -0.3 && sentiment.score > -0.8) {
      console.log(chalk.yellow(texto));
    } else if (sentiment.score > -0.3 && sentiment.score < 0.3) {
      console.log(chalk.gray(texto));
    } else {
      console.log("Jarvis: " + texto);
    }
  } else {
    console.log("Jarvis: " + texto);
  }
};

exports.speak = async (texto) => {
  runCommandRoot("skill $(pidof espeak)")
  return runCommand(`espeak -p20 -s130 -v es-la "${texto}"`)
}