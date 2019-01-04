<template>
  <!--版本控制-->
  <section class="page version-manage">
    <data-form :model="queryModel" @onSearch="refreshData" :page="pageService">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" v-auth="5552" prop="mobileVersion" :rules="[{ message: '请输入正确版本号', pattern: /^\d{1,2}(\.\d{1,2}){1,2}$/, trigger: 'blur' }]">
          <el-input v-model="queryModel.mobileVersion"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="os" v-auth="5553">
          <el-select v-model="queryModel.os" placeholder="请选择" clearable>
            <el-option label="iPhone OS" value="iPhone OS"></el-option>
            <el-option label="Android" value="Android"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="operatorTime" v-auth="5554">
          <div class="block">
            <el-date-picker v-model="queryModel.operatorTime" class="daterange-large" type="daterange" :editable="false" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--按钮区域-->
        <el-button @click="addNewVersion" v-auth="5555">添加新版本</el-button>
      </template>
    </data-form>

    <data-box @onPageChange="refreshData" :data="versionManageDataSet" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="os" label="操作系统" :min-width="$helper.getColumnWidth(1)">
        </el-table-column>
        <el-table-column prop="mobileVersion" label="版本号" :min-width="$helper.getColumnWidth(1)">
        </el-table-column>
        <el-table-column prop="silentInstall" label="是否静默安装" :min-width="$helper.getColumnWidth(1)">
          <template slot-scope="scope">
            <span v-if="scope.row.silentInstall === 0">是</span>
            <span v-if="scope.row.silentInstall === 1">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="更新文件地址" :min-width="$helper.getColumnWidth(3)" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.publishTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(1)">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteClick(scope)" v-auth="5556">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>

    <!--添加新版本弹出框-->
    <el-dialog width="60%" title="添加新版本" align="center" :visible.sync="dialog.addVersion" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @open="$nextTick(()=>{$refs['version-form'].reset()})">
      <AddVersion  @close="dialog.addVersion=false" @refreshList="refreshData" :companyCode="this.queryModel.companyCode" ref="version-form">
      </AddVersion>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import AddVersion from "~/components/system-manage/version-manage/add-version.vue";
import { State, Getter } from "vuex-class";
import { AppVersionService } from "~/services/common-service/app-version.service";
import { PageService } from "~/utils/page.service";


@Auth(855)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
    AddVersion
  }
})
export default class VersionManage extends Vue {
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Dependencies(AppVersionService) private appVersionService: AppVersionService;
  @Dependencies(PageService) private pageService: PageService;

  private queryModel: any = {
    id: '',
    os: '',
    versionId: '',
    mobileVersion: '',
    companyCode: '',
    operatorTime: []
  };
  private publishTime: Array<any> = [];
  private versionManageDataSet: Array<any> = [];
  private dialog: any = {
    addVersion: false,
  };

  /**
 * 考虑到非管理员不显示公司选择控件
 * get 操作的时候强制设置非管理员所在公司码
*/
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.queryModel.companyCode = this.userData.companyCode
    }
    return this.queryModel.companyCode
  }

  set companyCode(value) {
    this.queryModel.companyCode = value
  }
  /**
  * 页面激活
  */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }


  mounted() {
    this.refreshData()
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
  refreshData() {
    this.appVersionService
      .queryAppVersion(this.queryModel, this.pageService, { publishTime: 'desc' })
      .subscribe(data => {
        this.versionManageDataSet = data;
      }, ({ msg }) => {
        this.$message.error(msg);
      });
  }
  // /**
  //  * 弹出框清空
  //  */
  // addVersionOpen() {
  //   this.$nextTick(() => {
  //     let versionForm: any = this.$refs['version-form']
  //     versionForm.resetFields()
  //   })
  // }
  /**
   * 删除版本记录
   */
  deleteClick(scope) {
    this.$confirm('您确认要删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.appVersionService
        .deleteAppVersion({
          id: scope.row.id
        })
        .subscribe(data => {
          this.$message.success('操作成功')
          this.pageService.reset()
          this.refreshData()
        }, ({ msg }) => {
          this.$message.error(msg);
        })
    }).catch(() => {
      this.$message('已取消删除!')
    })
  }
  /**
   * 打开添加版本弹出框
   */
  addNewVersion() {
    this.dialog.addVersion = true;
  }
}
</script>

<style lang="less">

</style>
