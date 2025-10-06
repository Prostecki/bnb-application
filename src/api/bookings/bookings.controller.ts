import { type Context } from "hono";
import * as bookingService from "./bookings.service.js";

export const getBookingsController = async (c: Context) => {
  const data = await bookingService.getBookings();
  return c.json(data);
};

export const getBookingByIdController = async (c: Context) => {
  const { id } = c.req.param();
  const data = await bookingService.getBookingById(id);
  return c.json(data);
};

export const createBookingController = async (c: Context) => {
  const body = await c.req.json();
  const data = await bookingService.createBooking(body);
  return c.json(data, 201);
};

export const updateBookingController = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await bookingService.updateBooking(id, body);
  return c.json(data);
};

export const deleteBookingController = async (c: Context) => {
  const { id } = c.req.param();
  const data = await bookingService.deleteBooking(id);
  return c.json(data);
};
