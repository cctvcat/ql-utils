import fs from 'fs'
import axios, { AxiosRequestConfig } from 'axios'
import { authenticator } from '@otplib/preset-default'

const BUILD_FLAG = Symbol('build')

export class Ql {
  request = axios.create({
    timeout: 15 * 1000,
    baseURL: `http://127.0.0.1:${process.env['QL_PORT'] || '5700'}`,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36 Edg/94.0.992.38',
    },
  })

  static async build(token?: string) {
    const instance = new Ql(BUILD_FLAG)
    instance.setToken(token || (await instance.getToken()))
    return instance
  }

  constructor(buildFlag = BUILD_FLAG) {
    if (buildFlag !== BUILD_FLAG) {
      throw new Error('请用build函数去获取新的实例')
    }
  }

  get(url: string, config?: AxiosRequestConfig<any>) {
    return this.request.get(url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return this.request.post(url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return this.request.put(url, data, config)
  }

  delete(url: string, config?: AxiosRequestConfig<any>) {
    return this.request.delete(url, config)
  }

  setUrl(url: string) {
    this.request.defaults.baseURL = url
  }

  setPort(port: string | number) {
    this.request.defaults.baseURL = `http://127.0.0.1:${port}`
  }

  setToken(token: string) {
    this.request.defaults.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }

  async getToken(): Promise<string> {
    try {
      let path = '/ql/config/auth.json'
      if (!fs.existsSync(path)) {
        path = '/ql/data/config/auth.json' //新版本青龙地址
      }

      if (!fs.existsSync(path)) {
        return ''
      }

      const auth = JSON.parse(fs.readFileSync(path).toString())
      const token = auth.token
      if (!token || !(await this.isTokenAlive(token))) {
        return await this.login(
          auth.username,
          auth.password,
          auth.twoFactorSecret
        )
      }

      return token
    } catch (error) {
      console.log(error)
    }

    return ''
  }

  async login(
    username: string,
    password: string,
    twoFactorSecret?: string,
    old = false
  ): Promise<string> {
    try {
      const data: Record<string, any> = {
        username,
        password,
      }

      let res = await this.post(old ? `api/login` : `/api/user/login`, data)
      if (res.status === 200 && res.data.code === 200) {
        return res.data.data.token as string
      }

      if (res.status === 200 && res.data.code === 420) {
        data.code = authenticator.generate(twoFactorSecret || '')
        res = await this.put(`/api/user/two-factor/login`, data)
        if (res.status === 200 && res.data.code === 200) {
          return res.data.data.token as string
        }
      }

      if (res.status === 404 && !old) {
        return (await this.login(
          username,
          password,
          twoFactorSecret,
          true
        )) as string
      }
    } catch (e) {}

    return ''
  }

  async isTokenAlive(token: string) {
    try {
      const res = await this.get('/api/user', {
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        },
      })
      return res.status === 200
    } catch (e) {
      return false
    }
  }
}

export const ql = Ql
