import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from "~/utils/filter.service";
import { requestType } from "~/config/enum.config";
import { Service } from "~/core/service"

export class AccTelPoolService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 电催页面新增联系人电话或邮箱地址
   */
  @Debounce()
  savePersonalContactPhone(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.savePersonalContactPhone,
      data: data
    })
  }
  /**
   * 分配前判断是否有协催案件或协催标识
   */
  checkCaseAssist(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.checkCaseAssist,
      data: data
    })
  }
  /**
   * 电催案件留案操作
   */
  leaveTelCase(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.leaveTelCase,
      data: data
    })
  }
  /**
   * 取消留案操作
   */
  cancelLeaveCase(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.cancelLeaveCase,
      data: data
    })
  }
  /**
   * 电催申请提前流转
   */
  telAdvanceCirculation(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.telAdvanceCirculation,
      data: data
    })
  }
  /**
   * 电催页面查看电话录音列表
   */
  getPhoneRecord(data, page) {
    return this.netService.send({
      server: businessService.accTelPoolController.getPhoneRecord,
      data: data,
      page: page
    })
  }
  /**
   * 电催案件颜色打标
   */
  telCaseMarkColor(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.telCaseMarkColor,
      data: data
    })
  }
  @Debounce()
  saveRepairInfo(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.saveRepairInfo,
      data: data
    })
  }
  /**
   * 查看凭证
   */

  getPayProof(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.getPayProof,
      data: data
    })
  }
  /**
   * 电催页面获取分配信息
   */
  getBatchInfo(data?) {
    return this.netService.send({
      server: businessService.accTelPoolController.getBatchInfo,
      data
    })
  }
  /**
   * 电催页面批量分配
   */
  @Debounce()
  batchTelCase(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.batchTelCase,
      data: data
    })
  }
  /**
   * 案件再分配
   */
  @Debounce()
  distributeTurnCeaseAgain(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.distributeTurnCeaseAgain,
      data: data
    })
  }

  /**
   * 获取案件信息
   * @param id
   */
  getCaseInfoByCaseId(id) {
    return this.netService.send({
      server: businessService.accTelPoolController.getCaseInfoByCaseId,
      data: {
        caseId: id
      }
    })
  }
  /**
  * 电催相关联系人信息（电话本）
  */
  getTelPersonalContact(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.getTelPersonalContact,
      data
    })
  }
  /**
   * 修改联系人电话状态
   */
  modifyPhoneStatus(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.modifyPhoneStatus,
      data
    })
  }
  /**
   * 电催跟进记录列表查询
   */
  getFollowupRecord(caseNumber, data, page, sort) {
    return this.netService.send({
      server: businessService.accTelPoolController.getFollowupRecord,
      append: caseNumber,
      data,
      page,
      sort
    })
  }
  /**
   * 电催页面多条件查询协催记录
   */
  getAllAssistApplyRecord(data, page, sort) {
    return this.netService.send({
      server: businessService.accTelPoolController.getAllAssistApplyRecord,
      data,
      page,
      sort
    })
  }
  /**
   * 电催页面多条件查询短信记录
   */
  getAllSendMessageRecord(data, page) {
    return this.netService.send({
      server: businessService.accTelPoolController.getAllSendMessageRecord,
      data,
      page
    })
  }
  /**
   * 电催页面多条件查询申请外访记录
   */
  getAllCaseOutApplyRecord(data, page, sort) {
    return this.netService.send({
      server: businessService.accTelPoolController.getAllCaseOutApplyRecord,
      data: {
        caseId: data.caseId,
        applyDateMin: FilterService.dateRanageFormat(data.applyDate).start,
        applyDateMax: FilterService.dateRanageFormat(data.applyDate).end,
        approveStatus: data.approveStatus
      },
      page,
      sort
    })
  }
  /**
   * 电催添加跟进记录
   */
  @Debounce()
  saveFollowupRecord(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.saveFollowupRecord,
      data
    })
  }
  /**
   * 申请协催
   */
  assistApply(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.assistApply,
      data
    })
  }
  /**
   * 申请外访
   */
  @Debounce()
  visitApply(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.visitApply,
      data
    })
  }
  /**
   * 电催页面还款操作
   */
  @Debounce()
  doTelPay(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.doTelPay,
      data
    })
  }
  /**
   * 电催审批小流转案件
   */
  approvalTelCirculation(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.approvalTelCirculation,
      data
    })
  }
  /**
   * 多条件查询电催小流转待审批案件
   */
  getTelPendingCase(data, page?, sort?) {
    return this.netService.send({
      server: businessService.accTelPoolController.getTelPendingCase,
      data,
      page,
      sort
    })
  }
  syncPersonalContact(personalId, cardId) {
    return this.netService.send({
      server: businessService.accTelPoolController.syncPersonalContact,
      data: {
        personalId,
        idCard: cardId
      }
    })
  }
  /**
   * 电催页面多条件查询还款记录
   */
  getPaymentRecord(data, page, sort) {
    return this.netService.send({
      server: businessService.accTelPoolController.getPaymentRecord,
      data: data,
      page: page,
      sort: sort
    })
  }
  /**
   * 电催页面还款撤回
   */
  telWithdraw(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.telWithdraw,
      data: data
    })
  }
  /**
   * 电催案件结案
   */
  @Debounce()
  endTelCase(data) {
    return this.netService.send({
      server: businessService.accTelPoolController.endTelCase,
      data
    })
  }
}
