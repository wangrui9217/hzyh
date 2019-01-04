import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'bindPhoneController'

export default {
  /**
   * 绑定呼叫ID(绑定主叫号码)
   */
  bindTaskDataByCallerId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'bindTaskDataByCallerId',
    type: requestType.Post
  }
}
