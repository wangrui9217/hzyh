import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseAssistApplyController'

export default {
  /**
   * 协催申请电催审批
   */
  assistApplyTelApprove: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assistApplyTelApprove',
    type: requestType.Post
  },
  /**
   * 协催申请外访审批
   */
  assistApplyVisitApprove: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assistApplyVisitApprove',
    type: requestType.Post
  },
  /**
   * 电催审批协催申请页面条件查询
   */
  findAllApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllApply',
    type: requestType.Get
  },
  /**
   * 协催申请外访审批
   */
  findAllTelPassedApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllTelPassedApply',
    type: requestType.Get
  }
}
