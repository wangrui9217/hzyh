import { reminderService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class MobilePositionService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 多条件搜索(监控)
   */
  getLatitudeAndLongitude(data) {
    return this.netService.send({
      server: reminderService.mobilePositionController.getLatitudeAndLongitude,
      data
    })
  }

}

