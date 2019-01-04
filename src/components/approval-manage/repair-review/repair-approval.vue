<template>
  <section class="component repair-approval">
    <div class="frame">
      <data-grid iconClass="icon" :labelWidth="100" labelAlign="right" contentAlign="left">
        <data-grid-item label="客户姓名：" :span="4">{{ approvalData.name }}</data-grid-item>
        <data-grid-item label="身份证号：" :span="4">{{ approvalData.idCardNum }}</data-grid-item>
        <data-grid-item label="手机号：" :span="4">{{ approvalData.phone }}</data-grid-item>
        <data-grid-item label="批次号：" :span="4">{{ approvalData.batchNumber }}</data-grid-item>
        <data-grid-item label="委托方：" :span="4">{{ approvalData.principalName }}</data-grid-item>
        <data-grid-item label="还款类型：" :span="4">{{ approvalData.payType | dictConvert }}</data-grid-item>
        <data-grid-item label="还款金额(元)：" :span="4">{{ approvalData.paymentAmt|toThousands }}</data-grid-item>
        <data-grid-item label="减免金额(元)：" :span="4">{{ approvalData.derateAmt|toThousands }}</data-grid-item>
        <data-grid-item label="还款方式：" :span="4">{{ approvalData.payWay | dictConvert }}</data-grid-item>
        <data-grid-item label="申请日期：" :span="4">{{ approvalData.applyDate|dateFormat }}</data-grid-item>
        <data-grid-item label="凭证：" :span="8">
          <el-button type="text" @click="getPayProof" v-if="approvalData.fileCount">查看({{approvalData.fileCount}})</el-button>
          <span v-if="!approvalData.fileCount">未上传凭证</span>
        </data-grid-item>
        <data-grid-item label="审批结果：" :span="12" required>
          <template>
            <el-radio class="radio" :label="1" v-model="approvalModel.result">入账</el-radio>
            <el-radio class="radio" :label="0" v-model="approvalModel.result">驳回</el-radio>
          </template>
        </data-grid-item>
        <data-grid-item ref="opinion" label="审批意见：" :span="12" required>
          <el-input type="textarea" v-model="approvalModel.opinion"></el-input>
        </data-grid-item>
      </data-grid>
    </div>
    <el-row type="flex" justify="center">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit"  :loading="submitLoading">确定</el-button>
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
export default class RepairApproval extends Vue {
  @Dependencies(PaymentService) private paymentService: PaymentService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Emit('checkImg')
  checkImg(arr) { }
  @Emit('refreshList')
  refreshList() { }
  @Emit('close')
  close() { }

  private approvalData: any = {}
  private approvalModel: any = {
    casePayApplyId: '',
    result: '',
    opinion: '',
    flag: 1
  }
  private submitLoading: Boolean = false;

  /**
   * 查看凭证
   */
  getPayProof() {
    this.accTelPoolService.getPayProof({ casePayId: this.approvalModel.casePayApplyId }).subscribe(data => {
      let urlArr = []
      if (data && data.length) {
        urlArr = data.filter((v, i) => {
          if (v.type === 'jpg' || v.type === 'png') {
            return true
          } else {
            CommonService.downloadFile(v.url, v.realName)
            return false
          }
        }).map(v => v.url)
      } else {
        this.$message.info('没有上传凭证！')
      }
      if (urlArr.length > 0) {
        this.checkImg(urlArr)
      }
    }, ({ msg }) => {
      this.$message.error(msg);
    })
  }
  commit() {
    if (this.approvalModel.result === '') {
      this.$message.info('请选择审批结果')
      return false
    }
    if (this.approvalModel.opinion === '') {
      this.$message.info('请输入审批意见')
      return false
    }
    this.submitLoading = true;
    this.paymentService.approvalPayment(this.approvalModel).subscribe(data => {
      this.$message.info('审批成功')
      this.refreshList()
      this.close()
      this.submitLoading = false;
    }, err => {
      this.$message.error(err.msg);
      this.submitLoading = false;
    });
  }
  refresh(id) {
    this.approvalModel.result = ''
    this.approvalModel.opinion = ''
    this.approvalModel.casePayApplyId = id
    this.approvalData = {}
    this.paymentService.getPaymentInfo(id).subscribe(data => {
      this.approvalData = data;
    }, err => {
      this.$message.error(err.msg);
    });
  }
}
</script>

<style lang="less" scoped>
.frame {
  padding: 10px;
}
</style>
