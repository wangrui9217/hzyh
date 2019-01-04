<template>
  <section class="page out-commission-calculate-lat-report">
    <data-form :model="outModel" @onSearch="refreshData" hiddenSearch hiddenReset>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方" prop="outsName" v-auth="5469">
          <el-select v-model="outModel.outsName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in getOutSourceList()" :key="index" :label="outsName" :value="outsName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="outModel.operationType" @change="refreshData" :disabled="!outModel.outsName">
            <el-radio :label="204">回款</el-radio>
            <el-radio :label="205">回退</el-radio>
            <el-radio :label="206">修复</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template slot="append">
        <el-button @click="exportReport" :disabled="!outDataSet || outDataSet.length === 0" v-auth="5470">导出</el-button>
      </template>
    </data-form>
    <data-box :data="outDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="name" label="受托方" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdue_time" label="逾期时段" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.objectSonList" :key="i">
              <el-col class="item">{{v.overdue_time}}</el-col>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="monrybili" label="金额比率" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.objectSonList" :key="i">
              <el-col class="item-right">{{v.monrybili}}</el-col>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.objectSonList" :key="i">
              <el-col class="item-right">{{v.money}}</el-col>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hushubili" label="户数(元/户)" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.objectSonList" :key="i">
              <el-col class="item">{{v.hushubili}}</el-col>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nummoney" label="金额(户数)" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <div v-for="(v,i) in scope.row.objectSonList" :key="i">
              <el-col class="item">{{v.nummoney}}</el-col>
            </div>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { CommonService } from "~/utils/common.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import { OutSourceCommssionService } from "~/services/business-service/out-source-commssion.service";

@Auth(530)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
  }
})
export default class OutCommissionCalculateLatReport extends Vue {
  @Dependencies(OutSourceCommssionService) private outSourceCommssionService: OutSourceCommssionService;
  @State outSourceList: any;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private outModel: any = {
    companyCode: '',
    outsName: '',
    operationType: ''
  };
  private outDataSet = null;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.outModel.companyCode = this.userData.companyCode
    }
    return this.outModel.companyCode
  }

  set companyCode(value) {
    this.outModel.companyCode = value
  }

  /**
  * 过滤受托方
  */
  getOutSourceList() {
    return this.outSourceList.filter(x => x.companyCode === this.outModel.companyCode)
  }

  /**
   * 导出报表
   */
  exportReport() {
    if (!this.outModel.companyCode) {
      this.$message.info('请选择公司！')
      return
    }
    if (!this.outModel.outsName) {
      this.$message.info('请选择委外方！')
      return
    }
    if (!this.outModel.operationType) {
      this.$message.info('请选择类型！')
      return
    }
    this.outSourceCommssionService.exportReport(this.outModel).subscribe(data => {
      CommonService.downloadFile(data, '受托方佣金计算报表')
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  refreshData() {
    if (!this.outModel.companyCode) {
      this.$message.info('请选择公司！')
      return
    }
    if (!this.outModel.outsName) {
      this.$message.info('请选择受托方！')
      return
    }
    if (!this.outModel.operationType) {
      this.$message('请选择报表类型')
      return
    }
    this.outSourceCommssionService.outsourceCommissionForm(this.outModel).subscribe(data => {
      this.outDataSet = data;
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }
}
</script>

<style lang="less">

</style>
