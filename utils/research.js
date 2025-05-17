

//generate best image title

const apiKeyy = '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'; // Get this from https://openrouter.ai


async function getArticleSummary(contents) {

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKeyy}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "your-app-domain.com", // Use your domain or 'localhost'
      "X-Title": "My JS AI App" // Optional, for dashboard info
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free", // You can use any model here ${contents}
      messages: [
        { role: "user", content: `You are an advanced AI tasked with providing a summary of the following article or content. Shuffle the facts and key points from the article, ensuring each fact is presented accurately but in a random order. Maintain coherence and clarity, and keep the summary concise (5-6 sentences). Do not add new information. Ensure the output remains understandable despite the shuffled facts. ### Input Article/Content: ${contents} ### Output (Shuffled Fact Summary): (Provide a shuffled fact-based summary here)` }
      ]
    })
   });
//    .join(' | ')
   const data = await response.json();
   
   
    const reply = data.choices?.[0]?.message?.content;
    // 🔥 Logs only the AI's text
 return reply
}
module.exports = { getArticleSummary };
