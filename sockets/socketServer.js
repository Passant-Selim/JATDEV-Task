const WebSocket = require("ws");

const connections = new Set();

function createSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");
    connections.add(ws);

    ws.on("message", (message) => {
      console.log("Received:", message);
      ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      connections.delete(ws);
    });

    ws.send("Welcome to the WebSocket server");
  });
}

function broadcastMessage(message) {
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

module.exports = { createSocketServer, broadcastMessage };
