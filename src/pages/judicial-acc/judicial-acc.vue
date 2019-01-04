<template>
  <section class="page judicial-acc">
    <data-form :model="judicialModel" :rules="rules"  @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <!-- <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="judicialModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5341">
          <el-input v-model="judicialModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="批次号"  prop="batchNumber" v-auth="5342">
          <el-input v-model="judicialModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalName" v-auth="5343">
          <el-select v-model="judicialModel.principalName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-auth="5344">
          <el-input v-model="judicialModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="overdueAmount" v-auth="5345">
          <number-range v-model="judicialModel.overdueAmount"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5346">
          <el-select v-model="judicialModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="5347">
          <number-range v-model="judicialModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="judicialDataSet"  @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.caseNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.overduePeriods}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueDays}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.batchNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorTime" label="处理日期" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="司法说明" show-overflow-tooltip :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth } from "~/core/decorator";
import { Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Getter } from "vuex-class";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";

@Auth(352)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange
  }
})
export default class JudicialAcc extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  private judicialModel: any = {
    personalName: "",
    companyCode: "",
    payStatus: "",
    mobileNo: "",
    principalName: "",
    batchNumber: "",
    idCard: "",
    overdueAmount: {
      min: "",
      max: ""
    },
    overdueDays: {
      min: "",
      max: ""
    }
  };
  private rules = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };

  private judicialDataSet = null;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.judicialModel.companyCode = this.userData.companyCode;
    }
    return this.judicialModel.companyCode;
  }

  set companyCode(value) {
    this.judicialModel.companyCode = value;
  }

  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoJudicialByCondition(this.judicialModel, this.pageService)
      .subscribe(
        data => {
          this.judicialDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  handleResetForm() {
    this.judicialModel = {
      personalName: "",
      companyCode: "",
      payStatus: "",
      mobileNo: "",
      principalId: "",
      batchNumber: "",
      idCard: "",
      overdueAmount: {
        min: "",
        max: ""
      },
      overdueDays: {
        min: "",
        max: ""
      }
    };
  }
}
</script>

<style lang="less">
</style>
