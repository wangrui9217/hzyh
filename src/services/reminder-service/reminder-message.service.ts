import { reminderService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class ReminderMessageService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 获取未读消息数列表
   */
  getUnReadCount() {
    return this.netService.send({
      server: reminderService.reminderMessageController.getUnReadCount
    })
  }

  /**
  * 批量删除消息
  */
  batchDelete(ids) {
    return this.netService.send({
      server: reminderService.reminderMessageController.batchDelete,
      data: {
        ids
      }
    })
  }

  /**
   * 获取消息列表
   */
  getReminderMessages(page) {
    return this.netService.send({
      server: reminderService.reminderMessageController.getReminderMessages,
      data: {
        state: 'null'
      },
      page
    })
  }

  /**
   * 设置消息状态为已读
   * @param id
   */
  setMessageRead(id) {
    return this.netService.send({
      server: reminderService.reminderMessageController.setSelectedMessageRead,
      data: {
        messageId: id
      }
    })
  }
  /**
   * 取弹框三条消息
   */
  getWorkbenchReminder() {
    return this.netService.send({
      server: reminderService.reminderMessageController.getWorkbenchReminder
    })
  }
}

