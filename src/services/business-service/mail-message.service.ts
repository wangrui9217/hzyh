import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class MailMessageService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 发送邮件催收
   */
  @Debounce()
  sendMail(data) {
    return this.netService.send({
      server: businessService.mailMessageController.sendMail,
      data: data
    })
  }
}

