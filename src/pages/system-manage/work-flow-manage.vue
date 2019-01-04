<template>
  <!-- 系统设置-流程设置 --> 
  <section class="page work-flow-manage">
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="searchModel.taskName"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="newTask">新增任务</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :data="dataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="openTaskDetail(scope)">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>   
    <!--任务节点列表弹出框-->
    <el-dialog :title="`${operateData.taskName} 节点列表查看`" :center="true" :visible.sync="dialog.showTaskDetail" @open="showTaskDetail">
      <show-task-node ref="ShowTaskNode"></show-task-node>
    </el-dialog>

    <el-dialog title="新增任务节点列表" :visible.sync="dialog.showAdd" :center="true">
      <add-work-flow ref="AddWorkFlow" @close="dialog.showAdd = false" @refresh="refreshData" :existedTaskNames="existedTaskNames"></add-work-flow>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import AddWorkFlow from "~/components/system-manage/work-flow-manage/add-work-flow.vue";
import ShowTaskNode from "~/components/system-manage/work-flow-manage/show-task-node.vue";

@Auth(979)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    AddWorkFlow,
    ShowTaskNode
  }
})
export default class WorkFlowManage extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(ProcessInfoService) private processInfoService: ProcessInfoService;

  private searchModel:any = {
    taskName: ''
  }
  private dataSet:Array<any> = [];
  private operateData:any = {}
  private existedTaskNames:Array<any> = [];
  private dialog:any = {
    showTaskDetail: false,
    showAdd: false
  }

  created() {
    this.refreshData()
  }
  refreshData() {
    this.processInfoService.queryFlowTaskList(this.searchModel,this.pageService).subscribe(
      data => {
        this.dataSet = data,
        this.existedTaskNames = data.map(v=>v.taskName)
      },
      err => this.$message.error(err.msg)
    )
  }
  newTask() {
    this.dialog.showAdd = true
  }
  openTaskDetail(scope) {
    this.operateData = scope.row
    this.dialog.showTaskDetail = true
  }
  showTaskDetail() {
    this.$nextTick(() => {
      let ShowTaskNode: any = this.$refs["ShowTaskNode"];
      ShowTaskNode.refreshData(this.operateData.id);
    });
  }
}
</script>

<style lang="less">

</style>
