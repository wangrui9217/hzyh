import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class FreeMoneyResultService{

  @Inject(NetService)
  private netService: NetService

  /**
   * 打印信函申请
   */
  @Debounce()
  getFreeMonryResult(data) {
    return this.netService.send({
      server: businessService.freeMoneyResultController.getFreeMonryResult,
      data: data
    })
  }
}
