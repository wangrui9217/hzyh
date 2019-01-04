import { reminderService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class AppMsgService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 批量消息推送接口
   */
  @Debounce()
  batchSaveAppmsg(data) {
    return this.netService.send({
      server: reminderService.appMsgController.batchSaveAppmsg,
      data
    })
  }
  /**
   * 消息推送接口
   */
  @Debounce()
  saveAppmsg(data) {
    return this.netService.send({
      server: reminderService.appMsgController.saveAppmsg,
      data
    })
  }
}
