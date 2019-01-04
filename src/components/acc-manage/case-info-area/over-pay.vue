<template>
  <section class="component over-pay">
    <data-grid class="data-grid" :labelWidth="75" labelAlign="center" contentAlign="left">
      <data-grid-item label="客户姓名:" :span="4">{{personalInfo.name}}</data-grid-item>
      <data-grid-item label="身份证号:" :span="4">{{personalInfo.idCard}}</data-grid-item>
      <data-grid-item label="手机号:" :span="4">{{personalInfo.mobileNo}}</data-grid-item>
      <data-grid-item label="合同金额(元):" :span="4">
        <el-tooltip class="item  textStyle" effect="dark" placement="top-start" style="padding:0px" :content="caseInfo.contractAmount" v-if="caseInfo.contractAmount&&caseInfo.contractAmount.toString().length>10">
          <span>{{caseInfo.contractAmount| ellipsis(10)}}</span>
        </el-tooltip>
        <span v-else>{{caseInfo.contractAmount|toThousands}}</span>
      </data-grid-item>
      <data-grid-item label="期数(期):" :span="4">{{caseInfo.periods}}</data-grid-item>
      <data-grid-item label="逾期天数:" :span="4">{{caseInfo.overdueDays}}</data-grid-item>
    </data-grid>

    <!--逾期还款数据-->
    <div class="titlebpf">
      <el-row>
        <el-col :span="6"> 逾期总金额(元):
          <el-tooltip class="item  textStyle" effect="dark" placement="top-start" style="padding:0px" :content="caseInfo.overdueAmount" v-if="caseInfo.overdueAmount&&caseInfo.overdueAmount.toString().length>10">
            <span>{{caseInfo.overdueAmount| ellipsis(10)}}</span>
          </el-tooltip>
          <span v-else>{{caseInfo.overdueAmount|toThousands}}</span>
        </el-col>
        <el-col :span="6">
          实际还款金额(元):
          <el-tooltip class="item  textStyle" effect="dark" placement="top-start" style="padding:0px" :content="caseInfo.overdueInterest" v-if="caseInfo.overdueInterest&&caseInfo.overdueInterest.toString().length>10">
            <span>{{caseInfo.realPayAmount| ellipsis(10)}}</span>
          </el-tooltip>
          <span v-else>{{caseInfo.realPayAmount|toThousands}}</span>
        </el-col>
        <el-col :span="6">
          减免金额(元)：
          <el-tooltip class="item  textStyle" effect="dark" placement="top-start" style="padding:0px" :content="caseInfo.overdueDelayFine" v-if="caseInfo.overdueDelayFine&&caseInfo.overdueDelayFine.toString().length>10">
            <span>{{caseInfo.derateAmt| ellipsis(10)}}</span>
          </el-tooltip>
          <span v-else>{{caseInfo.derateAmt|toThousands}}</span>
        </el-col>
        <el-col :span="6">
          剩余应还金额(元)：
          <el-tooltip class="item  textStyle" effect="dark" placement="top-start" style="padding:0px" :content="(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt<=0)?0:(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt).toFixed(2)" v-if="(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt).toString().length>10">
            <span>{{(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt
              <=0)?0:(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt).toFixed(2)| ellipsis(10)}}</span>
          </el-tooltip>
          <span v-else>{{(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt
            <=0)?0:(caseInfo.overdueAmount-caseInfo.realPayAmount-caseInfo.derateAmt).toFixed(2)|toThousands}}</span>
        </el-col>
      </el-row>
    </div>

    <data-grid class="data-grid" :labelWidth="100" labelAlign="center" contentAlign="left">
      <data-grid-item label="还款类型:" :span="12" required>
        <el-radio-group @change="resetAll($event)" v-model="payaType">
          <el-radio :label="41">部分逾期还款</el-radio>
          <el-radio :label="42">全额逾期还款</el-radio>
          <el-radio :label="43">减免逾期还款</el-radio>
        </el-radio-group>
      </data-grid-item>
      <data-grid-item label="还款方式:" :span="12" required>
        <el-col :span="4">
          <el-select v-model="payWay" placeholder="请选择">
            <el-option v-for="{value,label} in this.$dict.getDictData('0010')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-col>
      </data-grid-item>
      <data-grid-item label="减免金额(元):" :span="12" v-show="payaType===43">
        <el-col :span="4">
          <el-input v-model="derateFee" placeholder="请输入减免金额" @blur="derate"></el-input>
        </el-col>
      </data-grid-item>
      <data-grid-item label="减免费用备注:" :span="12" v-show="payaType===43">
        <el-input v-model="derateDescripton" type="textarea" placeholder="请输入内容"></el-input>
      </data-grid-item>
      <data-grid-item label="还款金额(元):" :span="12" required>
        <el-col :span="4">
          <el-input v-model="payAmt" placeholder="请输入还款金额" @blur="repay"></el-input>
        </el-col>
      </data-grid-item>
      <data-grid-item label="还款说明:" :span="12">
        <el-input type="textarea" v-model="payDescripton" placeholder="请输入还款说明"></el-input>
      </data-grid-item>
      <data-grid-item label="上传凭证:" :span="12">
        <file-upload ref="file-upload" :fileList.sync="fileList" @onUploadSuccess="onUploadSuccess"></file-upload>
      </data-grid-item>
    </data-grid>
    <div class="row center-span" style="margin-top:20px">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm"  :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import {
  State,
  Mutation,
  namespace
} from "vuex-class";
import Component from "vue-class-component";
import {
  DataGrid,
  DataGridItem
} from "@zct1989/vue-component";
import DataBox from "~/components/common/data-box.vue";
import FileUpload from "~/components/common/file-upload.vue";
import ReductCalculation from "~/components/acc-manage/case-info-area/reduct-calculation.vue";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { AccVisitPoolService } from "../../../services/business-service/acc-visit-pool.service";
import { CaseAssistService } from "../../../services/business-service/case-assist.service";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Watch } from "vue-property-decorator";
import { FilterService } from '~/utils/filter.service';
import { FreeMoneyResultService } from "../../../services/business-service/free-money-result.service";
const accManageModule = namespace('acc-manage')
@Layout("workspace")
@Component({
  components: {
    DataBox,
    DataGrid,
    DataGridItem,
    FileUpload,
    ReductCalculation
  }
})
export default class overPay extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(FreeMoneyResultService) private freeMoneyResultService: FreeMoneyResultService;
  @Dependencies(AccVisitPoolService) private accVisitPoolService: AccVisitPoolService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @accManageModule.State caseInfo;
  @accManageModule.State caseId;
  @accManageModule.State searchModel;
  @accManageModule.Mutation updateRepayRecord;
  @accManageModule.State orderId;

  get personalInfo(): any {
    return this.caseInfo.personalInfo || {};
  }
  @Emit('close')
  close() { }
  @Watch("orderId")
  onCaseIdChange() {
    this.freeMoneyResultService
      .getFreeMonryResult({
        orderNumber: this.caseInfo.orderId
      })
      .subscribe(data => {
        this.toMoney = data
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }

  private derateFlag: any = '';
  private getCaseInfoData: any = '';
  private fileList: any = [];
  private totalMoney: any = '';
  private payaType: any = ''; // 还款类型
  private derateFee: any = ''; // 减免金额
  private payWay: any = ''; // 还款方式
  private derateDescripton: any = ''; // 减免费用备注
  private payDescripton: any = ''; // 还款说明
  private payAmt: any = ''; // 还款金额
  private isClass = false;
  private toMoney: any = '';
  private addressData: any = [];
  private submitLoading: Boolean = false;

  private rules: any = {
    assistWay: [{
      required: true,
      message: '请输入协催方式',
      type: 'Number',
      trigger: 'change'
    }],
    applyReason: [{
      required: true,
      message: '请输入协催说明',
      trigger: 'blur'
    }]
  };
  private applyData: any = {
    applyReason: '',
    assistWay: ''
  }
  private dialog: any = {
    reduct: false
  }
  //声明案件类型
  private caseType:any=''
  mounted() {
    //效验减免金额
    // this.freeMoneyResultService
    //   .getFreeMonryResult({
    //     orderNumber: this.caseInfo.orderId
    //   })
    //   .subscribe(data => {
    //     this.toMoney = data
    //   }, ({ msg }) => {
    //     this.$message.error(msg)
    //   })
  }
  /**
   * 减免计算
   */
  // reductCalculation() {
  //   this.dialog.reduct = true;
  // }
  onUploadSuccess(id, data) {

  }
  /**
   * 减免金额失去焦点事件（输入金额不小于0）
   */
  derate() {
    let deratenum: any = Number(String(this.derateFee).split(',').join(''))
    if (deratenum < 0) {
      this.payAmt = FilterService.toThousands(this.caseInfo.overdueAmount)
      // this.derateFee = FilterService.toThousands(0)
    }
    // if (this.payaType === 44) {
    //   if (deratenum > this.toMoney.totalCost) {
    //     this.derateFee = FilterService.toThousands(deratenum)
    //     this.payAmt = FilterService.toThousands(this.toMoney.countMomey)
    //   } else {
    //     this.derateFee = FilterService.toThousands(deratenum)
    //     this.payAmt = FilterService.toThousands(this.toMoney.countMomey - deratenum)
    //   }
    // }
    let aggregate = this.caseInfo.overdueAmount - this.caseInfo.realPayAmount - this.caseInfo.derateAmt
    if (this.payaType === 43) {
      this.derateFee = FilterService.toThousands(deratenum)
      let payAmt = Number(aggregate) - Number(deratenum)

      if (payAmt >= 0) {
        this.payAmt = FilterService.toThousands(payAmt)
      } else {
        this.payAmt = 0
      }
    }
  }
  /**
   * 还款金额失去焦点事件（输入金额不小于0）
   */
  repay() {
    if (this.payaType === 43) {
      let num: any = Number(String(this.payAmt).split(',').join('')).toFixed(2)
      if (Number(num) < 0) {
        this.payAmt = ''
      } else {
        this.payAmt = FilterService.toThousands(num)
        this.derateFee = FilterService.toThousands(this.caseInfo.overdueAmount - num)
      }
    } else
      if (this.payaType === 42) {
        let num = Number(String(this.payAmt).split(',').join('')).toFixed(2)
        if (Number(num) < 0) {
          this.payAmt = ''
        } else {
          this.payAmt = FilterService.toThousands(num)
          this.derateFee = FilterService.toThousands(0)
        }
      } else {
        let num = Number(String(this.payAmt).split(',').join('')).toFixed(2)
        this.payAmt = FilterService.toThousands(num)
        if (Number(num) <= 0) {
          this.payAmt = ''
          this.$message('还款金额必须大于0！')
        }
      }
  }
  /**
   * 还款类型切换时
   */
  resetAll(item) {
    this.payWay = ''
    this.payDescripton = ''
    this.derateDescripton = ''
    this.derateFee = ''
    if (this.payaType === 44 || this.payaType === 43) {
      this.payAmt = ''
    }
    let aggregate = this.caseInfo.overdueAmount - this.caseInfo.realPayAmount - this.caseInfo.derateAmt
    if (this.payaType === 42) {
      this.payAmt = FilterService.toThousands(aggregate)
    }
  }
  /**
   * 取消
   */
  cancel() {
    this.close()
    this.payWay = ''
    this.payDescripton = ''
    this.derateDescripton = ''
    this.derateFee = ''
    this.payAmt = ''
    this.payaType = ''
    this.applyData.applyReason = ''
    this.applyData.assistWay = ''
    let addForm: any = this.$refs['file-upload']
    addForm.reset()
  }
  /**
   * 确定
   */
  confirm() {
    if (this.payAmt.length > 13 || this.derateFee.length > 13) {
      this.$alert('还款金额不能超过十亿', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    if (this.payaType === 44 || this.payaType === 43) {
      if (Number(String(this.derateFee).split(',').join('')) < 0) {
        this.$alert('减免金额不能为负数', '提示', {
          confirmButtonText: '确定'
        })
        // this.derateFee = FilterService.toThousands(0)
        return
      }
    }

    if (Number(String(this.payAmt).split(',').join('')) < 0) {
      this.$alert('还款金额不能为负数', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    if (this.payaType === '') {
      this.$alert('还款类型，还款金额和还款方式为必填', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    if (this.payaType === 44 || this.payaType === 42 || this.payaType === 43) {
      if (this.payAmt === '' || this.payWay === '') {
        this.$alert('还款金额和还款方式为必填', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
    }
    if (this.payaType === 44) {
      let deratenum: any = Number(String(this.derateFee).split(',').join(''))
      if (deratenum > this.toMoney.totalCost || deratenum < 0) {
        this.derateFee = FilterService.toThousands(0)
        this.payAmt = FilterService.toThousands(this.toMoney.countMomey)
        this.$alert('减免金额不能超过减免总金额', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
    }

    if (this.payaType === 43 || this.derateFee > 0) {
      this.derateFlag = 1
    } else {
      this.derateFlag = 0
    }
    //获取案件类型
    this.caseType=this.searchModel.collectionType;
      this.submitLoading = true;
    if (this.caseType === 15) {
      this.accTelPoolService
        .doTelPay({
          fileIds: this.fileList.map(v => v.response.id),
          payaType: this.payaType,
          payWay: this.payWay,
          payAmt: Number(String(this.payAmt).split(',').join('')),
          caseId: this.caseId,
          derateFee: this.derateFee.split(',').join(''),
          derateDescripton: this.derateDescripton,
          caseNumber: this.caseInfo.caseNumber,
          payDescripton: this.payDescripton,
          derateFlag: this.derateFlag,
        })
        .subscribe(data => {
          this.$message.success( '申请成功！')
          this.submitLoading = false;
          this.updateRepayRecord(new Date())
          this.cancel()
        }, ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        } 
        )
    } else if (this.caseType === 16) {
      this.accVisitPoolService
        .doVisitPay({
          fileIds: this.fileList.map(v => v.response.id),
          payaType: this.payaType,
          payWay: this.payWay,
          payAmt: this.payAmt.split(',').join(''),
          caseId: this.caseId,
          derateFee: this.derateFee.split(',').join(''),
          derateDescripton: this.derateDescripton,
          caseNumber: this.caseInfo.caseNumber,
          payDescripton: this.payDescripton,
          derateFlag: this.derateFlag,
        })
        .subscribe(data => {
          this.$message.success( '申请成功！')
          this.submitLoading = false;
          this.updateRepayRecord(new Date())
          this.cancel()
        }, ({ msg }) => {
          this.$message.error(msg)
          this.submitLoading = false;
        })
    } else if (this.caseType === 17) {
      this.caseAssistService
        .doAssistPay({
          fileIds: this.fileList.map(v => v.response.id),
          payaType: this.payaType,
          payWay: this.payWay,
          payAmt: this.payAmt.split(',').join(''),
          caseId: this.caseId,
          derateFee: this.derateFee.split(',').join(''),
          derateDescripton: this.derateDescripton,
          caseNumber: this.caseInfo.caseNumber,
          payDescripton: this.payDescripton,
          derateFlag: this.derateFlag,
        })
        .subscribe(data => {
          this.$message.success('申请成功！')
          this.submitLoading = false;
          this.updateRepayRecord(new Date())
          this.cancel()
        }, ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        })
    }
  }
}

</script>

<style lang="less" scoped>
.titlebpf {
  border: solid 1px #dee1e5;
  border-bottom: 0px;
  line-height: 40px;
  width: 100%;
}

.overPay {
  top: 457px!important;
  left: 50px!important
}

.overPayout {
  top: 410px!important;
  left: 39px!important
}
</style>
