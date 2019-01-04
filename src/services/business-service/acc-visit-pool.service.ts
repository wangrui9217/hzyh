import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class AccVisitPoolService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 是否挂起
   */
  @Debounce()
  handUp(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.handUp,
      data: data
    })
  }
  /**
   * 外访取消留案
   */
  @Debounce()
  cancelLeaveCase(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.cancelLeaveCase,
      data: data
    })
  }
  /**
   * 外访页面批量分配
   */
  @Debounce()
  batchVisitCase(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.batchVisitCase,
      data: data
    })
  }
  /**
   * 外访案件留案操作
   */
  leaveVisitCase(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.leaveVisitCase,
      data: data
    })
  }
  /**
   * 外访申请提前流转
   */
  visitAdvanceCirculation(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.visitAdvanceCirculation,
      data: data
    })
  }
  /**
   * 外访案件颜色打标
   */
  visitCaseMarkColor(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.visitCaseMarkColor,
      data: data
    })
  }
  getVisitPersonalAddress(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.getVisitPersonalAddress,
      data
    })
  }
  /**
   * 多条件查询外访小流转待审批案件
   */
  getVisitPendingCase(data, page?, sort?) {
    return this.netService.send({
      server: businessService.accVisitPoolController.getVisitPendingCase,
      data,
      page,
      sort
    })
  }
  /**
   * 外访审批小流转案件
   */
  approvalVisitCirculation(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.approvalVisitCirculation,
      data
    })
  }
  /**
   * 外访页面添加修复信息
   */
  @Debounce()
  saveRepairInfo(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.saveRepairInfo,
      data
    })
  }
  /**
   * 外访页面还款操作
   */
  @Debounce()
  doVisitPay(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.doVisitPay,
      data
    })
  }
  /**
   * 外访页面添加跟进记录
   */
  @Debounce()
  saveFollowupRecord(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.saveFollowupRecord,
      data
    })
  }
  /**
   * 外访页面多条件查询还款记录
   */
  getPaymentRecord(data, page, sort) {
    return this.netService.send({
      server: businessService.accVisitPoolController.getPaymentRecord,
      data: data,
      page: page,
      sort: sort
    })
  }
  /**
   * 外访页面还款撤回
   */
  visitWithdraw(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.visitWithdraw,
      data: data
    })
  }
  /**
   * 外访页面获取分配信息
   */
  getBatchInfo() {
    return this.netService.send({
      server: businessService.accVisitPoolController.getBatchInfo
    })
  }
  /**
   * 修改联系人地址状态
   */
  modifyAddressStatus(data) {
    return this.netService.send({
      server: businessService.accVisitPoolController.modifyAddressStatus,
      data
    })
  }
}
