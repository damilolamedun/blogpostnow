// utils/content.js

const apiKey = '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'; // Get this from https://openrouter.ai

async function generateArticle(topic, facts) {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "your-app-domain.com", // Use your domain or 'localhost'
          "X-Title": "My JS AI App" // Optional, for dashboard info
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free", // You can use any model here
          messages: [
            { role: "user", content: `Write in a conversational tone with 1-2 grammatical errors per paragraph to sound human and this most be 1200-word blog post about "${topic}" using these facts: ${facts}. 
                       Incorporate this rules for a better article 1.higher  perplexity 2. less Burstiness (Variation in Sentence Structure) 3. less Overuse of Formality` }
          ]
        })
       });
    //    .join(' | ')
       const data = await response.json();
       
       
        const reply = data.choices?.[0]?.message?.content;
        // 🔥 Logs only the AI's text
        console.log(reply)
  return reply 
 }
// generateArticle('damil', 'jame', 'said')
module.exports = { generateArticle };

