<template>
  <section class="component debit-record">
    <data-form :model="debitRecordModel" @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="请求扣款日期" prop="debitDate">
          <el-date-picker v-model="debitRecordModel.debitDate" type="date" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扣款状态" prop="debitState">
          <el-select v-model="debitRecordModel.debitState" placeholder="请选择" clearable>
            <!-- <el-option v-for="{value,label} in $dict.getDictData('0017')" :key="value" :label="label" :value="value"> -->
              <el-option v-for="{value,label} in debitState" :key="value" :label="label" :value="value"></el-option>
            </el-option>
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
        <el-table-column prop="debitDate" label="请求扣款时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.debitDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="debitState" label="扣款状态"  :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.debitState | dictConvert}}</span>
          </template>
        </el-table-column>
     
        <el-table-column prop="debitMoney" label="扣款金额" :min-width="$helper.getColumnWidth(2)">
           <template slot-scope="scope">
            <span>{{ scope.row.debitMoney | toThousands }}元}</span>
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
import { CommonService } from "~/utils/common.service";
import { FileUploadService } from "~/services/file-service/file-upload.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import SvgIcon from "~/components/common/svg-icon.vue";
import clone from "clone";
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    SvgIcon
  }
})
export default class FollowRecord extends Vue {
  @accManageModule.State caseInfo;
  @accManageModule.State currentBusinessTabName;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(FileUploadService) private fileUploadService: FileUploadService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @Watch("caseInfo")
  @Watch("currentBusinessTabName")
  onCaseIdChange() {
    this.refreshData();
  }
  private debitState: any = [];
  private debitRecordModel: any = {
    debitDate: "",
    debitState: "",
    debitMoney: ""
  };
  private followrecordDataSet: any = [];

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
      if (v.value === 835) {
        v.children = this.$dict.getDictData("0257");
      }
    });
    this.refreshData();
    this.debitState = [
      {
        value:"001",
        label:"扣款成功"
      },
      {
        value:"002",
        label:"扣款失败"
      }
    ]
  }

  /**
   * 重置
   */
  handleResetForm() {}

  refreshData() {}
}
</script>

<style lang="less" scoped>
</style>
