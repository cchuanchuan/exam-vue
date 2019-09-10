import Cookies from 'js-cookie'

const TokenKey = 'exam_system_token'

export function getToken() {
  // console.log("getToken:"+Cookies.get(TokenKey))

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // console.log("setToken:"+token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // console.log("removeToken:"+TokenKey)
  return Cookies.remove(TokenKey)
}
