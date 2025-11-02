import { Hono } from "hono";
import {
  getBookingsController,
  getBookingByIdController,
  createBookingController,
  deleteBookingController,
  updateBookingController,
} from "./bookings.controller.js";
import { jwtMiddleware } from "../../middleware/jwt.js";

const bookingsRouter = new Hono();

// Route for creating booking (authentication required)
bookingsRouter.post("/", jwtMiddleware, createBookingController);

// Routes that require authentication
bookingsRouter.get("/", jwtMiddleware, getBookingsController);
bookingsRouter.get("/:id", jwtMiddleware, getBookingByIdController);
bookingsRouter.delete("/:id", jwtMiddleware, deleteBookingController);
bookingsRouter.patch("/:id", jwtMiddleware, updateBookingController);

export default bookingsRouter;
