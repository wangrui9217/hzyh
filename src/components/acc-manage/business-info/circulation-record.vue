<template>
  <section class="component follow-record">
    <data-form :model="followrecordModel" @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="申请日期" prop="operatorTime">
          <el-date-picker v-model="followrecordModel.operatorTime" type="date" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="流转去向" prop="turnToPool" >
        <el-select v-model="followrecordModel.turnToPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0258')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转状态" prop="turnApprovalStatus">
          <el-select v-model="followrecordModel.turnApprovalStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0048')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="followrecordDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="currentCollector" label="申请人" :min-width="$helper.getColumnWidth(2)"></el-table-column>
        <el-table-column prop="operatorTime" label="申请时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="流转去向" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.turnToPool | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="turnDescribe" label="流转说明" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="turnApprovalStatus" label="流转审核状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.turnApprovalStatus | dictConvert}}
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
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
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { FilterService } from "~/utils/filter.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import SvgIcon from "~/components/common/svg-icon.vue";
import ApplyRecord from "~/components/acc-manage/business-info/apply-record.vue";
import clone from "clone";
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    SvgIcon,
    ApplyRecord
  }
})
export default class FollowRecord extends Vue {
  @accManageModule.State caseInfo;
  @accManageModule.State currentBusinessTabName;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @Watch("caseInfo")
  @Watch("currentBusinessTabName")
  onCaseIdChange() {
    this.refreshData();
  }
  private imgArr = [];
  private followrecordModel: any = {
    operatorTime: [],
    turnFromPool: "",
    turnToPool: "",
    turnApprovalStatus: ""
  };
  private followrecordDataSet: any = [];
  private feedOptions: any = [];
  private applayObject: any = {};
  private dialog: any = {
    applyRecord: false
  };
  activated() {
    this.$nextTick(() => {
      this.refreshData();
    });
  }
  mounted() {
    let valid = clone(this.$dict.getDictData("0019"));
    valid.forEach(v => {
      if (v.value === 88) {
        v.children = this.$dict.getDictData("0020");
      }
      if (v.value === 89) {
        v.children = this.$dict.getDictData("0021");
      }
    });
    this.feedOptions = valid;
    this.refreshData();
    let turnFrom: any = this.$dict.getDictData("0254");
  }

  /**
   * 重置
   */
  handleResetForm() {
    this.followrecordModel.operatorTime = [];
    this.followrecordModel.turnToPool = "";
  }
  refreshData() {
    let Model: any = {
      operatorStartTime: FilterService.dateRanageFormat(
        this.followrecordModel.operatorTime
      ).start,
      operatorEndTime: FilterService.dateRanageFormat(
        this.followrecordModel.operatorTime
      ).end,
      caseNumber: this.caseInfo.caseNumber,
      turnToPool: this.followrecordModel.turnToPool,
      circulationType: "3,4",
      turnApprovalStatus: this.followrecordModel.turnApprovalStatus
    };
    this.caseInfoInquiryService
      .getCaseTurnRecord(Model, this.pageService, {
        applyDate: "desc"
      })
      .subscribe(
        data => {
          this.followrecordDataSet = data;
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
