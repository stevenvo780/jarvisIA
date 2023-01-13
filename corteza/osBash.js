
const { spawn } = require('child_process');
const sudo = require('sudo-prompt');
const fs = require('fs');
const path = require('path');

// User root
let childRoot;
exports.openRootSession = async () => {
  await sudo.exec('bash');
  childRoot = spawn('bash')
  childRoot.stdout.on('data', data => {
    //console.log(`stdout: ${data}`);
  });

  childRoot.stderr.on('data', data => {
    //console.error(`stderr: ${data}`);
  });
}

exports.runCommandRoot = async (command) => {
  await child.stdin.write(command + '\n');
}

exports.closeRootSession = () => {
  childRoot.kill('SIGINT');
}

// User session
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

// GPT3 Commands
let childGPT3;
exports.openSessionGPT3 = () => {
  childGPT3 = spawn('bash');
  childGPT3.stdout.on('data', data => {
    //console.log(`stdout: ${data}`);
  });

  childGPT3.stderr.on('data', data => {
    //console.error(`stderr: ${data}`);
  });
  childGPT3.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'gpt3.py') + '\n');
}

exports.runCommandGPT3 = async (command) => {
  childGPT3.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'BigNLP.json'), (eventType, filename) => {
      if (eventType === 'change') {
        const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'BigNLP.json')));
        resolve(result);
      }
    });
  });
}
exports.closeSessionGPT3 = () => {
  childGPT3.kill('SIGINT');
}

// GPT3Chat commands
let childGPT3Chat;
exports.openSessionGPT3Chat = () => {
  childGPT3Chat = spawn('bash');
  childGPT3Chat.stdout.on('data', data => {
    //console.log(`stdout chat: ${data}`);
  });
  childGPT3Chat.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'gpt3Chat.py') + '\n');
}

exports.runCommandGPT3Chat = async (command) => {
  childGPT3Chat.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'BigNLP.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'BigNLP.json')));
          resolve(result);
        } catch (error) {
          // aveces falla la lectura
        }
      }
    });
  });
}

exports.closeSessionGPT3Chat = () => {
  childGPT3Chat.kill('SIGINT');
}

// chatbot commands
let childChatbot;
exports.openSessionChatbot = () => {
  childChatbot = spawn('bash');
  childChatbot.stdout.on('data', data => {
    //console.log(`stdout chat: ${data}`);
  });
  childChatbot.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'chatbot.py') + '\n');
}

exports.runCommandChatbot = async (command) => {
  childChatbot.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'BigNLP.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'BigNLP.json')));
          resolve(result);
        } catch (error) {
          // aveces falla la lectura
        }
      }
    });
  });
}

exports.closeSessionChatbot = () => {
  childChatbot.kill('SIGINT');
}

// translate en to es commands
let childTranslate;
exports.openSessionTranslateEn_Es = () => {
  childTranslate = spawn('bash');
  childTranslate.stdout.on('data', data => {
    //console.log(`stdout chat: ${data}`);
  });
  childTranslate.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'translateTextEn_Es.py') + '\n');
}

exports.runCommandTranslateEn_Es = async (command) => {
  childTranslate.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'translateEn_Es.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'translateEn_Es.json')));
          resolve(result);
        } catch (error) {
          // aveces falla la lectura
        }
      }
    });
  });
}

exports.closeSessionTranslateEn_Es = () => {
  childTranslate.kill('SIGINT');
}

// translate es to en commands
let childTranslateES;
exports.openSessionTranslateEs_En = () => {
  childTranslateES = spawn('bash');
  childTranslateES.stdout.on('data', data => {
    //console.log(`stdout chat: ${data}`);
  });
  childTranslateES.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'translateTextEs_En.py') + '\n');
}

exports.runCommandTranslateEs_En = async (command) => {
  childTranslateES.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'translateEs_En.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'translateEs_En.json')));
          resolve(result);
        } catch (error) {
          // aveces falla la lectura
        }
      }
    });
  });
}

exports.closeSessionTranslateEs_En = () => {
  childTranslateES.kill('SIGINT');
}

// blenderbot commands
let childBlenderbot;
exports.openSessionBlenderbot = () => {
  childBlenderbot = spawn('bash');
  childBlenderbot.stdout.on('data', data => {
    //console.log(`stdout chat: ${data}`);
  });
  childBlenderbot.stdin.write('python3.10 ' + path.join(__dirname, '../lobulosProcesativos', 'blenderbot.py') + '\n');
}

exports.runCommandBlenderbot = async (command) => {
  childBlenderbot.stdin.write(command + '\n');
  return new Promise((resolve, reject) => {
    fs.watch(path.join(__dirname, '../memoria', 'BigNLP.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria', 'BigNLP.json')));
          resolve(result);
        } catch (error) {
          // aveces falla la lectura
        }
      }
    });
  });
}

exports.closeSessionBlenderbot = () => {
  childBlenderbot.kill('SIGINT');
}
