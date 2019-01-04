import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseAssistApplyProcessController'

export default {
  /**
   *   申请协催 提交
   */
  applyCaseAssistDerate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'applyCaseAssistDerate',
    type: requestType.Post
  },
  /**
   * 获取该用户名下待审批的协催案件（分页）
   */
  getAssistApplyApproval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAssistApplyApproval',
    type: requestType.Get
  },
  /**
   * 协催案件的审批
   */
  saveCaseAssistApproval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveCaseAssistApproval',
    type: requestType.Post
  },
}
