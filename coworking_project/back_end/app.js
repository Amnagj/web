import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./route/auth.js";
import roomRoute from "./route/roomRoutes.js";


import usersRoute from "./route/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";




const app = express();
app.use(cookieParser());
app.use(cors());
app.use(cookieParser());
dotenv.config();

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

//middlewares

app.use(express.json());
app.use(cors());


app.use("/api/user", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/rooms", roomRoute);


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

app.listen(4000, () => {
  connect();
  console.log("Connected to backend.");
});
