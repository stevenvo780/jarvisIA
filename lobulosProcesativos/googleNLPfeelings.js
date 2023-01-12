exports.getSentiment = async (question) => {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const document = {
    content: question,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({ document: document });
  //console.log(result.sentences);
  const sentiment = result.documentSentiment;

  // console.log(`Text: ${text}`);
  // console.log(sentiment);
  // console.log(`Sentiment score: ${sentiment.score}`);
  // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  return sentiment;
}