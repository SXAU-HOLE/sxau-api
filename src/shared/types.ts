import { AxiosResponse } from "axios"
import { Request, Response } from "express"

export interface IQuery {
  req: Request
  res: Response
}

export interface IAnswer {
  body?: AxiosResponse["data"]

  cookie?: string[]

  status?: number

  config?: AxiosResponse["config"]

  headers: AxiosResponse["headers"]
}
