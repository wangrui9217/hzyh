import { requestType } from '~/config/enum.config'

const SERVICE = 'common-service'
const CONTROLLER = 'appVersionController'

export default {
  /**
   * 添加app版本
   */
  createAppVersion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createAppVersion',
    type: requestType.Post
  },
  /**
   * 删除app版本
   */
  deleteAppVersion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteAppVersion',
    type: requestType.Get
  },
  /**
   * 发布新版本
   */
  publishAppVersion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'publishAppVersion',
    type:  requestType.Get
  },
  /**
   * 分页查询app版本控制
   */
  queryAppVersion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAppVersion',
    type: requestType.Get
  }
}
