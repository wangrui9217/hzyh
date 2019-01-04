<template>
  <section class="page letter-acc">
    <data-form :model="letterModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName"  v-auth="5590">
          <el-input v-model="letterModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5591">
          <el-input v-model="letterModel.collectorName"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期天数" prop="dayRange" v-auth="5592">
          <number-range v-model="letterModel.dayRange" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5593">
          <el-input v-model="letterModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5594">
          <el-select v-model="letterModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchPrintClick" v-auth="5595">批量打印</el-button>
      </template>
    </data-form>
    <data-box :data="letterDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <!--数据区-STAR-->
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" :min-width="$helper.getColumnWidth(8)" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt===null?scope.row.promiseAmt:scope.row.promiseAmt|toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseTime?scope.row.promiseTime:''|dateFormat }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack | $dict.getDictData('0020','0021')}}</el-button>
              </div>
            </el-popover>
            <span v-else>{{scope.row.followupBack | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流入日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="printLetterClick(scope)" type="text" size="small" v-auth="5596">打印信函</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--打印弹出框-->
    <el-dialog title="逾期催收信函打印" :center="true" @open="singlePrint" :visible.sync="dialog.printLetter" width="60%">
      <letter-print ref="LetterPrint"></letter-print>
    </el-dialog>
    <!--批量打印弹出框-->
    <el-dialog title="逾期催收信函批量打印" :center="true" @open="batchData" :visible.sync="dialog.batchPrintletter" width="50%">
      <letter-batch-print ref="letterBatchPrint" @preview="preview"></letter-batch-print>
    </el-dialog>
    <!--打印预览-->
    <el-dialog title="打印预览" :center="true" :visible.sync="dialog.printPreview" width="900px">
      <letter-preview :previewContent="previewContent" ref="previewPrint"></letter-preview>
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
import { TemplateService } from "~/services/business-service/template.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import NumberRange from "~/components/common/number-range.vue";
import { State, Mutation, namespace } from "vuex-class";
import { Watch, Prop, Emit, Model } from "vue-property-decorator";
import { CommonService } from "~/utils/common.service";
import { FilterService } from "~/utils/filter.service";
import LetterPrint from "~/components/letter-acc/letter-print.vue";
import LetterBatchPrint from "~/components/letter-acc/letter-batch-print.vue";
import LetterPreview from "~/components/letter-acc/letter-preview.vue";

const letterAccModule = namespace("letter-acc");

@Auth(1101)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    LetterPrint,
    LetterBatchPrint,
    LetterPreview
  }
})
export default class LetterAcc extends Vue {
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(TemplateService) private templateService: TemplateService;
  @Dependencies(PageService) private pageService: PageService;
  @letterAccModule.Mutation updatePrintInfo;
  @letterAccModule.Mutation printSomeSymbol;
  @letterAccModule.Mutation printYmdDate;
  @letterAccModule.Mutation browserType;

  private letterModel: any = {
    personalName: "",
    collectorName: "",
    dayRange: {
      min: "",
      max: ""
    },
    batchNumber: "",
    principalId: "",
    collectionType: "15,16",
    collectionStatusList: "20,21,22,23,171,172"
  };
  private letterDataSet: any = [];
  private selectionList: any = [];
  private templateContent: any = [];
  private previewContent: any = [];
  private dialog: any = {
    printLetter: false,
    batchPrintletter: false,
    printPreview: false
  };
  @State principalList: any;
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByNoPower(this.letterModel, this.pageService)
      .subscribe(
        data => {
          this.letterDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  mounted() {
    this.getTemplateList();
    this.refreshData();
    this.getBrowserType();
  }
  /**
   * 浏览器类型判断
   */
  getBrowserType() {
    let type: any = CommonService.getBrowserType();
    if (type === "chrome") {
      this.browserType({
        printPageHeight: "1025px"
      });
    }
    if (type === "opera") {
      this.browserType({
        printPageHeight: "1025px"
      });
    }
    if (type === "360") {
      this.browserType({
        printPageHeight: "1015px"
      });
    }
    if (type === "firefox") {
      this.browserType({
        printPageHeight: "1050px"
      });
    }
  }
  /**
   * 获取信函模板
   */
  getTemplateList() {
    this.templateService.getTemplatesByStyle(104).subscribe(
      data => {
        this.templateContent = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 点击打印信函弹出框
   */
  printLetterClick(scope) {
    var rowArr: any = [];
    rowArr.push(scope.row);
    this.updatePrintInfo(rowArr);
    this.printSomeSymbol({
      moneySymbol: "￥",
      yuanSymbol: "元",
      daySymbol: "天"
    });
    this.printYmdDate({
      year: CommonService.getDate()[0],
      month: CommonService.getDate()[1],
      day: CommonService.getDate()[2]
    });
    this.dialog.printLetter = true;
  }
  /**
   * 单条信函打印
   */
  singlePrint() {
    this.$nextTick(() => {
      let letterPrint: any = this.$refs["LetterPrint"];
      letterPrint.refreshTemplate(this.templateContent);
    });
  }
  /**
   * 点击批量打印弹出框
   */
  batchPrintClick(scope) {
    if (this.selectionList.length === 0) {
      this.$alert("请选择需要打印的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.updatePrintInfo(this.selectionList);
      this.printSomeSymbol({
        moneySymbol: "￥",
        yuanSymbol: "元",
        daySymbol: "天"
      });
      this.printYmdDate({
        year: CommonService.getDate()[0],
        month: CommonService.getDate()[1],
        day: CommonService.getDate()[2]
      });
      this.dialog.batchPrintletter = true;
    }
  }
  /**
   * 批量数据获取
   */
  batchData() {
    this.$nextTick(() => {
      let batchPrint: any = this.$refs["letterBatchPrint"];
      batchPrint.batchDataSend(this.selectionList, this.templateContent);
    });
  }
  preview(v) {
    this.dialog.printPreview = true;
    this.previewContent = v;
  }
}
</script>

<style lang="less">
</style>
