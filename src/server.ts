import { Express } from "express";
import * as fs from "fs";
import login from "./modules/login";

async function getModule() {
  let files: string[] = [];

  const dirRoot = "./src/modules";

  await fs.promises.readdir(dirRoot).then((res: string[]) => {
    files = res;
  });

  return files.map((file) => {});
}

async function setupRoute(app: Express) {
  // const routes = await getModule();
  // console.log(routes);
  app.post("/login", async (req, res) => {
    res.send(await login(req, res));
  });
}

export async function setupServer(app: Express) {
  setupRoute(app);
}
