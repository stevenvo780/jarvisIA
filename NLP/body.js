const path = require('path');
const { NlpManager } = require('node-nlp');
exports.pensarBody = async (question) => {
  const managerBody = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
  managerBody.load(path.join(__dirname, '../memoria/body', 'body.nlp'));
  const resultBody = await managerBody.process('es', question);
  return resultBody;
}