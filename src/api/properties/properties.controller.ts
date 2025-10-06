import { type Context } from "hono";
import * as propertyService from "./properties.service.js";

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
  const body = await c.req.json();
  const data = await propertyService.createProperty(body);
  return c.json(data, 201);
};

export const updatePropertyController = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const data = await propertyService.updateProperty(id, body);
  return c.json(data);
};

export const deletePropertyController = async (c: Context) => {
  const { id } = c.req.param();
  const data = await propertyService.deleteProperty(id);
  return c.json(data);
};
