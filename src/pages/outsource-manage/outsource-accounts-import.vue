<template>
  <section class="page outsource-accounts-import">
    <data-form :model="outModel" @onSearch="refreshData" :page="pageService" :hiddenSearch="!isSupperAdmin" hiddenReset>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="dialog.excelImport=true" v-auth="5460">账目导入</el-button>
        <el-button @click="accountsBatchConfirm" v-auth="5461">账目批量确认</el-button>
        <el-button @click="accountsBatchDelete" v-auth="5462">账目批量删除</el-button>
        <el-button type="text" @click="downloadTemplate" v-auth="5463">下载模板</el-button>
      </template>
    </data-form>
    <data-box :data="outDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="fienCasenum" label="申请号(财务)" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="fienCustname" label="客户名称(财务)" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="fienIdcard" label="身份证号(财务)" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.fienIdcard | encryptIDCardFour }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fienCount" align="right" label="逾期金额(财务)(元)" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.fienCount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fienPayback" align="right" label="已还金额(财务)(元)" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.fienPayback|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" @click="accountsConfirm(scope)" v-auth="5464">账目确认</el-button>
            <el-button type="text" @click="accountsDelete(scope)" v-auth="5465">账目删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="提示" :center="true" :visible.sync="dialog.list" width="50%">
      <section class="component accounts-error-msg">
        <div style="line-height: 30px">以下账目没有匹配案件</div>
        <data-box :data="reminderData">
          <template slot="column">
            <el-table-column prop="fienCasenum" label="申请号(财务)" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="fienCustname" label="客户名称(财务)" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
          </template>
        </data-box>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.reminder=false">关闭</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!--账目导入弹框-->
    <el-dialog title="账目导入" :center="true" :visible.sync="dialog.excelImport" width="60%" @open="$nextTick(()=>$refs['accounts-import'].refresh())">
      <accounts-import ref="accounts-import" @close="dialog.excelImport = false" @refreshList="refreshData"></accounts-import>
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
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { State, Getter } from "vuex-class";
import { CommonService } from "~/utils/common.service";
import AccountsImport from "~/components/outsource-manage/outsource-accounts-import/accounts-import.vue";

@Auth(527)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
    AccountsImport
  }
})
export default class OutsourceAccountsImport extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService) private outsourcePoolService: OutsourcePoolService;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private outModel: any = {
    companyCode: ''
  };
  private outDataSet = null;
  private selectionList: any = [];
  private reminderData: any = [];
  private outObj: any = {};
  private dialog: any = {
    excelImport: false,
    reminder: false,
    module: false,
    list: false
  };
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
   * 账目批量导入确认
   */
  accountsBatchConfirm(scope) {
    if (!this.selectionList.length) {
      this.$alert('请选择要确认的账目', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    this.$confirm('您确定要批量确认账目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.outsourcePoolService.affirmReconciliation(this.selectionList.map(v => v.id)).subscribe(data => {
        this.$message.success('操作成功！')
        if (data instanceof Array && data.length > 0) {
          this.reminderData = data
          this.dialog.reminder = true
        }
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }).catch(() => {
      this.$message.info('已取消操作')
    })
  }
  /**
   * 账目导入确认
   */
  accountsConfirm(scope) {
    this.$confirm('您确定要对该条账目操作吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.outsourcePoolService.affirmReconciliation([scope.row.id]).subscribe(data => {
        this.$message.success('操作成功！')
        if (data instanceof Array && data.length > 0) {
          this.$message({
            showClose: true,
            duration: 0,
            message: `客户${data[0].fienCustname}的申请号为${data[0].fienCasenum}没有匹配案件`
          })
        }
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    })
  }
  /**
   * 账目删除
   */
  accountsDelete(scope) {
    this.$confirm('您确定要删除该条账目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.outsourcePoolService.deleteFinanceData([scope.row.id]).subscribe(data => {
        this.$message.success('删除成功！')
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }).catch(() => {
      this.$message.info('已取消操作')
    })
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
  /**
   * 账目批量删除
   */
  accountsBatchDelete(scope) {
    if (!this.selectionList.length) {
      this.$alert('请选择要删除的账目', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    this.$confirm('您确定要批量删除账目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.outsourcePoolService.deleteFinanceData(this.selectionList.map(v => v.id)).subscribe(data => {
        this.$message.success('删除成功！')
        this.pageService.reset()
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }).catch(() => {
      this.$message.info('已取消操作')
    })
  }
  /**
   * 下载模板
   */
  downloadTemplate() {
    if (this.isSupperAdmin && this.outModel.companyCode === '') {
      this.$message('请选择公司！')
      return
    }
    this.outsourcePoolService.loadTemplate(0).subscribe(data => {
      CommonService.downloadFile(data, '账目导入模板')
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  refreshData() {
    this.outsourcePoolService.findFinanceData(this.outModel, this.pageService).subscribe(data => {
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
