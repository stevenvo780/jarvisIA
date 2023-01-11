const path = require('path');
const fs = require('fs');
const { systemAction, searchVideoOnYouTube, searchGoogle } = require('./cagorizacionProcessExecute');
const traductor = require('../lobulosProcesativos/googleTraductor');
exports.actionHandler = async (result, question) => {
  console.log(result);
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
    case "open.translate":
      const translate = await traductor(question);
      respuestaConversations("Traducción: " + translate);
      break;
    default:
      systemAction(result);
      break;
  }
  return result;
}