<template>
  <section class="component recovery-case">
    <el-input type="textarea" :rows="2" v-model="returnReason"></el-input>
      <div style="text-align:center;margin-top:20px">
        <el-button @click="close()">取消</el-button>
        <el-button :loading="loading" @click="submit">确定</el-button>
      </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import {State,namespace} from "vuex-class";
import { Emit, Prop } from "vue-property-decorator";
import { CaseReturnService } from "~/services/business-service/case-return.service";

const inrushCaseModule = namespace('inrush-case');

@Component({
  components:{}
})
export default class Verification extends Vue {
  @Dependencies(CaseReturnService) private caseReturnService: CaseReturnService;

  @inrushCaseModule.State('selectedCase') caseIds;

  @Emit("refresh") //刷新数据
  refresh() {}
  @Emit("close") //关闭回收案件弹框
  close() {
    this.returnReason = ''
  }

  private returnReason: any = "";
  private loading: boolean = false;
  /**
   * 回收案件确定
   */
  submit() {
    if(this.returnReason === ''){
      this.$message('请输入申请理由')
      return
    }
    let selModel: any = {
      ids: this.caseIds,
      reason: this.returnReason
    };
    this.loading = true
    this.caseReturnService.recoverCase(selModel).subscribe(
      data => {
        this.$message.success("回收成功！");
        this.loading = false
        this.close();
        this.refresh();
      },
      error => {
        this.$message.error(error.msg)
        this.loading = false
      }
    );
  }
}
</script>
<style>

</style>
