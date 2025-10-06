import { Hono } from "hono";
import {
  getBookingsController,
  getBookingByIdController,
  createBookingController,
  updateBookingController,
  deleteBookingController,
} from "./bookings.controller.js";
import { jwtMiddleware } from "../../middleware/jwt.js";

const bookingsRouter = new Hono();

bookingsRouter.use("/*", jwtMiddleware);

bookingsRouter.get("/", getBookingsController);
bookingsRouter.get("/:id", getBookingByIdController);
bookingsRouter.post("/", createBookingController);
bookingsRouter.put("/:id", updateBookingController);
bookingsRouter.delete("/:id", deleteBookingController);

export default bookingsRouter;
