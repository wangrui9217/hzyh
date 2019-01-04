<template>
  <section class="component assist-record">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker v-model="assistModel.applyDate" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="协催方式" prop="assistWay">
          <el-select v-model="assistModel.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="approveStatus">
          <el-select v-model="assistModel.approveStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0027')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="assistrecordDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="applyUserName" label="申请人" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="applyDate" label="申请时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyReason" label="协催说明"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="状态" prop="approveStatus" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus|dictConvert}}</span>
          </template>
        </el-table-column>
         <el-table-column label="操作" :min-width="$helper.getColumnWidth(2)">
           <template slot-scope="scope">
              <el-button type="text" @click="applayObject=scope.row;dialog.applyRecord = true;">审批记录</el-button>
           </template>
        </el-table-column>
      </template>
    </data-box>
    <!--审批记录-->
    <el-dialog title="审批历史记录" :center="true" :visible.sync="dialog.applyRecord" width="40%" append-to-body @open="$nextTick(()=>$refs['apply-record'].refreshData(applayObject))">
        <apply-record ref="apply-record"></apply-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Mutation, namespace } from "vuex-class";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { FilterService } from "~/utils/filter.service";
import { Watch } from "vue-property-decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import ApplyRecord from "~/components/acc-manage/business-info/apply-record.vue";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    ApplyRecord
  }
})
export default class AssistRecord extends Vue {
  @accManageModule.State caseId;
  @accManageModule.State assitRecordFlag;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  private assistModel: any = {
    applyDate: "",
    assistWay: "",
    approveStatus: ""
  };
  private assistrecordDataSet: any = [];
  private feedOptions: any = [];
  private dialog: any = {
    applyRecord: false
  };
  private applayObject: any = {};
  mounted() {
    this.refreshData();
  }
  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  @Watch("assitRecordFlag")
  onRecordChange() {
    this.refreshData();
  }
  refreshData() {
    let Model: any = {
      caseId: this.caseId,
      applyDate: [
        FilterService.dateRanageFormat(this.assistModel.applyDate).start,
        FilterService.dateRanageFormat(this.assistModel.applyDate).end
      ],
      assistWay: this.assistModel.assistWay,
      approveStatus: this.assistModel.approveStatus
    };
    this.accTelPoolService
      .getAllAssistApplyRecord(Model, this.pageService, {
        applyDate: "desc"
      })
      .subscribe(
        data => {
          this.assistrecordDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style lang="less" scoped>
</style>
