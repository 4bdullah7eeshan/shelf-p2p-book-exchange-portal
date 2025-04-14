const { createServer } = require("node:http");
const { Server } = require('socket.io');
const { PORT, NODE_ENV } = require("./config/index");
const app = require("./app");

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://shelf-p2p-book-exchange-portal.vercel.app/",
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket'],
    perMessageDeflate: false,
    connectionStateRecovery: {

    },
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user has connected');

    socket.on('register', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

if (NODE_ENV != "test") {
    app.listen(PORT, () => {
        console.log(`Express app running on PORT: ${PORT}!`);
    });
}