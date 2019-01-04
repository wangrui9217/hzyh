import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from "~/core/service"

export class PersonalInformationService extends Service {

  @Inject(NetService)
  private netService: NetService

  /**
   * 案件详情页获取客户信息
   */
  getPersonalByCaseId(data) {
    return this.netService.send({
      server: businessService.personalInformationController.getPersonalByCaseId,
      data:{
        caseId: data
      }
    })
  }

  /**
   * 案件详情页获取还款信息
   */
  getCaseInformationModelByCaseId(data) {
    return this.netService.send({
      server: businessService.personalInformationController.getCaseInformationModelByCaseId,
      data:{
        caseId: data
      }
    })
  }

  /**
   * 案件详情页获取附件信息
   */
  getCaseFIleModelByCaseId(data){
    return this.netService.send({
      server: businessService.personalInformationController.getCaseFIleModelByCaseId,
      data:{
        caseId: data
      }
    })
  }

}
