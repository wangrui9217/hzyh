import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'caseInfoDistributeController'

export default {
  /**
   * 案件导入待分配
   */
  findCaseInfoDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCaseInfoDistribute',
    type: requestType.Post
  },
  get_case_info_distributed_details: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoDistributedDetails',
    type: requestType.Get
  }
}
