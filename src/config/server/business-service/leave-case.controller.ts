import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'leaveCaseController'

export default {
  /**
   * 查询委外留案审批案件
   */
  getLeaveCaseInfoAll: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getLeaveCaseInfoAll',
    type: requestType.Get
  },
  /**
   * 委外留案审批
   */
  saveApprovaLeaveCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveApprovaLeaveCase',
    type: requestType.Post
  },
  /**
   * 委外留案审批
   */
  leaveCaseApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveCaseApply',
    type: requestType.Post
  }
}
