<template>
  <section class="page email-acc">
    <data-form :model="emailModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName" v-auth="5093">
          <el-input v-model="emailModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5094">
          <el-input v-model="emailModel.collectorName"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期天数" prop="dayRange" v-auth="5095">
          <number-range v-model="emailModel.dayRange" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5096">
          <el-input v-model="emailModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5097">
          <el-select v-model="emailModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="emailBatchClick" v-auth="5098">电子邮件群发</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="emailDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.mobileNo|encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column label="委托方" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="当前催收员" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.collectorName?scope.row.collectorName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件流入日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--电子邮件群发-->
    <el-dialog :visible.sync="dialog.emailBatchSend" :center="true" title="电子邮件群发">
      <email-batch-send ref="email-batch-send" @emailChange="emailChange" @success="emailSuccess"></email-batch-send>
    </el-dialog>
    <el-dialog :visible.sync="changePhone.flag" :center="true" title="新增邮箱地址">
      <el-form :model="changePhoneForm" ref="phoneForm" label-width="100px">
        <el-form-item prop="mail" label="电子邮箱" :rules="[
      { required: true,type:'email', message: '请输入电子邮箱', trigger: 'blur' }
      ]">
          <el-input v-model="changePhoneForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="修复说明" prop="remark" :rules="[
      { required: true, message: '请输入修复说明', trigger: 'blur' }
      ]">
          <el-input type="textarea" v-model="changePhoneForm.remark"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-row type="flex" justify="center">
            <el-button @click="changePhoneConfirm">确 定</el-button>
            <el-button @click="changePhone.flag = false">取 消</el-button>
          </el-row>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import EmailBatchSend from "~/components/email-acc/email-batch-send.vue";
import NumberRange from "~/components/common/number-range.vue";

@Auth(159)
@Layout("workspace")
@Component({
  components: {
    NumberRange,
    DataForm,
    DataBox,
    EmailBatchSend
  }
})
export default class EmailAcc extends Vue {
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(PageService) private pageService: PageService;
  private selectionList: any = [];
  private emailModel: any = {};
  private dialog: any = {
    emailBatchSend: false
  };
  private emailDataSet: Array<any> = [];
  private changePhone: any = {};
  private changePhoneForm: any = {};
  @State principalList: any;
  created() {
    this.changePhone = {
      flag: false,
      custId: "",
      index: ""
    };
    this.changePhoneForm = {
      mail: "",
      remark: ""
    };
    this.emailModel = {
      personalName: "",
      collectorName: "",
      dayRange: {
        min: "",
        max: ""
      },
      orderId: "",
      collectionType: "15,16",
      collectionStatusList: "20,21,22,23,172",
      batchNumber: "",
      principalId: ""
    };
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByNoPower(this.emailModel, this.pageService)
      .subscribe(
        data => {
          this.emailDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  emailBatchClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要分配的案件", "提示", {
        confirmButtonText: "确定"
      });
      return false;
    }
    this.dialog.emailBatchSend = true;
    this.$nextTick(() => {
      let EmailBatchSend = <any>this.$refs["email-batch-send"];
      EmailBatchSend.refresh(this.selectionList);
    });
  }
  /**
   * 发送成功
   */
  emailSuccess() {
    this.dialog.emailBatchSend = false;
  }
  /**
   * 修改邮箱
   */
  emailChange(scope) {
    this.changePhone.index = scope.$index;
    this.changePhone.custId = scope.row.custId;
    this.changePhone.cupoId = scope.row.cupoId;
    this.changePhone.custName = scope.row.custName;
    this.changePhone.relation = scope.row.relation;
    this.changePhone.flag = true;
  }
  /**
   * 新增邮箱
   */
  changePhoneConfirm() {
    let phoneForm: any = this.$refs["phoneForm"];
    phoneForm.validate(validate => {
      if (!validate) {
        return false;
      }
      let changeData: any = {
        personalId: this.changePhone.custId,
        mail: this.changePhoneForm.mail,
        remark: this.changePhoneForm.remark,
        caseId: this.changePhone.cupoId,
        name: this.changePhone.custName,
        relation: this.changePhone.relation
      };
      this.accTelPoolService.saveRepairInfo(changeData).subscribe(
        data => {
          this.$message.success("操作成功");
          this.changePhone.flag = false;
          this.$nextTick(() => {
            let EmailBatchSend = <any>this.$refs["email-batch-send"];
            EmailBatchSend.addSendData(changeData);
          });
          this.changePhoneForm.mail = "";
          this.changePhoneForm.remark = "";
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    });
  }
}
</script>

<style lang="less">
.dialog-footer {
  padding-top: 30px;
  padding-bottom: 20px;
}
</style>
