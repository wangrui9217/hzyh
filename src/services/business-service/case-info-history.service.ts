import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';


export class CaseInfoHistoryService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 回收案件删除
   */
  @Debounce()
  deleteReturnCase(data) {
    return this.netService.send({
      server: businessService.caseInfoHistoryController.deleteReturnCase,
      data: data
    })
  }
  /**
   * 委外已结案案件删除
   */
  @Debounce()
  deleteOuterCase(ids) {
    return this.netService.send({
      server: businessService.caseInfoHistoryController.deleteOuterCase,
      data: {
        ids
      }
    })
  }
  /**
   * 内催已结案删除
   */
  deleteInnerCase(data) {
    return this.netService.send({
      server: businessService.caseInfoHistoryController.deleteInnerCase,
      data: {
        ids: data
      }
    })
  }
}
