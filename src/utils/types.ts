import { Router, Request } from "express";

export type RouteType = {
  path: string;
  router: Router;
};

export type RequestPart = "body" | "query" | "params";

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

export interface jwtReq extends Request {
  user: User;
}
