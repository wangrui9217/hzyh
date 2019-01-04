import { requestType } from '~/config/enum.config'

const SERVICE = 'reminder-service'
const CONTROLLER = 'mobilePositionController'

export default {
  /**
   * 多条件搜索(监控)
   */
  getLatitudeAndLongitude: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getLatitudeAndLongitude',
    type: requestType.Get
  }
}
