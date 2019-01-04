const customConfig = require("app-config")
const env: any = process.env

let appConfig = {
  name: '',
  version: 'V2.2.3',
  url: {
    server: env.URL.SERVER,
    attach: env.URL.ATTACH
  },
  rabbitmq: {
    socket: env.RABBITMQ.SOCKET,
    vhost: env.RABBITMQ.VHOST,
    username: env.RABBITMQ.USERNAME,
    password: env.RABBITMQ.PASSWORD,
    exchange: env.RABBITMQ.EXCHANGE
  },
  timeout: 30000,
  debug: env.ENV === 'dev'
}

// 如果存在自定义配置则启用自定义配置
if (customConfig && customConfig.enable) {
  appConfig = Object.assign(appConfig, customConfig.config)
}

export default appConfig
