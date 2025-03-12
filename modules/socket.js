const { createServer } = require('node:http');
const { Server } = require('socket.io');
const auth = require("./auth.js");
const logging = require("./console.js");

var userSocketMap = {};
var io;

const server = (app) => {
    const srv = createServer(app);
    io = new Server(srv);

    io.use(async (socket, next) => {
        const token = socket.handshake.query.token || socket.handshake.headers['authorization'];

        if (!token) {
            // no token provided, reject
            return next(new Error('Authentication error: No token provided'));
        }

        if (auth.verifyToken(token)) {
            const [sid, tok] = token.split(".");
            const uuid = await auth.getUserIdFromSessionId(sid); // get uuid
            
            // map user id to socket id
            socket.userId = uuid;
            userSocketMap[uuid] = socket.id;

            return next();
        } else {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        // handle disconnect + remove user from mapping
        socket.on('disconnect', () => {
            delete userSocketMap[socket.userId];
        });
    });

    return {
        listen: (port, callback) => srv.listen(port, callback),
    };
};

function emitToClient(userId, event, data) {
    if (!io) {
        logging.warn("emitToClient called before socket was initialized");
        return;
    }

    const socketId = userSocketMap[userId];
    if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        socket.emit(event, data); // emit event to specific client
    }
}

module.exports = { server, emitToClient };
