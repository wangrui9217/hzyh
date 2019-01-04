import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'resourceController'

export default {
  /**
   * 查询所有资源
   */
  getAllResource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllResource',
    type: requestType.Get
  },
  /**
   * 按ID查询资源
   */
  getResource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getResource',
    type: requestType.Get
  },
  /**
   * 按ID查询资源
   */
  resourceAddRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'resourceAddRole',
    type: requestType.Post
  },
  /**
   * 修改资源
   */
  updateResource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateResource',
    type: requestType.Post
  },
}
