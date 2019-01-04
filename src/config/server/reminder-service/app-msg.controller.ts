import { requestType } from '~/config/enum.config'

const SERVICE = 'reminder-service'
const CONTROLLER = 'appMsgController'

export default {
  /**
   * 消息推送接口
   */
  saveAppmsg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveAppmsg',
    type: requestType.Post
  },
  /**
   * 批量消息推送接口
   */
  batchSaveAppmsg: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'batchSaveAppmsg',
    type: requestType.Post
  }
}
