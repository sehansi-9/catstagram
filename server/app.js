import express from 'express';
import mongoose from 'mongoose';
import { MONGOURI } from './keys.js';
import cors from 'cors';
import { Server } from 'socket.io';
import './models/user.js';
import './models/post.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Attempting to start server on port:', PORT);

// Middleware
app.use(cors()); // Enable CORS for all routes

// MongoDB Connection
if (!MONGOURI) {
    console.error('CRITICAL ERROR: MONGOURI environment variable is not defined!');
} else {
    console.log('Connecting to MongoDB...');
    mongoose.connect(MONGOURI)
        .then(() => console.log('Successfully connected to MongoDB atlas'))
        .catch(err => console.error('FAILED to connect to MongoDB:', err.message));
}

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error event:', err);
});


app.use(express.json()); // Middleware to parse JSON requests
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);

// Start the Express app
const server = app.listen(PORT, () => {
    console.log('Server is running on', PORT);
});

// Attach Socket.io to the same server
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log('someone has connected');

    socket.on('disconnect', () => {
        console.log('someone has left');
    });
});
