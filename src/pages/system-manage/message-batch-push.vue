<template>
  <section class="page message-batch-push">
    <el-row type="flex">
      <el-col style="flex-basis:300px;border:1px solid #e4e4e4;height:595px;overflow:auto;min-width: 0">
        <!-- <department-tree @onCurrentChange="getCheckedNodes"></department-tree> -->
        <origanize-tree  :isIcon="false" ref="orgTree" @change="onChange" :dataList="visitDeptData"></origanize-tree>
      </el-col>
      <el-col style="margin-left:20px;width:500px;flex-grow:1">
        <data-form :model="messageModel" @onSearch="refreshData" :page="pageService">
          <template slot="default-input">
            <el-form-item label="用户名" prop="userName"  v-auth="5564">
              <el-input v-model="messageModel.userName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName" v-auth="5565">
              <el-input v-model="messageModel.realName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-auth="5566">
              <el-select v-model="messageModel.status" placeholder="请选择" clearable>
                <el-option label="启用" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template slot="default-button">
            <el-button @click="messageBatchClick" v-show="status === 0" v-auth="5567">批量消息推送</el-button>
            <el-button @click="bindPhoneClick" v-auth="5568">绑定主叫号码</el-button>
          </template>
        </data-form>
        <data-box :data="messageDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(4)">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(4)">
            </el-table-column>
            <el-table-column prop="phone" label="电话" :min-width="$helper.getColumnWidth(4)">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" :min-width="$helper.getColumnWidth(4)">
            </el-table-column>
            <el-table-column prop="belongDepartment" label="所属机构" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{scope.row.department?scope.row.department.name:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">启用</span>
                <span v-if="scope.row.status == 1">停用</span>
              </template>
            </el-table-column>
            <el-table-column prop="operateTime" label="创建日期" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{scope.row.operatorTime | dateFormat('yyyy-MM-dd')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <el-button type="text" @click="msgPushClick(scope)" v-auth="5569">消息推送</el-button>
                <el-button type="text" @click="telClick(scope)" v-auth="5570">电话</el-button>
              </template>
            </el-table-column>
          </template>
        </data-box>
        <!--绑定主叫号码-->
        <el-dialog title="绑定主叫号码" :visible.sync="dialog.bindPhone" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" style="width:1200px;margin:0 auto">
          <BindPhone ref='bind-phone' @closetwo="dialog.bindPhone = false"></BindPhone>
        </el-dialog>
        <!--批量信息推送-->
        <el-dialog title="批量消息推送" @close="dialogClose" :visible.sync="dialog.batchMsgPushFlag" :close-on-click-modal="false">
          <BatchMessPushDialog ref="appMsgPush" @resetSuccess="resetSuccess" @close="dialog.batchMsgPushFlag=false" :selectionList="selectionList"></BatchMessPushDialog>
        </el-dialog>
        <!--信息推送-->
        <el-dialog title="APP消息推送" @close="dialogClose" :visible.sync="dialog.appMsgPushFlag" :close-on-click-modal="false">
          <appMsgPush ref="appMsgPush" @resetSuccess="resetSuccess" @close="dialog.appMsgPushFlag=false" :currItem="currItem"></appMsgPush>
        </el-dialog>

      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { UserService } from "../../services/business-service/user.service";
import { DepartmentService } from "~/services/business-service/department.service"
import { SmaService } from "~/services/common-service/sma.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import DepartmentTree from '~/components/system-manage/department-tree.vue';
import BindPhone from "~/components/system-manage/message-push/bind-phone.vue"
import BatchMessPushDialog from "~/components/system-manage/message-push/batch-mess-push-dialog.vue"
import AppMsgPush from "~/components/system-manage/message-push/app-msg-push.vue"
import OriganizeTree from "~/components/system-manage/user-manage/origanize-tree.vue";
import { State, Mutation, Getter, namespace } from "vuex-class";
const accManageModule = namespace("acc-manage");
import { Watch } from "vue-property-decorator";

@Auth(859)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    DepartmentTree,
    BindPhone,
    BatchMessPushDialog,
    AppMsgPush,
    OriganizeTree
  }
})
export default class MessageBatchPush extends Vue {
  @Dependencies(PageService) private pageService: PageService
  @Dependencies(UserService) private userService: UserService
  @Dependencies(SmaService) private smaService: SmaService;
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @State userData;
  @State companyList
  @accManageModule.State caseInfo;
  @accManageModule.State callerInfo;
  @accManageModule.State caseId;
  @accManageModule.State caseType;
  @accManageModule.State taskId;
  @accManageModule.State caller;
  @State departmentList;
  @accManageModule.Mutation updateFollRecord
  @accManageModule.Mutation updateCallInfo

