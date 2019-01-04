import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoJudicialController'

export default {
  /**
   * 司法审批案件查询
   */
  caseInfoJudicial: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'caseInfoJudicial',
    type: requestType.Get
  },
  /**
   * 案件申请审批通过
   */
  caseInfoJudicialApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'caseInfoJudicialApply',
    type: requestType.Post
  },
  /**
   * 司法审批通过案件查询
   */
  getCaseInfoJudicial: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoJudicial',
    type: requestType.Get
  },
  /**
   * 审批待通过案件查询
   */
  getCaseInfoJudicialApproval: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoJudicialApproval',
    type: requestType.Get
  },
  /**
   * 案件申请司法审批
   */
  saveCaseInfoJudicial: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveCaseInfoJudicial',
    type: requestType.Post
  }
}
