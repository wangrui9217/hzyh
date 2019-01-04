import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'sMSMessageController'

export default {
  /**
   * 添加短信记录(发送短信)
   */
  sendMessageSingle: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'SendMessageSingle',
    type: requestType.Post
  },
  /**
   * 智能短信记录
   */
  sendCapaMessageSingle: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'SendCapaMessageSingle',
    type: requestType.Post
  }
}
