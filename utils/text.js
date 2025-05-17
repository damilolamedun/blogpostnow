
// //     const apiKey = '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'; // Get this from https://openrouter.ai
// //  async function aiai() {
  
 
// // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
// //   method: "POST",
// //   headers: {
// //     "Authorization": `Bearer ${apiKey}`,
// //     "Content-Type": "application/json",
// //     "HTTP-Referer": "your-app-domain.com", // Use your domain or 'localhost'
// //     "X-Title": "My JS AI App" // Optional, for dashboard info
// //   },
// //   body: JSON.stringify({
// //     model: "mistralai/mistral-7b-instruct:free", // You can use any model here
// //     messages: [
// //       { role: "user", content: "Hello, who are you?" }
// //     ]
// //   })
// // });

// // const data = await response.json();
// // console.log(data);

// // const reply = data.choices?.[0]?.message?.content;
// // console.log(reply); // 🔥 Logs only the AI's text
// // }

// // aiai()

// const axios = require('axios');

// async function getBearerToken() {
//   try {
//     const res = await axios.post('http://deme.medianewsonline.com/wp-json/jwt-auth/v1/token', {
//       username: 'admin',
//       password: 'demainguy@2002'
//     });

//     console.log('✅ Bearer Token:', res.data.token);
//     return res.data.token;
//   } catch (err) {
//     console.error('❌ Failed to get token:', err.response.data);
//   }
// }
// getBearerToken()



// import { v4 as uuidv4 } from 'uuid';

// const id = uuidv4();
// console.log(id);

// utils/publisher.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration
const WORDPRESS_URL = 'http://deme.medianewsonline.com/'; // Replace with your actual site
const USERNAME = 'joseph'; // WordPress admin username
const PASSWORD = '8kcgF6P93A3mhFr7Xm(%amW5josep'; // WordPress application password

async function getAuthToken() {
  try {
    const response = await axios.post(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
      username: USERNAME,
      password: PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw error;
  }
}

async function uploadMedia(imagePath, authToken) {
  const form = new FormData();
  let tempPath = imagePath;

  if (imagePath.startsWith('http')) {
    const filename = `${uuidv4()}.jpg`;
    tempPath = path.join(__dirname, filename);
    const writer = fs.createWriteStream(tempPath);

    const response = await axios({
      url: imagePath,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  form.append('file', fs.createReadStream(tempPath));

  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (imagePath.startsWith('http')) fs.unlinkSync(tempPath);
    return response.data.id;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
}

async function publishPost(title, content, imageId, authToken) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: 'publish',
        featured_media: imageId
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    console.log('✅ Post published!');
    console.log('📰 Title:', response.data.title.rendered);
    console.log('🔗 URL:', response.data.link);
    return response.data.link;
  } catch (error) {
    console.error('Publishing failed:', error.response?.data || error.message);
    throw error;
  }
}

// async function main() {
//   try {
//     const authToken = await getAuthToken();
//     return authToken
//     // const imageUrl = "https://images.pexels.com/photos/8259339/pexels-photo-8259339.jpeg";
//     // const imageId = await uploadMedia(imageUrl, authToken);
//     // await publishPost("Test Post", "This is my content", imageId, authToken);
//   } catch (error) {
//     console.error('Process failed:', error.message);
//   }
// }


module.exports = { uploadMedia, publishPost, getAuthToken };










const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration


// const WORDPRESS_URL = 'http://deme.medianewsonline.com/';
// const USERNAME = 'joseph';
// const PASSWORD = '8kcgF6P93A3mhFr7Xm(%amW5josep';

// Cache for categories to avoid repeated lookups
const categoryCache = new Map();
async function getAuthToken() {
  try {
    const response = await axios.post(`${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
      username: USERNAME,
      password: PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.token) {
      throw new Error('No token received in response');
    }
    
    console.log('Successfully obtained auth token');
    return response.data.token;
  } catch (error) {
    console.error('Authentication failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}
async function uploadMedia(imagePath, authToken) {
  const form = new FormData();
  let tempPath = imagePath;

  if (imagePath.startsWith('http')) {
    const filename = `/img/${uuidv4()}.jpg`;
    tempPath = path.join(__dirname, filename);
    const writer = fs.createWriteStream(tempPath);

    const response = await axios({
      url: imagePath,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  form.append('file', fs.createReadStream(tempPath));

  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (imagePath.startsWith('http')) fs.unlinkSync(tempPath);
    return response.data.id;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
}
async function getOrCreateCategory(categoryName, authToken) {
  // Check cache first
  if (categoryCache.has(categoryName)) {
    return categoryCache.get(categoryName);
  }

  try {
    // Try to find existing category with exact name match
    const searchResponse = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/categories?per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    // Look for exact match (case insensitive)
    const existingCategory = searchResponse.data.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    // If found, return the ID
    if (existingCategory) {
      categoryCache.set(categoryName, existingCategory.id);
      return existingCategory.id;
    }

    // If not found, create new category
    const createResponse = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/categories`,
      {
        name: categoryName
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    categoryCache.set(categoryName, createResponse.data.id);
    return createResponse.data.id;
  } catch (error) {
    // Handle the specific case where the category exists but wasn't found in search
    if (error.response?.data?.code === 'term_exists') {
      const existingId = error.response.data.data.term_id;
      categoryCache.set(categoryName, existingId);
      return existingId;
    }
    
    console.error('Category operation failed:', error.response?.data || error.message);
    throw error;
  }
}

async function publishPost(title, content, imageId, categories = [], authToken) {
  try {
    // Process categories (can be array or single string/number)
    const categoryIds = [];
    
    if (categories && categories.length > 0) {
      const categoryList = Array.isArray(categories) ? categories : [categories];
      
      for (const category of categoryList) {
        if (typeof category === 'number') {
          categoryIds.push(category); // Already an ID
        } else {
          const categoryId = await getOrCreateCategory(category, authToken);
          categoryIds.push(categoryId);
        }
      }
    }

    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: 'publish',
        featured_media: imageId,
        categories: categoryIds
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Post published!');
    console.log('📰 Title:', response.data.title.rendered);
    console.log('🔗 URL:', response.data.link);
    console.log('🏷️ Categories:', categoryIds.join(', '));
    return response.data.link;
  } catch (error) {
    console.error('Publishing failed:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    const authToken = await getAuthToken();
  
    const imageUrl = "https://images.pexels.com/photos/8259339/pexels-photo-8259339.jpeg";
    const imageId = await uploadMedia(imageUrl, authToken);
    
    // Example with categories (can be names or IDs)
    await publishPost(
      "Test Post with Categories", 
      "This is my content with categories",
      imageId,
      ["Technology", "Programming"], // Category names
      authToken
    );
    
    // Or with mixed names and IDs
    // await publishPost(..., ["News", 5], authToken);
    
    // Or single category
    // await publishPost(..., "Sports", authToken);
  } catch (error) {
    console.error('Process failed:', error.message);
  }
}


module.exports = { 
  uploadMedia, 
  publishPost, 
  getAuthToken,
  getOrCreateCategory 
};