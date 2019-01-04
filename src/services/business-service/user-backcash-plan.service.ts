import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";


export class UserBackcashPlanService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 月度回款金额管理列表
   */
  @Debounce()
  query(data, page) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.query,
      data: data,
      page: page
    })
  }
  @Debounce()
  importBackAmtGoalExcel(data) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.importBackAmtGoalExcel,
      data
    })
  }
  /**
   * 批量删除
   */
  @Debounce()
  deleteManyUserBackcashPlan(data) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.deleteManyUserBackcashPlan,
      data
    })
  }
  /**
   * 删除
   */
  @Debounce()
  deleteUserBackcashPlan(data) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.deleteUserBackcashPlan,
      data
    })
  }
  /**
   * 下载月度回款目标Excel模版
   */
  @Debounce()
  downloadUserBackcashPlanExcelTemplate(data) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.downloadUserBackcashPlanExcelTemplate,
      data
    })
  }
  /**
   * 更新用户计划回款
   */
  @Debounce()
  updateUserBackcashPlan(data) {
    return this.netService.send({
      server: businessService.userBackcashPlanController.updateUserBackcashPlan,
      data
    })
  }
}
