import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class CaseInfoReportService {
  @Inject(NetService)
  private netService: NetService

  /**
   * PC待分配案件查询
   */
  @Debounce()
  queryWaitDistributed(data?, page?) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryWaitDistributed,
      data: {
        overDuePayStatus: data.overDuePayStatus,
        companyCode: data.companyCode,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        principalId: data.principalId,
        orderId: data.orderId,
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        payStatus: data.payStatus,
        overMinDay: data.overdueDays.min,
        overMaxDay: data.overdueDays.max,
        closeDateMin: FilterService.dateRanageFormat(data.closeDate).start,
        closeDateMax: FilterService.dateRanageFormat(data.closeDate).end,
        delegationDateMin: FilterService.dateRanageFormat(data.delegationDate).start,
        delegationDateMax: FilterService.dateRanageFormat(data.delegationDate).end,
        idCard: data.idCard,
        shopDeptId: data.shopDeptId
      },
      page: page
    })
  }
  /**
   * PC催收中案件查询
   */
  @Debounce()
  queryCollectingCase(data?, page?) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryCollectingCase,
      data: {
      principalId: data.principalId,
      batchNumber: data.batchNumber,
      delegationDateStart: FilterService.dateRanageFormat(data.delegationDate).start,
      delegationDateEnd: FilterService.dateRanageFormat(data.delegationDate).end,
      closeDateStart: FilterService.dateRanageFormat(data.closeDate).start,
      closeDateEnd: FilterService.dateRanageFormat(data.closeDate).end
      },
      page: page
    })
  }
  /**
   * 内催已结案案件查询
   */
  @Debounce()
  queryCaseOver(data?, page?) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryCaseOver,
      data: {
        orderId: data.orderId,
        overDuePayStatus: data.overDuePayStatus,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        principalId: data.principalId,
        closeDateMin: FilterService.dateRanageFormat(data.closeDate).start,
        closeDateMax: FilterService.dateRanageFormat(data.closeDate).end,
        delegationDateMin: FilterService.dateRanageFormat(data.delegationDate).start,
        delegationDateMax: FilterService.dateRanageFormat(data.delegationDate).end,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        payStatus: data.payStatus,
        overMinDay: data.overdueDays.min,
        overMaxDay: data.overdueDays.max,
        shopDeptId: data.shopDeptId
      },
      page: page
    })
  }
  /**
   * 按健查找接口
   */
  @Debounce()
  queryCaseInfo(data, page) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryCaseInfo,
      data: data,
      page: page
    })
  }
  /**
   * 提醒逾期案件的最近已还款
   */
  @Debounce()
  queryLatelyPayCase(data, page) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryLatelyPayCase,
      data: {
        orderId: data.orderId,
        companyCode: data.companyCode,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        principalId: data.principalId,
        overdueMaxAmt: data.amtRange.max,
        overdueMinAmt: data.amtRange.min,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        closeDateMin: FilterService.dateRanageFormat(data.closeDate).start,
        closeDateMax: FilterService.dateRanageFormat(data.closeDate).end,
        delegationDateMin: FilterService.dateRanageFormat(data.delegationDate).start,
        delegationDateMax: FilterService.dateRanageFormat(data.delegationDate).end,
        overDuePayStatus: data.overDuePayStatus,
        payStatus: data.payStatus,
        shopDeptId: data.shopDeptId
      },
      page: page
    })
  }
  /**
   * 提醒逾期案件的剥离案件
   */
  @Debounce()
  queryStrippingCase(data, page) {
    return this.netService.send({
      server: reportService.CaseInfoReportController.queryStrippingCase,
      data: {
        orderId: data.orderId,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        principalId: data.principalId,
        overdueMaxAmt: data.amtRange.max,
        overdueMinAmt: data.amtRange.min,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        closeDateMin: FilterService.dateRanageFormat(data.closeDate).start,
        closeDateMax: FilterService.dateRanageFormat(data.closeDate).end,
        delegationDateMin: FilterService.dateRanageFormat(data.delegationDate).start,
        delegationDateMax: FilterService.dateRanageFormat(data.delegationDate).end,
        overDuePayStatus: data.overDuePayStatus,
        payStatus: data.payStatus,
        shopDeptId: data.shopDeptId
      },
      page: page
    })
  }

}

