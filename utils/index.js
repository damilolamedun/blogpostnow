// index.js
const cron = require('../node_modules/cron');
const { getTrendingTopic } = require('./trends');
const { generateViralTitle } = require('./titlers');
const { generatecategory } = require('./categoryai');
const { generateimg } = require('./images');
const { getArticleSummary } = require('./research');
const { generateArticle } = require('./content');
const { uploadMedia, publishPost, getAuthToken, getOrCreateCategory} = require('./publisher');

async function dailyPost() {
  try {
    // Step 1: Get trending topic
    const { topic, description } = await getTrendingTopic();

    console.log("topic gotten ")
    // Step 2: Generate title
    const title = await generateViralTitle(description);
    console.log("title done")
 console.log(title,"       ", description)
  
    // Step 4: Research
    // const [facts, comments] = await Promise.all([
    //   getWikiSummary(topic),
    //   scrapeRedditComments(topic)
    // ]);
    
    const facts = await getArticleSummary(description)
    console.log("fact gotten")

    // Step 5: Write article
    const content = await generateArticle(description, facts);
    const escapedArticle = JSON.stringify(content);
    console.log("content ready gotten")

      // Step 3: Create image
      const imagePath = await generateimg(escapedArticle);
    
  console.log(title,"       ",  content,"      ", imagePath)
    // // Step 6: Publish
    const authToken = await getAuthToken()
    const categoryName= await generatecategory(title)
    console.log("category", categoryName)

    const category = await getOrCreateCategory(categoryName, authToken)
    console.log(category)
    const imageId = await uploadMedia(imagePath, authToken);
    await publishPost(title, content, imageId, categoryName, authToken);
    
    console.log('Published:', title);
 } catch (error) {
    console.error('Error:', error.message, error.code)

  }
}

dailyPost()
// // Run daily at 9 AM
// new cron.CronJob('0 9 * * *', dailyPost).start();