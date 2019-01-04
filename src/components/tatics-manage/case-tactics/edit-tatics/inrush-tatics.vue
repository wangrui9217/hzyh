<template>
  <section class="component inrush-tatics">
    <div style="margin-bottom:15px" class="text-left">
      <span>分配方式：</span>
      <el-radio-group v-model="allotType">
        <el-radio :label="1">按催收员分配</el-radio>
        <el-radio :label="0">按机构分配</el-radio>
      </el-radio-group>
    </div>
    <el-row type="flex">
      <el-col :span="6" style="height:500px;margin-top:4px;border:1px solid #d1dbe5;overflow:auto">
        <department-tree @onCurrentChange="getCheckedNodes" :currentDept="currentDept" ref="department-tree"></department-tree>
      </el-col>
      <el-col :span="18">
        <data-form :model="model" @onSearch="refreshData" :page="pageService">
          <template slot="default-input">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="model.realName"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleName">
              <el-input v-model="model.roleName"></el-input>
            </el-form-item>
          </template>
        </data-form>
        <data-box :page="pageService" :selectionList.sync="selectionList" :data="userDataSet" @onPageChange="refreshData" ref="data-box">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="departmentName" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
          </template>
        </data-box>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top:10px">
      <el-button @click="close">上一步</el-button>
      <el-button @click="confirm">完成</el-button>
    </el-row>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { UserService } from "~/services/business-service/user.service";
import DataBox from "~/components/common/data-box.vue";
import DepartmentTree from '~/components/system-manage/department-tree.vue'
import { CaseStrategyService } from "~/services/dataimp-service/case-strategy.service";
import DataForm from "~/components/common/data-form.vue";
import { State } from "vuex-class";

@Component({
  components: {
    DataForm,
    DataBox,
    DepartmentTree
  }
})
export default class InrushTatics extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(CaseStrategyService) private caseStrategyService: CaseStrategyService;
  @Emit('close')
  close() { }
  @Emit('success')
  success() { }
  @State departmentList;

  private allotType: any = 1;
  private model: any = {
    realName: '',
    roleName: '',
    deptCode: ''
  };
  private selectionList: any = [];
  private userDataSet = null;
  private nowNode: any = null;
  private addOrModify: any = {};
  private currentDept: any = null;

  private tactics: any = {
    name: '',
    priority: '',
    strategyType: '',
    assignType: '',
    outsource: [],
    strategyJson: [],
    seriesIds: [],
    productIds: [],
    shops: []
  };
  reset() {
    let tree: any = this.$refs['department-tree']
    tree.reset()
  }
  /**
   * 刷新
   */
  refresh(obj, allotObj, addOrModify) {
    this.model.realName = ''
    this.model.roleName = ''
    this.pageService.reset()
    this.userDataSet = null
    this.addOrModify = addOrModify
    this.tactics.name = obj.name
    this.tactics.priority = obj.priority
    this.tactics.stripMark = obj.stripMark
    this.tactics.seriesIds = obj.seriesIds
    this.tactics.productIds = obj.productIds
    this.tactics.shops = obj.shops
    this.tactics.strategyType = obj.tacticsType
    this.tactics.strategyJson = obj.strategyJson
    this.tactics.users = allotObj.users
    this.tactics.departId = allotObj.departId
    let depart = this.departmentList.find(v => v.id === allotObj.departId)
    this.currentDept = depart || null
    this.model.deptCode = depart ? depart.id : ''
    this.allotType = allotObj.assignType
    this.nowNode = { deptId: allotObj.departId }
    let tree: any = this.$refs['department-tree']
    tree.reset()
  }
  confirm() {
    let obj: any = {
      name: this.tactics.name,
      assignType: this.allotType,
      strategyJson: JSON.stringify(this.tactics.strategyJson),
      priority: this.tactics.priority,
      strategyType: this.tactics.strategyType,
    }
    if (this.nowNode) {
      obj.departments = [this.nowNode.id]
    } else {
      this.$alert('请选择要分配的机构', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    if (!this.allotType) {
      if (this.nowNode) {
        obj.departments = [this.nowNode.id]
      } else {
        this.$alert('请选择要分配的机构', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
    } else {
      if (this.selectionList.length) {
        obj.users = this.selectionList.map(v => v.id)
        obj.departments = [this.nowNode.id]
      } else {
        this.$alert('请选择要分配的催收员', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
    }
    if (!this.addOrModify.flag) {
      obj.id = this.addOrModify.id
    }
    this.caseStrategyService.addCaseStrategy(obj).subscribe(data => {
      this.$message.success('操作成功')
      this.success()
    })
  }
  /**
   * 获取当前树选择项
   */
  getCheckedNodes(item) {
    if (item.code === this.model.deptCode) {
      return false
    }
    this.model.deptCode = item.code
    this.nowNode = item;
    this.refreshData()
  }
  refreshData() {
    this.userService.queryUserByDeptAndRole(this.model, this.pageService).subscribe(data => {
      if (this.tactics.users) {
        this.$nextTick(() => {
          this.selectionList = data.filter(v => this.tactics.users.find(val => val === v.id))
        })
      }
      this.userDataSet = data;
    }, ({ msg }) => {
      this.$message.error(msg);
    })
  }
}

</script>
<style scoped>

</style>
<style>

</style>
