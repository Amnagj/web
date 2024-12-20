import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// Middleware to check if the user is authenticated
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Get token from cookies
  if (!token) return next(createError(401, "You are not authenticated"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));

    req.user = user; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to check if the user is an admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized"));
    }
  });
};
