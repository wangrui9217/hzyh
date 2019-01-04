import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class CaseAssistApplyService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 协催申请电催审批
   */
  @Debounce()
  assistApplyTelApprove(data, id) {
    return this.netService.send({
      server: businessService.caseAssistApplyController.assistApplyTelApprove,
      data,
      append: id
    })
  }
  /**
   * 协催申请外访审批
   */
  @Debounce()
  assistApplyVisitApprove(data, id) {
    return this.netService.send({
      server: businessService.caseAssistApplyController.assistApplyVisitApprove,
      data,
      append: id
    })
  }
  /**
   * 电催审批协催申请页面条件查询
   */
  @Debounce()
  findAllApply(data, page?, sort?) {
    return this.netService.send({
      server: businessService.caseAssistApplyController.findAllApply,
      data: {
        companyCode: data.companyCode,
        personalName: data.personalName,
        applyRealName: data.applyRealName,
        personalPhone: data.personalPhone,
        batchNumber: data.batchNumber,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        principalId: data.principalId
      },
      page,
      sort
    })
  }
  /**
   * 协催申请外访审批
   */
  @Debounce()
  findAllTelPassedApply(data, page?, sort?) {
    return this.netService.send({
      server: businessService.caseAssistApplyController.findAllTelPassedApply,
      data: {
        companyCode: data.companyCode,
        personalName: data.personalName,
        applyRealName: data.applyRealName,
        personalPhone: data.personalPhone,
        batchNumber: data.batchNumber,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        principalId: data.principalId
      },
      page,
      sort
    })
  }
}
