import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class DepartmentService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 查询用户所属部门及子部门
   */
  @Debounce()
  queryOwnDepartment() {
    return this.netService.send({
      server: businessService.departmentController.queryOwnDepartment
    })
  }
  /**
   * 查询所属公司的部门
   */
  queryAllDepartment(data) {
    return this.netService.send({
      server: businessService.departmentController.queryAllDepartment,
      data: data
    })
  }
  /**
   * 查询所属公司门店
   */
  queryShopDept(data) {
    return this.netService.send({
      server: businessService.departmentController.queryShopDept,
      data
    })
  }

  /**
   * 查询用户所在的子部门
   */
  queryDepartmentList() {
    return this.netService.send({
      server: businessService.departmentController.queryDepartmentList,
    })
  }
  /**
   * 移动组织结构
   */
  moveDepartment(data) {
    return this.netService.send({
      server: businessService.departmentController.moveDepartment,
      data
    })
  }
  /**
   * 移动组织结构
   */
  deleteDepartment(id: string) {
    return this.netService.send({
      server: businessService.departmentController.deleteDepartment,
      data: {
        id: id
      }
    })
  }
  /**
  * 修改部门
  */
  @Debounce()
  updateDepartment(data) {
    return this.netService.send({
      server: businessService.departmentController.updateDepartment,
      data
    })
  }
  /**
   * 组织机构的type属性
   */
  getDepartmentType() {
    return this.netService.send({
      server: businessService.departmentController.getDepartmentType,
    })
  }

  /**
   * 组织机构的Level属性
   */
  getDepartmentLevel() {
    return this.netService.send({
      server: businessService.departmentController.getDepartmentLevel,
    })
  }
  /**
   * 增加部门
   */
  @Debounce()
  createDepartment(data) {
    return this.netService.send({
      server: businessService.departmentController.createDepartment,
      data
    })
  }
}
