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

// it allows to see properties for logged users
// propertiesRouter.use("/*", jwtMiddleware);

propertiesRouter.get("/", getPropertiesController);
propertiesRouter.get("/:id", getPropertyByIdController);
propertiesRouter.post("/", createPropertyController);
propertiesRouter.put("/:id", updatePropertyController);
propertiesRouter.delete("/:id", deletePropertyController);

export default propertiesRouter;
