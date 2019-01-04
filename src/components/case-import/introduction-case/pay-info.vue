<template>
  <section class="component pay-info">
    <el-col class="frame">
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>产品信息</span>
      </div>
      <data-grid :labelWidth="100" labelAlign="right" contentAlign="left">
        <data-grid-item label="产品系列：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.productSeriesName}}</data-grid-item>
        <data-grid-item label="产品名称：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.productName}}</data-grid-item>
        <data-grid-item label="期数(期)：" :span="4" :min-width="$helper.getColumnWidth(2)"></data-grid-item>
        <data-grid-item label="年利率(%)：" :span="4" :min-width="$helper.getColumnWidth(2)"></data-grid-item>
        <data-grid-item label="还款方式：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.payment}}</data-grid-item>
        <data-grid-item label="综合利率(%)：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.multipleRate}}</data-grid-item>
        <data-grid-item label="罚息费率(%/天)：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.interestRate}}</data-grid-item>
        <data-grid-item label="罚息金额(元/天)：" :span="4" :min-width="$helper.getColumnWidth(2)"></data-grid-item>
        <data-grid-item label="合同违约金费率(%)：" :span="4" :min-width="$helper.getColumnWidth(2)">{{params.contractViolateRate}}</data-grid-item>
        <data-grid-item label="提前还款违约金费率(%)：" :span="4" :min-width="$helper.getColumnWidth(2)"></data-grid-item>
        <data-grid-item label="分期服务费费率(%/月)：" :span="8" :min-width="$helper.getColumnWidth(2)">{{params.stagingServicesRate}}</data-grid-item>
      </data-grid>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>还款信息</span>
      </div>
      <data-grid :labelWidth="100" labelAlign="right" contentAlign="left">
        <data-grid-item label="还款期数：" :span="3">{{params.periods}}</data-grid-item>
        <data-grid-item label="剩余期数：" :span="3">{{params.leftPeriods}}</data-grid-item>
        <data-grid-item label="逾期期数：" :span="3">{{params.paymentStatus}}</data-grid-item>
        <data-grid-item label="账龄：" :span="3">{{params.accountAge}}</data-grid-item>
        <data-grid-item label="授信金额(元)：" :span="3">{{params.creditMoney}}</data-grid-item>
        <data-grid-item label="合同金额(元)：" :span="3">{{params.contractAmount}}</data-grid-item>
        <data-grid-item label="逾期总金额(元)：" :span="3">{{params.overdueAmount}}</data-grid-item>
        <data-grid-item label="逾期本金(元)：" :span="3">{{params.overdueCapital}}</data-grid-item>
        <data-grid-item label="逾期利息(元)：" :span="3">{{params.overDueInterest}}</data-grid-item>
        <data-grid-item label="逾期罚息(元)：" :span="3">{{params.overdueFine}}</data-grid-item>
        <data-grid-item label="逾期滞纳金(元)：" :span="3">{{params.overdueDelayFine}}</data-grid-item>
        <data-grid-item label="已还款金额(元)：" :span="3">{{params.hasPayAmount}}</data-grid-item>
        <data-grid-item label="已还款期数：" :span="3">{{params.hasPayPeriods}}</data-grid-item>
        <data-grid-item label="最近还款金额(元)：" :span="3">{{params.latelyPayAmount}}</data-grid-item>
        <data-grid-item label="最近还款日期：" :span="6">{{params.latelyPayDate | dateFormat('yyyy-MM-dd')}}</data-grid-item>
        <data-grid-item label="合同编号：" :span="3">{{params.contractNumber}}</data-grid-item>
        <data-grid-item label="贷款日期：" :span="3">{{params.loanDate | dateFormat('yyyy-MM-dd')}}</data-grid-item>
        <data-grid-item label="剩余本金：" :span="3">{{params.leftCapital}}</data-grid-item>
        <data-grid-item label="剩余利息：" :span="3">{{params.leftInterest}}</data-grid-item>
        <data-grid-item label="首次还款日：" :span="6">{{ params.firstPayDate | dateFormat('yyyy-MM-dd')}}</data-grid-item>
        <data-grid-item label="备注：" :span="6">{{params.memo}}</data-grid-item>
      </data-grid>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>还款明细</span>
      </div>
      <data-box  ref="data-box">
        <template slot="columns">
          <el-table-column prop="periods" label="还款期数" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="payDate" label="还款日期" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="totalAmt" label="应还金额" :min-width="$helper.getColumnWidth(2)" align="right">
          </el-table-column>
          <el-table-column prop="princial" label="应还本金" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="interest" label="应还利息" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="mangementCost" label="应还平台管理费" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="penalty" label="应还罚息" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="penalSum" label="应还违约金" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="overDays" label="逾期天数" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="overPenalty" label="逾期罚息" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="overPenalSum" label="逾期违约金" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="leftPenalty" label="剩余罚息" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="leftPrincipal" label="剩余本金" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="leftInterest" label="剩余利息" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
          <el-table-column prop="leftMangementCost" label="剩余管理费" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
        </template>
      </data-box>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>还款记录</span>
      </div>
      <data-box  ref="data-box">
        <template slot="columns">
          <el-table-column prop="periods" label="期数">
          </el-table-column>
          <el-table-column prop="totalPayment" label="还款总额(元)">
          </el-table-column>
          <el-table-column prop="paymentType" label="还款类型">
            <template slot-scope="scope">
              <span>{{scope.row.paymentType | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="当时状态">
          </el-table-column>
          <el-table-column prop="paymentTime" label="还款时间">
            <template slot-scope="scope">
              <span>{{scope.row.paymentTime|dateTimeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人">
          </el-table-column>
          <el-table-column prop="paymentVoucher" label="还款凭证">
          </el-table-column>
        </template>
      </data-box>

    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { CustomerRepaymentPlanController } from "~/services/business-service/customer-repayment-plan.service";
import DataBox from "~/components/common/data-box.vue";
import { Layout, Dependencies } from "~/core/decorator";
import { Watch, Prop } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import { DataInfoExcelService} from "../../../services/dataimp-service/data-info-excel.service";
@Component({
  components: {
    DataBox,
    SvgIcon,
    DataGrid,
    DataGridItem
  }
})
export default class PayInfo extends Vue {
  @Dependencies(CustomerRepaymentPlanController)
  private customerRepaymentPlanController: CustomerRepaymentPlanController;
  @Dependencies(DataInfoExcelService) private dataInfoExcelService: DataInfoExcelService;

  private params :any ={}

  refresh(data) {
    this.params = data
    // this.data = {
    //   product: {
    //     productDetailList: [{}]
    //   },
    //   message: {},
    //   payDetail: [],
    //   record: []
    // }
    // this.type = pay.type
    // if (pay.type === 'IMPORT') {
    //   this.importSend(pay)
    // } else {
    //   this.ortherSend(pay)
    // }
  }
}
</script>

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
