import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'offlineHistoryRemarkController'

export default {
  /**
   * 线下历史催记管理
   */
  queryOfflineHistoryRemark: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOfflineHistoryRemark',
    type: requestType.Get
  }
}
