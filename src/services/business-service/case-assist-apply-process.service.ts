import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'
import { FilterService } from "~/utils/filter.service";

export class CaseAssistApplyProcessService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 获取审批链
   */
  @Debounce()
  applyCaseAssistDerate(data) {
    return this.netService.send({
      server: businessService.caseAssistApplyProcessController.applyCaseAssistDerate,
      data: data
    })
  }

  /**
   * 获取该用户名下待审批的协催案件（分页）
   */
  getAssistApplyApproval(data, page?, sort?) {
    data.applyDate[0] = FilterService.dateTimeFormat(data.applyDate[0]);
    data.applyDate[1] = FilterService.dateTimeFormat(data.applyDate[1]);
    return this.netService.send({
      server: businessService.caseAssistApplyProcessController.getAssistApplyApproval,
      data,
      page,
      sort
    })
  }
  /**
   * 获取该用户名下待审批的协催案件（分页）
   */
  @Debounce()
  saveCaseAssistApproval(data) {
    return this.netService.send({
      server: businessService.caseAssistApplyProcessController.saveCaseAssistApproval,
      data
    })
  }



}
