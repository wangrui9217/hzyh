import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class OfflineHistoryRemarkService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 线下历史催记管理
   */
  @Debounce()
  queryOfflineHistoryRemark(data, page) {
    return this.netService.send({
      server: businessService.offlineHistoryRemarkController.queryOfflineHistoryRemark,
      data,
      page
    })
  }
}
