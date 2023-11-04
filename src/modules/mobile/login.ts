import { Request, Response } from "express"
import axios from "axios"
import { encrypt } from "../../utils/encrypt"

export default async function (req: Request, res: Response) {
  const username = req.query.username
  const password = req.query.password as string

  const pwd = encrypt(password)

  const url = `http://jwglxtyd.sxau.edu.cn:8080/njwhd/login?userNo=${username}&pwd=${pwd}&encode=1&captchaData=&codeVal=`

  const { data } = await axios.post(url)

  return data
}
