import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from '~/core/service'

export class ProcessInfoService extends Service {
  @Inject(NetService)
  private netService: NetService

  /**
   * 审批链的创建
   */
  @Debounce()
  saveProcessTask(data) {
    return this.netService.send({
      server: businessService.processInfoController.saveProcessTask,
      data
    })
  }
  /**
   * 审批链列表展示
   */
  queryFlowTaskList(data, page?) {
    return this.netService.send({
      server: businessService.processInfoController.queryFlowTaskList,
      data,
      page
    })
  }
  /**
   * 根据任务id查询节点信息
   */
  getTaskInfoList(taskId) {
    return this.netService.send({
      server: businessService.processInfoController.getTaskInfoList,
      data: {
        taskId: taskId
      }
    })
  }
  /**
   * 获取所有的任务（下拉框使用）
   */
  getFlowTaskAll() {
    return this.netService.send({
      server: businessService.processInfoController.getFlowTaskAll
    })
  }
  /**
   * 获取审批过的历史记录（在展示待审批列表的操作）
   */
  getTaskHistoryList(data) {
    return this.netService.send({
      server: businessService.processInfoController.getTaskHistoryList,
      data
    })
  }
}
