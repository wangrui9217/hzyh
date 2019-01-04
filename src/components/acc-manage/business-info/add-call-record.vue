<template>
  <section class="component add-call-record">
    <el-form :rules="rules" :model="addModel" ref="add-record-form" label-width="100px" class="text-left">
      <div class="content">
          <el-form-item label="催收对象:" prop="target">
            <el-select v-model="addModel.target" @change="accTarget" clearable class="select_content">
              <el-option v-for="{value,label} in $dict.getDictData('0015')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="催收反馈:" prop="collectionFeedbacks">
            <el-cascader v-model="addModel.collectionFeedbacks" :options="accFeedback" @change="feedbackChange" change-on-select :show-all-levels="false" clearable class="select_content"></el-cascader>
          </el-form-item>
          <el-form-item label="姓名:" prop="targetName">
            <el-input v-model="addModel.targetName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="contactPhone" v-if="!isCallCollectionType">
            <el-input v-model="addModel.contactPhone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="地址状态:" prop="addrStatus" v-if="isCallCollectionType">
            <el-select v-model="addModel.addrStatus" clearable class="promiseAmt select_content">
              <el-option v-for="{value,label} of $dict.getDictData('0035')" :key="value" :label="label" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址类型:" prop="addrType" v-if="isCallCollectionType">
            <el-select v-model="addModel.addrType" clearable class="promiseAmt select_content">
              <el-option v-for="{value,label} of $dict.getDictData('0018')" :key="value" :label="label" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域:" prop="cityCode" v-if="isCallCollectionType">
            <el-cascader v-model="addModel.cityCode" :options="options" clearable class="select_content"></el-cascader>
          </el-form-item>
      </div>
          
          <!-- <el-form-item v-if="addModel.collectionFeedback===90" label="还款金额(元):" prop="promiseAmt">
            <el-input type="input" v-model="addModel.promiseAmt" class="promiseAmt"></el-input>
          </el-form-item>
          <el-form-item v-if="addModel.collectionFeedback===90" label="还款日期:" prop="promiseDate">
            <el-date-picker :picker-options="promiseDate" class="promise" type="datetime" :editable="false" v-model="addModel.promiseDate" placeholder="选择日期时间" clearable>
            </el-date-picker> -->
          <el-form-item label="详细地址:" prop="address" v-if="isCallCollectionType">
            <el-input type="textarea" :rows="2" :cols="4" v-model="addModel.address"></el-input>
          </el-form-item>
          <el-form-item label="跟进内容:" prop="content">
            <el-input type="textarea" :maxlength="500" :rows="2" :cols="4" v-model="addModel.content"></el-input>
          </el-form-item>
          <el-form-item label="下次跟进日期:" prop="follnextDate">
            <el-date-picker :picker-options="follnextDate" type="datetime" class="promise" :editable="false" v-model="addModel.follnextDate" placeholder="选择日期时间" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="下次跟进内容:" prop="follnextContent">
            <el-input v-model="addModel.follnextContent" type="textarea" :maxlength="500" :rows="2" :cols="4"></el-input>
          </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:10px">
      <el-button @click="submit" style="margin-bottom:10px" :loading="submitLoading">保存记录</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Mutation, namespace } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { Emit, Watch } from "vue-property-decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { CaseAssistService } from "~/services/business-service/case-assist.service";
import { FilterService } from "~/utils/filter.service";
import { CityService } from "~/utils/city.service";
import { caseType, followType, sourceType } from "~/config/enum.config";
import clone from "clone";
import { ifError } from "assert";

const accManageModule = namespace("acc-manage");

@Component({
  components: {}
})
export default class AddCallRecord extends Vue {
  @accManageModule.State caseInfo;
  @accManageModule.State caseId;
  @accManageModule.State callInfo;
  @accManageModule.Mutation updateRefreshState;
  /*
    上级页面查询数据的实体，用于右侧List　拼接查询
    案件数据查询实体 包含 
    caseType: collectionType
    status : collectionStatusList
  */
  @accManageModule.State searchModel;
  @accManageModule.Mutation updateCurrentBusinessTabName;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @State companyList: any;
  @Emit("refreshRecord")
  refreshRecord() {}
  @Watch("callInfo")
  onCallInfoChange() {
    this.addModel.target = this.callInfo.follRelation;
    this.addModel.targetName = this.callInfo.follName;
    this.addModel.contactPhone = this.callInfo.follPhone;
  }
  @Watch("caseInfo")
  onCaseInfoChange() {
    this.addModel = {
      content: "", // 跟进记录
      targetName: "", // 姓名
      target: "", // 跟进对象
      caseId: this.caseId,
      caseNumber: this.caseInfo.caseNumber,
      personalId: this.personalInfo.id,
      contactPhone: "",
      type: this.getFllowType(), // 跟进方式（78电催，79外访，186协催）
      collectionType: this.searchModel.collectionType, // 催收类型(15电催,16外访)
      source: "", // 数据来源(80电话，81外访)
      follnextFlag: "", // 下次跟进标志（0-没有下次跟进 1-有下次跟进"）
      follnextDate: "", // 下次跟进提醒日期
      follnextContent: "", // 下次跟进提醒内容
      collectionWay: 1,
      phoneStatus: "",
      collectionFeedbacks: [],
      collectionFeedback: "", // 催收反馈
      addrStatus: "", //地址状态
      addrType: "", //地址类型
      cityCode: [], //区域城市信息
      address: "", //详细地址
      detail: ""
    };
  }

