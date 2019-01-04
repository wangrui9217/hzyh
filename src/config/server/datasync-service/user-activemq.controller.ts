import { requestType } from '~/config/enum.config'

const SERVICE = 'datasync-service'
const CONTROLLER = 'userActiveMqController'

export default {
  /**
   * 异常案件手工同步案件
   */
  exceptionDataSync: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exceptionDataSync',
    type: requestType.Get
  }
}
