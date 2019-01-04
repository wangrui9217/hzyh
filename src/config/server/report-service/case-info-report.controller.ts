import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'caseInfoReportController'

export default {
  /**
   * PC待分配案件查询
   */
  queryWaitDistributed: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryWaitDistributed',
    type: requestType.Get
  },
  /**
   * PC催收中案件查询
   */
  queryCollectingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCollectingCase',
    type: requestType.Get
  },
  /**
   * 内催已结案案件查询
   */
  queryCaseOver: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCaseOver',
    type: requestType.Get
  },
  /**
   * 案件查找查询
   */
  queryCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCaseInfo',
    type: requestType.Get
  },  
  /**
   * 提醒逾期案件的最近已还款
   */
  queryLatelyPayCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryLatelyPayCase',
    type: requestType.Get
  },
  /**
   * 提醒逾期案件的剥离案件
   */
  queryStrippingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryStrippingCase',
    type: requestType.Get
  }
}