  private visitDeptData = [];
  private phoneData: any = null
  private errorMessage: any = []
  private departmentDatas: any = []
  private rowData: any = {}
  private form: any = {}
  private callType: any = ''
  private telData: any = {}
  private custTemplateContent: any = ''
  private messageModel: any = {
    userName: '',
    realName: '',
    status: 0,
    type: 2,
    deptCode: ''
  }
  private dialog: any = {
    bindPhone: false,
    batchMsgPushFlag: false,
    appMsgPushFlag: false
  }
  private status: any = 0
  private messageDataSet = null
  private selectionList: Array<any> = []
  private currItem: any = {}
  @Watch("$route")
  onCaseIdChange() {
    this.refreshData();
  }
  mounted() {
    // 过滤电催部门数据
    this.visitDeptData = this.departmentList.filter( v => v.type != 1)
  }
  refreshData() {
    this.userService
      .getUserByType(this.messageModel, this.pageService)
      .subscribe(data => {
        this.messageDataSet = data
      }, err => {
        this.$message.error(err.msg)
      })
  }
  onChange(value) {
    this.messageModel.deptCode = value.code
    this.refreshData()
  }
  getCheckedNodes({ code }) {
    if (this.messageModel.deptCode !== code) {
      this.messageModel.deptCode = code;
      this.pageService.reset();
      this.refreshData();
    }
  }
  messageBatchClick() {
    if (this.selectionList.length === 0) {
      this.$alert('请选择推送用户', '提示', {
        confirmButtonText: '确定'
      })
      return false
    }
    this.dialog.batchMsgPushFlag = true
  }
  dialogClose() {
    document.documentElement.style.overflow = 'auto'
  }
  resetSuccess() {
    this.refreshData()
  }
  bindPhoneClick() {
    this.dialog.bindPhone = true
  }
  msgPushClick(scope) {
    this.dialog.appMsgPushFlag = true
    this.currItem = scope.row
  }
  telClick(scope) {
    this.smaService
      .checkCall({ companyCode: this.userData.companyCode })
      .subscribe(data => {
        // 中通天鸿
        if (data.value === '164') {
          this.callType = data.value
          this.telData = {
            // taskId: this.$store.state.accManage.caller_info.taskId,
            customer: this.userData.id,
            callee: scope.row.phone,
            caller: this.caller === null ? '' : this.caller,
            companyCode: this.userData.companyCode
          }
        } else if (data.value === '163') {
          // erpv3
          this.callType = data.value
          this.telData = {
            taskId: this.taskId === null ? '' : this.taskId,
            customer: this.userData.id,
            callee: scope.row.phone,
            caller: this.caller === null ? '' : this.caller,
            companyCode: this.userData.companyCode
          }
        }
        this.smaService
          .addTaskRecorder(this.telData)
          .subscribe(data => {
            this.$message.success('拨号成功')
            this.updateCallInfo({
              follRelation: this.rowData.relation,
              follName: this.rowData.name,
              follPhone: this.rowData.phone,
              recoderId: data.id,
              taskcallerId: data.taskId,
              taskId: data.resultTaskId,
            })
          }, ({ msg }) => {
            this.$message.error(msg)
          })
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }
}
</script>

<style scoped>

</style>
