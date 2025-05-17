const axios = require('axios');

async function postToReddit(title, content, subreddit) {
  // You'll need to get these credentials from Reddit developer portal
  const clientId = 'Gh8f_ODTOmjR4nu_G2KQbw';
  const clientSecret = '_usA1ujF04rzjsMqFF96tGwT8oZ7Pw';
  const username = 'joseph_blogger';
  const password = 'josephbloger@16';

  try {
    // 1. Get access token
    const authResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=password&username=${username}&password=${password}`,
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = authResponse.data.access_token;

    // 2. Submit post
    const postResponse = await axios.post(
      'https://oauth.reddit.com/api/submit',
      {
        title: title,
        text: content,
        sr: subreddit,
        kind: 'self' // 'link' for URL posts
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'YOUR_APP_NAME/1.0 by YOUR_REDDIT_USERNAME'
        }
      }
    );

    return postResponse.data;
  } catch (error) {
    console.error('Reddit posting failed:', error.response?.data || error.message);
    throw error;
  }
}