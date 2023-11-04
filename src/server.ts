import { Express } from "express"
import * as fs from "fs"
import login from "./modules/login"
import MobileLogin from "./modules/mobile/login"
import MobileSchedule from "./modules/mobile/schedule"

async function getModule(mobile = false) {
  let files: string[] = []

  const dirRoot = `./src/modules${mobile ? "/mobile" : ""}`

  await fs.promises.readdir(dirRoot).then((res: string[]) => {
    files = res
  })

  return files
    .filter((item) => item.endsWith(".ts"))
    .map((file) => {
      const fileName = file.replace(".ts", "")

      const module = require(`./modules/${
        mobile ? "mobile/" : ""
      }${fileName}`).default
      console.log(fileName, module)

      return { module }
    })
}

async function setupRoute(app: Express) {
  const routes = [await getModule(), await getModule(true)]
  // console.log(routes);
  app.post("/login", async (req, res) => {
    res.send(await login(req, res))
  })
  app.post("/mobile/login", async (req, res) => {
    res.send(await MobileLogin(req, res))
  })
  app.get("/mobile/schedule", async (req, res) => {
    res.send(await MobileSchedule(req, res))
  })
}

export async function setupServer(app: Express) {
  setupRoute(app)
}
