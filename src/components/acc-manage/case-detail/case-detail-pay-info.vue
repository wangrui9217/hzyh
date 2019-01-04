<template>
  <section class="component case-detail-pay-info">
    <el-col class="frame">
      <div type="flex" align="left" class="data-grid-title">
      <svg-icon iconName="kaihuxinxi"></svg-icon>
      <span>贷款商品信息</span>
      </div>
      <div style="margin-bottom:10px">● 贷款商品类型</div>
      <data-grid :labelWidth="150" contentAlign="left">
        <data-grid-item label="产品类型：" :span="3" min-width="120px">{{repayInfo.seriesName}}</data-grid-item>
        <data-grid-item label="产品名称：" :span="3" min-width="120px">{{repayInfo.productName}}</data-grid-item>
        <data-grid-item label="活动项目编号：" :span="3" min-width="120px">{{orderInfo.promotionNumber}}</data-grid-item>
        <data-grid-item label="申请渠道代码：" :span="3" min-width="120px">{{orderInfo.channelNumber}}</data-grid-item>
      </data-grid>

      <div style="margin:10px 0">● 贷款商品</div>
      <data-box :data="commodities" hiddenIndex>
        <template slot="columns">
          <el-table-column prop="commType" label="商品类型">
            <template slot-scope="scope">
              {{Number(scope.row.commType) | dictConvert}}
            </template>
          </el-table-column>
          <el-table-column prop="commBrand" label="商品品牌(代银)"></el-table-column>
          <el-table-column prop="commModel" label="商品型号(账号)"></el-table-column>
          <el-table-column prop="commPrice" label="商品价格(贷款)"></el-table-column>
        </template>
      </data-box>

      <div style="margin:10px 0">● 消费贷款信息</div>
      <data-grid :labelWidth="150" contentAlign="left">
        <data-grid-item label="账单周期：" :span="3" min-width="120px">{{orderInfo.billCycle}}</data-grid-item>
        <data-grid-item label="首次还款日：" :span="3" min-width="120px">{{orderRepaymentPlan.firstDueDate | dateFormat}}</data-grid-item>
        <data-grid-item label="每月还款额：" :span="3" min-width="120px">{{orderRepaymentPlan.monthAmt}}</data-grid-item>
        <data-grid-item label="还款计划类型：" :span="3" min-width="120px">{{orderRepaymentPlan.amorzType | dictConvert}}</data-grid-item>
        <data-grid-item label="年利率：" :span="3" min-width="120px">{{orderRepaymentPlan.yearRate}}</data-grid-item>
        <data-grid-item label="还款方式：" :span="3" min-width="120px">{{Number(orderRepaymentPlan.repayMethod) | dictConvert}}</data-grid-item>
        <data-grid-item label="罚息利率：" :span="3" min-width="120px">{{orderRepaymentPlan.penaltyRate}}</data-grid-item>
        <data-grid-item label="提前还款违约金费率：" :span="3" min-width="120px">{{orderRepaymentPlan.advancePaymentRate}}</data-grid-item>
        <data-grid-item label="分期服务费费率：" :span="3" min-width="120px">{{orderRepaymentPlan.stagingFeeRate}}</data-grid-item>
        <data-grid-item label="是否还后续贷：" :span="3" min-width="120px">{{orderRepaymentPlan.repaySubloanWether}}</data-grid-item>
        <data-grid-item label="贷款状态(核销)：" :span="3" min-width="120px">{{Number(orderInfo.loanStatus) | dictConvert}}</data-grid-item>
        <data-grid-item label="黑名单标记：" :span="3" min-width="120px">{{Number(orderRepaymentPlan.blackFlag) | dictConvert}}</data-grid-item>
        <data-grid-item label="销售门店代码：" :span="3" min-width="120px">{{orderInfo.storeNumber}}</data-grid-item>
        <data-grid-item label="销售代表姓名：" :span="3" min-width="120px">{{orderInfo.saleName}}</data-grid-item>
        <data-grid-item label="销售代表手机号：" :span="3" min-width="120px">{{orderInfo.saleNamePhone}}</data-grid-item>
        <data-grid-item label="最高额抵押标记：" :span="3" min-width="120px">{{Number(orderRepaymentPlan.maxMortgageMark) | dictConvert}}</data-grid-item>
        <data-grid-item label="主贷款申请号：" :span="3" min-width="120px">{{orderRepaymentPlan.mainApplyNumber}}</data-grid-item>
        <data-grid-item label="主贷款标识：" :span="3" min-width="120px">{{Number(orderRepaymentPlan.mainLoanLogo) | dictConvert}}</data-grid-item>
        <data-grid-item label="案件归属地：" :span="3" min-width="120px">{{repayInfo.areaName}}</data-grid-item>
        <data-grid-item label="销售代表备注：" :span="3" min-width="120px">{{orderRepaymentPlan.salesRemark}}</data-grid-item>
      </data-grid>
      <!-- 应甲方稽核部要求，取消案件详情页中  “贷款审批信息” 展示。 bug单 582 -->
      <!-- <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>贷款审批信息</span>
      </div>
      <data-grid :labelWidth="150" contentAlign="left">
        <data-grid-item label="人行征信评分：" :span="4" min-width="120px">{{orderRepaymentPlan.pbocScore}}</data-grid-item>
        <data-grid-item label="决定代码：" :span="4" min-width="120px">{{orderRepaymentPlan.decisionNo}}</data-grid-item>
        <data-grid-item label="决定原因：" :span="4" min-width="120px">{{orderRepaymentPlan.decisionReason}}</data-grid-item>
        <data-grid-item label="居住证明核查-备注：" :span="12" min-width="120px">{{material.residentDocMemo}}</data-grid-item>
        <data-grid-item label="居住证明-审批备注：" :span="12" min-width="120px">{{material.residentApproveMemo}}</data-grid-item>
        <data-grid-item label="收入证明核查-备注：" :span="12" min-width="120px">{{material.incomeDocMemo}}</data-grid-item>
        <data-grid-item label="收入证明-审批备注：" :span="12" min-width="120px">{{material.incomeApproveMemo}}</data-grid-item>
        <data-grid-item label="单位电话-调查结果：" :span="12" min-width="120px">{{material.cophoneExistind}}</data-grid-item>
        <data-grid-item label="单位电话-备注：" :span="12" min-width="120px">{{material.cophoneMemo}}</data-grid-item>
        <data-grid-item label="单位电话-审批备注：" :span="12" min-width="120px">{{material.cophoneApproveMemo}}</data-grid-item>
        <data-grid-item label="家庭电话-备注：" :span="12" min-width="120px">{{material.residentDocMemo}}</data-grid-item>
        <data-grid-item label="家庭电话-审批备注：" :span="12" min-width="120px">{{material.homePhoneApproveMemo}}</data-grid-item>
        <data-grid-item label="本人手机-备注：" :span="12" min-width="120px">{{material.mobileMemo}}</data-grid-item>
        <data-grid-item label="本人手机-审批备注：" :span="12" min-width="120px">{{material.mobileApproveMemo}}</data-grid-item>
        <data-grid-item label="其他联系人-备注：" :span="12" min-width="120px">{{material.relativeMemo}}</data-grid-item>
        <data-grid-item label="系统校验-备注：" :span="12" min-width="120px">{{material.inetMemo}}</data-grid-item>
        <data-grid-item label="备注：" :span="12" min-width="120px">{{material.remarks}}</data-grid-item>
      </data-grid> -->

      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>还款信息</span>
      </div>
      <data-grid :totalSpan="10" :labelWidth="150" contentAlign="left">
        <data-grid-item label="逾期本金：" :span="2" min-width="120px">{{repayInfo.overdueCapital}}</data-grid-item>
        <data-grid-item label="逾期期数：" :span="2" min-width="120px">{{repayInfo.overduePeriods}}</data-grid-item>
        <data-grid-item label="逾期天数：" :span="2" min-width="120px">{{repayInfo.overdueDays}}</data-grid-item>
        <data-grid-item label="逾期最大天数：" :span="2" min-width="120px">{{repayInfo.maxOverdueDays}}</data-grid-item>
        <data-grid-item label="最近一次应还日期：" :span="2" min-width="120px">{{repayInfo.latesDateReturn | dateFormat}}</data-grid-item>
        <data-grid-item label="逾期总金额：" :span="2" min-width="120px">{{repayInfo.overdueAmount}}</data-grid-item>
        <data-grid-item label="已还期数：" :span="2" min-width="120px">{{repayInfo.hasPayPeriods}}</data-grid-item>
        <data-grid-item label="剩余期数：" :span="2" min-width="120px">{{repayInfo.leftPeriods}}</data-grid-item>
        <data-grid-item label="未偿还本金：" :span="2" min-width="120px">{{repayInfo.unpaidPrincipal}}</data-grid-item>
        <data-grid-item label="未偿还利息：" :span="2" min-width="120px">{{repayInfo.unpaidInterest}}</data-grid-item>
        <data-grid-item label="未偿还罚息：" :span="2" min-width="120px">{{repayInfo.unpaidFine}}</data-grid-item>
        <data-grid-item label="未偿还其他利息：" :span="2" min-width="120px">{{repayInfo.unpaidOtherInterest}}</data-grid-item>
        <data-grid-item label="未偿还管理费：" :span="2" min-width="120px">{{repayInfo.unpaidMthFee}}</data-grid-item>
        <data-grid-item label="未偿还其他费用" :span="2" min-width="120px">{{repayInfo.unpaidOtherFee}}</data-grid-item>
        <data-grid-item label="未偿还滞纳金：" :span="2" min-width="120px">{{repayInfo.overdueCapital}}</data-grid-item>
        <data-grid-item label="当前未结罚息复利：" :span="2" min-width="120px">{{repayInfo.unpaidLpc}}</data-grid-item>
        <data-grid-item label="最近一期还款日期：" :span="2" min-width="120px">{{repayInfo.latelyPayDate | dateFormat}}</data-grid-item>
        <data-grid-item label="最近一次还款金额：" :span="2" min-width="120px">{{repayInfo.latelyPayAmount}}</data-grid-item>
        <data-grid-item label="剩余本金：" :span="2" min-width="120px">{{repayInfo.leftCapital}}</data-grid-item>
        <data-grid-item label="剩余利息：" :span="2" min-width="120px">{{repayInfo.leftInterest}}</data-grid-item>
        <data-grid-item label="剩余月服务费：" :span="2" min-width="120px">{{repayInfo.remainFee}}</data-grid-item>
        <data-grid-item label="逾期账户数：" :span="2" min-width="120px">{{repayInfo.overdueAccountNumber}}</data-grid-item>
        <data-grid-item label="内催次数：" :span="2" min-width="120px">{{repayInfo.inColcnt}}</data-grid-item>
        <data-grid-item label="外包次数：" :span="2" min-width="120px">{{repayInfo.outColcnt}}</data-grid-item>
        <data-grid-item label="已执行期数：" :span="2" min-width="120px">{{repayInfo.executedPeriods}}</data-grid-item>
      </data-grid>

      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>还款明细</span>
      </div>
      <data-box :data="repaymentDetail" hiddenIndex>
        <template slot="columns">
          <el-table-column prop="payPeriod" label="还款期数" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payDate" label="还款日期" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              {{scope.row.payDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="payAmt" label="应还金额" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payPrincipal" label="应还本金" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payInterest" label="应还利息" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payNoun" label="应还复利" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payPlatformFee" label="应还平台管理费" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="payFine" label="应还罚息" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payLiquidated" label="应还违约金" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayPrincipal" label="已偿还本金" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayInterest" label="已偿还利息" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayNoun" label="已偿还复利" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayLiquidated" label="已偿还违约金" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayFine" label="已偿还罚息" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasPayManagement" label="已偿还账户管理费" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="surplusPrincipal" label="剩余本金" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="surplusInterest" label="剩余利息" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="surplusPlatformFee" label="剩余管理费" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="payAmount" label="还款总额" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="payType" label="还款类型" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              {{scope.row.payType | dictConvert}}
            </template>
          </el-table-column>
        </template>
      </data-box>

      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>核销还款明细</span>
      </div>
      <data-box :data="writeOffDetailsList">
        <template slot="columns">
          <el-table-column prop="inaccountDate" label="入账日期" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.inaccountDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="personalNo" label="客户号" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="unpaidPrincipal" label="录入未尝还本金" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="remainPrincipal" label="录入剩余本金" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="unpaidInterest" label="录入未尝还利息" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="verifiNobillInterest" label="录入未出账单利息" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="otherInterest" label="录入其他累计利息" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="pnltInterest" label="录入罚息" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="inFine" label="录入滞纳金" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="monthFee" label="录入月服务费" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="otherFee" label="录入其他管理费" :min-width="$helper.getColumnWidth(6)"></el-table-column>
          <el-table-column prop="terminationInd" label="核销结清标识" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="hasTotal" label="还款总额" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="settleDate" label="结清日期" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{scope.row.settleDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="requestDate" label="核销请求日期" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              {{scope.row.requestDate | dateFormat}}
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import DataBox from "~/components/common/data-box.vue";
import { Watch, Prop } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import { DataInfoExcelService } from "~/services/dataimp-service/data-info-excel.service";
import { CustomerRepaymentPlanController } from "~/services/business-service/customer-repayment-plan.service";
// import { AccImportExcelData } from '~/services/dataimp-service/acc-import-excel-data.service";

const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataBox,
    SvgIcon,
    DataGrid,
    DataGridItem
  }
})
export default class CaseDetailPayInfo extends Vue {
  @Dependencies(CustomerRepaymentPlanController) private customerRepaymentPlanController: CustomerRepaymentPlanController;
  @Dependencies(DataInfoExcelService) private dataInfoExcelService: DataInfoExcelService;
  // @Dependencies(AccImportExcelData) private accImportExcelData: AccImportExcelData;

