import { Request, Response } from "express";
import axios from "axios";
import encodeInp from "../utils/encode";
import qs from "qs";

const login_url: string = "http://jwglxt.sxau.edu.cn/jsxsd/xk/LoginToXk";
const index_url: string =
  "http://jwglxt.sxau.edu.cn/jsxsd/framework/xsMainV.htmlx";

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

  const cookie = await getCookie();

  return login_verify(
    {
      loginMethod: "LoginToXk",
      userAccount: username,
      encoded,
    },
    cookie
  );
}

async function getCookie() {
  const res = await axios.get("http://jwglxt.sxau.edu.cn/jsxsd/");
  return res?.headers?.["set-cookie"]?.[0];
}

async function login_verify(data: any, cookie: string | undefined) {
  console.log(data);

  if (!cookie) {
    return;
  }

  try {
    const res = await axios({
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      },
      data: qs.stringify(data),
      url: login_url,
      maxRedirects: 200,
    });

    return res.data;
  } catch (err) {
    console.error(err);

    return {
      code: 500,
      msg: "服务器出问题啦~",
    };
  }

  // console.log(res.headers?.["set-cookie"][0]);

  // axios({
  //   headers: {
  //     cookie: cookie,
  //   },
  // });
  // const profile_url = "http://jwglxt.sxau.edu.cn/jsxsd/bygl/bygl_ckxsList";

  // const { data: profile } = await axios.get(profile_url, {
  //   headers: {
  //     cookie: "6B6639B2E4B0EC4F4B37B2170365B2A7",
  //   },
  // });

  // return profile;
}
