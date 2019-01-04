<template>
  <section class="component show-task-node">
    <data-box :data="dataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="执行步数" prop="temp"></el-table-column>
        <el-table-column label="角色名称"  prop="roleName"></el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import DataBox from "~/components/common/data-box.vue";
import { ProcessInfoService } from "~/services/business-service/process-info.service";

@Component({
  components: {
    DataBox
  }
})
export default class ShowTaskNode extends Vue {
  @Dependencies(ProcessInfoService) private processInfoService: ProcessInfoService;

  private dataSet: any = null;

  refreshData(taskId) {
    this.processInfoService.getTaskInfoList(taskId).subscribe(
      data => this.dataSet = data,
      err => this.$message.error(err.msg)
    )
  }
}
</script>

<style lang="less">

</style>

