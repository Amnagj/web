import express from "express";
import { 
  checkAvailability, 
  bookRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  getRoom, 
  getAllRooms 
} from "../controller/roomController.js";

const router = express.Router();

// Route to check room availability
router.post("/check-availability", checkAvailability);

// Route to book a room
router.post("/book", bookRoom);

// Route to create a new room
router.post("/", createRoom);

// Route to update a room by ID
router.put("/:id", updateRoom);

// Route to delete a room by ID
router.delete("/:id", deleteRoom);

// Route to get a single room by ID
router.get("/:id", getRoom);

// Route to get all rooms
router.get("/", getAllRooms);
// Routes using the middleware


export default router;
