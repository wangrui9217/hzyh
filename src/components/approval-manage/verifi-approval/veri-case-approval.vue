<template>
  <section class="page veri-case-approval">
    <data-grid :labelWidth="100" labelAlign="right" contentAlign="left">
      <data-grid-item label="客户姓名：" :span="4">{{ paymentData.personalName }}</data-grid-item>
      <data-grid-item label="身份证号：" :span="4">{{ paymentData.idCard }}</data-grid-item>
      <data-grid-item label="手机号：" :span="4">{{ paymentData.mobileNo }}</data-grid-item>
      <data-grid-item label="批次号：" :span="4">{{ paymentData.batchNumber }}</data-grid-item>
      <data-grid-item label="委托方：" :span="4">{{ paymentData.principalName }}</data-grid-item>
      <data-grid-item label="合同编号：" :span="4">{{ paymentData.contractNumber }}</data-grid-item>
      <data-grid-item label="合同金额(元)：" :span="4">{{ paymentData.contractAmount|toThousands }}</data-grid-item>
      <data-grid-item label="还款期数：" :span="4">{{ paymentData.hasPayPeriods }}</data-grid-item>
      <data-grid-item label="逾期天数：" :span="4">{{ paymentData.overdueDays }}</data-grid-item>
      <data-grid-item label="逾期总金额：" :span="4">{{paymentData.overdueAmount}}</data-grid-item>
      <data-grid-item label="逾期本金：" :span="4">{{paymentData.overdueCapital}}</data-grid-item>
      <data-grid-item label="逾期利息：" :span="4">{{paymentData.overdueInterest}}</data-grid-item>
      <data-grid-item label="逾期罚息：" :span="4">{{paymentData.overdueFine}}</data-grid-item>
      <data-grid-item label="逾期滞纳金：" :span="4">{{paymentData.overdueDelayFine}}</data-grid-item>
      <data-grid-item label="已还款金额：" :span="4">{{paymentData.hasPayAmount}}</data-grid-item>
      <data-grid-item label="已还款期数：" :span="4">{{paymentData.hasPayPeriods}}</data-grid-item>
      <data-grid-item label="最近还款金额：" :span="4">{{paymentData.latelyPayAmount}}</data-grid-item>
      <data-grid-item label="最近还款日期：" :span="4">{{ paymentData.latelyPayDate | dateFormat('yyyy-MM-dd')}}</data-grid-item>
      <data-grid-item label="申请日期：" :span="4">{{ paymentData.applicationDate | dateFormat('yyyy-MM-dd')}}</data-grid-item>
      <data-grid-item label="申请理由：" :span="8">{{paymentData.applicationReason}}</data-grid-item>
      <data-grid-item label="审批结果：" :span="12" required>
        <template>
          <el-radio class="radio" :label="1" v-model="commit.orapStatus">同意</el-radio>
          <el-radio class="radio" :label="0" v-model="commit.orapStatus">拒绝</el-radio>
        </template>
      </data-grid-item>
      <data-grid-item ref="opinion" label="审批意见：" :span="12" required>
        <el-input type="textarea" v-model="commit.orapOpinion"></el-input>
      </data-grid-item>
    </data-grid>
    <el-row type="flex" justify="center">
      <el-button @click="cancleHandle">取消</el-button>
      <el-button @click="confirmHandle"  :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Watch, Prop } from "vue-property-decorator";
import { CaseInfoVerificationService } from "~/services/business-service/case-info-verification.service";

@Layout("workspace")
@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class VeriCaseApproval extends Vue {
  @Dependencies(CaseInfoVerificationService) private caseInfoVerificationService: CaseInfoVerificationService;
  @Prop() casePayApplyId: any
  private commit: any = {
    orapStatus: '',
    orapOpinion: ''
  }
  private paymentData: any = []
  private submitLoading: Boolean = false;

  mounted() {
    this.refresh()
  }
  refresh() {
    this.caseInfoVerificationService
      .caseInfoVerification({ id: this.casePayApplyId })
      .subscribe(data => {
        this.paymentData = data
      }, err => {
        this.$message.error(err.msg)
      })
  }
  cancleHandle() {
    this.$emit('refresh')
    this.commit.orapOpinion = ''
    this.commit.orapStatus = ''
  }
  confirmHandle() {
    if (this.commit.orapStatus === '') {
      this.$message({
        type: 'info',
        message: '请选择审批结果'
      })
      return false
    }
    if ((this.commit.orapStatus === 54) && (this.commit.orapOpinion === '')) {
      this.$message({
        type: 'info',
        message: '请输入审批意见'
      })
      return false
    }
    this.submitLoading = true;
    this.caseInfoVerificationService
      .caseInfoVerificationApply({
        approvalOpinion: this.commit.orapOpinion,
        approvalResult: this.commit.orapStatus,
        id: this.casePayApplyId
      })
      .subscribe(data => {
        this.$message({
          type: 'info',
          message: '审批成功'
        })
        this.submitLoading = false;
        this.commit.orapOpinion = ''
        this.commit.orapStatus = ''
        this.$emit('refresh')
        // this.approvalSaveUpdateTime()
      })
  }
}

</script>

<style scoped>

</style>
