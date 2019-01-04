import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { debounce } from 'rxjs/operator/debounce';

export class UserService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 增加用户
   */
  @Debounce()
  createUser(data) {
    return this.netService.send({
      server: businessService.userController.createUser,
      data: data
    })
  }
  /**
   * 查询部门下的特定用户
   */
  @Debounce()
  query(data, page) {
    return this.netService.send({
      server: businessService.userController.query,
      data: data,
      page: page
    })
  }
  /**
   * 查询角色下的用户
   */
  getUserByRolePage(data, page) {
    return this.netService.send({
      server: businessService.userController.getUserByRolePage,
      data: data,
      page: page
    })
  }
  /**
   * 用户分配角色
   */
  @Debounce()
  userAddRole(data) {
    return this.netService.send({
      server: businessService.userController.userAddRole,
      data: data
    })
  }
  /**
   * 用户批量分配角色
   */
  @Debounce()
  manyUserAddRole(data) {
    return this.netService.send({
      server: businessService.userController.manyUserAddRole,
      data: data
    })
  }
  /**
   * 查询机构下用户
   */
  getUserByType(data, page) {
    return this.netService.send({
      server: businessService.userController.getUserByType,
      data: data,
      page: page
    })
  }
  /**
   * 导出用户列表
   */
  exportUserList(data) {
    return this.netService.send({
      server: businessService.userController.exportUserList,
      data: data
    })
  }
  /**
   * 查询部门下的用户
   * @param deptCode 部门ID
   */
  queryNoPage(data) {
    return this.netService.send({
      server: businessService.userController.queryNoPage,
      data: {
        deptId: data.deptId,
        deptCode: data.deptCode,
        id: data.id
      }
    })
  }
  queryUserByDeptAndRole(data, page) {
    return this.netService.send({
      server: businessService.userController.queryUserByDeptAndRole,
      data: {
        deptCode: data.deptCode,
        userName: data.userName,
        realName: data.realName,
        roleId: data.roleId,
        roleName: data.roleName
      },
      page: page
    })
  }
  queryUserByDeptAndType(data, page) {
    return this.netService.send({
      server: businessService.userController.queryUserByDeptAndType,
      data: {
        deptCode: data.deptCode,
        userName: data.userName,
        realName: data.realName,
        roleId: data.roleId,
        roleName: data.roleName,
        modelType: data.modelType
      },
      page: page
    })
  }
  /**
   * 修改用户
   */
  @Debounce()
  updateUser(data) {
    return this.netService.send({
      server: businessService.userController.updateUser,
      data
    })
  }
  /**
   * 手动刷新缓存
   */
  flushCache() {
    return this.netService.send({
      server: businessService.userController.flushCache,
    })
  }
}

