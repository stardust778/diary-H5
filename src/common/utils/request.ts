import 
axios, 
{ AxiosRequestConfig, 
  AxiosInstance, 
  AxiosResponse,
  AxiosError
} from 'axios';
import { Toast } from 'zarm';

type Result<T> = {
  code: number;
  msg: string;
  data: T;
}

const MODE = import.meta.env.MODE  // 环境变量

export class Request {
  private baseConfig: AxiosRequestConfig = {
    baseURL: MODE === 'development' ? '' : '',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `${localStorage.getItem('token')}`,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    },
    timeout: 8000
  }
  private instance: AxiosInstance = axios.create(this.baseConfig)

  public constructor() {
    this.setReqInterceptors();
    this.setResInterceptors();
  }

  // 请求拦截器
  private setReqInterceptors = () => {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = config.headers?.Authorization;
        if(token) return config;
        return Promise.reject('请求未修改token')
      },
      (err: AxiosError) => {
        Toast.show('网络请求失败');
        Promise.reject(err);
        return 
      }
    )
  }

  // 响应拦截器
  private setResInterceptors = () => {
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const { code, msg, data } = res.data;
        if(code === 200) {
          return res.data
        }
        Toast.show(msg);
        return Promise.reject(msg)
      },
      (err) => {
        let message = '';
        switch(err.response.status) {
					case 302:
						message = '重定向(302)'
						break
					case 400:
						message = '请求错误(400)'
						break
					case 401:
						message = '未授权,请重新登录'
            window.location.href = '/login'
						break
					case 403:
						message = '拒绝访问(403)'
						break
					case 404:
						message = '请求出错(404)'
						break
					case 408:
						message = '请求超时'
						break
					case 500:
						message = '服务器错误(500)'
						break
					case 501:
						message = '服未实现(501)'
						break
					case 502:
						message = '网络错误(502)'
						break
					case 503:
						message = '服务不可用(503)'
						break
					case 504:
						message = '网络超时(504)'
						break
					case 505:
						message = 'HTTP版本不支持'
						break
					default:
						message = `连接出错${err.response.status}`
				}
        Toast.show(message);
        return Promise.reject(err.response)
      }
    )
  }
  // get请求
  public get = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> => 
    this.instance({
      ...{ url, method: 'get', params: data },
      ...config,
    })
  
  // post请求
  public post = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> =>
    this.instance({
      ...{ url, method: 'post', data},
      ...config
    })
}

export default new Request();