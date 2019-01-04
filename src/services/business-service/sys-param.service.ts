import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class SysParamService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 系统参数带条件的分页查询
   */
  @Debounce()
  query(data, page) {
    return this.netService.send({
      server: businessService.sysParamController.query,
      data: data,
      page: page
    })
  }
  /**
   * 新增/修改系统参数
   */
  @Debounce()
  createSysParam(data) {
    return this.netService.send({
      server: businessService.sysParamController.createSysParam,
      data: data
    })
  }
  /**
   * 修改模板地址
   */
  @Debounce()
  modifyTemplateUrl(data) {
    return this.netService.send({
      server: businessService.sysParamController.modifyTemplateUrl,
      data: data
    })
  }
}
