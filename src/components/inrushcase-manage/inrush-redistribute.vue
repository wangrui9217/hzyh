<template>
  <section class="component inrush-redistribute">
    <el-row type="flex">
      <el-col :span="6" style="height:500px;margin-top:4px;border:1px solid #d1dbe5;overflow:auto">
        <department-tree @onCurrentChange="getCheckedNodes" ref="department-tree"></department-tree>
      </el-col>
      <el-col :span="18">
        <data-box :page="pageService" :selectionList.sync="selectionList" :data="userDataSet" @onPageChange="refreshData" ref="data-box">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="type" label="催收类型" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">{{scope.row.type|dictConvert}}</template>
            </el-table-column>
            <el-table-column label="是否管理员" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <span v-if="scope.row.manager===1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
          </template>
        </data-box>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top:10px">
      <el-button @click="nextStep">下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-row>

  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Emit
} from "vue-property-decorator";
import {
  State,
  Mutation,
  namespace
} from "vuex-class";
import {
  Dependencies
} from "~/core/decorator";
import {
  PageService
} from "~/utils/page.service";
import {
  UserService
} from "~/services/business-service/user.service";
import {
  CaseInfoService
} from "~/services/business-service/case-info.service";
import DataBox from "~/components/common/data-box.vue";
import DepartmentTree from '~/components/system-manage/department-tree.vue'

const accManageModule = namespace('inrush-case')

@Component({
  components: {
    DataBox,
    DepartmentTree
  }
})
export default class InrushRedistribute extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  private selectionList: any = [];
  private userDataSet: any = [];
  private nowNode: any = null;
  private checkModel: any = {};

  @accManageModule.State('caseAllotUser') caseAllotUser
  @accManageModule.State('caseAllotOrg') caseAllotOrg
  @accManageModule.Mutation('updateCaseAllotUser') updateCaseAllotUser
  @accManageModule.Mutation('updateCaseAllotOrg') updateCaseAllotOrg

  get AllotUser() {
    return this.caseAllotUser
  }
  set AllotUser(value) {
    this.updateCaseAllotUser(value)
  }

  get AllotOrg() {
    return this.caseAllotOrg
  }
  set AllotOrg(value) {
    this.updateCaseAllotOrg(value)
  }

  @Emit('close')
  close() { }
  @Emit('user')
  user() { }
  @Emit('org')
  org() { }

  getCheckedNodes(item) {
    this.checkModel = {
      deptCode: item.code
    }
    this.nowNode = item;
    this.refreshData()
  }
  nextStep() {
    if (this.selectionList.length) {
      this.$confirm('是否将案件分配给所选催收员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let userIdList = this.selectionList.map(v => {
          return v.id
        })
        this.user()
        this.AllotUser = this.selectionList
      })
    } else {
      this.$alert('请选择催收员', '提示', {
        confirmButtonText: '确定'
      })
    }
    // this.$confirm('是否将案件分配给所选机构?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'info'
    // }).then(() => {
    //   this.org()
    //   this.AllotOrg = this.nowNode
    // })
  }
  refresh() {
    this.pageService.reset()
    let tree: any = this.$refs['department-tree']
    tree.reset()
  }
  cancel() {
    this.close()
    let databox: any = this.$refs['data-box'];
    databox.clearSelection();
  }
  refreshData() {
    this.userService.queryUserByDeptAndRole(this.checkModel, this.pageService).subscribe(data => {
      this.userDataSet = data;
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      })
  }
}

</script>
<style>

</style>
