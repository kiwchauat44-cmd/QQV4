import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // State
  const players: Record<string, any> = {};
  const forces: any[] = [];

  const COLORS = [
    "#00ffcc", "#ff00ff", "#ffff00", "#00ffff", 
    "#ff3300", "#33ff00", "#6600ff", "#ffcc00"
  ];

  io.on("connection", (socket) => {
    const playerId = uuidv4();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    players[playerId] = {
      id: playerId,
      x: 0,
      y: 0,
      color: color,
    };

    socket.emit("init", { playerId, players, forces });
    socket.broadcast.emit("playerJoined", players[playerId]);

    socket.on("move", (pos) => {
      if (players[playerId]) {
        players[playerId].x = pos.x;
        players[playerId].y = pos.y;
        socket.broadcast.emit("playerMoved", { id: playerId, x: pos.x, y: pos.y });
      }
    });

    socket.on("addForce", (force) => {
      const duration = force.duration || (force.type === 'dispersion' ? 800 : 5000);
      const newForce = { 
        ...force, 
        id: uuidv4(), 
        createdAt: Date.now(),
        radius: force.radius || 300,
        strength: force.strength || 50,
        duration: duration
      };
      forces.push(newForce);
      io.emit("forceAdded", newForce);

      // Remove force after duration
      setTimeout(() => {
        const index = forces.findIndex(f => f.id === newForce.id);
        if (index !== -1) {
          forces.splice(index, 1);
          io.emit("forceRemoved", newForce.id);
        }
      }, duration);
    });

    socket.on("clearForces", () => {
      forces.length = 0;
      io.emit("init", { playerId: socket.id, players, forces });
    });

    socket.on("disconnect", () => {
      delete players[playerId];
      io.emit("playerLeft", playerId);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
