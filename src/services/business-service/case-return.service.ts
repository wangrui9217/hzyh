import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class CaseReturnService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 重新分配回收案件
   */
  @Debounce()
  reDisRecoverCase(data) {
    return this.netService.send({
      server: businessService.caseReturnController.reDisRecoverCase,
      data: {
        ids: data.ids,
        type: data.type,
        closeDate: FilterService.dateFormat(data.closeDate)
      }
    })
  }
  /**
   * 回收案件移入核销案件池
   */
  @Debounce()
  moveToVerification(data) {
    return this.netService.send({
      server: businessService.caseReturnController.moveToVerification,
      data: data
    })
  }
  /**
   * 回收案件移入司法案件池
   */
  @Debounce()
  moveToJudicial(data) {
    return this.netService.send({
      server: businessService.caseReturnController.moveToJudicial,
      data: data
    })
  }
  /**
   * 内催回收案件
   */
  @Debounce()
  recoverCase(data) {
    return this.netService.send({
      server: businessService.caseReturnController.recoverCase,
      data: data
    })
  }
}

