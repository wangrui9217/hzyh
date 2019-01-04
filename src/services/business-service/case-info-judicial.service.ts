import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service'
export class CaseInfoJudicialService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 司法审批通过案件查询
   */
  @Debounce()
  getCaseInfoJudicial(data, page?) {
    return this.netService.send({
      server: businessService.caseInfoJudicialController.getCaseInfoJudicial,
      data: {
        personalName: data.personalName,
        companyCode: data.companyCode,
        payStatus: data.payStatus,
        mobileNo: data.mobileNo,
        principalId: data.principalId,
        batchNumber: data.batchNumber,
        idCard: data.idCard,
        overdueMaxAmt: data.overdueAmount.max,
        overdueMinAmt: data.overdueAmount.min,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min
        },
      page
    })
  }
  /**
   * 案件申请司法审批
   */
  @Debounce()
  saveCaseInfoJudicial(data) {
    return this.netService.send({
      server: businessService.caseInfoJudicialController.getCaseInfoJudicial,
      data: data
    })
  }
}
