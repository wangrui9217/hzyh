import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'queryUserController'

export default {
  /**
   * 查询部门所对应的人员
   */
  queryUsers: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryUsers',
    type: requestType.Get
  }
}
