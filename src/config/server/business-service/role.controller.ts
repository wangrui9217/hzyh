import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'roleController'

export default {
  /**
   * 分页查询角色资源
   */
  getAllRolePage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRolePage',
    type: requestType.Get
  },
  /**
   * 查询角色资源
   */
  getAllRoles: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllRoles',
    type: requestType.Get
  },
  /**
   * 创建角色
   */
  createRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createRole',
    type: requestType.Post
  },
  /**
   * 删除角色
   */
  deleteRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteRole',
    type: requestType.Delete
  },
  /**
   * 角色查找资源
   */
  getRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRole',
    type: requestType.Get
  },
  /**
   * 更新角色
   */
  updateRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateRole',
    type: requestType.Post
  },
  /**
   * 获取全部角色
   */
  queryAllRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAllRole',
    type: requestType.Get
  },
  /**
   * 根据角色ID 获取有用的资源
   */
  getRoleById:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getRoleById',
    type: requestType.Get
  }
}
