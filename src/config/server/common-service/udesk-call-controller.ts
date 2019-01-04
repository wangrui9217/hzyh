import { requestType } from '~/config/enum.config'

const SERVICE = 'common-service'
const CONTROLLER = 'udeskCallController'

export default {
  /**
   * 开始电话呼叫
   */
  callByPhoneNum: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'callByPhoneNum',
    type: requestType.Get
  }
}
