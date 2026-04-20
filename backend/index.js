require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();


app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cricket-scorecard-app-bki8-gf16p4q8q.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const { router: matchRoutes, fetchAllMatches } = require("./routes/matchRoutes");
const Match = require("./models/Match");
const authRoutes = require("./authentication/AuthRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

// ==================
// DB CONNECTION
// ==================
// mongoose.connect(
//   "mongodb://testuser:test123@ac-dlwwi5d-shard-00-00.cpq7yw0.mongodb.net:27017,ac-dlwwi5d-shard-00-01.cpq7yw0.mongodb.net:27017,ac-dlwwi5d-shard-00-02.cpq7yw0.mongodb.net:27017/scorecard?ssl=true&replicaSet=atlas-5cl3g3-shard-0&authSource=admin&appName=Cluster0",
//   {
//     serverSelectionTimeoutMS: 30000,
//     family: 4
//   }
// )
// .then(async () => {
//   console.log("✅ MongoDB connected");

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    family: 4,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 🔥 Run once at startup
    await fetchAllMatches();

    // 🔁 Run every 5 minutes
    setInterval(async () => {
      console.log("🔄 Fetching matches every 5 minutes...");
      await fetchAllMatches();
    }, 5 * 60 * 1000);
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });
// mongoose
//   .connect(process.env.MONGO_URI, {
//     serverSelectionTimeoutMS: 30000,
//     family: 4,
//   })
//   .then(async () => {
//     console.log("✅ MongoDB connected");
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err.message);
//   });



  
//   // 🔥 RUN ONCE

//   await fetchAllMatches();

//   // 🔥 RUN EVERY 5 MINUTES
//   setInterval(async () => {
//     console.log("🔄 Fetching matches every 5 minutes...");
//     await fetchAllMatches();
//   }, 5 * 60 * 1000);

// })
// .catch(err => console.error("❌ MongoDB error:", err));

// ==================
// SOCKET.IO
// ==================
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
});

// 🔥 SEND DATA EVERY 10 SECONDS (FAST UI)
setInterval(async () => {
  const liveMatches = await Match.find({ isLive: true });
  const timestamp = new Date().toLocaleTimeString();

  io.emit("matchUpdated", { liveMatches, timestamp });

  console.log(`📡 Sent ${liveMatches.length} live matches at ${timestamp}`);
}, 10000);

// ==================
// SERVER
// ==================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const cors = require("cors");
// const express = require("express");
// const app = express();

// app.use(express.json());

// // Enable CORS with specific frontend origin and needed methods
// /* app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true, // If your frontend sends cookies or auth headers
// }));
//  */

// // app.use(cors({
// //   origin: [
    
// //     "https://cricket-scorecard-app-bki8-gf16p4q8q.vercel.app" 
// //   ],
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   credentials: true,
// // }));

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://cricket-scorecard-app-bki8-gf16p4q8q.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));



// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");

// const matchRoutes = require("./routes/matchRoutes");
// const Match = require("./models/Match");
// const authRoutes = require("./authentication/AuthRoutes");

// app.use("/api/auth", authRoutes);

// // MongoDB connection

// //  mongoose.connect("mongodb+srv://namansahu31:Naman123@cluster0.cpq7yw0.mongodb.net/scorecard")
// // mongoose.connect("mongodb://namansahu31:Naman123@ac-dlwmi5d-shard-00-00.cpq7yw0.mongodb.net:27017,ac-dlwmi5d-shard-00-01.cpq7yw0.mongodb.net:27017,ac-dlwmi5d-shard-00-02.cpq7yw0.mongodb.net:27017/scorecard?ssl=true&replicaSet=atlas-5cl3g3-shard-0&authSource=admin&appName=Cluster0")
// //   .then(() => console.log("✅ MongoDB connected"))
// //   .catch((err) => console.error("❌ MongoDB error:", err));


// // mongoose.connect(
// //  mongodb+srv://testuser:test123@cluster0.cpq7yw0.mongodb.net/scorecard,
// //   {
// //     serverSelectionTimeoutMS: 30000
// //   }
// // );


// // mongoose.connect(
// //   "mongodb+srv://testuser:test123@cluster0.cpq7yw0.mongodb.net/scorecard",
// //   {
// //     serverSelectionTimeoutMS: 30000,
// //     family: 4
// //   }
// // );
// mongoose.connect(
//   "mongodb://testuser:test123@ac-dlwwi5d-shard-00-00.cpq7yw0.mongodb.net:27017,ac-dlwwi5d-shard-00-01.cpq7yw0.mongodb.net:27017,ac-dlwwi5d-shard-00-02.cpq7yw0.mongodb.net:27017/scorecard?ssl=true&replicaSet=atlas-5cl3g3-shard-0&authSource=admin&appName=Cluster0",
//   {
//     serverSelectionTimeoutMS: 30000,
//     family: 4
//   }
// )
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB error:", err));



// // Routes
// app.get("/", (req, res) => res.send("API running"));
// app.use("/api/matches", matchRoutes);

// // HTTP + Socket.IO with CORS configured to allow all origins for sockets
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);
//   socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
// });

// // Emit live matches every 3000000 ms (50 minutes)
// setInterval(async () => {
//   const liveMatches = await Match.find({ isLive: true });
//   const liveCount = liveMatches.length;
//   const timestamp = new Date().toLocaleTimeString();
//   io.emit("matchUpdated", { liveMatches, liveCount, timestamp });
//   console.log(`📡 Emitted ${liveCount} live matches at ${timestamp}`);
// }, 300000);

// /* const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
//  */
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


/* const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const matchRoutes = require("./routes/matchRoutes");
const Match = require("./models/Match");
const authRoutes = require("./authentication/AuthRoutes");
app.use("/api/auth", authRoutes);


// MongoDB connection
mongoose
  .connect("mongodb+srv://namansahu31:Naman%23123@cluster0.cpq7yw0.mongodb.net/scorecard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Middleware

app.use(cors());

// Routes
app.get("/", (req, res) => res.send("API running"));
app.use("/api/matches", matchRoutes);

// HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET"] } });

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
});

// Emit live matches every 30s (for real-time feature)
setInterval(async () => {
  const liveMatches = await Match.find({ isLive: true });
  const liveCount = liveMatches.length;
  const timestamp = new Date().toLocaleTimeString();
  io.emit("matchUpdated", { liveMatches, liveCount, timestamp });
  console.log(`📡 Emitted ${liveCount} live matches at ${timestamp}`);
}, 3000000);// i increasin thr time

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
 */