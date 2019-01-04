import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class SmsMessageService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 添加短信记录(发送短信)
   */
  sendMessageSingle(data) {
    return this.netService.send({
      server: businessService.sMSMessageController.sendMessageSingle,
      data: data
    })
  }
  /**
   * 智能短信记录
   */
  @Debounce()
  sendCapaMessageSingle(capaPersonals, sendType, tesmId) {
    return this.netService.send({
      server: businessService.sMSMessageController.sendCapaMessageSingle,
      data: {
        capaPersonals,
        sendType,
        tesmId
      }
    })
  }
}
