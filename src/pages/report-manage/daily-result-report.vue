<template>
  <section class="page daily-result-report">
    <data-form :model="dailyResultModel" @onSearch="refreshData" :rules="rules">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型 " prop="type" v-auth="5484">
          <el-select v-model="dailyResultModel.type" @change="dailyResultDataSet = null,dailyResultModel.time = ''">
            <el-option label="实时" :value="0"></el-option>
            <el-option label="历史" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="deptIds" v-auth="5485">
          <el-cascader v-model="dailyResultModel.deptIds" @change="changeUserName" :options="departmentData" @blur="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="userName" v-auth="5486">
          <el-input v-model="dailyResultModel.userName" v-if="dailyResultModel.deptIds.length===0"></el-input>
          <el-select v-model="dailyResultModel.userName" placeholder="请选择" clearable v-else>
            <el-option v-for="{userName,realName} in orgCuponameList" :key="userName" :label="realName" :value="userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time" v-if="dailyResultModel.type===1" v-auth="5487">
          <el-date-picker v-model="dailyResultModel.time" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick" v-auth="5488">导出</el-button>
      </template>
    </data-form>
    <data-box :data="dailyResultDataSet">
      <template slot="columns">
        <el-table-column prop="date" label="考察对象">

          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(2)">
          </el-table-column>

          <el-table-column label="组别" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col class="item" :style="getStyle(v.dailyResultReports)">{{m.groupName}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">累计</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item"> {{val.realName}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0"></el-col>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考察数据类型 (金额单位：元)">

          <el-table-column prop="caseNum" label="案件数量" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item">{{val.caseNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.caseSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="caseAmt" label="逾期金额" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.caseAmt|toThousands}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.amtSum|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayNum" label="当日回款户数" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item">{{val.dayNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.daySum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayAmt" label="当日回款金额" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.dayAmt|toThousands}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.dayAmtSum|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="monthNum" label="月累计回款户数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item">{{val.monthNum}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.monthNumSum}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="monthAmt" label="月累计回款金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.monthAmt|toThousands}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.monthAmtSum|toThousands}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayNumRate" label="当日回款户数比" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.dayNumRate|toPercent}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.caseSum == 0 ? 0 :(v.sum.daySum / v.sum.caseSum)|toPercent}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dayAmtRate" label="当日回款金额比" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.dayAmtRate|toPercent}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.amtSum == 0 ? 0 : (v.sum.dayAmtSum / v.sum.amtSum)|toPercent}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="backMoneyRate" label="回款比" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.backMoneyRate|toPercent}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.targetSum == 0 ? 0 : (v.sum.monthAmtSum / v.sum.targetSum)|toPercent}}</el-col>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="target" label="月度回款金额目标" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.dailyResultSecModels" :key="n">
                <div v-for="(v,i) in m.dailyResultThiModels" :key="i">
                  <el-col v-for="(val,index) in v.dailyResultReports" :key="index" class="item-right">{{val.target}}</el-col>
                  <el-col class="item-sum" v-if="dailyResultModel.type===0">{{v.sum.targetSum}}</el-col>
                </div>
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
const fileName = '每日结果报表'

@Auth(781)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class DailyResultReport extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData;
  private orgCuponameList: any = [];
  private dailyResultModel: any = {
    companyCode: "",
    type: 0,
    deptId: "",
    userName: "",
    time: "",
    deptIds: []
  };
  private rules: any = {
    time: { required: true, message: '请选择日期范围', trigger: 'blur' }
  }
  private dailyResultDataSet: any = null;

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.dailyResultModel.companyCode = this.userData.companyCode
    }
    return this.dailyResultModel.companyCode
  }

  set companyCode(value) {
    this.dailyResultModel.companyCode = value
  }

  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    // 最后一次选择的机构
    let lastDeptId = this.dailyResultModel.deptIds[this.dailyResultModel.deptIds.length - 1]
    if (lastDeptId && lastDeptId !== this.dailyResultModel.deptId) {
      this.dailyResultModel.cupoName = ''
      this.dailyResultModel.deptId = lastDeptId;
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
  changeUserName() {
    if(this.dailyResultModel.deptIds.length===0){
      this.dailyResultModel.userName = ''
    }
  } 
  /**
   * 刷新数据
   */
  refreshData() {
    this.reportService.getDailyResultReport(this.dailyResultModel)
      .subscribe(data => {
        this.dailyResultDataSet = data

        let fun = (item, arrays) => {
          if (item.realName) {
            arrays.push(item)
          } else {
            let list: any = Object.values(item).find(x => x instanceof Array)
            if (list) {
              list.forEach(listItem => {
                fun(listItem, arrays)
              })
            }
          }
        }
        this.dailyResultDataSet.forEach(x => {
          x.dailyResultSecModels.forEach(k => {
            k.dailyResultThiModels.forEach(l => {
              let arrays: any = []
              fun(l, arrays)
              l.sum = {
                caseSum: arrays.map(x => x.caseNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                amtSum: arrays.map(x => x.caseAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                daySum: arrays.map(x => x.dayNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                dayAmtSum: arrays.map(x => x.dayAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                monthAmtSum: arrays.map(x => x.monthAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                monthNumSum: arrays.map(x => x.monthNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                // dayNumRateSum: arrays.map(x => x.dayNumRate).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                // dayAmtRateSum: arrays.map(x => x.dayAmtRate).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                // backMoneyRateSum: arrays.map(x => x.backMoneyRate).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
                targetSum: arrays.map(x => x.target).reduce((a, b) => (a * 100 + b * 100) / 100, 0)
              }
            })
          })
        })
      },
      error => this.$message.error(error.msg))
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
    this.reportService.exportDailyResultReport(this.dailyResultModel)
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
