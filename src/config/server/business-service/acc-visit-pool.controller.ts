import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'accVisitPoolController'

export default {
  /**
   * 外访审批小流转案件
   */
  approvalVisitCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'approvalVisitCirculation',
    type: requestType.Post
  },
  /**
   * 协催申请
   */
  assistApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'assistApply',
    type: requestType.Post
  },
  /**
   * 外访页面批量分配
   */
  batchVisitCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchVisitCase',
    type: requestType.Post
  },
  /**
   * 外访页面还款操作
   */
  doVisitPay: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'doVisitPay',
    type: requestType.Post
  },
  /**
   * 外访案件结案
   */
  endVisitCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'endVisitCase',
    type: requestType.Get
  },
  /**
   * 外访页面多条件查询协催记录
   */
  getAllAssistApplyRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllAssistApplyRecord',
    type: requestType.Get
  },
  /**
   * 多条件查询外访已处理记录
   */
  getAllHandleVisitCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllHandleVisitCase',
    type: requestType.Get
  },
  /**
   * 外访页面多条件查询发送信息记录
   */
  getAllSendMessageRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllSendMessageRecord',
    type: requestType.Get
  },
  /**
   * 外访主页面多条件查询外访案件
   */
  getAllVisitCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllVisitCase',
    type: requestType.Get
  },
  /**
   * 外访页面获取分配信息
   */
  getBatchInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBatchInfo',
    type: requestType.Get
  },
  /**
   * 外访页面多条件查询跟进记录
   */
  getFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFollowupRecord',
    type: requestType.Get
  },
  /**
   * 外访页面多条件查询还款记录
   */
  getPaymentRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPaymentRecord',
    type: requestType.Get
  },
  /**
   * 查看还款凭证
   */
  getRepaymentVoucher: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRepaymentVoucher',
    type: requestType.Get
  },
  /**
   * 多条件查询外访已结案案件
   */
  getVisitCaseOver: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitCaseOver',
    type: requestType.Get
  },
  /**
   * 多条件查询外访催收中或还款审核中案件
   */
  getVisitCollectioning: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitCollectioning',
    type: requestType.Get
  },
  /**
   * 下载外访资料
   */
  getVisitFiles: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitFiles',
    type: requestType.Get
  },
  /**
   * 多条件查询外访小流转待审批案件
   */
  getVisitPendingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitPendingCase',
    type: requestType.Get
  },
  /**
   * 外访页面查询客户联系人
   */
  getVisitPersonalAddress: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitPersonalAddress',
    type: requestType.Get
  },
  /**
   * 多条件查询外访待结案案件
   */
  getVisitRepaid: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitRepaid',
    type: requestType.Get
  },
  /**
   * 多条件查询外访待催收案件
   */
  getVisitWaitCollection: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getVisitWaitCollection',
    type: requestType.Get
  },
  /**
   * 是否挂起
   */
  handUp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'handUp',
    type: requestType.Get
  },
  /**
   * 外访案件留案操作
   */
  leaveVisitCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveVisitCase',
    type: requestType.Post
  },
  /**
   * 修改联系人地址状态
   */
  modifyAddressStatus: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'modifyAddressStatus',
    type: requestType.Put
  },
  /**
   * 外访页面添加跟进记录
   */
  saveFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveFollowupRecord',
    type: requestType.Post
  },
  /**
   * 外访页面添加修复信息
   */
  saveRepairInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveRepairInfo',
    type: requestType.Post
  },
  /**
   * 外访申请提前流转
   */
  visitAdvanceCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitAdvanceCirculation',
    type: requestType.Post
  },
  /**
   * 外访案件重新分配
   */
  visitCaseDistribution: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitCaseDistribution',
    type: requestType.Post
  },
  /**
   * 外访案件颜色打标
   */
  visitCaseMarkColor: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitCaseMarkColor',
    type: requestType.Put
  },
  /**
   * 外访页面还款撤回
   */
  visitWithdraw: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitWithdraw',
    type: requestType.Get
  },
  /**
   * 外访取消留案审批
   */
  cancelLeaveCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'cancelLeaveCase',
    type: requestType.Post
  }
}
