

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';

const PORT = 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://abhisheksaichatbot.netlify.app" ,
            "http://localhost:5173"   // Vite client
              // React client (if you use CRA)
        ], // Your client URL
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

// OpenRouter configuration
const OPENROUTER_API_KEY = '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';  // Replace with your OpenRouter key
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Choose a valid model ID
const MODEL_ID = 'google/gemini-pro';  // Fast and free

const getAIResponse = async (message) => {
    try {
        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: MODEL_ID,  // Use valid OpenRouter model ID
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiReply = response.data.choices[0].message.content || "🤖 I'm not sure how to respond.";
        console.log(aiReply)
        return aiReply;

    } catch (error) {
        console.error('Error fetching AI response:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get AI response');
    }
};

io.on('connection', (socket) => {
    console.log('🔌 A user connected');

    socket.on('message', async (msg) => {
        console.log('📩 Message received:', msg);

        try {
            const aiReply = await getAIResponse(msg);
            socket.emit('message', aiReply);

        } catch (error) {
            socket.emit('message', 'Sorry, something went wrong with the response.');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});




