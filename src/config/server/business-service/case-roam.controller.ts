import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'CaseRoamController'

export default {
  /**
   * 案件流转申请
   */
  CaseRecordInfoApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'CaseRecordInfoApply',
    type: requestType.Post
  },
  /**
   * 流转案件进行审批
   */
  ApprovalCaseRecordApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'ApprovalCaseRecordApply',
    type: requestType.Post
  },
  /**
   * 获取该用户名下所有待审批的流转案件
   */
  getCaseRecordApplyInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseRecordApplyInfo',
    type: requestType.Get
  },
}
