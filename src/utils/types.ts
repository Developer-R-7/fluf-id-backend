import { Router, Request } from "express";

export type RouteType = {
  path: string;
  router: Router;
};

export type RequestPart = "body" | "query" | "params";

export interface jwtReq extends Request {
  user: {
    id: string;
    name: string;
    lastLogin: Date;
    walletAddress: string;
  };
}
