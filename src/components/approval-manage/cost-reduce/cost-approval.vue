<template>
  <section class="component cost-approval">
    <div class="frame">
      <data-grid :labelWidth="80" labelAlign="right" contentAlign="center">
        <data-grid-item label="客户姓名：" :span="4">{{ paymentData.name }}</data-grid-item>
        <data-grid-item label="身份证号：" :span="4">{{ paymentData.idCardNum }}</data-grid-item>
        <data-grid-item label="手机号：" :span="4">{{ paymentData.phone }}</data-grid-item>
        <data-grid-item label="合同金额(元)：" :span="4">{{ paymentData.contractAmount|toThousands }}</data-grid-item>
        <data-grid-item label="期数(期)：" :span="4">{{ paymentData.periods }}</data-grid-item>
        <data-grid-item label="逾期天数：" :span="4">{{ paymentData.overdueDays }}</data-grid-item>
        <data-grid-item label="逾期还款应还总额：" :labelWidth="200" :span="12">{{paymentData.overdueAmount|toThousands}}</data-grid-item>
        <data-grid-item label="逾期应支付本金：" :labelWidth="200" :span="12">{{paymentData.overdueCapital|toThousands}}</data-grid-item>
        <data-grid-item label="应支付利息：" :labelWidth="200" :span="12">{{paymentData.overdueInterest|toThousands}}</data-grid-item>
        <data-grid-item label="应支付逾期罚息：" :labelWidth="200" :span="12">{{paymentData.overdueFine|toThousands}}</data-grid-item>
        <data-grid-item label="应支付逾期还款合同违约金：" :labelWidth="200" :span="12">{{paymentData.overdueDelayFine|toThousands}}</data-grid-item>
        <data-grid-item label="应支付分期服务费：" :labelWidth="200" :span="12">{{paymentData.overdueManageFee|toThousands}}</data-grid-item>
        <data-grid-item label="减免费用小计：" :labelWidth="200" :span="12">{{paymentData.derateAmt|toThousands}}</data-grid-item>
        <data-grid-item label="减免费用备注：" :labelWidth="200" :span="12">{{ paymentData.derateRemark }}</data-grid-item>
        <data-grid-item label="凭证：" :labelWidth="200" :span="12">
          <el-button type="text" @click="getPayProof" v-if="paymentData.fileCount">查看({{paymentData.fileCount}})</el-button>
          <span v-if="!paymentData.fileCount">未上传凭证</span>
        </data-grid-item>
        <data-grid-item label="审批结果：" :labelWidth="200" :span="12" required>
          <template>
            <el-radio class="radio" :label="1" v-model="approvalModel.result">同意</el-radio>
            <el-radio class="radio" :label="0" v-model="approvalModel.result">拒绝</el-radio>
          </template>
        </data-grid-item>
        <data-grid-item :labelWidth="200" label="审批意见：" :span="12" required>
          <el-input type="textarea" :maxlength="500" v-model="approvalModel.opinion"></el-input>
        </data-grid-item>
      </data-grid>
    </div>
    <el-row type="flex" justify="center">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Emit } from "vue-property-decorator";
import { PaymentService } from "~/services/business-service/payment.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { CommonService } from "~/utils/common.service";

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class CostApproval extends Vue {
  @Dependencies(PaymentService) private paymentService: PaymentService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}
  @Emit("checkImg")
  checkImg(arr) {}

  private paymentData: any = {};
  private approvalModel: any = {
    casePayApplyId: "",
    result: "",
    opinion: "",
    flag: 0
  };
  private submitLoading: Boolean = false;

  /**
   * 查看凭证
   */
  getPayProof() {
    this.accTelPoolService
      .getPayProof({ casePayId: this.approvalModel.casePayApplyId })
      .subscribe(
        data => {
          let urlArr = [];
          if (data && data.length) {
            urlArr = data
              .filter((v, i) => {
                if (v.type === "jpg" || v.type === "png") {
                  return true;
                } else {
                  CommonService.downloadFile(v.url, v.realName);
                  return false;
                }
              })
              .map(v => v.url);
          } else {
            this.$message.info("没有上传凭证！");
          }
          if (urlArr.length > 0) {
            this.checkImg(urlArr);
          }
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  commit() {
    if (this.approvalModel.result === "") {
      this.$message.info("请选择审批结果");
      return false;
    }
    if (this.approvalModel.opinion === "") {
      this.$message.info("请输入审批意见");
      return false;
    }
    this.submitLoading = true;
    this.paymentService.approvalPayment(this.approvalModel).subscribe(
      data => {
        this.$message.info("审批成功");
        this.refreshList();
        this.close();
        this.submitLoading = false;
      },
      ({ msg }) => {
        this.$message.error(msg);
        this.submitLoading = false;
      }
    );
  }
  refresh(id) {
    this.approvalModel.result = "";
    this.approvalModel.opinion = "";
    this.approvalModel.casePayApplyId = id;
    this.paymentData = {};
    this.paymentService.getPaymentInfo(id).subscribe(
      data => {
        this.paymentData = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  mounted() {}
}
</script>

<style lang="less" scoped>
.frame {
  padding: 10px;
}
</style>
