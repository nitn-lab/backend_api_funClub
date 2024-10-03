const WebSocket = require("ws");
const uuid = require("uuid"); // For generating unique channel names

let activeCalls = {};

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ port: 4000 });
  console.log("New WebSocket connection established");
  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const { type, from, to, channelName } = JSON.parse(message);
      console.log("channelName", channelName, from);
      if (type === "register") {
        ws.username = from;
      } else if (type === "call") {
        if (activeCalls[to] || activeCalls[from]) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "User is already in a call.",
            })
          );
        } else {
          const newChannelName = channelName || uuid.v4();
          activeCalls[from] = newChannelName;
          activeCalls[to] = newChannelName;

          broadcast(
            to,
            JSON.stringify({
              type: "incomingCall",
              from,
              channelName: newChannelName,
            })
          );
        }
      } else if (type === "acceptCall") {
        ws.send(JSON.stringify({ type: "callAccepted", channelName }));
      } else if (type === "endCall") {
        delete activeCalls[from];
        delete activeCalls[to];
        broadcast(to, JSON.stringify({ type: "callEnded" }));
      }
    });
  });

  // Cleanup on disconnection
  wss.on("close", (ws) => {
    // Remove user from active calls if they disconnect
    console.log(`User ${ws.username} disconnected`);
    for (const [key, value] of Object.entries(activeCalls)) {
      if (key === ws.username) {
        delete activeCalls[key]; // Remove the disconnecting user
      }
    }
    // Also remove any user who was being called by the disconnecting user
    for (const [key, value] of Object.entries(activeCalls)) {
      if (value === activeCalls[ws.username]) {
        delete activeCalls[key]; // Remove the other participant
      }
    }
  });

  function broadcast(to, message) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.username === to) {
        client.send(message);
      }
    });
  }
}

module.exports = { setupWebSocketServer };
