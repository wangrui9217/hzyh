<template>
  <section class="page outsource-reconciliation-table">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号" prop="outbatch" v-auth="5466">
          <el-input v-model="assistModel.outbatch"></el-input>
        </el-form-item>
        <el-form-item label="受托方" prop="outsId" v-auth="5467">
          <el-select v-model="assistModel.outsId" placeholder="请选择" clearable>
            <el-option v-for="{id,outsName} in getOutSourceList()" :key="id" :label="outsName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportReport" :disabled="!msgDataSet || msgDataSet.length === 0" v-auth="5468">生成对账报表</el-button>
      </template>
    </data-form>
    <data-box :data="msgDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="fienBatchnum" label="批次号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="fienCasenum" label="申请号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="fienCustname" label="客户名称" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="fienIdcard" label="身份证号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="fienFgname" label="委外方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fienCount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.fienCount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fienPayback" label="已还金额" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.fienPayback | toThousands}}</span>
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
import { PageService } from "~/utils/page.service";
import { CommonService } from "~/utils/common.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";

@Auth(528)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class OutsourceReconciliationTable extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService) private outsourcePoolService: OutsourcePoolService;
  @State outSourceList: any;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private assistModel: any = {
    outsId: '',
    companyCode: '',
    outbatch: ''
  };
  private msgDataSet = null;
  /**
  * 考虑到非管理员不显示公司选择控件
  * get 操作的时候强制设置非管理员所在公司码
 */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.assistModel.companyCode = this.userData.companyCode
    }
    return this.assistModel.companyCode
  }

  set companyCode(value) {
    this.assistModel.companyCode = value
  }

  /**
   * 过滤受托方
  */
  getOutSourceList() {
    return this.outSourceList.filter(x => x.companyCode === this.assistModel.companyCode)
  }
  /**
   * 生成对账报表
   */
  exportReport() {
    this.outsourcePoolService.exportOutsideFinanceData(this.assistModel).subscribe(data => {
      // 接口返回的数据
      if (data) {
        CommonService.downloadFile(data, '委外对账表')
      } else {
        this.$message.info('暂无数据')
      }
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  refreshData() {
    this.outsourcePoolService.findConfirmFinanceData(this.assistModel, this.pageService).subscribe(data => {
      this.msgDataSet = data;
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