  private accFeedback: any = [];
  private isEdit = false;
  private add: any = "";
  private addressAppend: any = "";
  private options: any = CityService.getCityData();
  private addModel: any = {};
  private rules: any = {};
  private fromPath: any = "";
  private resultType: any = "";
  private submitLoading: Boolean = false;

  private follnextDate: any = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    }
  };
  private promiseDate: any = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    }
  };

  get personalInfo() {
    return this.caseInfo.personalInfo || {};
  }

  created() {
    this.rules = {
      target: {
        required: true,
        message: "请选择催收对象",
        trigger: "change",
        type: "number"
      },
      contactPhone: [
        { required: true, message: "请输入联系电话", trigger: "blur" },
        { validator: this.$validator.phoneAndCallNumber, trigger: "blur" }
      ],
      collectionFeedbacks: {
        required: true,
        message: "请选择催收反馈",
        trigger: "change"
      },
      targetName: { required: true, message: "请输入姓名", trigger: "blur" },
      content: { required: true, message: "请输入跟进内容", trigger: "blur" },
      promiseAmt: [
        { required: true, message: "请输入还款金额", trigger: "blur" },
        { validator: this.$validator.money, trigger: "blur" }
      ],
      promiseDate: {
        required: true,
        message: "请选择还款日期",
        trigger: "blur"
      },
      addrStatus: {
        required: true,
        message: "请选择地址状态",
        trigger: "change"
      },
      addrType: { required: true, message: "请选择地址类型", trigger: "blur" },
      cityCode: { required: true, message: "请选择区域", trigger: "blur" },
      address: { required: true, message: "请输入详细地址", trigger: "blur" }
    };
    this.addModel = {
      content: "", // 跟进记录
      targetName: "", // 姓名
      target: "", // 跟进对象
      caseId: this.caseId,
      caseNumber: this.caseInfo.caseNumber,
      personalId: this.personalInfo.id,
      contactPhone: "",
      type: this.getFllowType(), // 跟进方式（78电催，79外访，186协催）
      collectionType: this.searchModel.collectionType, // 催收类型(15电催,16外访)
      source: "", // 数据来源(80电话，81外访)
      follnextFlag: "", // 下次跟进标志（0-没有下次跟进 1-有下次跟进"）
      follnextDate: "", // 下次跟进提醒日期
      follnextContent: "", // 下次跟进提醒内容
      collectionWay: 1,
      phoneStatus: "",
      collectionFeedbacks: [],
      collectionFeedback: "", // 催收反馈
      addrStatus: "", //地址状态
      addrType: "", //地址类型
      cityCode: [], //区域城市信息
      address: "", //详细地址
      detail: "",
      resultType: ""
    };
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
    this.accFeedback = valid;
  }

  /**
   * 获取是否外访、协催类型
   */
  get isCallCollectionType() {
    return (
      this.searchModel.collectionType === caseType.visit ||
      this.searchModel.collectionType === caseType.assist
    );
  }

  /**
   * 判断来与哪个模块
   */
  getFllowType() {
    let str: any =
      `${localStorage.getItem("fromPath")}` == "/"
        ? "/call-acc/call-case"
        : `${localStorage.getItem("fromPath")}`;
    this.fromPath = str.match(/\/(\S*)\//)[1];
    switch (this.fromPath) {
      case "call-acc": //电话
        return 78;
      case "visit-acc": //外访
        return 79;
      case "assist-acc": //协催
        return 162;
      case "inrushcase-manage": //内催
        return 858;
      case "outsource-manage": //委外
        return 859;
      case "special-case-manage": //特殊
        return 860;
      case "stop-collection-manage": //停催
        return 861;
      default:
        return "";
    }
  }

  /**
   * 保存记录
   */
  submit() {
    if (this.addModel.promiseDate) {
      let myDate = new Date();
      if (this.addModel.promiseDate <= myDate) {
        this.$message("承诺日期不能小于或等于当前时间，请重新选择！");
        this.addModel.promiseDate = "";
        return;
      }
    }
    if (this.addModel.follnextDate) {
      let myDate = new Date();
      if (this.addModel.follnextDate <= myDate) {
        this.$message("跟进提醒时间不能小于或等于当前时间，请重新选择！");
        this.addModel.follnextDate = "";
        return;
      }
    }
    if (!this.isEdit) {
      this.addRecord();
    }
  }
  /**
   * 添加跟进记录
   */
  addRecord() {
    let addForm: any = this.$refs["add-record-form"];
    addForm.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.addModel.promiseFlag =
        this.addModel.collectionFeedback === 90 ? 1 : 0;
      this.addModel.follnextFlag =
        this.addModel.follnextDate || this.addModel.follnextContent ? 1 : 0;

      if (this.searchModel.collectionType === caseType.call) {
        this.saveFollowupRecordByCall();
      } else if (this.searchModel.collectionType === caseType.visit) {
        this.saveFollowupRecordByVisit();
      } else if (this.searchModel.collectionType === caseType.assist) {
        this.saveFollowupRecordByAssist();
      } else {
        this.saveFollowupRecord();
      }
    });
  }

  saveFollowupRecord() {
    let model = clone(this.addModel);
    model.promiseDate = FilterService.dateFormat(this.addModel.promiseDate); // 承诺还款日期
    model.follnextDate = FilterService.dateFormat(this.addModel.follnextDate); // 下次跟进提醒日期
    if (this.addModel.type == "858" || this.addModel.type == "589") {
      model.collectionType = this.caseInfo.collectionType;
    }
    this.accTelPoolService.saveFollowupRecord(model).subscribe(
      data => {
        this.addSuccess();
        this.submitLoading = false;
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg);
      }
    );
  }
  /*
   *提交成功，再进行数据初始化
   */
  addSuccess() {
    let addForm: any = this.$refs["add-record-form"];
    this.$message.success("添加成功");
    this.refreshRecord();
    this.updateCurrentBusinessTabName("follow-record");
    this.updateRefreshState(Math.random());
    addForm.resetFields();
  }

  /**
   * 保存催收记录 --电话催收
   */
  saveFollowupRecordByCall() {
    let model = clone(this.addModel);
    model.source = sourceType.call; // 数据来源(80电话，81外访)
    model.promiseDate = FilterService.dateFormat(this.addModel.promiseDate); // 承诺还款日期
    model.follnextDate = FilterService.dateFormat(this.addModel.follnextDate);
    model.taskId = this.callInfo.taskId // 拨打电话时传的参数
    this.accTelPoolService.saveFollowupRecord(model).subscribe(
      data => {
        this.addSuccess();
        this.submitLoading = false;
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg);
      }
    );
  }

  /**
   * 保存催收记录 --外访
   */
  saveFollowupRecordByVisit() {
    let numberCase: any = this.addModel.cityCode;
    let actors: any = CityService.getCityName(
      numberCase[0],
      numberCase[1],
      numberCase[2]
    );

    let model = clone(this.addModel);
    model.detail = actors.concat(this.addModel.address).toString();
    model.source = sourceType.visit;
    model.promiseDate = FilterService.dateFormat(this.addModel.promiseDate); // 承诺还款日期
    model.follnextDate = FilterService.dateFormat(this.addModel.follnextDate); // 下次跟进提醒日期

    this.accVisitPoolService.saveFollowupRecord(model).subscribe(
      data => {
        this.addSuccess();
        this.submitLoading = false;
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg);
      }
    );
  }

  /**
   * 保存催收记录 --协助催收
   */
  saveFollowupRecordByAssist() {
    let numberCase: any = this.addModel.cityCode;
    let actors: any = CityService.getCityName(
      numberCase[0],
      numberCase[1],
      numberCase[2]
    );

    let model = clone(this.addModel);
    model.detail = actors.concat(this.addModel.address).toString();
    model.source = sourceType.assist;
    model.promiseDate = FilterService.dateFormat(this.addModel.promiseDate); // 承诺还款日期
    model.follnextDate = FilterService.dateFormat(this.addModel.follnextDate); // 下次跟进提醒日期

    this.caseAssistService.saveFollowupRecord(model).subscribe(
      data => {
        this.addSuccess();
        this.submitLoading = false;
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg);
      }
    );
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.addModel.resultType = this.addModel.collectionFeedbacks[
      this.addModel.collectionFeedbacks.length - 2
    ];
    this.addModel.collectionFeedback = this.addModel.collectionFeedbacks[
      this.addModel.collectionFeedbacks.length - 1
    ];

    if (!this.addModel.collectionFeedback) {
      this.addModel.collectionFeedback = "";
    }
  }
  /**
   * 催收对象change
   */
  accTarget() {
    let Contacts = this.personalInfo.personalContacts.find(
      v => v.relation === Number(this.addModel.target)
    );
    if (Contacts) {
      this.addModel.targetName = Contacts.name;
      this.addModel.contactPhone = Contacts.phone;
    } else {
      this.addModel.targetName = "";
      this.addModel.contactPhone = "";
    }
  }
}
</script>

<style lang="less">
.add-call-record {
  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .el-form-item__label {
    text-align: left !important;
  }
  .el-form-item__content .el-input {
    width: 140px !important;
  }
   .el-form-item__content .el-date-editor--datetime{
    width: 180px !important;
   }
  .promiseAmt .el-input {
    width: 140px !important;
  }
}
</style>
