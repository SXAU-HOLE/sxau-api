import axios from 'axios'

// import { encodeInp } from './utils'

const url = 'http://sso.sxau.edu.cn/sso-server/login?service=http://ehall.sxau.edu.cn%2Fshall%2Flogin%3Ftoken%3D6016940192d349f1a6a6702f85bf9b24'
const img_url = 'http://sso.sxau.edu.cn/sso-server/captcha_img'
const login_url = 'http://jwglxt.sxau.edu.cn/jsxsd/'

async function login_verify() {
  get_login_cookie()
}
async function get_login_cookie() {
  const res = await axios.get(login_url)
  console.log(res)
}
login_verify()
