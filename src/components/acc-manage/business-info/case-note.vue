<template>
  <section class="component case-note">
    <data-form :model="casenoteModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="操作人" prop="operatorRealName">
          <el-input v-model="casenoteModel.operatorRealName"></el-input>
        </el-form-item>
        <el-form-item label="操作时间" prop="operatorTime">
          <el-date-picker v-model="casenoteModel.operatorTime" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="casenoteDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="operatorRealName" label="操作人" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="remark" label="备注信息"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="operatorTime" label="操作时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Layout,
  Dependencies
} from "~/core/decorator";
import {
  PageService
} from "~/utils/page.service";
import {
  State,
  Mutation,
  namespace
} from "vuex-class";
import {
  CaseInfoService
} from "~/services/business-service/case-info.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import {
  FilterService
} from "~/utils/filter.service";
import clone from "clone"
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class CaseNote extends Vue {
  @accManageModule.State caseId;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  private casenoteModel: any = {
    operatorRealName: '',
    operatorTime: []
  };
  private casenoteDataSet: any = [];
  private feedOptions: any = [];

  mounted() {
    this.refreshData()
  }
  refreshData() {
    let Model: any = {
      caseId: this.caseId,
      operatorRealName: this.casenoteModel.operatorRealName,
      operatorTime: [FilterService.dateRanageFormat(this.casenoteModel.operatorTime).start, FilterService.dateRanageFormat(
        this.casenoteModel.operatorTime).end],
    }
    this.caseInfoService
      .getCaseInfoRemark(Model, this.pageService, {
        operatorTime: 'desc'
      })
      .subscribe(
      data => {
        this.casenoteDataSet = data;
      },err => {
        this.$message.error(err.msg);
      }
      );
  }
}

</script>

<style lang="less" scoped>

</style>
