<template>
  <section class="component strategy-allocation">
    <el-form :model="Model" label-width="190px">
      <el-form-item label="执行频率:">
        <el-radio v-model="Model.radio" label="1">每天</el-radio>
        <el-radio v-model="Model.radio" label="2">月初</el-radio>
      </el-form-item>
    </el-form>
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
import { Emit } from "vue-property-decorator";
import { State } from "vuex-class";
import { ObtainTaticsService } from "~/services/dataimp-service/obtain-tatics.service";

@Component({
  components: {
  }
})
export default class StrategyAllocation extends Vue {
  @Dependencies(ObtainTaticsService) private obtainTaticsService: ObtainTaticsService;
  @State companyCode: any;
  @Emit('refreshList')
  refreshList(){}
  @Emit('close')
  close(){}
  private Model: any = {
    radio: '1',
  };
  private submitLoading: Boolean = false;
  commit() {
    if(this.Model.radio === '1'){
      this.$message.success("后台操作中,请关注消息中心!")
      this.submitLoading = true
      this.obtainTaticsService.everyDayDivisionCase({companyCode:this.companyCode}).subscribe(
        data => {},
        err => this.$message.error(err.msg)
      )
    }else if (this.Model.radio === '2') {
      this.$message.success("后台操作中,请关注消息中心!")
      this.submitLoading = true
      this.obtainTaticsService.monthEarlyDivisionCase({companyCode:this.companyCode}).subscribe(
        data => {},
        err => this.$message.error(err.msg)
      )
    }
    this.submitLoading = false
    this.refreshList()
    this.close()
  }
}
</script>

<style lang="less" scoped>

</style>
