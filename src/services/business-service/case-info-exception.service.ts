import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class CaseInfoExceptionService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 检查异常案件
   */
  @Debounce()
  checkExceptionCase(data?) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.checkExceptionCase,
      data
    })
  }
  /**
  * 获取所有异常案件
  */
  @Debounce()
  findAllCaseInfoException(data?, page?) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.findAllCaseInfoException,
      data: {
        companyCode: data.companyCode,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        batchNumber: data.batchNumber,
        overDueDays: [data.overDueDays.min, data.overDueDays.max],
        overdueAmount: [data.overdueAmount.min, data.overdueAmount.max],
        prinName: data.prinName
      },
      page
    })
  }
  /**
   * 添加案件
   */
  @Debounce()
  addCaseInfoException(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.addCaseInfoException,
      data: {
        caseInfoExceptionId: data
      }
    })
  }
  /**
   * 获取所有重复案件
   */
  @Debounce()
  findAllRepeatCaseInfo(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.findAllRepeatCaseInfo,
      data: {
        caseInfoExceptionId: data
      }
    })
  }
  /**
   * 更新案件
   */
  @Debounce()
  updateExceptionCase(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.updateExceptionCase,
      data: {
        caseInfoExceptionId: data.caseInfoExceptionId,
        caseInfoIds: data.caseInfoIds
      }
    })
  }
  /**
   * 删除异常案件
   */
  @Debounce()
  deleteCaseInfoException(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.deleteCaseInfoException,
      data: {
        caseInfoExceptionId: data
      }
    })
  }
  /**
   * 获取所有重复案件
   */
  @Debounce()
  getAllRepeatCaseInfo(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.getAllRepeatCaseInfo,
      data: {
        caseInfoExceptionId: data
      }
    })
  }
  /**
  * 批量删除异常池案件
  */
  @Debounce()
  batchDeleteCaseInfoException(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.batchDeleteCaseInfoException,
      data: {
        ids: data
      }
    })
  }
  /**
  * 批量新增
  */
  @Debounce()
  batchAddCaseInfo(data) {
    return this.netService.send({
      server: businessService.caseInfoExceptionController.batchAddCaseInfo,
      data: {
        ids: data
      }
    })
  }
}
