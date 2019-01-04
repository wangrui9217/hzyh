import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseOutboundApplyController'

export default {
  /**
   * 申请外访审批列表 type外访1电催0
   */
  findAllPassedApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllPassedApply',
    type: requestType.Get
  },
  /**
   * 外访申请外访审批
   */
  visitApplyVisitApprove : {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitApplyVisitApprove',
    type: requestType.Post
  },
  /**
   * 外访申请电催审批
   */
  visitApplyTelApprove  : {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitApplyTelApprove',
    type: requestType.Post
  }
}
