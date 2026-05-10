const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const aiService = {
  summarizeNote: async (content) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing Groq API Key. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    if (!content || content.trim().length < 10) {
      throw new Error("Note content is too short to summarize.");
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes notes. Please provide a concise, structured summary in Thai (or the language of the note). Use bullet points if necessary. Start directly with the summary."
            },
            {
              role: "user",
              content: `Please summarize the following note content:\n\n${content}`
            }
          ],
          temperature: 0.5,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "AI Summarization failed");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error("AI Service Error:", err);
      throw err;
    }
  }
};
