// server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let messages = []; // Store message history

wss.on("connection", (ws) => {
    console.log("New client connected");

    // Send message history to new client
    ws.send(JSON.stringify({ type: "history", data: messages }));

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        
        if (parsedMessage.type === "message") {
            messages.push(parsedMessage.data); // Store message
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "message", data: parsedMessage.data }));
                }
            });
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

console.log("WebSocket server running on ws://localhost:8080");
