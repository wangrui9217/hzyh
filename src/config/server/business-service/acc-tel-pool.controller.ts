import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'AccTelPoolController'

export default {
  /**
   * 电催审批小流转案件
   */
  approvalTelCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'approvalTelCirculation',
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
   * 外访申请
   */
  visitApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'visitApply',
    type: requestType.Post
  },
  /**
   * 电催页面批量分配
   */
  batchTelCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchTelCase',
    type: requestType.Post
  },
  /**
   * 取消留案操作
   */
  cancelLeaveCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'cancelLeaveCase',
    type: requestType.Post
  },
  /**
   * 分配前判断是否有协催案件或协催标识
   */
  checkCaseAssist: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkCaseAssist',
    type: requestType.Get
  },
  /**
   * 案件重新分配
   */
  distributeTurnCeaseAgain: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'distributeTurnCeaseAgain',
    type: requestType.Post
  },
  /**
   * 电催页面还款操作
   */
  doTelPay: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'doTelPay',
    type: requestType.Post
  },
  /**
   * 电催案件结案
   */
  endTelCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'endTelCase',
    type: requestType.Get
  },
  /**
   * 电催页面多条件查询协催记录
   */
  getAllAssistApplyRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllAssistApplyRecord',
    type: requestType.Get
  },
  /**
   * 多条件查询电催已处理记录
   */
  getAllHandleTelCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllHandleTelCase',
    type: requestType.Get
  },
  /**
   * 电催页面多条件查询发送信息记录
   */
  getAllSendMessageRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllSendMessageRecord',
    type: requestType.Get
  },
  /**
   * 电催主页面多条件查询电催案件
   */
  getAllTelCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllTelCase',
    type: requestType.Get
  },
  /**
   * 多条件查询电催催收中案件
   */
  getAllTelCollecting: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllTelCollecting',
    type: requestType.Get
  },
  /**
   * 多条件查询电催待结案案件
   */
  getAllTelWaitEnd: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllTelWaitEnd',
    type: requestType.Get
  },
  /**
   * 电催页面获取分配信息
   */
  getBatchInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getBatchInfo',
    type: requestType.Get
  },
  /**
   * 通过案件ID获得案件信息
   */
  getCaseInfoByCaseId: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseInfoByCaseId',
    type: requestType.Get
  },
  /**
   * 查看凭证
   */
  getPayProof: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPayProof',
    type: requestType.Get
  },
  /**
   * 电催页面多条件查询还款记录
   */
  getPaymentRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPaymentRecord',
    type: requestType.Get
  },
  /**
   * 电催页面查看电话录音列表
   */
  getPhoneRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPhoneRecord',
    type: requestType.Get
  },
  /**
   * 多条件查询电催小流转待审批案件
   */
  getTelPendingCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTelPendingCase',
    type: requestType.Get
  },
  /**
   * 电催页面查询客户联系人
   */
  getTelPersonalContact: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTelPersonalContact',
    type: requestType.Get
  },
  /**
   * 电催案件留案操作
   */
  leaveTelCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'leaveTelCase',
    type: requestType.Post
  },
  /**
   * 修改联系人电话状态
   */
  modifyPhoneStatus: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'modifyPhoneStatus',
    type: requestType.Put
  },
  /**
   * 电催页面添加跟进记录
   */
  saveFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveFollowupRecord',
    type: requestType.Post
  },
  /**
   * 电催页面新增联系人电话或邮箱地址
   */
  savePersonalContactPhone: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'savePersonalContactPhone',
    type: requestType.Post
  },
  /**
   * 电催页面添加修复信息
   */
  saveRepairInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveRepairInfo',
    type: requestType.Post
  },
  /**
   * 电催申请提前流转
   */
  telAdvanceCirculation: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'telAdvanceCirculation',
    type: requestType.Post
  },
  /**
   * 电催案件重新分配
   */
  telCaseDistribution: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'telCaseDistribution',
    type: requestType.Post
  },
  /**
   * 电催案件颜色打标
   */
  telCaseMarkColor: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'telCaseMarkColor',
    type: requestType.Put
  },
  /**
   * 电催页面还款撤回
   */
  telWithdraw: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'telWithdraw',
    type: requestType.Get
  },
  /**
   * 流转案件确认
   */
  turnCaseVisitConfirm: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'turnCaseVisitConfirm',
    type: requestType.Post
  },
  /**
   * 流转案件分配
   */
  turnCaseVisitDistribution: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'turnCaseVisitDistribution',
    type: requestType.Post
  },
  /**
   * 电催跟进记录列表查询
   */
  getFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getFollowupRecord',
    type: requestType.Get
  },
  /**
   * 申请外访记录列表查询
   */
  getAllCaseOutApplyRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllCaseOutApplyRecord',
    type: requestType.Get
  },
  syncPersonalContact: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'syncPersonalContact',
    type: requestType.Get
  }
}
