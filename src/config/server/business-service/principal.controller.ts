import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'principalController'

export default {
  /**
   * 获取所有委托方信息
   */
  getPrincipalList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPrincipalList',
    type: requestType.Get
  },
   /**
   * 新增/修改委托方信息
   */
  createPrincipal: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createPrincipal',
    type: requestType.Post
  },
   /**
   * 删除委托方
   */
  deletePrincipal: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deletePrincipal',
    type: requestType.Delete
  },
   /**
   * 获取委托方分页查询
   */
  getPrincipalPageList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getPrincipalPageList',
    type: requestType.Get
  }
}
