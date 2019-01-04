<template>
  <section class="component visit-record">
    <data-form :model="visitModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker v-model="visitModel.applyDate" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="approveStatus">
          <el-select v-model="visitModel.approveStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0007')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>

    <data-box :data="visitrecordDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="applyDate" label="申请时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyReason" label="外访说明"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="approveStatus" label="状态" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvePhoneResult" label="电催审批意见" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.approvePhoneResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveOutResult" label="外访审批意见" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.approveOutResult | dictConvert}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
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

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class VisitRecord extends Vue {
  @accManageModule.State caseId;
  @accManageModule.State visitRecordFlag;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  private visitModel: any = {
    applyDate: [],
    approveStatus: "",
    caseId: this.caseId,
  };
  private visitrecordDataSet: any = [];
  private feedOptions: any = [];

  mounted() {
    this.refreshData();
  }
  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  @Watch("visitRecordFlag")
  onRecordChange() {
    this.refreshData();
  }
  refreshData() {
    this.accTelPoolService
      .getAllCaseOutApplyRecord({
        caseId: this.caseId,
        approveStatus: this.visitModel.approveStatus,
        applyDate: this.visitModel.applyDate
      }, this.pageService, { applyDate: "desc" })
      .subscribe(
      data => {
        this.visitrecordDataSet = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
      )
  }
}
</script>

<style lang="less" scoped>

</style>

