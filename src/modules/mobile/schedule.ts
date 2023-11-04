import axios from "axios"

export default async function (req: Request, res: Response) {
  const url =
    "http://jwglxtyd.sxau.edu.cn:8080/njwhd/student/curriculum?week=&kbjcmsid="

  const { data } = await axios.get(url, {
    headers: {
      Token: req.headers.token,
    },
  })

  return data
}
