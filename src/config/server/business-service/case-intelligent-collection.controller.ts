import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseIntelligentCollectionController'

export default {
  /**
   * 短信群发及语音群呼操作
   */
  handleBatchSend: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'handleBatchSend',
    type: requestType.Post
  },
   /**
   * 电子邮件群发操作
   */
  handleEmailSend: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'handleEmailSend',
    type: requestType.Post
  },
   /**
   * 查询智能催收案件信息
   */
  queryCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCaseInfo',
    type: requestType.Get
  }
}
