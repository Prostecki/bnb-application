import { Hono } from "hono";
import {
  getPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
  getMyPropertiesController,
  getPropertyBookingsController,
} from "./properties.controller.js";
import { jwtMiddleware } from "../../middleware/jwt.js";

const propertiesRouter = new Hono();

// Public routes
propertiesRouter.get("/", getPropertiesController);

// Protected routes
propertiesRouter.get("/me", jwtMiddleware, getMyPropertiesController);

// Public routes
propertiesRouter.get("/:id", getPropertyByIdController);
propertiesRouter.get("/:id/bookings", getPropertyBookingsController);

// Protected routes
propertiesRouter.post("/", jwtMiddleware, createPropertyController);
propertiesRouter.put("/:id", jwtMiddleware, updatePropertyController);
propertiesRouter.delete("/:id", jwtMiddleware, deletePropertyController);

export default propertiesRouter;
