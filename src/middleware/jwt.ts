import { jwt } from 'hono/jwt';
import { type Context, type Next } from 'hono';

export const jwtMiddleware = (c: Context, next: Next) => {
  const middleware = jwt({
    secret: process.env.SUPABASE_JWT_SECRET!,
  });
  return middleware(c, next);
};

export const getUserInfo = (c: Context) => {
  const payload = c.get('jwtPayload');
  return c.json({
    message: "You are authorized!",
    user_info_from_token: payload
  });
};
