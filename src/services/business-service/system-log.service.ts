import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service'
export class SystemLogService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 查询特定公司的日志
   */
  @Debounce()
  query(data, page,sort) {
    return this.netService.send({
      server: businessService.systemLogController.query,
      data: {
        companyCode: data.companyCode,
        operator: data.operator,
        operatorTimeStart: FilterService.dateRanageFormat(data.operatorTime).start,
        operatorTimeEnd: FilterService.dateRanageFormat(data.operatorTime).end,
        remark: data.remark
      },
      page: page,
      sort:sort
    })
  }
}
