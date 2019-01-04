import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'CaseInfoInquiryController'

export default {
  /**
   * 短信催收列表
   */
  getCaseInfoByNoPower: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoByNoPower',
    type: requestType.Get
  },
  /**
   * PC电催和外访
   */
  getCaseInfoByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoByCondition',
    type: requestType.Get
  },
  /**
   * PC协催
   */
  getCaseAssistByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseAssistByCondition',
    type: requestType.Get
  },
  /**
   * 内催按批次号查询催收中案件
   */
  getInnerCaseInfoByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getInnerCaseInfoByCondition',
    type: requestType.Get
  },
  /**
   * 获取产品系列和产品名称
   */
  getProductSeries: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getProductSeries',
    type: requestType.Get
  },
  /**
   * 查询内催待分配
   */
  getInnerWaitCollectCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getInnerWaitCollectCase',
    type: requestType.Get
  },
  /**
   * 多条件查询司法案件
   */
  getCaseInfoJudicialByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoJudicialByCondition',
    type: requestType.Get
  },
  /**
   * 多条件查询修复案件
   */
  getAllRepairingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRepairingCase',
    type: requestType.Get
  },
  /**
  * 查询流转记录
  */
  getCaseTurnRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseTurnRecord',
    type: requestType.Get
  },
  /**
   * 特殊案件待分配
   */
  getWaitCaseByPoolType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getWaitCaseByPoolType',
    type: requestType.Get
  },
  /**
   * 特殊案件催收中、归C、已结清
   */
  getCaseByPoolTypeAndCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseByPoolTypeAndCondition',
    type: requestType.Get
  }
}
