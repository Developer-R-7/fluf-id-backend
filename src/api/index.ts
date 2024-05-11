import { Router } from "express";
import authRouter from "./auth/auth-router";
import userRouter from "./user/user-router";
import appRouter from "./app/app-router";

const routes = [
  { path: "/auth", router: authRouter },
  { path: "/user", router: userRouter },
  { path: "/app", router: appRouter },
];

export default (): Router => {
  const app = Router();
  routes.forEach((route) => {
    app.use(route.path, route.router);
  });

  return app;
};
