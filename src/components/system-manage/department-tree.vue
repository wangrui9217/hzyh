<template>
  <section class="component department-tree" style="display:inline-block;min-width:100%">
    <el-tree ref="department-tree" align="left" :data="departmentData" highlight-current auto-expand-parent :expand-on-click-node="false" node-key="id" :props="{label:'name',children:'children'}" @current-change="onCurrentChange"></el-tree>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { DepartmentService } from "~/services/business-service/department.service";
import { Emit, Watch, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Tree } from "element-ui";
@Component({
  components: {}
})
export default class DepartmentTree extends Vue {
  @Dependencies(DepartmentService) departmentService: DepartmentService;
  @Getter departmentData;
  @Prop() currentDept: any;
  @Emit("onCurrentChange")
  onCurrentChange(data, node) {
  }
  private departmentTree;
  private treeData: any = [];

  @Watch("departmentData")
  onDepartmentDataChange() {
    this.reset();
  }

  mounted() {
    this.departmentTree = <Tree>this.$refs["department-tree"];
    this.reset();
  }

  reset() {
    this.treeData = []
    this.$nextTick(() => {
      if (this.departmentData && this.departmentData.length) {
        this.treeData = this.departmentData
        let [root] = this.treeData;
        this.departmentTree.setCurrentKey(this.currentDept ? this.currentDept.id : root.id);
        this.onCurrentChange(this.currentDept || root, null);
      }
    });
  }

  setCurrentKey(id) {
    this.departmentTree.setCurrentKey(id)
  }
}
</script>

<style lang="less" scoped>

</style>
