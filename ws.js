// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';

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