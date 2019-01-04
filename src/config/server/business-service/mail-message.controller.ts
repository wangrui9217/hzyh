import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'mailMessageController'

export default {
  /**
   * 发送邮件催收
   */
  sendMail: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'sendMail',
    type: requestType.Post
  }
}
