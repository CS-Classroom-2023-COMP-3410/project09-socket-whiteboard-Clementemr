const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Allow CORS
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));


let boardState = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send the current board state to the new user
    socket.emit("load-board", boardState);

    socket.on("draw", (data) => {
        boardState.push(data);
        socket.broadcast.emit("draw", data);
    });

    socket.on("clear", () => {
        boardState = [];
        io.emit("clear");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


