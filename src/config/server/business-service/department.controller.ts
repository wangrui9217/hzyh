import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'departmentController'

export default {
  /**
   * 查询用户所属部门及子部门
   */
  queryOwnDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryOwnDepartment',
    type: requestType.Get
  },
  /**
   * 查询所属公司的部门
   */
  queryAllDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAllDepartment',
    type: requestType.Get
  },
  /**
   * 查询所有门店
   */
  queryShopDept: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryShopDept',
    type: requestType.Get
  },
  /**
   * 查询用户所在的子部门
   */
  queryDepartmentList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryDepartmentList',
    type: requestType.Get
  },
  /**
  * 移动组织机构
  */
  moveDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'moveDepartment',
    type: requestType.Get
  },
  /**
  * 删除部门
  */
  deleteDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteDepartment',
    type: requestType.Delete
  },
  /**
  * 修改部门
  */
  updateDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateDepartment',
    type: requestType.Post
  },

  /**
  * 组织机构的type属性
  */
  getDepartmentType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDepartmentType',
    type: requestType.Get
  },
  /**
  * 组织机构的Level属性
  */
  getDepartmentLevel: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getDepartmentLevel',
    type: requestType.Get
  },
  /**
   * 增加部门
   */
  createDepartment: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createDepartment',
    type: requestType.Post
  }

}
