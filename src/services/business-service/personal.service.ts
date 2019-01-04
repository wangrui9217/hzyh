import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class PersonalService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 查询案件流转记录
   */
  getCaseTurnRecord(caseNumber) {
    return this.netService.send({
      server: businessService.personalController.getCaseTurnRecord,
      data: {
        caseNumber
      }
    })
  }
  /**
   * 客户信息导出
   */
  personalInfoExport(data) {
    return this.netService.send({
      server: businessService.personalController.personalInfoExport,
      data: data
    })
  }
  /**
   * 通讯录
   */
  getPersonalPhones(data, page) {
    return this.netService.send({
      server: businessService.personalController.getPersonalPhones,
      data,
      page
    })
  }
  /**
   * 查询客户地图
   */
  @Debounce()
  getMapInfo(address) {
    return this.netService.send({
      server: businessService.personalController.getMapInfo,
      data: {
        address
      }
    })
  }
}
