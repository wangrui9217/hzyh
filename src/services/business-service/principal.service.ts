import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class PrincipalService extends Service {

  @Inject()
  private netService: NetService

  /**
   * 获取委托方列表
   */
  getPrincipalList(companyCode) {
    return this.netService.send({
      server: businessService.principalController.getPrincipalList,
      data: {
        companyCode
      }
    })
  }
  /**
   * 新增/修改委托方信息
   */
  @Debounce()
  createPrincipal(data) {
    return this.netService.send({
      server: businessService.principalController.createPrincipal,
      data: data
    })
  }
  /**
  * 删除委托方
  */
  deletePrincipal(id) {
    return this.netService.send({
      server: businessService.principalController.deletePrincipal,
      data: {
        id: id
      }
    })
  }
  /**
  * 获取委托方分页查询
  */
  getPrincipalPageList(data, page?) {
    return this.netService.send({
      server: businessService.principalController.getPrincipalPageList,
      data: data,
      page: page
    })
  }
}

