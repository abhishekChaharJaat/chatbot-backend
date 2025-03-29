// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';
const OPENROUTER_API_KEY = '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';
// const PORT = 8000;
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3001", 
//         methods: ["GET", "POST"]
//     }
// });

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })

// io.on('connection', (socket) => {
//     console.log('A user connected');
    
//     // socket.on('disconnect', () => {
//     //     console.log('A user disconnected');
//     // });
//     socket.on('message', (msg) => {
//         console.log('Message received: ' + msg);
//         io.emit('message', "Hello from server"); // Broadcast the message to all clients
//     });
// }
// );