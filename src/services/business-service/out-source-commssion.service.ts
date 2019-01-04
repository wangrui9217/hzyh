import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class OutSourceCommssionService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 新增/修改委外佣金
   */
  @Debounce()
  createOutSourceCommssion(outsourceCommissionList) {
    return this.netService.send({
      server: businessService.outSourceCommssionController.createOutSourceCommssion,
      data: {
        outsourceCommissionList
      }
    })
  }
  /**
   * 删除委外佣金
   */
  @Debounce()
  deleteOutsourceCommission(ids) {
    return this.netService.send({
      server: businessService.outSourceCommssionController.deleteOutsourceCommission,
      data: {
        ids
      }
    })
  }
  /**
   * 导出佣金报表
   */
  @Debounce()
  exportReport(data) {
    return this.netService.send({
      server: businessService.outSourceCommssionController.exportReport,
      data
    })
  }
  /**
   * 根据委外方id和公司code码查询委外佣金
   */
  @Debounce()
  getOutSourceCommission(data) {
    return this.netService.send({
      server: businessService.outSourceCommssionController.getOutSourceCommission,
      data
    })
  }
  /**
   * 委外佣金报表
   */
  @Debounce()
  outsourceCommissionForm(data) {
    return this.netService.send({
      server: businessService.outSourceCommssionController.outsourceCommissionForm,
      data
    })
  } 
}
