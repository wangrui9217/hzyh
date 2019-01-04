import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'exportFollowupController'

export default {
  /**
   * 导出跟进记录
   */
  exportFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportFollowupRecord',
    type: requestType.Post
  },
  /**
   * 案件查找导出跟进记录
   */
  exportFollowup: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportFollowup',
    type: requestType.Post
  }
}
