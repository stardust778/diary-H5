const MODE = import.meta.env.MODE;  // 环境变量
export const baseUrl = MODE === 'development' ? 'api' : 'http://api.chennick.wang';

export const imgUrlTrans = (url: string | undefined) => {
  if(url && url.startsWith('http')) {
    return url
  } else {
    url = `${MODE == 'development' ? 'http://api.chennick.wang' : baseUrl}${url}`
    return url
  }
}