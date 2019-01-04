import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class RoleService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 分页查询角色资源
   */
  getAllRolePage(data,page) {
    return this.netService.send({
      server: businessService.roleController.getAllRolePage,
      data,
      page
    })
  }
  /**
   * 查询角色资源
   */
  getAllRoles() {
    return this.netService.send({
      server: businessService.roleController.getAllRoles
    })
  }
  /**
   * 新增角色
   */
  @Debounce()
  createRole(data) {
    return this.netService.send({
      server: businessService.roleController.createRole,
      data: data
    })
  }
  /**
   * 更新角色
   */
  @Debounce()
  updateRole(data) {
    return this.netService.send({
      server: businessService.roleController.updateRole,
      data
    })
  }
  /**
   * 删除角色
   */
  @Debounce()
  deleteRole(data) {
    return this.netService.send({
      server: businessService.roleController.deleteRole,
      data
    })
  }
  /**
   * 根据id查找角色
   */
  getRoleById(id) {
    return this.netService.send({
      server: businessService.roleController.getRole,
      append: id
    })
  }
  /**
   * 角色查找资源
   */
  getRole(data) {
    return this.netService.send({
      server: businessService.roleController.getRole,
      data
    })
  }
  /**
   * 获取全部角色
   */
  queryAllRole() {
    return this.netService.send({
      server: businessService.roleController.queryAllRole
    })
  }

  /**
   * 根据角色ID 获取角色的资源
   * @Param rolesId:String 角色ID
   */
  getRoleResource(roleId:String){
    return this.netService.send({
      server: businessService.roleController.getRoleById,
      data:{
        id: roleId
      }
    })
  }
}

