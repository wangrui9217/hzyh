import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'appRegisterController'

export default {
  /**
   * 新增app消息推送注册服务
   */
  saveAppRegister: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveAppRegister',
    type: requestType.Post
  }
}
