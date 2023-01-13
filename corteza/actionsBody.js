const path = require('path');
const fs = require('fs');
const { respuestaConversations } = require('./voz');
const { systemAction, searchVideoOnYouTube, searchGoogle } = require('./cagorizacionProcessExecute');
const {
  runCommandTranslateEn_Es,
  runCommandTranslateEs_En,
} = require('./osBash');
exports.actionHandler = async (result, question) => {
  switch (result) {
    case "open.music":
      const music = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria/body/music', 'ideas.json')));;
      let musicSrt = question;
      for (let index = 0; index < music.length; index++) {
        const idea = music[index];
        if (question.search(idea.input) >= 0) {
          musicSrt = question.toLowerCase().replace(idea.input.toLowerCase(), "");
        }
      }
      await searchVideoOnYouTube(musicSrt);
      break;
    case "open.search":
      const searchGoogleData = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria/body/searchGoogle', 'ideas.json')));;
      let searchGoogleStr = question;
      for (let index = 0; index < searchGoogleData.length; index++) {
        const idea = searchGoogleData[index];
        if (question.search(idea.input) >= 0) {
          searchGoogleStr = question.toLowerCase().replace(idea.input.toLowerCase(), "");
        }
      }
      await searchGoogle(searchGoogleStr);
      break;
    case "open.translate.es.en":
      const translateData = JSON.parse(fs.readFileSync(path.join(__dirname, '../memoria/body/translate', 'ideas.json')));;
      let translateStr = question;
      for (let index = 0; index < translateData.length; index++) {
        const idea = translateData[index];
        if (question.search(idea.input) >= 0) {
          translateStr = question.toLowerCase().replace(idea.input.toLowerCase(), "");
        }
      }
      let translateEs_En = await runCommandTranslateEs_En(translateStr);
      respuestaConversations(translateEs_En.response);
      break;
    case "open.translate.en.es":
      translateStr = question;
      for (let index = 0; index < translateData.length; index++) {
        const idea = translateData[index];
        if (question.search(idea.input) >= 0) {
          translateStr = question.toLowerCase().replace(idea.input.toLowerCase(), "");
        }
      }
      let translateEn_Es = await runCommandTranslateEn_Es(translateStr);
      respuestaConversations(translateEn_Es.response);
      break;
    default:
      systemAction(result);
      break;
  }
  return result;
}