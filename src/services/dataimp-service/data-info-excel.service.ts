import { dataimpService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator"
import { Service } from "~/core/service"

export class DataInfoExcelService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 案件导入数据
   */
  @Debounce()
  getDataInfoExcelList(data, page) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.getDataInfoExcelList,
      data:{
        custName: data.custName,
        caseAmt: data.caseAmt,
        overDueDays: [data.overDueDays.min, data.overDueDays.max], // 逾期天数
        overdueAmount: [data.overdueAmount.min,data.overdueAmount.max], // 案件金额
        batchNumber: data.batchNumber,
        prinName: data.prinName,
        cupoName: data.cupoName,
        cupoStatus: data.cupoStatus,
        cupoGettime: data.cupoGettime,
        companyCode: data.companyCode,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        color: data.color,
        dayRange: data.dayRange,
        caseMoney: data.caseMoney,
        caseMark: data.caseMark
      },
      page
    })
  }
  /**
   * 案件导入确定
   */
  @Debounce()
  importExcelData(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.importExcelData,
      data
    })
  }
  /**
   * 获取批次号列表
   */
  @Debounce()
  queryBatchNumGroup(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.queryBatchNumGroup,
      data
    })
  }
  @Debounce()
  checkCasesFile(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.checkCasesFile,
      data
    })
  }
  @Debounce()
  casesConfirmByBatchNum(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.casesConfirmByBatchNum,
      data: data
    })
  }
  @Debounce()
  deleteCasesByBatchNum(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.deleteCasesByBatchNum,
      data
    })
  }
  @Debounce()
  exportError(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.exportError,
      data
    })
  }
  @Debounce()
  findUpload(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.findUpload,
      data: data
    })
  }
  @Debounce()
  getDataInfoExcelDetails(data) {
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.getDataInfoExcelDetails,
      data: data
    })
  }
  @Debounce()
  loadTemplate(){
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.loadTemplate
    })
  }
  @Debounce()
  specialAndStopLoadTemplate(){
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.specialAndStopLoadTemplate
    })
  }
  @Debounce()
  uploadCaseFileSingle(data){
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.uploadCaseFileSingle,
      data:data
    })
  }
  @Debounce()
  findError(data){
    return this.netService.send({
      server: dataimpService.dataInfoExcelController.findError,
      data:data
    })
  }
}
