import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'userController'

export default {
  /**
   * 增加用户
   */
  createUser: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createUser',
    type: requestType.Post
  },
  /**
   * 查询部门下的特定用户
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  },
  /**
   * 查询特定部门下特定角色的用户
   */
  queryUserByDeptAndRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryUserByDeptAndRole',
    type: requestType.Get
  },
  /**
   * 用户分配角色
   */
  userAddRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'userAddRole',
    type: requestType.Post
  },
  /**
   * 用户批量分配角色
   */
  manyUserAddRole: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'manyUserAddRole',
    type: requestType.Post
  },
  /**
   * 查询角色下的用户
   */
  getUserByRolePage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUserByRolePage',
    type: requestType.Get
  },
  /**
   * 查询机构下用户
   */
  getUserByType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getUserByType',
    type: requestType.Get
  },
  /**
   * 导出用户列表
   */
  exportUserList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportUserList',
    type: requestType.Post
  },
  /**
   * 查询部门下的用户
   */
  queryNoPage: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryNoPage',
    type: requestType.Get
  },
  /**
   * 修改用户
   */
  updateUser: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateUser',
    type: requestType.Post
  },
  /**
   * 手动刷新缓存
   */
  flushCache: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'flushCache',
    type: requestType.Get
  },
  /**
   * 分案查询部门
   */
  queryUserByDeptAndType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryUserByDeptAndType',
    type: requestType.Get
  }
}
