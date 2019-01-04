import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class ExportItemsService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 系统参数带条件的分页查询
   */
  @Debounce()
  saveExportItems(paramData: any) {
    return this.netService.send({
      server: businessService.exportItemsController.saveExportItems,
      data: paramData
    })
  }

  @Debounce()
  getExportItems(category: number) {
    return this.netService.send({
      server: businessService.exportItemsController.getExportItems,
      data: {
        category: category
      }
    })
  }
  /**
   * 查询委外导出项
   */
  getOutsourceExportItems(category) {
    return this.netService.send({
      server: businessService.exportItemsController.getOutsourceExportItems,
      data: {
        category: category
      }
    })
  }
  /**
   * 设置委外导出项
   */
  @Debounce()
  saveOutsourceExportItems(data) {
    return this.netService.send({
      server: businessService.exportItemsController.saveOutsourceExportItems,
      data
    })
  }
  /**
   * 查询更新项
   */
  getUpdateItems(companyCode) {
    return this.netService.send({
      server: businessService.exportItemsController.getUpdateItems,
      data: {
        companyCode: companyCode
      }
    })
  }
  /**
   * 设置更新项
   */
  @Debounce()
  saveUpdateItems(data) {
    return this.netService.send({
      server: businessService.exportItemsController.saveUpdateItems,
      data: {
        bankItems: data.bankItems,
        personalItems: data.personalItems,
        jobItems: data.jobItems,
        caseItems: data.caseItems,
        followItems: data.followItems,
        connectItems: data.connectItems
      }
    })
  }
}
