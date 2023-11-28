import { Express, Request, Response, query } from "express"
import * as fs from "fs"

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
      let route = "/" + fileName

      let get = false
      if (fileName.includes("get")) {
        get = true

        route = route.replace("get_", "")
      }

      if (mobile) {
        route = "/mobile" + route
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require(`./modules/${
        mobile ? "mobile/" : ""
      }${fileName}`).default

      return { module, get, route }
    })
}

async function routerHandler(req: Request, res: Response, item: any) {
  const moduleResponse = await item.module(req, res)
  res.send(moduleResponse)
}

async function setupRoute(app: Express) {
  const routes = [...(await getModule()), ...(await getModule(true))]
  console.log(routes)

  routes.forEach((item) => {
    console.log(item.module)

    if (item.get) {
      app.get(item.route, (req, res) => routerHandler(req, res, item))
    } else {
      app.post(item.route, (req, res) => routerHandler(req, res, item))
    }
  })

  app.get("/test", (req, res) => {
    res.send("test")
  })
}

export async function setupServer(app: Express) {
  setupRoute(app)
}
