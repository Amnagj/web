import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./route/auth.js";
import roomRoute from "./route/roomRoutes.js";
import usersRoute from "./route/user.js";
import adminRoute from "./route/admin.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactRoute from "./route/contact.js"; // Import the contact route
import graphRoutes from './route/graph.js';
import path from "path";
dotenv.config();
const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Spécifiez l'origine autorisée
  credentials: true, // Permet les cookies et les informations d'authentification
};

app.use(cors(corsOptions)); // Utilisez les options CORS configurées

// Middlewares
app.use(cookieParser());

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Routes
app.use("/api/user", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/admin", adminRoute);
app.use('/api/contact', contactRoute);
app.use('/api/graph', graphRoutes);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Servir les fichiers statiques à partir du dossier public/graphs
app.use('/graphs', express.static(path.join(__dirname, './public/graphs/graphs')));

// Autres routes ici (exemple)
app.get('/contact', (req, res) => {
  res.send('Contact Page');
});


// Error-handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Start server
app.listen(4000, () => {
  connect();
  console.log("Connected to backend.");
});
// Route to get the email of the last logged-in user
import contactRoutes from "./route/contact.js";
// Use the contact routes
app.use("/api/contacts", contactRoutes);
