<template>
  <section class="page assist-handled-case">
    <data-form :model="assisthandledModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5369">
          <el-input v-model="assisthandledModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5370">
          <el-input v-model="assisthandledModel.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amountRange" v-auth="5371">
          <number-range v-model="assisthandledModel.amountRange"></number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="assisthandledDataSet" @onPageChange="refreshData" :sort="sortService" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.caseNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.mobileNo | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.assistWay| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assistStatus" label="案件状态"  :min-width="$helper.getColumnWidth(3)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.assistStatus| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFlowinTime" label="流入日期" :min-width="$helper.getColumnWidth(4)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.caseFlowinTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="latelyCollectorName" label="上一个协催员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="currentCollectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="assistCollectorName" label="协催员" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operatorName" label="操作员" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>

    <!--查看案件明细的案件跟进记录-->
    <el-dialog :title="repair.caseNumber+'案件跟进明细'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repair.caseNumber"></FollowRecord>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";

@Auth(335)
@Layout("workspace")
@Component({
  components: {
    NumberRange,
    DataForm,
    DataBox,
    FollowRecord
  }
})
export default class AssistHandledCase extends Vue {
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private assisthandledDataSet = null;
  private repair: any = {};
  private dialog: any = {
    FollowRecord: false
  };
  private assisthandledModel: any = {
    personalName: "",
    companyCode: "",
    mobileNo: "",
    amountRange: {
      min: "",
      max: ""
    },
    assistStatusList: 29
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.assisthandledModel.companyCode = this.userData.companyCode
    }
    return this.assisthandledModel.companyCode
  }

  set companyCode(value) {
    this.assisthandledModel.companyCode = value
  }

  refreshData() {
    this.caseInfoInquiryService
      .getCaseAssistByCondition(
      this.assisthandledModel,
      this.pageService,
      this.sortService
      )
      .subscribe(
      data => {
        this.assisthandledDataSet = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
      );
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }
}
</script>

<style lang="less">

</style>
