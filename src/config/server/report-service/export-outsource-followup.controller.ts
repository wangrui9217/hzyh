import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'exportOutsourceFollowupController'

export default {
  /**
   * 导出委外跟进记录
   */
  exportOutsourceFollowupRecord: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportOutsourceFollowupRecord',
    type: requestType.Post
  }
}
