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
