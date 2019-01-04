import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'appRegisterResource'

export default {
  /**
   * 新增app注册服务
   */
  addAppRegister: {
    service: SERVICE,
    controller: CONTROLLER,
    type: requestType.Post
  },
  /**
   * 查询app注册服务通过id
   */
  getAppRegisterById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAppRegisterById',
    type: requestType.Get
  }
}
