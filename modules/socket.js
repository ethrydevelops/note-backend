const { createServer } = require('node:http');
const { createServer: createSecureServer } = require('node:https');
const path = require("path");
const { Server } = require('socket.io');
const fs = require('fs');
const auth = require("./auth.js");
const logging = require("./console.js");

require("dotenv").config();

var userSocketMap = {};
var io, proto;

const server = (app) => {
    let srv;

    if (process.env.HTTPS && process.env.HTTPS == "true") {
        if(!(process.env.HTTPS_KEY_PATH && process.env.HTTPS_CERT_PATH)) {
            logging.error("HTTPS_KEY_PATH and HTTPS_CERT_PATH must be populated with valid SSL certificate and private key.");
            throw new Error("HTTPS_KEY_PATH and HTTPS_CERT_PATH must be populated with valid SSL certificate and private key.");
        }
        /* get ssl stuff from env vars */
        const keyPath = path.resolve(__dirname, '..', process.env.HTTPS_KEY_PATH);
        const certPath = path.resolve(__dirname, '..', process.env.HTTPS_CERT_PATH);

        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            const sslOptions = {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath),
            };
            srv = createSecureServer(sslOptions, app);
            logging.info("Starting server on HTTPS");

            proto = "https";
        } else {
            logging.error("HTTPS key or certificate file not found at "+keyPath+", "+certPath+". Falling back to HTTP.");
            srv = createServer(app);

            proto = "http";
        }
    } else {
        srv = createServer(app);
        logging.info("Starting server on HTTP");

        proto = "http";
    }

    io = new Server(srv);

    io.use(async (socket, next) => {
        const token = socket.handshake.query.token || socket.handshake.headers['authorization'];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        if (auth.verifyToken(token)) {
            const [sid, tok] = token.split(".");
            const uuid = await auth.getUserIdFromSessionId(sid);

            socket.userId = uuid;
            userSocketMap[uuid] = socket.id;

            return next();
        } else {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            delete userSocketMap[socket.userId];
        });
    });

    return {
        listen: (port, callback) => srv.listen(port, callback),
        proto
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
        socket.emit(event, data);
    }
}

module.exports = { server, emitToClient };
