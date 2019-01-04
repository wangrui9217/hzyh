import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'outbackSourceController'

export default {
  /**
   * 委外案件回款
   */
  createOutBackAmt: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createOutBackAmt',
    type: requestType.Post
  },
  /**
   * 委外页面多条件查询回款跟进记录
   */
  getOutbackFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutbackFollowupRecord',
    type: requestType.Get
  }
}
