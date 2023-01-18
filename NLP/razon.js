
const path = require('path');
const { NlpManager, ConversationContext } = require('node-nlp');
const managerRazon = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
const context = new ConversationContext();
exports.pensarRazon = async (question) => {
  managerRazon.load(path.join(__dirname, '../memoria/razon', 'razon.nlp'));
  const resultRazon = await managerRazon.process('es', question, context);
  return resultRazon;
}

