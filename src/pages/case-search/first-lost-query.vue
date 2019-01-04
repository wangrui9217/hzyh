<template>
  <section class="page first-lost-query">
    <data-form  :model="searchModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="searchModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5023">
          <el-input v-model="searchModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5024">
          <el-input v-model="searchModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-auth="5031">
          <el-input v-model="searchModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNumber" v-auth="5031">
          <el-input v-model="searchModel.contractNumber"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="invalidContactCaseExport">导出失联案件</el-button>
      </template>
    </data-form>
    <data-box :data="firstLostDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="contractNumber" label="合同编号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号码" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="sex" label="性别" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.sex | dictConvert('0033')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstMissingTime" label="首次失联时间" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.firstMissingTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentMissingDays" label="当前失联天数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="longestMissingDays" label="最长失联天数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="missingTimes" label="失联次数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="currentMissingFlag" label="当前是否失联" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.currentMissingFlag?"是":"否"}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import { ContactFeedbackService } from "~/services/business-service/contact-feedback.service";

@Auth(374)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange
  }
})
export default class FirstLostQuery extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(ContactFeedbackService)
  private contactFeedbackService: ContactFeedbackService;

  private selectionList: any = [];
  private firstLostDataSet: any = [];
  private searchModel: any = {
    caseNumber: "",
    personalName: "",
    mobileNo: "",
    idCard: "",
    contractNumber: ""
  };
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.contactFeedbackService
      .invalidContactCase(this.searchModel, this.pageService)
      .subscribe(
        data => {
          this.firstLostDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 导出失联案件
   */
  invalidContactCaseExport() {
    this.$confirm("您确定要导出失联案件吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.contactFeedbackService.invalidContactCaseExport().subscribe(
          data => {
            this.$message.success("操作成功，请关注任务中心！");
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(() => {
        this.$message.info("已取消操作");
      });
  }
}
</script>

<style lang="less" scoped>
</style>
