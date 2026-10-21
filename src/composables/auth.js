import { useCookies } from '@vueuse/integrations/useCookies'
// cookie存储，键和值都必须是字符串！！
const Tokenkey="admin-token"
const cookie=useCookies()

export function getToken(){
    return cookie.get(Tokenkey)
}

export function setToken(token){
    return cookie.set(Tokenkey,token)
}

export function removeToken(){
    return cookie.remove(Tokenkey)
}