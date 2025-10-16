import { type Context } from "hono";
import * as propertyService from "./properties.service.js";
import * as bookingService from "../bookings/bookings.service.js";
import type { Property } from "../../models/property.model.js";

export const getPropertiesController = async (c: Context) => {
  const data = await propertyService.getProperties();
  return c.json(data);
};

export const getMyPropertiesController = async (c: Context) => {
  const payload = c.get("jwtPayload");
  const userId = payload.sub;
  const data = await propertyService.getPropertiesByUserId(userId);
  return c.json(data);
};

export const getPropertyByIdController = async (c: Context) => {
  const { id } = c.req.param();
  const data = await propertyService.getPropertyById(id);
  return c.json(data);
};

export const getBookingsByPropertyIdController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const data = await bookingService.getBookingsByPropertyId(id);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const createPropertyController = async (c: Context) => {
  const body = await c.req.json<Omit<Property, "id" | "userId">>();
  const payload = c.get("jwtPayload");
  const userId = payload.sub;
  const data = await propertyService.createProperty(body, userId);
  return c.json(data, 201);
};

export const updatePropertyController = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json<Partial<Property>>();
  const payload = c.get("jwtPayload");
  const userId = payload.sub;
  const data = await propertyService.updateProperty(id, body, userId);
  return c.json(data);
};

export const deletePropertyController = async (c: Context) => {
  const { id } = c.req.param();
  const payload = c.get("jwtPayload");
  const userId = payload.sub;
  const data = await propertyService.deleteProperty(id, userId);
  return c.json(data);
};

export const getPropertyBookingsController = async (c: Context) => {
  try {
    const propertyId = c.req.param("id");
    // Import bookingService here to avoid circular dependencies
    const { getBookingsByPropertyId } = await import(
      "../bookings/bookings.service.js"
    );
    const data = await getBookingsByPropertyId(propertyId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
