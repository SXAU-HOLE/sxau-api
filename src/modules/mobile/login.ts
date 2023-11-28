import { Request, Response } from "express"
import axios from "axios"
import { encrypt } from "../../utils/encrypt"

export default async function (req: Request, res: Response) {
  const username = req.query?.username
  const password = req.query?.password as string

  console.log(req.query)

  const pwd = encrypt(password)

  const url = `http://jwglxtyd.sxau.edu.cn:8080/njwhd/login?userNo=${username}&pwd=${pwd}&encode=1&captchaData=&codeVal=`

  try {
    const { data } = await axios.post(url, {})
    return data
  } catch (err) {
    throw new Error("请联系管理员，服务器出错啦~")
  }
}
