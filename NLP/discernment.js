
const path = require('path');
const { NlpManager, ConversationContext } = require('node-nlp');
const managerDiscernment = new NlpManager({ languages: ['es'], autoSave: false, nlu: { log: false } });
exports.pensarDiscernment = async (question) => {
  managerDiscernment.load(path.join(__dirname, '../memoria/discernment', 'discernment.nlp'));
  const context = new ConversationContext();
  const resultDiscernment = await managerDiscernment.process('es', question, context);
  return resultDiscernment;
}

