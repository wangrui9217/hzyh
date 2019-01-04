import { datasyncService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class AccRepaymentRemindService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 案件导入手工同步案件
   */
  @Debounce()
  getErpRepaymentRemind() {
    return this.netService.send({
      server: datasyncService.accRepaymentRemindController.getErpRepaymentRemind
    })
  }
}
