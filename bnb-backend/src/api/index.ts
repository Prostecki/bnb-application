import { Hono } from "hono";
import authRouter from "./auth/auth.route.js";
import propertiesRouter from "./properties/properties.route.js";
import bookingsRouter from "./bookings/bookings.route.js";
import { getUserInfo, jwtMiddleware } from "../middleware/jwt.js";

const apiRouter = new Hono();

apiRouter.route("/auth", authRouter);
apiRouter.route("/properties", propertiesRouter);
apiRouter.route("/bookings", bookingsRouter);

apiRouter.use("/me", jwtMiddleware);
apiRouter.get("/me", getUserInfo);

export default apiRouter;
