import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service'

export class CallReportService {
    @Inject(NetService)
    private netService: NetService

    /**
     * 双向外呼通话个数统计
     */
    getCountSmaRecord(data) {
        return this.netService.send({
            server: businessService.callReportController.getCountSmaRecord,
            data: {
                companyCode: data.companyCode,
                startTime: FilterService.dateRanageFormat(data.time).start,
                endTime: FilterService.dateRanageFormat(data.time).end
            }
        })
    }
    /**
     * 双向外呼通话时长统计
     */
    getCountTimeSmaRecord(data) {
        return this.netService.send({
            server: businessService.callReportController.getCountTimeSmaRecord,
            data: {
                companyCode: data.companyCode,
                startTime: FilterService.dateRanageFormat(data.time).start,
                endTime: FilterService.dateRanageFormat(data.time).end
            }
        })
    }
    /**
     * 查询对呼数据
     */
    query(data, page, sort?) {
        return this.netService.send({
            server: businessService.callReportController.query,
            data: {
                companyCode: data.companyCode,
                callType: data.callType,
                operatorName: data.operatorName
            },
            page: page,
            sort: sort
        })
    }
}
