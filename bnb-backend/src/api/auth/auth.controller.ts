import { type Context } from "hono";
import {
  signUpUser,
  signInUser,
  forgotPasswordService,
  signOutService,
  getCurrentUser,
} from "./auth.service.js";
import type { UserCredentials } from "../../models/user.model.ts";

export const signUpController = async (c: Context) => {
  try {
    const credentials = await c.req.json<UserCredentials>();
    const data = await signUpUser(credentials);
    return c.json(data, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const signInController = async (c: Context) => {
  try {
    const credentials = await c.req.json<Omit<UserCredentials, "name">>();
    const data = await signInUser(credentials);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
};

export const forgotPasswordController = async (c: Context) => {
  try {
    const { email } = await c.req.json<{ email: string }>();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    await forgotPasswordService(email);
    return c.json({ message: "Password reset email sent" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const resetPasswordController = async (c: Context) => {
  try {
    const { email } = await c.req.json<{ email: string }>();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    await forgotPasswordService(email);
    return c.json({ message: "Password reset email sent" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
export const signOutController = async (c: Context) => {
  try {
    await signOutService();
    return c.json({ message: "Signed out successfully" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getMeController = async (c: Context) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Получаем актуальные данные пользователя из базы данных
    const userData = await getCurrentUser(token);

    return c.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.is_admin,
    });
  } catch (error: any) {
    console.error("Error in getMeController:", error.message);
    return c.json({ error: "Failed to get user information" }, 401);
  }
};
