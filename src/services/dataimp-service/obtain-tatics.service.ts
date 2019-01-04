import { dataimpService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { Service } from "~/core/service"

export class ObtainTaticsService extends Service{

  @Inject(NetService)
  private netService: NetService

  /**
   * 生成/修改 案件获取数据策略
   */
  @Debounce()
  addObtainTaticsStrategy(data) {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.addObtainTaticsStrategy,
      data
    })
  }


  /**
   * 删除获取数据
   */
  deleteObtainTaticsStrategy(id) {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.deleteObtainTaticsStrategy,
      data: {
        id
      }
    })
  }

  /**
   * 分配策略按条件分页查询
   */
  getObtainTaticsStrategy(data, page?) {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.getObtainTaticsStrategy,
      data,
      page
    })
  }

  /**
    * 获取产品类型
    */
  selectProductSeries() {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.selectProductSeries,
    })
  }




  /**
   * 预览案件生成规则
   */
  @Debounce()
  queryCaseInfoByCondition() {
    return this.netService.send({
      server: dataimpService.caseStrategyController.queryCaseInfoByCondition
    })
  }
  /**
   * 策略分配案件
   */
  @Debounce()
  smartDistribute() {
    return this.netService.send({
      server: dataimpService.caseStrategyController.smartDistribute
    })
  }
  /**
   * 检查策略名称是否重复
   */
  findCaseStrategy(data) {
    return this.netService.send({
      server: dataimpService.caseStrategyController.findCaseStrategy,
      data
    })
  }

  /**
   * 策略分案每天
   */
  everyDayDivisionCase(data) {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.everyDayDivisionCase,
      data
    })
  }

  /**
   * 策略分案月初
   */
  monthEarlyDivisionCase(data) {
    return this.netService.send({
      server: dataimpService.obtainTaticsStrategyController.monthEarlyDivisionCase,
      data
    })
  }

}