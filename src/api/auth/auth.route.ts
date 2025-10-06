import { Hono } from "hono";
import { signUpController, signInController } from "./auth.controller.js";

const authRouter = new Hono();

authRouter.post("/signup", signUpController);
authRouter.post("/signin", signInController);

export default authRouter;
