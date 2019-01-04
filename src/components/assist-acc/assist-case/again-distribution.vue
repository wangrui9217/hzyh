<template>
  <section class="component again-distribution">
    <div>
      <el-col>
        <div class="text-center case-flow-follow">当前催收员:{{cupodata.currentCollectorName}}</div>
      </el-col>
      <data-box :page="pageService" :selectionList.sync="selectionList" :data="dataSet" :default-sort="{prop: 'currentAmount', order: 'ascending'}" highlight-current-row max-height="400" @current-change="redialogCurrentChange">
        <template slot="columns">
          <el-table-column prop="userName" label="催收专员" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.collectionUser.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.collectionUser.department?scope.row.collectionUser.department.name:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="caseCount" label="当前持有案件数" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="allAccountBalance" label="当前持有案件总账户余额" :min-width="$helper.getColumnWidth(8)">
            <template slot-scope="scope">
              <span>{{scope.row.allAccountBalance | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可分配案件数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <span>{{(Math.ceil(todayPer-scope.row.caseCount)
                <0)?0:Math.ceil(todayPer-scope.row.caseCount)}}</span>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <el-col class="dialog-footer" align="center" style="margin-top:30px">
        <el-button @click="close">取消</el-button>
        <el-button @click="redialogConfirm" :loading="submitLoading">确定</el-button>
      </el-col>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataBox from "~/components/common/data-box.vue";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { PersonalService } from "~/services/business-service/personal.service";
import { CaseAssistService } from "~/services/business-service/case-assist.service";
import { Watch, Prop } from "vue-property-decorator";
import { CommonService } from "~/utils/common.service";
import clone from "clone";
import { Emit } from "vue-property-decorator";
@Component({
  components: {
    DataBox
  }
})
export default class FollowRecord extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(PersonalService) private personalService: PersonalService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @Prop() cupodata: any;
  @Emit("close")
  close() {}
  @Emit("refreshList")
  refreshList() {}
  private selectionList: any = [];
  private model: any = {
    type: "",
    collectionFeedback: "",
    collectionFeedbacks: [],
    operatorTime: []
  };
  private dataSet: any = [];
  private todayPer: any = null;
  private currentRow: any = {};
  private caseTransfer: any = [];
  private feedOptions: any = [];
  private submitLoading: Boolean = false;
  @Watch("cupodata")
  /**
   * 重新分配选择改变
   */
  redialogCurrentChange(val) {
    this.currentRow = val;
  }
  redistributionData() {
    this.submitLoading = true;
    let distributionData: any = {
      caseAssistId: this.cupodata.assistId,
      assistorId: this.currentRow.collectionUser.id
    };
    this.caseAssistService.assignCaseAssist(distributionData).subscribe(
      data => {
        this.submitLoading = false;
        this.refreshData();
        this.refreshList();
        this.close();
        this.$message.success("分配成功!");
      },
      ({ msg }) => {
        this.$message.error(msg);
        this.submitLoading = false;
      }
    );
  }
  /**
   * 确定
   */
  redialogConfirm() {
    this.currentRow = this.selectionList[0];
    if (!this.currentRow.collectionUser.userName) {
      this.$alert("请选择催收员", "提示", {
        confirmButtonText: "确定"
      });
      return;
    }
    if (
      this.todayPer < this.currentRow.caseCount ||
      this.todayPer === this.currentRow.caseCount
    ) {
      this.$confirm("该催收员可分配案件数为零，确定分配吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.redistributionData();
        })
        .catch(() => {});
    } else {
      this.redistributionData();
    }
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.model.collectionFeedback = this.model.collectionFeedbacks[
      this.model.collectionFeedbacks.length - 1
    ];
    if (!this.model.collectionFeedback) {
      this.model.collectionFeedback = "";
    }
  }
  refreshData() {
    this.dataSet = [];
    this.todayPer = null;
    this.caseAssistService.getBatchInfo().subscribe(
      data => {
        this.todayPer = data.averageNum;
        this.dataSet = data.batchInfoModelList;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  mounted() {
    this.refreshData();
  }
}
</script>

<style lang="less" scoped>
</style>
