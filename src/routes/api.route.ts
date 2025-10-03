import { Hono } from 'hono';
import { jwt } from 'hono/jwt';

const apiRouter = new Hono();

// Use the standard, simple JWT middleware
apiRouter.use('/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.SUPABASE_JWT_SECRET!,
  });
  return jwtMiddleware(c, next);
});

// This endpoint will now work again for any valid (unexpired) token
apiRouter.get('/me', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({
    message: "You are authorized!",
    user_info_from_token: payload
  });
});

export default apiRouter;
