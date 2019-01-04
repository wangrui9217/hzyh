<template>
  <!--系统参数管理-->
  <section class="page system-parameter-manage">
    <data-form :model="queryModel" @onSearch="refreshData" autoSearch>
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="name" v-auth="5560" >
          <el-input v-model="queryModel.name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status" v-auth="5561">
          <el-select v-model="queryModel.status" placeholder="请选择" clearable>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>

    <data-box @onPageChange="refreshData" :data="sysParamDataSet" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="code" label="参数代码" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="name" label="参数名称" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="value" label="参数值" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span v-if="scope.row.code === 'SysParam.phone.call'">{{Number(scope.row.value) | dictConvert('0038')}}</span>
            <span v-else>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否启用" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">是</span>
            <span v-if="scope.row.status === 1">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="说明" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(1)">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyClick(scope)" v-if="scope.row.sign===0" v-auth="5561">修改</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>

    <el-dialog title="修改" :visible.sync="dialog.modifysysparamterDialog" @open="getmodifyData" :close-on-click-modal="false" :close-on-press-escape="false" :center="true">
      <modify-parameter ref="refresh" @close="dialog.modifysysparamterDialog=false" @refreshList="refreshData"></modify-parameter>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { SysParamService } from "~/services/business-service/sys-param.service";
import ModifyParameter from "~/components/system-manage/param-manage/modify-parameter.vue";

@Auth(857)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    ModifyParameter
  }
})
export default class SystemParameterManage extends Vue {
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  @Dependencies(SysParamService) private sysParamService: SysParamService;
  @Dependencies(PageService) private pageService: PageService;
  @State userData: any;

  mounted() {
    this.refreshData();
  }
  private queryModel: any = {
    companyCode: "",
    name: "",
    status: ""
  };
  private sysParamDataSet: Array<any> = [];
  private dialog: any = {
    modifysysparamterDialog: false
  };
  private modifyData: any = {};
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.queryModel.companyCode = this.userData.companyCode;
    }
    return this.queryModel.companyCode;
  }

  set companyCode(value) {
    this.queryModel.companyCode = value;
  }

  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  refreshData() {
    this.sysParamService.query(this.queryModel, this.pageService).subscribe(
      data => {
        this.sysParamDataSet = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }

  /**
   * 修改
   */
  modifyClick(scope) {
    this.modifyData = scope.row;
    this.dialog.modifysysparamterDialog = true;
  }
  /**
   * 修改open事件 ，获取要修改的当前行数据
   */
  getmodifyData() {
    this.$nextTick(() => {
      let refresh: any = this.$refs["refresh"];
      refresh.refresh(this.modifyData);
    });
  }
}
</script>

<style lang="less">

</style>
