import { Request, Response } from "express"
import axios from "axios"

export default async function (req: Request, res: Response) {
  const query = req.query

  const url = `http://jwglxtyd.sxau.edu.cn:8080/njwhd/student/curriculum?week=${query.week}`

  const { data } = await axios.get(url, {
    headers: {
      Token: req.headers.token,
    },
  })

  return data
}
