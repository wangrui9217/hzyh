<template>
  <section class="page realtime-report">
    <data-form :model="weekModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="deptIds" v-auth="5476">
          <el-cascader v-model="weekModel.deptIds" :options="departmentData" @change="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="realName" v-auth="5477">
          <el-input v-model="weekModel.realName" v-if="weekModel.deptIds.length===0"></el-input>
          <el-select v-model="weekModel.realName" placeholder="请选择" clearable v-else>
            <el-option v-for="{realName} in orgCuponameList" :key="realName" :label="realName" :value="realName">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReportClick" v-auth="5478">导出</el-button>
      </template>
    </data-form>
    <data-box :data="weekReportDataSet">
      <template slot="columns">
        <el-table-column label="考察对象">

          <el-table-column prop="deptName" label="部门" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column label="组别" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col class="item" :style="getStyle(m)">{{m.groupName}}</el-col>
                <el-col class="item leijiFont">累计</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item">
                  <span @click="expendClick(val)">{{val.realName}}</span>
                </el-col>
                <el-col class="item"></el-col>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考察数据类型（金额单位：元）">
          <el-table-column prop="waitCollectAmt" label="待催收案件金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item-right">{{val.waitCollectAmt|toThousands}}</el-col>
                <el-col class="item-sum">{{m.sum.waitCollectAmtSum|toThousands}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="collectingNum" label="催收中案件数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item">{{val.collectingNum}}</el-col>
                <el-col class="item-sum">{{m.sum.collectingSum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="collectingAmt" label="催收中案件金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item-right">{{val.collectingAmt|toThousands}}</el-col>
                <el-col class="item-sum">{{m.sum.collectingAmtSum|toThousands}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="overdueNum" label="逾期还款中案件数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item">{{val.overdueNum}}</el-col>
                <el-col class="item-sum">{{m.sum.overdueSum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="overdueAmt" label="逾期还款中案件金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item-right">{{val.overdueAmt|toThousands}}</el-col>
                <el-col class="item-sum">{{m.sum.overdueAmtSum|toThousands}}</el-col>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="promiseNum" label="承诺还款案件数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item">{{val.promiseNum}}</el-col>
                <el-col class="item-sum">{{m.sum.promiseSum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="promiseAmt" label="承诺还款案件金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item-right">{{val.promiseAmt|toThousands}}</el-col>
                <el-col class="item-sum">{{m.sum.promiseAmtSum|toThousands}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="endNum" label="结案案件数" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item">{{val.endNum}}</el-col>
                <el-col class="item-sum">{{m.sum.endSum}}</el-col>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="endAmt" label="结案案件金额" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <div v-for="(m,n) in scope.row.performanceSecModels" :key="n">
                <el-col v-for="(val,index) in m.performanceBasisModels" :key="index" class="item-right">{{val.endAmt|toThousands}}</el-col>
                <el-col class="item-sum">{{m.sum.endAmtSum|toThousands}}</el-col>
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
import { Auth,Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { UserService } from '~/services/business-service/user.service'
import { ReportService } from '~/services/report-service/report.service'
import { CommonService } from '~/utils/common.service'
const fileName = '每日催收结果报表'

@Auth(769)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class RealtimeReport extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Getter departmentData;
  private orgCuponameList: any = [];
  private expand_user: any = [];
  
  private weekModel: any = {
    companyCode: "",
    type: 0,
    deptId: "",
    realName: "",
    time: "",
    deptIds: [],
    deptCode:"",
    code:""
  }
  private weekReportDataSet: any = null

    /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.weekModel.companyCode = this.userData.companyCode
    }
    return this.weekModel.companyCode
  }

  set companyCode(value) {
    this.weekModel.companyCode = value
  }

  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    // 最后一次选择的机构
    let lastDeptId = this.weekModel.deptIds[this.weekModel.deptIds.length - 1]
    if (lastDeptId && lastDeptId !== this.weekModel.deptId) {
      this.weekModel.cupoName = ''
      this.weekModel.deptId = lastDeptId
      this.userService.queryNoPage(lastDeptId)
        .subscribe(data => {
          this.orgCuponameList = data.map(x => {
            return {
              code: x.department.code,
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
    if(this.orgCuponameList.length>0){
      this.weekModel.deptCode=this.orgCuponameList[this.orgCuponameList.length-1].code
    }else{
      this.weekModel.deptCode=""
    }
    this.reportService
      .getPerformanceReport( {
        userName: this.weekModel.realName,
        code:this.weekModel.deptCode
      })
      .subscribe(data => {
        this.weekReportDataSet = data
        let fun = (item, arrays) => {
          if (item.realName) {
            arrays.push(item)
          } else {
            let list = Object.values(item).find(x => x instanceof Array)
            if (list) {
              (list as Array<any>).forEach(listItem => {
                fun(listItem, arrays)
              })
            }
          }
        }
        this.weekReportDataSet.forEach(x => {
          x.performanceSecModels.forEach(v => {
            let arrays: any = []
            fun(v, arrays)
            v.sum = {
              waitCollectSum: arrays.map(x => x.waitCollectNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              waitCollectAmtSum: arrays.map(x => x.waitCollectAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              collectingSum: arrays.map(x => x.collectingNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              collectingAmtSum: arrays.map(x => x.collectingAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              overdueSum: arrays.map(x => x.overdueNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              overdueAmtSum: arrays.map(x => x.overdueAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              advanceSum: arrays.map(x => x.advanceNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              advanceAmtSum: arrays.map(x => x.advanceAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              promiseSum: arrays.map(x => x.promiseNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              promiseAmtSum: arrays.map(x => x.promiseAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              endSum: arrays.map(x => x.endNum).reduce((a, b) => (a * 100 + b * 100) / 100, 0),
              endAmtSum: arrays.map(x => x.endAmt).reduce((a, b) => (a * 100 + b * 100) / 100, 0)
            }
          })
        })
      }, error => this.$message.error(error.msg))
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
   * 点击姓名展开
   */
  expendClick(val) {
    if (this.expand_user.includes(val.realName)) {
      this.expand_user.splice(this.expand_user.indexOf(val.realName), 1)
    } else {
      this.expand_user.push(val.realName)
    }
  }
  /**
   * 报表文件下载
   */
  exportReportClick() {
    this.reportService.exportPerformanceReport(this.weekModel)
      .subscribe(data => CommonService.downloadFile(data, fileName),
      error => this.$message(error.msg))
  }
  getStyle(obj) {
    return {
      height: `${obj.performanceBasisModels.length * 40}px`,
      lineHeight: `${obj.performanceBasisModels.length * 40}px`
    }
  }
}

</script>

<style lang="less">
</style>
