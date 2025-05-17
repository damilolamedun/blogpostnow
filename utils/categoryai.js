// utils/titles.js

const apiKey = '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'; // Get this from https://openrouter.ai
 
async function  generatecategory(topic) {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "your-app-domain.com", // Use your domain or 'localhost'
          "X-Title": "My JS AI App" // Optional, for dashboard info
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free", // You can use any model here
          messages: [
            { role: "user", content: `Generate a single-word category (e.g., 'sports', 'entertainment', 'technology') for the blog topic '${topic}'. Ensure the response is concise, relevant, and strictly one word without additional explanations at all.` }
          ]
        })
       });
       
       const data = await response.json();

       const reply = data.choices?.[0]?.message?.content.split('\n')[0];
       
  
    return reply;
}

module.exports = { generatecategory };