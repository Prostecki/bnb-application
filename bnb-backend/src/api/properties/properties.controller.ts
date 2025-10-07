import { type Context } from "hono";
import * as propertyService from "./properties.service.js";
import type { Property } from "../../models/property.model.js";

export const getPropertiesController = async (c: Context) => {
  const data = await propertyService.getProperties();
  return c.json(data);
};

export const getPropertyByIdController = async (c: Context) => {
  const { id } = c.req.param();
  const data = await propertyService.getPropertyById(id);
  return c.json(data);
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
