import express from "./express";
import Express from "express";

export default async ({
  expressApp,
}: {
  expressApp: Express.Application;
}): Promise<void> => {
  express({ app: expressApp });
  console.log("Express loaded");
  console.log("API loaded");
};
