import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'userBackcashPlanController'

export default {
  /**
   * 月度回款金额管理列表
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  },
  importBackAmtGoalExcel:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importBackAmtGoalExcel',
    type: requestType.Post
  },
  /**
   * 批量删除
   */
  deleteManyUserBackcashPlan:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteManyUserBackcashPlan',
    type: requestType.Post
  },
  /**
   * 删除
   */
  deleteUserBackcashPlan:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteUserBackcashPlan',
    type: requestType.Delete
  },
  /**
   * 下载月度回款目标Excel模版
   */
  downloadUserBackcashPlanExcelTemplate:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'downloadUserBackcashPlanExcelTemplate',
    type: requestType.Get
  },
  /**
   * 更新用户计划回款
   */
  updateUserBackcashPlan:{
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateUserBackcashPlan',
    type: requestType.Post
  }
}
