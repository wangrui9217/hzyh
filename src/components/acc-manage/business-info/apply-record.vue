<template>
   <section class="compontent apply-record">
      <data-box :data="recordData" @onPageChange="refreshData">
        <template slot="columns">
          <!--数据列区域-->
          <el-table-column prop="nodeState" label="审批状态" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.nodeState=="0" ? "同意":scope.row.nodeState=="1" ? "驳回" : scope.row.nodeState=="2" ? "拒绝" : "申请成功"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nodeOpinion" label="审批意见" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <span>{{scope.row.nodeOpinion}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalTime" label="审批时间" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.approvalTime|dateTimeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalUser" label="审批人" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>
        </template>
    </data-box>
   </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import { FilterService } from "~/utils/filter.service";
import { Watch, Prop, Emit } from "vue-property-decorator";
import DataBox from "~/components/common/data-box.vue";

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class ApplyRecord extends Vue {
  @Dependencies(ProcessInfoService)
  private processInfoService: ProcessInfoService;
  private recordData: any = [];
  refreshData(applayObject) {
    let parmas: any = {
      approvalId:
        applayObject.approvalId == null ? " " : applayObject.approvalId,
      caseNumber: applayObject.caseNumber
    };
    this.processInfoService.getTaskHistoryList(parmas).subscribe(
      data => {
        this.recordData = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
}
</script>

