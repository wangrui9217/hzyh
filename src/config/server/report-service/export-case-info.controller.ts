import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'ExportCaseInfoController'

export default {
  /**
   * 导出案件
   */
  exportCaseInfo: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportCaseInfo',
    type: requestType.Post
  }
}
