const http = require('http');
const querystring = require('querystring');
const {apikey} = require('./api.js')


async function getNewsAndSendToEjs(res, topicName = 'weather', pageSize = 10, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required.');
  }

  if (typeof topicName !== 'string' || topicName.length === 0) {
    throw new Error('Invalid topic name.');
  }

  if (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100) {
    throw new Error('Invalid page size.');
  }

  const query = querystring.stringify({
    q: topicName,
    pageSize,
    apiKey,
  });

  try {
    const options = {
      hostname: 'newsapi.org',
      path: `/v2/everything?${query}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const responseData = JSON.parse(data);

          if (!responseData.articles || !Array.isArray(responseData.articles)) {
            throw new Error('Invalid response data.');
          }

          const articles = responseData.articles.map((article) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
          }));

          res.render('index', { articles });
        } catch (error) {
          console.log(error);
          res.render('index', { articles: [] });
        }
      });
    });

    req.on('error', (error) => {
      console.error(error);
      res.render('index', { articles: [] });
    });

    req.end();
  } catch (error) {
    console.log(error);
    res.render('index', { articles: [] });
  }
}

module.exports = {
  getNewsAndSendToEjs,
};
