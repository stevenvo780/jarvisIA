
const { exec } = require('child_process');
const { respuestaConversations } = require('./voz');
exports.systemAction = (action) => {
  return new Promise((resolve, reject) => {
    exec(action, (error, stdout, stderr) => {
      if (error) {
        resolve(action);
        //reject(error);
        return;
      }
      if (stderr) {
        //reject(error);
        resolve(action);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

exports.searchVideoOnYouTube = (searchTerm) => {
  respuestaConversations("Buscando video en YouTube...")
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

exports.searchGoogle = (question) => {
  respuestaConversations("Buscando en google")
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
exports.notFount = (question) => {
  respuestaConversations("Buscando en google...");
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

