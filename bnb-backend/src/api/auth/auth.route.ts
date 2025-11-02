import { Hono } from "hono";
import {
  signUpController,
  signInController,
  forgotPasswordController,
  resetPasswordController,
  signOutController,
  getMeController,
  updateProfileController,
} from "./auth.controller.js";

const authRouter = new Hono();

authRouter.post("/signup", signUpController);
authRouter.post("/signin", signInController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.post("/signout", signOutController);
authRouter.get("/me", getMeController);
authRouter.patch("/profile", updateProfileController);

export default authRouter;
