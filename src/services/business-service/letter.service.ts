import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class LetterService {

    @Inject(NetService)
    private netService: NetService

    /**
     * 打印信函申请
     */
    @Debounce()
    applyLetter(data) {
        return this.netService.send({
            server: businessService.letterController.applyLetter,
            data: data
        })
    }
}

