// utils/trends.js
const axios = require('axios');

async function getTrendingTopic() {
  try {
    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=1cf6e97cde3149f2adfa8000c98a3f89'
    );

    const articles = response.data.articles.slice(0, 10); // You can change how many to consider
    if (!articles.length) throw new Error('No articles found');

    const randomIndex = Math.floor(Math.random() * articles.length);
    const selectedArticle = articles[randomIndex];

    const headline = selectedArticle.title || 'No headline available';
    const description = selectedArticle.description || 'No description available';

    return { headline, description };
  } catch (error) {
    console.error('Error fetching trending topic:', error.message);
    return { headline: null, description: null };
  }
}

module.exports = { getTrendingTopic };
