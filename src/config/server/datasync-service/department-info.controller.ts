import { requestType } from '~/config/enum.config'

const SERVICE = 'datasync-service'
const CONTROLLER = 'departmentInfoController'

export default {
  /**
   * 手工同步机构
   */
  handleDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'handleDepartment',
    type: requestType.Get
  }
}
