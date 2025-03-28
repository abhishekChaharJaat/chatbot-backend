import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = 8000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "https://abhisheksaichatbot.netlify.app",
            "http://localhost:5173"  // Vite client
        ],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

// OpenRouter configuration
 const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model configuration
const MODELS = ['google/gemini-pro', 'anthropic/claude-3-opus', 'openai/gpt-3.5-turbo'];

// 🛠️ Function to get AI response
const getAIResponse = async (message) => {
    for (const model of MODELS) {
        try {
            console.log(`🔍 Trying model: ${model}`);

            const response = await axios.post(
                OPENROUTER_URL,
                {
                    model: model,
                    messages: [{ role: "user", content: message }]
                },
                {
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Log and return AI's response
            const aiReply = response.data.choices[0].message.content || "🤖 I'm not sure how to respond.";
            console.log(`✅ AI Response: ${aiReply}`);
            return aiReply;

        } catch (error) {
            console.error(`❌ Error with model ${model}:`, error.response ? error.response.data : error.message);
            
            // Continue to the next model if one fails
        }
    }

    // Fallback message if all models fail
    return "🤖 Sorry, all models failed to respond. Try again later.";
};

// 🔥 Socket connection handling
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






// const OPENROUTER_API_KEY = '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';