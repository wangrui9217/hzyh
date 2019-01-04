<template>
  <!--结案-->
  <section class="component end-case">
    <data-grid class="data-grid" :labelWidth="75" labelAlign="center" contentAlign="left">
        <data-grid-item label="客户姓名:" :span="6">{{personalInfo.name}}</data-grid-item>
        <data-grid-item label="身份证号:" :span="6">{{personalInfo.idCard}}</data-grid-item>
        <data-grid-item label="合同金额(元):" :span="6">{{caseInfo.contractAmount | toThousands}}</data-grid-item>
        <data-grid-item label="逾期天数:" :span="6">{{caseInfo.overdueDays}}</data-grid-item>
        <data-grid-item label="逾期金额(元):" :span="6">{{caseInfo.overdueAmount + caseInfo.earlySettleAmt | toThousands}}</data-grid-item>
        <data-grid-item label="逾期实际还款金额:" :span="6">{{caseInfo.realPayAmount}}</data-grid-item>
				<!-- <data-grid-item label="提前结清实际还款金额:" :span="12">{{caseInfo.earlyRealSettleAmt}}</data-grid-item> -->
				<data-grid-item label="结案方式:" :span="12" required>
          <el-radio v-model="endCaseModal.endType" label="110" @change="endCaseRadioChange">已还款</el-radio>
          <el-radio v-model="endCaseModal.endType" label="112" @change="endCaseRadioChange">债主死亡</el-radio>
        </data-grid-item>
				<data-grid-item label="结案说明:" :span="12" required>
          <el-input type="textarea" placeholder="请输入结案说明" :value="endCaseModal.endRemark"></el-input>
        </data-grid-item>
    </data-grid>
		<div class="row center-span" style="margin-top:20px">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Layout, Dependencies } from "~/core/decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
const accManageModule = namespace("acc-manage");
@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class EndCase extends Vue {
  @Dependencies (AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @accManageModule.State caseInfo;
  @accManageModule.State caseId;
  @accManageModule.State repayRecordFlag;
  @Emit ('close')
  close(){
    this.resetEndCaseModal()
  };
  private submitLoading: Boolean = false;
  private endCaseModal: any ={
    caseId: '',
    endRemark: '',
    endType: '',
    isAssist: ''
  }
  get personalInfo(): any {
    return this.caseInfo.personalInfo || {};
  }
  /**
   * 提交结案
   */
  commit(){
    if(this.endCaseModal.endRemark === '') {
      this.$alert('请输入结案说明', '提示', {
        confirmButtonText: '确定'
      })
      return false
    }
    this.$confirm('确定要结案吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.endTelCase()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消结案'
      })
    }) 
  }
  /**
   * 提交结案接口
   */
  endTelCase(){
    this.submitLoading = true;
    this.endCaseModal.caseId = this.caseId;
    this.endCaseModal.isAssist = Boolean(this.caseInfo.AssistFlag);
    this.accTelPoolService.endTelCase(this.endCaseModal).subscribe(
      data => {
        this.$alert('该案件成功结案，如需查看，请前往已结案页面！', '提示', 
        {
          confirmButtonText: '知道了',
          type: 'success'
        })
        this.resetEndCaseModal()
        this.close()
        this.$router.back()
        this.submitLoading = false;
      },
      err => {
        this.$message({
          type: 'info',
          message: err.msg
        });
        this.submitLoading = false;
      }
    )
  }
  /**
   * 重置表单
   */
  resetEndCaseModal() {
    this.endCaseModal= {
    caseId: '',
    endRemark: '',
    endType: '',
    isAssist: ''
    }
  }
  /**
   * raido状态变更
   */
  endCaseRadioChange(){
    if(this.endCaseModal.endType == "110"){
      this.endCaseModal.endRemark = "已还款"
    }else if(this.endCaseModal.endType == "112"){
      this.endCaseModal.endRemark = "债主死亡"
    }else{
      this.endCaseModal.endRemark = " "
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
