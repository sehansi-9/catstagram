const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');
const cors = require('cors');
const { Server } = require('socket.io');

// Middleware
app.use(cors()); // Enable CORS for all routes

// MongoDB Connection
mongoose.connect(MONGOURI);

mongoose.connection.on('connected', () => {
    console.log('connected to mongo yeahhh');
});

mongoose.connection.on('error', (err) => {
    console.log('error connecting', err);
});

// Models and Routes
require('./models/user');
require('./models/post');

app.use(express.json()); // Middleware to parse JSON requests
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

// Start the Express app
const server = app.listen(PORT, () => {
    console.log('Server is running on', PORT);
});

// Attach Socket.io to the same server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log('someone has connected');

    socket.on('disconnect', () => {
        console.log('someone has left');
    });
});
