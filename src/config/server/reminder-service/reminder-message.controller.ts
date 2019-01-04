import { requestType } from '~/config/enum.config'

const SERVICE = 'reminder-service'
const CONTROLLER = 'reminderMessageController'

export default {
  /**
   * 获取未读消息数
   */
  getUnReadCount: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUnReadCount',
    type: requestType.Get
  },
  /**
   * 批量删除消息
   */
  batchDelete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchDelete',
    type: requestType.Post
  },
  /**
   * 删除消息
   */
  delete: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'delete',
    type: requestType.Post
  },
  /**
   * 通过登陆用户token查询消息列表
   */
  getReminderMessages: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getReminderMessages',
    type: requestType.Get
  },
  /**
   *设置消息状态为已读
   */
  setSelectedMessageRead: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'setSelectedMessageRead',
    type: requestType.Get
  },
  /**
   * 取弹框三条消息
   */
  getWorkbenchReminder: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getWorkbenchReminder',
    type: requestType.Get
  }
}
