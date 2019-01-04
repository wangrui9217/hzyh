import { datasyncService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class UserActiveMqService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 异常案件手工同步案件
   */
  @Debounce()
  exceptionDataSync(orderNumber) {
    return this.netService.send({
      server: datasyncService.userActiveMqController.exceptionDataSync,
      data: {
        orderNumber
      }
    })
  }
}
