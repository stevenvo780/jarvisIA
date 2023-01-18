const axios = require("axios");

exports.consumeWolfram = async (question) => {
  const options = {
    method: 'GET',
    url: 'http://api.wolframalpha.com/v1/result',
    params: {
      i: question,
      lang: "es",
      appid: process.env.API_WOLFRAM
    }
  };

  return await axios.request(options).then(function (response) {
    return response.data;
  }).catch(function (error) {
    //console.error(error);
  });
}