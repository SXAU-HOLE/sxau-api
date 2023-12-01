import axios, { AxiosRequestConfig } from "axios"
import { IAnswer, IQuery } from "../shared/types"

export function createRequest() {
  return (options: AxiosRequestConfig, query?: IQuery): Promise<IAnswer> => {
    console.log(query?.req.headers.cookie)

    const headers = {
      ...(options.headers || {}),
      cookie: query.req?.headers?.cookie || "",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
    }

    return new Promise((resolve, reject) => {
      const config = {
        method: "get",
        maxRedirects: 0,
        ...options,
        headers,
      } as AxiosRequestConfig

      const answer: IAnswer = Object.create(null)
      axios(config).then((res) => {
        const body = res.data
        answer.body = body

        answer.cookie = res.headers["set-cookie"] || []

        answer.config = res.config

        answer.status = body?.status || res?.status

        answer.headers = res.headers

        resolve(answer)
      })
    })
  }
}

const request = createRequest()

export default request
