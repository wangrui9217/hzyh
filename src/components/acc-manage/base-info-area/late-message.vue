<template>
   <section class="compontent late-message">
     <el-card>
      <div slot="header" class="row between-span middle-span top_header">
        <div>逾期信息</div>
      </div>
      <div class="container container1">
        <div class="content">
          <span>未结罚息(元):</span>
          <div>{{caseData.unpaidFine|ellipsis(12)}}</div>
        </div>
         <div class="content">
          <span>贷款期数:</span>
          <div>{{caseData.payPeriod}}期</div>
        </div>
      </div>
      <div class="container">
        <div class="content">
          <span>未结利息(元):</span>
          <div>{{caseData.unpaidInterest}}</div>
        </div>
        <div class="content">
          <span>还款期数:</span>
          <div>{{caseData.hasPayPeriods}}期</div>
        </div>
      </div>
      <div class="container">
        <div class="content">
          <span>逾期本金(元):</span>
          <div>{{caseData.overdueCapital}}</div>
        </div>
        <div class="content">
          <span>逾期期数:</span>
          <div>{{caseData.overduePeriods}}期</div>
        </div>
      </div>
      <div class="container">
        <div class="content">
          <span>逾期利息(元):</span>
          <div>{{caseData.overdueInterest}}</div>
        </div>
        <div class="content">
          <span>逾期天数:</span>
          <div>{{caseData.overdueDays}}天</div>
        </div>
      </div>
      <div class="container">
        <div class="content">
          <span>逾期其他费用(元):</span>
          <div>{{caseData.overdueFine}}</div>
        </div>
        <div class="content">
          <span>贷款金额(元):</span>
          <div>{{caseData.ApprovedLoanAmt}}</div>
        </div>
      </div>
      <div class="container">
       <div class="content">
          <span>逾期金额(元):</span>
          <div>{{caseData.overdueAmount|ellipsis(12)}}</div>
        </div>
      </div>
      <div v-if="caseData&&caseData.cardAddress&&caseData.cardAddress.length>25" class="container">
         <p>身份证地址：{{caseData.cardAddress?caseData.cardAddress:''|ellipsis(25)}}</p>
      </div>
      <div class="container" v-else>身份证地址：{{caseData.cardAddress?caseData.cardAddress:''}}</div>
      <div class="bottom_btn">
        <el-button type="primary" disabled>请求扣款</el-button>
        <span style="margin-left:10px;">扣款状态：扣款成功</span> <span style="margin-left:20px;">案件更新时间：{{updateTime | dateFormat}}</span>
      </div>
     </el-card>
   </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import { FilterService } from "~/utils/filter.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {}
})
export default class LateMessage extends Vue {
  @accManageModule.State caseInfo;
  @Dependencies(CaseInfoService) caseInfoService: CaseInfoService;
  private caseData: any = {};
  private updateTime: any = "";
  /**
   * 获取逾期信息
   */
  refreshData() {
    this.caseInfoService.getOverdueInfo(this.caseInfo.id).subscribe(data => {
      this.caseData = data;
    });
  }
  mounted() {
    this.refreshData();
    this.updateTime = new Date().getTime() - 3600 * 24 * 1000;
  }
}
</script>
<style lang="less">
.late-message {
  .top_header {
    height: 28px;
    display: flex;
  }
  .container1 {
    margin-top: 10px;
  }
  .el-card__body {
    height: 250px;
    font-size: 12px;
    color: rgb(98, 101, 104);
  }
  .container {
    display: flex;
    margin-left: 10px;
    align-items: center;
    margin-bottom: 12px;
  }
  .content {
    display: flex;
    flex: 1;

    div {
      padding: 0 15px;
      margin-left: 15px;
      border-bottom: 1px solid rgb(235, 238, 245);
    }
  }
  .bottom_btn {
    margin-top: 14px;
    button {
      height: 28px;
      line-height: 4px;
      margin-left: 10px;
      font-size: 12px;
    }
  }
}
</style>