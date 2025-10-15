import { type Context } from "hono";
import * as bookingService from "./bookings.service.js";

export const createBookingController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payload = c.get("jwtPayload"); // This might be undefined if not authenticated
    const userId = payload ? payload.sub : null; // Get userId if authenticated, else null
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
    const userId = payload ? payload.sub : null;
    const { guestEmail, guestPhoneNumber } = await c.req.json<{
      guestEmail?: string;
      guestPhoneNumber?: string;
    }>();
    const data = await bookingService.deleteBooking(
      id,
      userId,
      guestEmail,
      guestPhoneNumber
    );
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const updateBookingController = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const payload = c.get("jwtPayload");
    const userId = payload.sub;

    const body = await c.req.json();

    const data = await bookingService.updateBooking(id, userId, body);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
