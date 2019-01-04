<template>
  <section class="page message-acc">
    <data-form :model="msgModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName" v-auth="5355">
          <el-input v-model="msgModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5356">
          <el-input v-model="msgModel.collectorName"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期天数" prop="dayRange" v-auth="5357">
          <number-range v-model="msgModel.dayRange" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5358">
          <el-input v-model="msgModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5359">
          <el-select v-model="msgModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchClick"  v-auth="5360">短信群发</el-button>
      </template>
    </data-form>
    <data-box :data="msgDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
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
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流入日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--选择发送对象-->
    <el-dialog title="选择发送对象" :center="true" :visible.sync="dialog.choose" width="60%" @open="$nextTick(()=>$refs['choose-send-obj'].refresh())">
      <choose-send-obj ref="choose-send-obj" @nextStep="nextStep"></choose-send-obj>
    </el-dialog>
    <!--新增角色弹出框-->
    <el-dialog title="短信群发" :center="true" :visible.sync="dialog.batch" width="60%" @open="$nextTick(()=>$refs['message-batch-send'].refresh(selectionList, msgObj.custCheck.length?'1':'0', msgObj.checkList))">
      <message-batch-send @preStep="dialog.batch=false,dialog.choose=true" @errMessage="errMessageShow" @success="refreshData(), dialog.batch = false;dialog.choose = false"
        @addPhone="addPhone" ref="message-batch-send"></message-batch-send>
    </el-dialog>
    <!--短信发送失败-->
    <el-dialog title="短信发送失败" :center="true" :visible.sync="dialog.err">
      <data-box :data="errDataSet">
        <template slot="columns">
          <el-table-column prop="personalName" label="姓名" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="personalPhone" label="错误手机号码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
        </template>
      </data-box>
    </el-dialog>
    <!--新增手机号-->
    <el-dialog title="新增手机号" :center="true" :visible.sync="dialog.addPhone" width="40%" @close="submitLoading=false"  @open="submitLoading=false">
      <div style="display: flex;justify-content: center">
        <el-form :model="phoneModel" ref="phoneForm" label-width="70px">
          <el-form-item prop="phone" label="手机号" :rules="[
        { required: true, message: '请输入手机号', trigger: 'blur', pattern:/^1(3|4|5|7|8)\d{9}$/}
        ]" class="text-left">
            <el-input v-model="phoneModel.phone"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-col class="dialog-footer" align="center">
        <el-button @click="phoneConfirm" :loading="submitLoading">确定</el-button>
        <el-button @click="dialog.addPhone = false;">取消</el-button>
      </el-col>
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
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { State } from "vuex-class";
import MessageBatchSend from "~/components/message-acc/message-batch-send.vue";
import ChooseSendObj from "~/components/message-acc/choose-send-obj.vue";
import NumberRange from "~/components/common/number-range.vue";

@Auth(152)
@Layout("workspace")
@Component({
  components: {
    NumberRange,
    ChooseSendObj,
    MessageBatchSend,
    DataForm,
    DataBox
  }
})
export default class MessageAcc extends Vue {
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(PageService) private pageService: PageService;
  @State principalList: any;

  private msgModel: any = {
    personalName: "",
    collectorName: "",
    dayRange: {
      min: "",
      max: ""
    },
    collectionType: "15,16",
    collectionStatusList: "20,21,22,23,172",
    batchNumber: "",
    principalId: ""
  };
  private phoneModel: any = {
    relation: "",
    name: "",
    id: "",
    i: "",
    index: "",
    phone: ""
  };
  private msgDataSet = null;
  private errDataSet: any = [];
  private selectionList: any = [];
  private msgObj: any = {};
  private dialog: any = {
    batch: false,
    choose: false,
    err: false,
    addPhone: false
  };
  private submitLoading: Boolean = false;
  /**
   * 新增手机号确定
   */
  phoneConfirm() {
    let form: any = this.$refs["phoneForm"];
    form.validate(valid => {
      if (!valid) {
        return false;
      }
      this.submitLoading = true;
      this.accTelPoolService
        .savePersonalContactPhone(this.phoneModel)
        .subscribe(
          data => {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.submitLoading = false;
            this.dialog.addPhone = false;
            this.$nextTick(() => {
              let messageBatchSend: any = this.$refs["message-batch-send"];
              messageBatchSend.addSendData(this.phoneModel);
              this.submitLoading = false;
            });
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
    });
  }
  /**
   * 新增手机号
   */
  addPhone(scope, i) {
    this.dialog.addPhone = true;
    this.phoneModel.i = i;
    this.phoneModel.index = scope.$index;
    this.phoneModel.id = scope.row.concatIds[i];
    this.phoneModel.name = scope.row.nameList[i];
    this.phoneModel.relation = scope.row.relation[i];
    this.phoneModel.status = scope.row.status[i];
    this.$nextTick(() => {
      let phoneForm: any = this.$refs["phoneForm"];
      phoneForm.resetFields();
    });
  }
  /**
   * 错误信息
   */
  errMessageShow(data) {
    this.dialog.err = true;
    this.errDataSet = data;
  }
  /**
   * 短信群发
   */
  batchClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要发送短信的案件！", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.dialog.choose = true;
    }
  }
  /**
   * 短信群发下一步
   */
  nextStep(checkList, custCheck) {
    // this.dialog.choose = false;
    this.dialog.batch = true;
    this.msgObj.custCheck = custCheck;
    this.msgObj.checkList = checkList;
  }

  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByNoPower(this.msgModel, this.pageService)
      .subscribe(
        data => {
          this.msgDataSet = data;
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
  mounted() {
    this.refreshData();
  }
}
</script>

<style lang="less">
.dialog-footer {
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
