<template>
  <section class="page message-statistics">
    <data-form :model="messageModel" @onSearch="refreshData" :rules="rules">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型 " prop="type">
          <el-select v-model="messageModel.type" @change="messageDataSet = null,messageModel.time = ''">
            <el-option label="实时" :value="0"></el-option>
            <el-option label="历史" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="deptIds" v-auth="1179">
          <el-cascader v-model="messageModel.deptIds" :options="departmentData" @blur="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="userName">
          <el-input v-model="messageModel.userName" v-if="messageModel.deptIds.length===0"></el-input>
          <el-select v-model="messageModel.userName" placeholder="请选择" clearable v-else>
            <el-option v-for="{userName,realName} in orgCuponameList" :key="userName" :label="realName" :value="userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time" v-if="messageModel.type===1">
          <el-date-picker v-model="messageModel.time" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick">导出</el-button>
      </template>
    </data-form>
    <data-box :data="messageDataSet">
      <template slot="columns">
        <el-table-column prop="date" label="考察对象">

          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>

          <el-table-column label="组别" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col class="item" :style="getStyle(v.smsReports)">{{v.groupName}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col v-for="(val,index) in v.smsReports" :key="index" :class="val.deptCode? 'item':'item-sum'" > {{val.realName}} </el-col>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考察数据类型">
          <el-table-column prop="dayNum" label="短信发送数量" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col v-for="(val,index) in v.smsReports" :key="index"  :class="val.deptCode? 'item':'item-sum'" >{{val.smsNum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="caseAmt" label="发送成功数量" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col v-for="(val,index) in v.smsReports" :key="index"  :class="val.deptCode? 'item':'item-sum'" >{{val.successNum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayNum" label="发送失败数量" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col v-for="(val,index) in v.smsReports" :key="index"  :class="val.deptCode? 'item':'item-sum'" >{{val.failureNum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="caseNum" label="排名" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.smsSecModels" :key="i">
                <el-col v-for="(val,index) in v.smsReports" :key="index"  :class="val.deptCode? 'item':'item-sum'" >{{val.rank}}</el-col>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import Component from "vue-class-component";
import { State, Getter } from "vuex-class"
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { UserService } from '~/services/business-service/user.service'
import { ReportService } from '~/services/report-service/report.service'
import { CommonService } from '~/utils/common.service'
const fileName = '短信发送统计报表'

@Auth(802)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class MessageStatistics extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData;
  private orgCuponameList: any = [];
  private messageModel: any = {
    companyCode: "",
    type: 0,
    deptId: "",
    userName: "",
    time: "",
    deptIds: []
  }

  private rules: any = {
    time:{ required:true,message:'请选择日期范围',trigger:'blur'}
  }

  private messageDataSet: any = null

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.messageModel.companyCode = this.userData.companyCode
    }
    return this.messageModel.companyCode
  }

  set companyCode(value) {
    this.messageModel.companyCode = value
  }

  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    // 最后一次选择的机构
    let lastDeptId = this.messageModel.deptIds[this.messageModel.deptIds.length - 1]
    if (lastDeptId && lastDeptId !== this.messageModel.deptId) {
      this.messageModel.cupoName = ''
      this.messageModel.deptId = lastDeptId
      this.userService.queryNoPage(lastDeptId)
        .subscribe(data => {
          this.orgCuponameList = data.map(x => {
            return {
              id: x.id,
              userName: x.userName,
              realName: x.realName
            }
          })
        }, error => this.$message.error(error.msg))
    }
  }
  /**
   * 刷新数据
   */
  refreshData() {
    this.reportService
      .getSmsReport(this.messageModel)
      .subscribe(
        data => this.messageDataSet = data,
        error => this.$message.error(error.msg)
      )
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  /**
   * 报表文件下载
   */
  exportReportClick() {
    this.reportService.exportSmsReport(this.messageModel)
      .subscribe(data => CommonService.downloadFile(data, fileName),
      error => this.$message.error(error.msg))
  }
  getStyle(arr) {
        return {
          height: `${arr.length * 40}px`,
          lineHeight: `${arr.length * 40}px`
        }
  }
}
</script>

<style lang="less">

</style>
