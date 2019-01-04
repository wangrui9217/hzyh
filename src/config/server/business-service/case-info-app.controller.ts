import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoAppController'

export default {
  /**
   * 协催取消留案
   */
  cancelLeaveAssistCaseForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'cancelLeaveAssistCaseForApp',
    type: requestType.Get
  },
  /**
   * 外访取消留案
   */
  cancelLeaveVisitCaseForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'cancelLeaveVisitCaseForApp',
    type: requestType.Get
  },
  /**
   * 协催结束
   */
  endCaseAssistForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'endCaseAssistForApp',
    type: requestType.Get
  },
  /**
   * 客户查询
   */
  getPersonalCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPersonalCase',
    type: requestType.Get
  },
  /**
   * 协催案件留案操作
   */
  leaveCaseAssistForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveCaseAssistForApp',
    type: requestType.Get
  },
  /**
   * 外访案件留案操作
   */
  leaveVisitCaseForApp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveVisitCaseForApp',
    type: requestType.Get
  },
  /**
   * 附近协催抢单
   */
  nearbyCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'nearbyCase',
    type: requestType.Post
  },
  /**
   * 附近协催
   */
  nearbyOwnCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'nearbyOwnCase',
    type: requestType.Post
  },
  /**
   * 协催案件查询
   */
  queryAssistDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAssistDetail',
    type: requestType.Get
  },
  /**
   * 通过案件ID查询案件信息
   */
  queryDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryDetail',
    type: requestType.Get
  },
  /**
   * 外访案件查询
   */
  queryVisitDetail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryVisitDetail',
    type: requestType.Get
  },
  /**
   * 协催案件抢单
   */
  receiveCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'receiveCaseAssist',
    type: requestType.Get
  }
}
