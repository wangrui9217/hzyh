import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseAssistController'

export default {
  /**
   * 协催案件分配
   */
  assignCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assignCaseAssist',
    type: requestType.Post
  },
  /**
   * 协催案件颜色打标
   */
  assistCaseMarkColor: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assistCaseMarkColor',
    type: requestType.Put
  },
  /**
   * 协催页面还款撤回
   */
  assistWithdraw: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assistWithdraw',
    type: requestType.Get
  },
  /**
   * 协催页面批量分配
   */
  batchCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchCaseAssist',
    type: requestType.Post
  },
  /**
   * 协催案件取消留案操作
   */
  cancelLeaveCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'cancelLeaveCaseAssist',
    type: requestType.Post
  },
  /**
   * 结束协催
   */
  closeCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'closeCaseAssist',
    type: requestType.Get
  },
  /**
   * 协催页面还款操作
   */
  doAssistPay: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'doAssistPay',
    type: requestType.Post
  },
  /**
   * 协催案件结案
   */
  endCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'endCaseAssist',
    type: requestType.Post
  },
  /**
   * 获取所有协催案件
   */
  findAllCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAllCaseAssist',
    type: requestType.Get
  },
  /**
   * 协催案件查询短信记录
   */
  findAssistCaseMessageRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAssistCaseMessageRecord',
    type: requestType.Get
  },
  /**
   * 查询还款申请/记录
   */
  findAssistCasePayRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findAssistCasePayRecord',
    type: requestType.Get
  },
  /**
   * 查询案件协催记录
   */
  findCaseInfoAssistRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCaseInfoAssistRecord',
    type: requestType.Get
  },
  /**
   * 多条件查询协催已处理记录
   */
  getAllRecordAssistCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRecordAssistCase',
    type: requestType.Get
  },
  /**
   * 协催案件查看还款凭证
   */
  getAssistRepaymentVoucher: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAssistRepaymentVoucher',
    type: requestType.Get
  },
  /**
   * 下载协催案件外访资料
   */
  getAssistVisitFiles: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAssistVisitFiles',
    type: requestType.Get
  },
  /**
   * 协催页面获取分配信息
   */
  getBatchInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBatchInfo',
    type: requestType.Get
  },
  /**
   * 协催页面多条件查询跟进记录
   */
  getFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFollowupRecord',
    type: requestType.Get
  },
  /**
   * 协催案件留案操作
   */
  leaveCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveCaseAssist',
    type: requestType.Post
  },
  /**
   * 协催案件页面添加跟进记录
   */
  saveFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveFollowupRecord',
    type: requestType.Post
  },
}
