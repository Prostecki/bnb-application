import { type Context } from "hono";
import * as bookingService from "./bookings.service.js";

export const createBookingController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");
    const userId = payload.sub;
    const data = await bookingService.createBooking(body, userId);
    return c.json(data, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const getBookingsController = async (c: Context) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload.sub;
    const data = await bookingService.getBookings(userId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getBookingByIdController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const payload = c.get("jwtPayload");
    const userId = payload.sub;
    const data = await bookingService.getBookingById(id, userId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 404);
  }
};

export const deleteBookingController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const payload = c.get("jwtPayload");
    const userId = payload.sub;
    const data = await bookingService.deleteBooking(id, userId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
