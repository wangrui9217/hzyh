module.exports = {
  URL: {
    SERVER: JSON.stringify("http://192.191.0.40:9000"),
    ATTACH: JSON.stringify("http://116.236.220.210:8081")
  },
  RABBITMQ: {
    SOCKET: JSON.stringify("ws://192.191.0.40:15674/ws"),
    VHOST: JSON.stringify("admin"),
    USERNAME: JSON.stringify("admin"),
    PASSWORD: JSON.stringify("admin"),
    EXCHANGE: JSON.stringify("/exchange/oss")
  }
}
