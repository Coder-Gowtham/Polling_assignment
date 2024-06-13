const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const service = require('./service');
const bodyParser = require("body-parser"); // Import bodyParser for parsing request bodies

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'MYDB',
    password: 'localhost@123',
    port: 1024,
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser for parsing request bodies

// Define routes for home, login, and registration
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

let userName = "";

// Register route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    userName = username;

    try {
        const checkEmail = await pool.query("SELECT * FROM registered_users WHERE email = $1", [username]);

        if (checkEmail.rows.length > 0) {
            return res.status(400).send("User already exists! Please try logging in.");
        }

        const hash = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO registered_users(email, password) VALUES ($1, $2)", [username, hash]);
        res.redirect(`/poll?username=${username}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM registered_users WHERE email = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).send("User does not exist. Please register.");
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.redirect(`/poll?username=${username}`);
        } else {
            res.status(400).send("Incorrect Password. Please try again.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/poll', async (req, res) => {
    const username = req.query.username;
    console.log('userName', username);
    try {
        const options = await service.getAllOptions(pool);
        console.log(`All Option || ${JSON.stringify(options)}`);
        res.render('index.ejs', { options, username });
    } catch (err) {
        console.error('Error fetching options:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch chat history
app.get('/api/chat-history', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM chats ORDER BY createdTime ASC');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching chat history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle voting
    // Handle voting
    socket.on('vote', async (data) => {
        console.log('Received vote data:', data);

        const { selectedOption, username } = data;
        console.log('Selected option and username:', selectedOption, username);

        try {
            // Check if the user has already voted
            const checkIsVoted = await service.getIsVoted(pool, username);
            console.log('User checkIsVoted:', checkIsVoted);

            // If the user has not voted yet
            if (checkIsVoted && checkIsVoted[0].is_voted === 0) {
                // Update the vote count
                await service.incrementVoteCount(pool, selectedOption);

                // Mark the user as voted
                await service.updateIsVoted(pool, username, selectedOption);

                console.log('User voted successfully.');

                // Emit updated options to clients
                const updatedOptions = await service.getAllOptions(pool);
                io.emit('voteUpdate', updatedOptions);
            } else {
                console.log('User has already voted.');
                io.to(socket.id).emit('alreadyVoted');
            }
        } catch (err) {
            console.error('Error handling vote:', err);

        }
    });



    // Handle chat messages
    socket.on('chatMessage', async (data) => {
        const { message, username, newUsername } = data;

        // Broadcast the message to all clients
        io.emit('chatMessage', {message, username, newUsername});

        try {
            // Save the message to the database
            await service.saveMessage(pool, message, username, newUsername);
            console.log('Message saved to database.');
        } catch (error) {
            console.error('Error saving message to database:', error);
        }
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
