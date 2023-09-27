import { Express } from "express";

export function setupRoute(app: Express) {
  app.post("/login", login);
}
