const { SentimentAnalyzer } = require('node-nlp');

exports.somaticSentiment = (text) => {
  const sentiment = new SentimentAnalyzer({ language: 'es' });
  return new Promise((resolve, reject) => {
    sentiment
      .getSentiment(text)
      .then(result => resolve(result));
  });s
}
