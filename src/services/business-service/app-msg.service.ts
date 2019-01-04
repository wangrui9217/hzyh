import {reminderService} from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class AppMsgService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 消息推送接口
   */
  @Debounce()
  saveAppmsg(data) {
    return this.netService.send({
      server: reminderService.appMsgController.saveAppmsg,
      data:{
        appmsgNoRead: data.appmsgNoRead,
        content: data.content,
        title: data.title,
        userId: data.userId,
        userName: data.userName
      }
    })
  }
}
