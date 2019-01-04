<template>
  <section class="component show-approval-record">
    <data-box :data="dataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="申请号" prop="caseNumber" :min-width="$helper.getColumnWidth(5)"></el-table-column>
        <el-table-column label="操作状态" prop="nodeState">
            <template slot-scope="scope">
              <span v-if="scope.row.nodeState == 0">同意</span>
              <span v-if="scope.row.nodeState == 2">拒绝</span>
              <span v-if="scope.row.nodeState == 3">申请成功</span>
            </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="approvalTime" :min-width="$helper.getColumnWidth(6)">
            <template slot-scope="scope">
                {{scope.row.approvalTime|dateTimeFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作人" prop="approvalUser" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="操作说明" prop="nodeOpinion"></el-table-column>
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
export default class ShowApprovalRecord extends Vue {
  @Dependencies(ProcessInfoService) private processInfoService: ProcessInfoService;

  private dataSet: any = null;

  refreshData(data) {
    this.processInfoService.getTaskHistoryList(data).subscribe(
      data => this.dataSet = data,
      err => this.$message.error(err.msg)
    )
  }
}
</script>

<style lang="less">

</style>

