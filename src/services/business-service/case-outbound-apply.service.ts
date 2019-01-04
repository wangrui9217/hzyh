import {businessService} from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CaseOutboundApplyService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 申请外访审批列表 type外访1电催0
   */
  @Debounce() 
  findAllPassedApply(data, page?, sort?) {
    return this.netService.send({
      server: businessService.caseOutboundApplyController.findAllPassedApply,
      data:{
        type: data.type,
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
   * 外访申请外访审批
   */
  @Debounce()
  visitApplyVisitApprove(data) {
    return this.netService.send({
      server: businessService.caseOutboundApplyController.visitApplyVisitApprove,
      data
    }) 
  }
  /**
   * 外访申请电催审批
   */
  @Debounce()
  visitApplyTelApprove(data) {
    return this.netService.send({
      server: businessService.caseOutboundApplyController.visitApplyTelApprove,
      data
    }) 
  }
}
