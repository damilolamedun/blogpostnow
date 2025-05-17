// utils/images.js;

const apiKeyy = '2zTArWuNmXmmeEJj3MTnK8lFe469BJwFtDfr0IhrzWIeWK8VYKP0wG8G'; // 🔑 Replace with your real API key
async function generateFeaturedImage(searchQuery) {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`, {
        headers: {
          Authorization: apiKeyy
        }
      });
  
      const data = await response.json();
      const photo = data.photos[0];
      const imgurl = photo?.src?.large; // optional chaining just in case
  
      return imgurl;
    } catch (err) {
      console.error('Error fetching image:', err);
      return null;
    }
  }
  


//generate best image title

const apiKey = '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'; // Get this from https://openrouter.ai

async function generateimg(contents) {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "your-app-domain.com", // Use your domain or 'localhost'
          "X-Title": "My JS AI App" // Optional, for dashboard info
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free", // You can use any model here
          messages: [
            { role: "user", content: `1.read through this: ${contents} 2. generate best cover image title for the article, searchable and reasonable and 1 single option or sentence not log ` }
          ]
        })
       });
    //    .join(' | ')
       const data = await response.json();
       
       
        const reply = data.choices?.[0]?.message?.content;
        // 🔥 Logs only the AI's text
        
    const image_url = await generateFeaturedImage(reply)
  
  return image_url
}
 module.exports = { generateimg };