  @accManageModule.State('repayInfo') _repayInfo

  @Prop() payType: String
  @Watch('payType')
  onPayTypeChanged() {
    if (this.payType === 'IMPORT') {
      this.importSend('')
    } else {
      this.ortherSend('')
    }
  }

  private message: any = {}
  private payDetail: any = []
  private record: any = []
  private type: any = ''

  // 案件信息
  get repayInfo() {
    return this._repayInfo || {}
  }

  // 订单信息
  get orderInfo() {
    return this._repayInfo.orderInfo || {}
  }

  // 贷款商品
  get commodities() {
    return this.orderInfo.commodities || []
  }

  // 还款明细
  get repaymentDetail() {
    return this._repayInfo.payPlans || []
  }

  get material() {
    return this._repayInfo.material || {}
  }

  get orderRepaymentPlan() {
    return this._repayInfo.orderRepaymentPlan || {}
  }

  // 核销还款明细
  get writeOffDetailsList() {
    return this._repayInfo.writeOffDetailsList || []
  }
    // 产品信息
  get product() {
    return this.repayInfo.product || {}
  }


  // 产品系列
  get productSeries() {
    return this.product.productSeries || {}
  }

  /**
     * 案件导入的数据更新
     */
  importSend(pay) {
    // net.sendAll([{
    //   server: server.CaseManage.get_product_information, // 案件导入的案件详情还款信息的产品信息
    //   data: {
    //     productId: pay.productId
    //   }
    // }, {
    //   server: server.CaseManage.get_repayment_information, // 案件导入的案件详情还款信息的还款信息
    //   data: {
    //     orderId: pay.orderId
    //   }
    // }]).then((data) => {
    //   if (data[0][0]) {
    //     this.data.product = data[0][0]
    //     if (!data[0][0].productDetailList[0]) {
    //       this.data.product.productDetailList = [{}]
    //     }
    //   }
    //   if (data[1][0]) {
    //     this.data.message = data[1][0]
    //   }
    // }, err => {
    //   this.$message({
    //     type: 'info',
    //     message: err.reason
    //   })
    // })
  }
  /**
   * 其他页面的数据更新
   */
  ortherSend(pay) {
    // net.sendAll([{
    //   server: server.CaseManage.get_formalProduct_information, // 案件分配、案件管理、客户查询的案件详情还款信息的产品信息
    //   data: {
    //     productId: pay.productId
    //   }
    // }, {
    //   server: server.CaseManage.get_Repayment_info, // 案件分配、案件管理、客户查询的案件详情还款信息的还款信息
    //   data: {
    //     cupoOrdernum: pay.cupoOrdernum
    //   }
    // }, {
    //   server: server.CaseManage.get_orderPaymentInformation_byOrderNum, // 案件分配、案件管理、客户查询的案件详情还款信息的还款明细、还款记录
    //   data: {
    //     orderNum: pay.orderNum
    //   }
    // }]).then((data) => {
    //   if (data[0]) {
    //     if (data[0].productDetailList) {
    //       this.data.product = data[0]
    //     }
    //   }
    //   this.data.message = data[1]
    //   if (data[2].orderPaymentDetailList) {
    //     this.data.payDetail = data[2].orderPaymentDetailList
    //   }
    //   if (data[2].orderPaymentRecordList) {
    //     this.data.record = data[2].orderPaymentRecordList
    //   }
    //   // this.items = data
    // }, err => {
    //   this.$message({
    //     type: 'info',
    //     message: err.reason
    //   })
    // })
  }

}
</script>
<style lang="less">
.component.case-detail-pay-info {
  .table {
    padding:0!important;
  }
}
</style>
<style lang="less" scoped>
.frame {
  padding: 10px;
  padding-bottom: 0px;
}
.data-grid-title {
  line-height: 39px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  color: #00bbca;
}
</style>
