import axios from "axios"
import { Request, Response } from "express"
import request from "../utils/request"
import { transform_empty_list } from "../shared/util"

const url = "http://jwglxt.sxau.edu.cn/jsxsd/kbcx/kbxx_classroom_ifr"

/**
 * data[i][j] i -> 星期几 j -> 第几大节课
 */

export default async function (req: Request, res: Response) {
  const week = req.query?.week || 1

  const params = {
    xnxqh: "2023-2024-1",
    kbjcmsid: "ACFC9E767C0F45E98E45C1A987E56230",
    skyx: "",
    xqid: "001",
    jzwid: 5,
    jxlvalue: 5,
    skjsid: "",
    skjs: "",
    jsid: "",
    zc1: week,
    zc2: week,
    skxq1: 1,
    skxq2: 7,
    jc1: "",
    jc2: "",
  }

  const ans = await request({ url, method: "POST", params }, { req, res })

  return transform_empty_list(ans.body)
}
