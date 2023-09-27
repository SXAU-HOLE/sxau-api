import { Request, Response } from "express";
import axios from "axios";
import encodeInp from "../utils/encode";
import qs from "qs";
import * as cheerio from "cheerio";

const login_url: string = "http://jwglxt.sxau.edu.cn/jsxsd/xk/LoginToXk";
let cookie: string | undefined;

async function getCookie() {
  const res = await axios.get("http://jwglxt.sxau.edu.cn/jsxsd/");
  return res?.headers?.["set-cookie"]?.[0];
}

export default async function login(req: Request, res: Response) {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return {
      code: 400,
      msg: "用户名或密码不能为空",
    };
  }
  const encoded = encodeInp(username) + "%%%" + encodeInp(password);

  cookie = await getCookie();

  return login_verify(
    {
      loginMethod: "LoginToXk",
      userAccount: username,
      userPassword: "",
      encoded,
    },
    cookie
  );
}

async function active_cookie(data: any): Promise<boolean> {
  const header = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh,zh-CN;q=0.9,en;q=0.8",
    "Cache-Control": "max-age=0",
    "Content-Length": "109",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: cookie,
    Host: "jwglxt.sxau.edu.cn",
    Origin: "http://jwglxt.sxau.edu.cn",
    "Proxy-Connection": "keep-alive",
    Referer: "http://jwglxt.sxau.edu.cn/jsxsd/",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  };
  const res = await axios({
    method: "POST",
    headers: header,
    data: qs.stringify(data),
    url: login_url,
  });

  // 登陆成功重定向到这个页面
  return res.request.path === "/jsxsd/framework/xsMainV.htmlx";
}

async function getProfile() {
  const header2 = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh,zh-CN;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    Cookie: cookie,
    Host: "jwglxt.sxau.edu.cn",
    Referer: "http://jwglxt.sxau.edu.cn/jsxsd/framework/xsMainV.htmlx",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  };

  const { data: profile } = await axios({
    method: "GET",
    headers: header2,
    url: "http://jwglxt.sxau.edu.cn/jsxsd/grxx/xsxx",
  });

  const $ = cheerio.load(profile);
  const u_college = $('#xjkpTable td:contains("院系：")').text().split("：")[1];
  const u_major = $('#xjkpTable td:contains("专业：")').text().split("：")[1];
  const u_class = $('#xjkpTable td:contains("班级：")').text().split("：")[1];
  const u_name = $('#xjkpTable td:contains("姓名"):first')
    .next("td")
    .text()
    .trim();

  return {
    code: 200,
    data: {
      u_college,
      u_major,
      u_class,
      u_name,
    },
    msg: "获取信息成功！",
  };
}

async function login_verify(data: any, cookie: string | undefined) {
  if (!cookie) {
    return;
  }

  try {
    const is_login = await active_cookie(data);

    if (!is_login) {
      return {
        code: 401,
        msg: "账号或密码错误",
      };
    }

    const profile = await getProfile();

    return profile;
  } catch (err) {
    console.error(err);

    return {
      code: 500,
      msg: "服务器出问题啦~",
    };
  }
}
