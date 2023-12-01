import { Express, Request, Response, query, response } from "express"
import * as fs from "fs"
import { isLogin } from "./modules/login"

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
  if (item.route.includes("login")) {
    const moduleResponse = await item.module(req, res)
    res.send(moduleResponse)
    return
  }

  const cookie = req.headers.cookie as string

  isLogin(cookie).then(async (response) => {
    if (response) {
      if (cookie) {
        res.setHeader("Set-Cookie", cookie)
      }

      const moduleResponse = await item.module(req, res)
      res.send(moduleResponse)
    } else {
      res.status(401).send({
        msg: "请登陆后查看",
        code: 401,
      })
    }
  })
}

async function setupRoute(app: Express) {
  const routes = [...(await getModule()), ...(await getModule(true))]

  routes.forEach((item) => {
    console.log(item.route)

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
