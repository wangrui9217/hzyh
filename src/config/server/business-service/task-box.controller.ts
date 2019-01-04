import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'taskBoxController'

export default {
  /**
   * 查询任务列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  }
}
