import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import getAIResponse from './getAIResponse.js';

const PORT = 8000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://abhisheksaichatbot.netlify.app/", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});


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
