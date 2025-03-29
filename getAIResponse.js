import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS = ['google/gemini-pro', 'anthropic/claude-3-opus', 'openai/gpt-3.5-turbo'];

const getAIResponse = async (message) => {
    for (const model of MODELS) {
        let retries = 3;
        let delay = 1000;

        while (retries > 0) {
            try {
                console.log(`🔍 Trying model: ${model}`);
                const response = await axios.post(
                    OPENROUTER_URL,
                    {
                        model: model,
                        messages: [{ role: "user", content: message }],
                        max_tokens: 1000,
                        temperature: 0.7,
                        top_p: 0.9
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,  // Use env variable
                            "Content-Type": "application/json"
                        }
                    }
                );

                const aiReply = response.data.choices[0]?.message?.content || "🤖 No response from model.";
                console.log(`✅ AI Response from ${model}: ${aiReply}`);
                return aiReply;

            } catch (error) {
                console.error(`❌ Error with model ${model}:`, error.response ? error.response.data : error.message);

                if (error.response) {
                    console.error('📄 Status:', error.response.status);
                    console.error('🚫 Data:', error.response.data);

                    if (error.response.status === 429) {
                        console.log(`🕒 Rate limit hit. Retrying in ${delay / 1000} seconds...`);
                        await new Promise((resolve) => setTimeout(resolve, delay));
                        delay *= 2;
                    }
                }

                retries--;
            }
        }
    }
    return "🤖 Sorry, all models failed to respond. Try again later.";
};

export default getAIResponse;
