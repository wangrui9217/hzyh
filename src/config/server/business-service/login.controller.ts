import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'login'

export default {
  /**
   * 账号密码登录
   */
  login: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'login',
    type: requestType.Post
  },
  /**
   * token登录
   */
  getUserByToken: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUserByToken',
    type: requestType.Get
  },
  /**
   * 重置密码
   */
  resetPassword: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'resetPassword',
    type: requestType.Post
  },
  /**
   * 修改密码
   */
  updatePassword: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updatePassword',
    type: requestType.Post
  },
  /**
   * 启用禁用设备
   */
  disableDevice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'disableDevice',
    type: requestType.Post
  },
  /**
   * 启用禁用设备锁
   */
  enableDeviceKey: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'enableDeviceKey',
    type: requestType.Post
  },
  /**
   * 重置设备
   */
  resetDevice: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'resetDevice',
    type: requestType.Post
  }
}
