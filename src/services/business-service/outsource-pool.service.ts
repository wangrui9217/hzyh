import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class OutsourcePoolService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 委外案件管理全部案件案件明细查看旁边增加撤销分配
   */
  @Debounce()
  revertOutCaseInfoDistribute(batchNumber) {
    return this.netService.send({
      server: businessService.outsourcePoolController.revertOutCaseInfoDistribute,
      data: {
        batchNumber
      }
    })
  }
  /**
   * 退案
   */
  backOutsourcePool() {
    return this.netService.send({
      server: businessService.outsourcePoolController.backOutsourcePool
    })
  }
  /**
   * 财务数据确认操作
   */
  affirmReconciliation(idList) {
    return this.netService.send({
      server: businessService.outsourcePoolController.affirmReconciliation,
      data: {
        idList
      }
    })
  }
  /**
   * 移入待分配
   */
  changeToBeAssigned() {
    return this.netService.send({
      server: businessService.outsourcePoolController.changeToBeAssigned
    })
  }
  /**
   * 委外结案
   */
  closeOutsourcePool(outCaseIds) {
    return this.netService.send({
      server: businessService.outsourcePoolController.closeOutsourcePool,
      data: {
        outCaseIds
      }
    })
  }
  /**
   * 委外案件导出
   */
  exportAccOutsourcePool() {
    return this.netService.send({
      server: businessService.outsourcePoolController.exportAccOutsourcePool
    })
  }
  /**
   * 导出委外财务对账数据
   */
  exportOutsideFinanceData(data) {
    return this.netService.send({
      server: businessService.outsourcePoolController.exportOutsideFinanceData,
      data
    })
  }
  /**
   * 查询已确认的数据
   */
  findConfirmFinanceData(data, page?) {
    return this.netService.send({
      server: businessService.outsourcePoolController.findConfirmFinanceData,
      data,
      page
    })
  }
  /**
   * 查询未确认的数据
   */
  findFinanceData(data, page?) {
    return this.netService.send({
      server: businessService.outsourcePoolController.findFinanceData,
      data,
      page
    })
  }
  /**
   * 查询可委外案件
   */
  getAllOutCase() {
    return this.netService.send({
      server: businessService.outsourcePoolController.getAllOutCase
    })
  }
  /**
   * 查询委外分配信息
   */
  @Debounce()
  getOutDistributeInfo(data, page) {
    return this.netService.send({
      server: businessService.outsourcePoolController.getOutDistributeInfo,
      data: data,
      page: page
    })
  }
  /**
   * 查询委外记录
   */
  getOutRecored() {
    return this.netService.send({
      server: businessService.outsourcePoolController.getOutRecored
    })
  }
  /**
   * 按批次号查看委外案件详情
   */
  getOutSourceCaseByBatchnum(data, page?) {
    return this.netService.send({
      server: businessService.outsourcePoolController.getOutSourceCaseByBatchnum,
      data: {
        outsName: data.outsName,
        outsId: data.outsId,
        batchNumber: data.batchNumber,
        contractAmt: [data.amtRange.min, data.amtRange.max],
        personalName: data.personalName,
        mobileNo: data.mobileNo


      },
      page
    })
  }
  /**
   * 按批次号和委外名称查看委外案件详情
   */
  getOutSourceCaseByOutName(data, page?) {
    return this.netService.send({
      server: businessService.outsourcePoolController.getOutSourceCaseByOutName,
      data: {
        companyCode: data.companyCode,
        outsId: data.outsId,
        type: data.type,
        outsIdList: data.outsIdList,
        ourBatchList: data.ourBatchList,
        outTimeStart: FilterService.dateRanageFormat(data.outTime).start,
        outTimeEnd: FilterService.dateRanageFormat(data.outTime).end
      },
      page
    })
  }
  /**
   * 查看委外案件跟进记录
   */
  getOutSourceCaseFollowRecord(data, page?, sort?) {
    return this.netService.send({
      server: businessService.outsourcePoolController.getOutSourceCaseFollowRecord,
      data: {
        operatorTime: [FilterService.dateRanageFormat(data.operatorTime).start, FilterService.dateRanageFormat(data.operatorTime).end],
        caseNumber: data.caseNumber,
        type: data.type,
        collectionFeedback: data.collectionFeedback
      },
      page,
      sort
    })
  }
  /**
   * 多条件查询回收案件
   */
  getReturnCaseByConditions(data, page) {
    return this.netService.send({
      server: businessService.outsourcePoolController.getReturnCaseByConditions,
      data: {
        outBatch: data.outBatch, // 批次号
        'caseId.personalInfo.name': data['caseId.personalInfo.name'],
        'caseId.personalInfo.mobileNo': data['caseId.personalInfo.mobileNo'],
        'caseId.personalInfo.idCard': data['caseId.personalInfo.idCard'],
        'caseId.overdueAmount': [data.overdueAmount.min, data.overdueAmount.max],
        'caseId.overdueDays': [data.overdueDays.min, data.overdueDays.max],
        overOutsourceTime: [FilterService.dateRanageFormat(data.overOutsourceTime).start, FilterService.dateRanageFormat(data.overOutsourceTime).end],

      },
      page: page
    })
  }
  /**
   * 账目导入/委外跟进记录导入
   */
  @Debounce()
  importFinancData(data) {
    return this.netService.send({
      server: businessService.outsourcePoolController.importFinancData,
      data: data
    })
  }
  /**
   * 下载模板
   */
  @Debounce()
  loadTemplate(type) {
    return this.netService.send({
      server: businessService.outsourcePoolController.loadTemplate,
      data: {
        type
      }
    })
  }
  /**
   * 待委外案件评分(手动)
   * @param 公司编码 可为空
   */
  @Debounce(2000)
  outCaseScore(companyCode: string) {
    return this.netService.send({
      server: businessService.outsourcePoolController.outCaseScore,
      data: { companyCode: companyCode }
    })
  }
  /**
   * 委外中案件评分(手动)
   */
  outCurrentCaseScore() {
    return this.netService.send({
      server: businessService.outsourcePoolController.outCurrentCaseScore
    })
  }
  /**
   * 委外案件 待分配案件 策略分配
   */

  outerStrategyDistribute(data) {
    return this.netService.send({
      server: businessService.outsourcePoolController.outerStrategyDistribute,
      data: {
        caseIds: data
      }
    })
  }
  /**
   * 委外待分配案件分配
   */
  @Debounce()
  outsourceDistributeCeaseInfo(data) {
    return this.netService.send({
      server: businessService.outsourcePoolController.outsourceDistributeCeaseInfo,
      data: data
    })
  }
  /**
   * 委外待分配按数量平均分配预览
   */
  outsourceDistributePreview(data) {
    return this.netService.send({
      server: businessService.outsourcePoolController.outsourceDistributePreview,
      data: data
    })
  }
  /**
   * 查询待分配委外案件
   */
  @Debounce()
  query(data, page) {
    return this.netService.send({
      server: businessService.outsourcePoolController.query,
      data: data,
      page: page
    })
  }
  /**
   * 撤回
   */
  recallOutCase(ids) {
    return this.netService.send({
      server: businessService.outsourcePoolController.recallOutCase,
      data: {
        ids
      }
    })
  }
  /**
   * 回收委外案件
   */
  returnOutsourceCase(outCaseIds, returnReason) {
    return this.netService.send({
      server: businessService.outsourcePoolController.returnOutsourceCase,
      data: {
        outCaseIds,
        returnReason
      }
    })
  }
  /**
   * 核销申请
   */
  verificationApply() {
    return this.netService.send({
      server: businessService.outsourcePoolController.verificationApply
    })
  }
  /**
   * 财务数据删除操作
   */
  @Debounce()
  deleteFinanceData(idList) {
    return this.netService.send({
      server: businessService.outsourcePoolController.deleteFinanceData,
      data: {
        idList
      }
    })
  }
}
