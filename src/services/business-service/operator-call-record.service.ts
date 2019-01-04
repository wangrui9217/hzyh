import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class OperatorCallRecordController {

    @Inject(NetService)
    private netService: NetService

    /**
     * 发送邮件催收
     */
    @Debounce()
    getRecordByPersonId(data, page, sort) {
        return this.netService.send({
            server: businessService.operatorCallRecordController.getRecordByPersonId,
            data,
            page,
            sort
        })
    }
}
