
const { exec, spawn } = require('child_process');
const sudo = require('sudo-prompt');
const { runCommandRoot, runCommand } = require('./osBash');
exports.respuestaConversations = (texto) => {
  this.speak(texto);
  console.log("Jarvis: " + texto);
}

exports.speak = async (texto) => {
  await runCommandRoot("skill $(pidof espeak)")
  return await runCommand(`espeak -p20 -s130 -v es-la "${texto}"`)
}