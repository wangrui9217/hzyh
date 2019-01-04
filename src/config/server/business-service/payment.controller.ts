import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'PaymentController'

export default {
  /**
   * 还款审批
   */
  approvalPayment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'approvalPayment',
    type: requestType.Put
  },
  /**
   * 导出还款记录
   */
  exportCasePayApply: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportCasePayApply',
    type: requestType.Get
  },
  /**
   * 多条件查询减免审批记录
   */
  getAllDerate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllDerate',
    type: requestType.Get
  },
  /**
   * 多条件查询还款审批记录
   */
  getAllPayment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllPayment',
    type: requestType.Get
  },
  /**
   * 还款信息展示
   */
  getPaymentInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPaymentInfo',
    type: requestType.Get
  },
  /**
   * 同步ERP
   */
  getPaymentRemind: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPaymentRemind',
    type: requestType.Get
  }
}
