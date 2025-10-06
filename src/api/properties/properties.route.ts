import { Hono } from "hono";
import {
  getPropertiesController,
  getPropertyByIdController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from "./properties.controller.js";
import { jwtMiddleware } from "../../middleware/jwt.js";

const propertiesRouter = new Hono();

// Public routes
propertiesRouter.get("/", getPropertiesController);
propertiesRouter.get("/:id", getPropertyByIdController);

// Protected routes
propertiesRouter.post("/", jwtMiddleware, createPropertyController);
propertiesRouter.put("/:id", jwtMiddleware, updatePropertyController);
propertiesRouter.delete("/:id", jwtMiddleware, deletePropertyController);

export default propertiesRouter;
