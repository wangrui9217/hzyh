import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CaseRepairService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 待修复案件查询
   */
  @Debounce()
  getAllRepairingCase(data?, page?) {
    return this.netService.send({
      server: businessService.caseRepairController.getAllRepairingCase,
      data: {
        companyCode: data.companyCode,
        "caseId.personalInfo.name": data.personalName, // 客户姓名
        "caseId.principalId.name": data.principalName, // 委托方
        "caseId.overdueAmount": [data.overdueAmount.min, data.overdueAmount.max], // 修复案件金额-
        repairStatus: data.repairStatus, // 状态
        "caseId.payStatus": data.payStatus, // 逾期期数
        "caseId.overdueDays": [data.overdueDays.min, data.overdueDays.max]//逾期天数

      },
      page: page
    })
  }
  /**
   * 修复附件查看
   */
  viewCaseRepairRecord(data) {
    return this.netService.send({
      server: businessService.caseRepairController.viewCaseRepairRecord,
      data
    })
  }
  /**
 * 查看已修复案件信息
 */
  viewCaseRepair({ id }) {
    return this.netService.send({
      server: businessService.caseRepairController.viewCaseRepair,
      data: {
        id: id
      }
    })
  }
  /**
  * 修复案件状态
  */
  @Debounce()
  toRepair(data) {
    return this.netService.send({
      server: businessService.caseRepairController.toRepair,
      data
    })
  }
  /**
  * 修复分配
  */
  @Debounce()
  distributeRepairCase(data) {
    return this.netService.send({
      server: businessService.caseRepairController.distributeRepairCase,
      data
    })
  }
}

