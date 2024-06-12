const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Handle voting
    socket.on('vote', (voteData) => {
        io.emit('voteUpdate', voteData);
    });

    // Handle chat messages
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    // Handle typing indicator
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
