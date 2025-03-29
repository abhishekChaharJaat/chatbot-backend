import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';


const PORT = 8000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://abhisheksaichatbot.netlify.app", "http://localhost:5173", "https://openrouter.ai"],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

const OPENROUTER_API_KEY = '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';

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

io.on('connection', (socket) => {
    console.log('🔌 A user connected');

    socket.on('message', async (msg) => {
        console.log('📩 Message received:', msg);

        try {
            const aiReply = await getAIResponse(msg);
            socket.emit('message', aiReply);

        } catch (error) {
            console.error('❌ Failed to fetch AI response:', error);
            socket.emit('message', '⚠️ Sorry, something went wrong with the response.');
        }
    });

    socket.on('disconnect', () => {
        console.log('🔌 A user disconnected');
    });
});
