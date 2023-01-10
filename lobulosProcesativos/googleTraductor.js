const translate = require('google-translate-api');

module.exports = async function translateAction(text) {
  return await translate(text, { to: 'en' }).then(res => {
    console.log(res.text);
    return res.text;
  }).catch(err => {
    console.error(err);
  });
}

