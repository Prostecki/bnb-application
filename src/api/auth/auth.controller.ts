import { type Context } from "hono";
import { signUpUser, signInUser } from "./auth.service.js";

export const signUpController = async (c: Context) => {
  try {
    const credentials = await c.req.json();
    const data = await signUpUser(credentials);
    return c.json(data, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const signInController = async (c: Context) => {
  try {
    const credentials = await c.req.json();
    const data = await signInUser(credentials);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
};
