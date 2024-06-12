// index.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mySql = require('mysql');
const controller = require('./controller');

const connection = mySql.createConnection({
    database: 'ICICI',
    user: 'gowtham',
    password: 'niveus@123',
    host: 'localhost',
    port: '3306',
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const options = await controller.getAllOptions(connection);
        console.log(`All Option || ${JSON.stringify(options)}`);
        res.render('index', { options });
    } catch (err) {
        console.error('Error fetching options:', err);
        res.status(500).send('Internal Server Error');
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle voting
    socket.on('vote', async (optionId) => {
        try {
            await controller.incrementVoteCount(connection, optionId);
            const updatedOptions = await controller.getAllOptions(connection);
            io.emit('voteUpdate', updatedOptions);
        } catch (err) {
            console.error('Error updating vote count:', err);
        }
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
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
