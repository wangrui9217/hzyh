<template>
  <section class="component follow-record">
    <data-form :model="followrecordModel" @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="跟进日期" prop="personalName">
          <el-date-picker v-model="followrecordModel.operatorTime" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="催收反馈" prop="collectionFeedback">
          <el-cascader v-model="followrecordModel.collectionFeedbacks" :options="feedOptions" @change="feedbackChange" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="催记来源" prop="type">
          <el-select v-model="followrecordModel.type" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0016')" :key="value" :label="label" :value="value">
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
        <el-table-column prop="operatorTime" label="跟进时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="催记来源"  :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.type | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="催收对象" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.target | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="targetName" label="姓名" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="resultType" label="反馈类型" :min-width="$helper.getColumnWidth(3)">
           <template slot-scope="scope">
            <span>{{scope.row.resultType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionFeedback" label="催收反馈" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.collectionFeedback===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt | toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseDate|dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <span style="color:green">{{scope.row.collectionFeedback | dictConvert}}</span>
              </template>
            </el-popover>
            <span v-else>{{scope.row.collectionFeedback | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="detail" label="电话/地址" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.contactPhone?scope.row.contactPhone:'' }} {{ scope.row.detail?scope.row.detail:'' }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="跟进内容" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operatorName" label="跟进人员"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="查看" :min-width="$helper.getColumnWidth(3)" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="downloadRecordClick(scope)" :disabled="scope.row.opUrl===null">
              <svg-icon iconName="laba"></svg-icon>
            </el-button>
            <el-button type="text" @click="CheckcertificateClick(scope)" :disabled="scope.row.fileIds===null">
              <svg-icon iconName="xiangce"></svg-icon>
            </el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--查看凭证-->
    <el-dialog title="查看" :center="true" :visible.sync="dialog.img" width="40%">
      <div style="padding-bottom:20px;overflow:hidden">
        <el-col style="max-height:500px;overflow-x:auto;text-align:center">
          <img v-for="(v,i) in imgArr" :key="i" :src="v" width="500" style="padding-bottom:20px" v-img />
        </el-col>
      </div>
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

  private dialog: any = {
    img: false
  };
  private imgArr = [];
  private followrecordModel: any = {
    type: "",
    collectionFeedback: "",
    collectionFeedbacks: [],
    operatorTime: []
  };
  private followrecordDataSet: any = [];
  private feedOptions: any = [];
  private fromPath: any = "";

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
    this.feedOptions = valid;
    this.getFromPath();
    this.refreshData();
  }
  /**
   * 获取来自于哪个模块
   */
  getFromPath() {
    let str: any =
      `${localStorage.getItem("fromPath")}` == "/"
        ? "/call-acc/call-case"
        : `${localStorage.getItem("fromPath")}`;
    this.fromPath = str.match(/\/(\S*)\//)[1];
    switch (this.fromPath) {
      case "call-acc": //电话
        this.followrecordModel.type = 78;
        break;
      case "visit-acc": //外访
        this.followrecordModel.type = 79;
        break;
      case "assist-acc": //协催
        this.followrecordModel.type = 162;
        break;
      case "inrushcase-manage": //内催
        this.followrecordModel.type = 858;
        break;
      case "outsource-manage": //内催
        this.followrecordModel.type = 859;
        break;
      case "special-case-manage": //特殊
        this.followrecordModel.type = 860;
        break;
      case "stop-collection-manage": //停催
        this.followrecordModel.type = 861;
        break;
      default:
        this.followrecordModel.type = "";
        break;
    }
  }
  /**
   * 重置
   */
  handleResetForm() {
    this.followrecordModel.dateRange = [];
    this.followrecordModel.collectionFeedbacks = [];
    this.followrecordModel.operatorTime = [];
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.followrecordModel.collectionFeedback = this.followrecordModel.collectionFeedbacks[
      this.followrecordModel.collectionFeedbacks.length - 1
    ];
    if (!this.followrecordModel.collectionFeedback) {
      this.followrecordModel.collectionFeedback = "";
    }
  }
  refreshData() {
    let Model: any = {
      operatorTime: [
        FilterService.dateRanageFormat(this.followrecordModel.operatorTime)
          .start,
        FilterService.dateRanageFormat(this.followrecordModel.operatorTime).end
      ],
      type: this.followrecordModel.type,
      collectionFeedback: this.followrecordModel.collectionFeedback
    };
    this.accTelPoolService
      .getFollowupRecord(this.caseInfo.caseNumber, Model, this.pageService, {
        operatorTime: "desc"
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
  /**
   * 下载录音
   */
  downloadRecordClick(scope) {
    CommonService.downloadFile(scope.row.opUrl, "语音内容");
  }
  /**
   * 查看资料
   */
  CheckcertificateClick(scope) {
    this.caseInfoService
      .getFollowupFile({
        followId: scope.row.id
      })
      .subscribe(
        data => {
          let urlArr: any = [];
          if (data && data.length) {
            urlArr = data
              .filter((v, i) => {
                if (v.type === "jpg" || v.type === "png") {
                  return true;
                } else {
                  CommonService.downloadFile(v.url, v.realName);
                  return false;
                }
              })
              .map(v => v.url);
          } else {
            this.$message.info("没有上传材料");
          }
          if (urlArr.length > 0) {
            this.imgArr = urlArr;
            this.dialog.img = true;
          }
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
