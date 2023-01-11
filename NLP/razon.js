
const path = require('path');
const { NlpManager, ConversationContext } = require('node-nlp');
exports.pensarRazon = async (question) => {
  const managerRazon = new NlpManager({ languages: ['es'], autoSave: false });
  managerRazon.load(path.join(__dirname, '../memoria/razon', 'razon.nlp'));
  const context = new ConversationContext();

  const resultRazon = await managerRazon.process('es', question, context);
  return resultRazon;
}

