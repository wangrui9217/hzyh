import { requestType } from '~/config/enum.config'

const SERVICE = 'datasync-service'
const CONTROLLER = 'accRepaymentRemindController'

export default {
  /**
   * 案件导入手工同步案件
   */
  getErpRepaymentRemind: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getErpRepaymentRemind',
    type: requestType.Get
  }
}
