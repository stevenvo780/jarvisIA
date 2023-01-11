
const { spawn } = require('child_process');
const sudo = require('sudo-prompt');
let childRoot;
exports.openRootSession = async () => {
  await sudo.exec('bash');
  childRoot = spawn('bash')
}

exports.runCommandRoot = async (command) => {
  await child.stdin.write(command + '\n');
}

exports.closeRootSession = () => {
  childRoot.kill('SIGINT');
}
let child;

exports.openSession = () => {
  child = spawn('bash');
  child.stdout.on('data', data => {
    //console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', data => {
    //console.error(`stderr: ${data}`);
  });
}

exports.runCommand = async (command) => {
  child.stdin.write(command + '\n');
}

exports.closeSession = () => {
  child.kill('SIGINT');
}