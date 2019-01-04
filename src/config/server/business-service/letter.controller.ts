import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'letterController'

export default {
  /**
   * 查询案件
   */
  getCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfo',
    type: requestType.Get
  },
  /**
 * 打印信函申请
 */
  applyLetter: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'applyLetter',
    type: requestType.Post
  }
}
