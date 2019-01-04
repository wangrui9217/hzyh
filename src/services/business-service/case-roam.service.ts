import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class CaseRoamService extends Service {

  @Inject(NetService)
  private netService: NetService


  /**
   * 案件流转申请
   */
  @Debounce()
  CaseRecordInfoApply(data) {
    return this.netService.send({
      server: businessService.caseRoamController.CaseRecordInfoApply,
      data
    })
  }

  /**
   * 流转案件进行审批
   */
  @Debounce()
  ApprovalCaseRecordApply(data) {
    return this.netService.send({
      server: businessService.caseRoamController.ApprovalCaseRecordApply,
      data
    })
  }

  /**
   * 获取该用户名下所有待审批的流转案件
   */
  getCaseRecordApplyInfo(data, page?, sort?) {
    return this.netService.send({
      server: businessService.caseRoamController.getCaseRecordApplyInfo,
      data,
      page,
      sort
    })
  }
}

