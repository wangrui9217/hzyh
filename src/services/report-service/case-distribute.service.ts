import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CaseDistributeService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 案件导入待分配
   */
  @Debounce()
  findCaseInfoDistribute(data, page?) {
    return this.netService.send({
      server: reportService.caseInfoDistributeController.findCaseInfoDistribute,
      data: {
        companyCode: data.companyCode,
        personalName: data.personalName,
        cityId: data.cityList[data.cityList.length-1],
        mobileNo: data.mobileNo,
        batchNumber: data.batchNumber,
        principalId: data.principalId,
        overdueDaysStart: data.dayRange.min,
        overdueDaysEnd: data.dayRange.max,
        overDueAmountStart: data.amountRange.min,
        overDueAmountEnd: data.amountRange.max,
        handNumberStart: data.handNumber.min,
        handNumberEnd: data.handNumber.max,
        commissionRateStart: data.rateRange.min,
        commissionRateEnd: data.rateRange.max,
        payStatus: data.payStatus
      },
      page
    })
  }
}

