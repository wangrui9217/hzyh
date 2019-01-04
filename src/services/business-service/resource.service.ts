import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class ResourceService {

  @Inject()
  private netService: NetService

  /**
   * 查询所有资源
   */
  getAllResource() {
    return this.netService.send({
      server: businessService.resourceController.getAllResource
    })
  }
  /**
   * 按ID查询资源
   */
  getResource(id) {
    return this.netService.send({
      server: businessService.resourceController.getResource,
      append: id
    })
  }
  /**
   * 资源添加角色
   */
  resourceAddRole(data) {
    return this.netService.send({
      server: businessService.resourceController.resourceAddRole,
      data
    })
  }
  /**
  * 修改资源
  */
  updateResource(data) {
    return this.netService.send({
      server: businessService.resourceController.updateResource,
      data
    })
  }
}

