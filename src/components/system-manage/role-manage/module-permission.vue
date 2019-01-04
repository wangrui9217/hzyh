<template>
  <section class="component module-permission">
    <div style="display:flex">
      <el-col class="module">
        <el-row class="title">模块</el-row>
        <div class="module-tree">
          <el-tree align="left" :data="treeResource" show-checkbox highlight-current :default-expanded-keys="[0]" node-key="id"  ref="tree"  
                   @current-change="onCurrentNodeChange"  @check="onCheck"></el-tree>
        </div>
      </el-col>
      <el-col style="width:300px;flex-grow:1">
        <el-row class="title">对应模块功能</el-row>
        <data-box :data="dataSet" show-checkbox :selectionList.sync="selectionList" ref="table" height="400">
          <template slot="columns">
            <el-table-column prop="name" label="功能名称" :min-width="$helper.getColumnWidth(4)" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="描述" :min-width="$helper.getColumnWidth(3)" align="center">
            </el-table-column>
          </template>
        </data-box>
        <el-row class="btn-box">
          <el-button @click="saveModule" :loading="submitLoading">保存</el-button>
        </el-row>
      </el-col>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { RoleService } from "~/services/business-service/role.service";
import { ResourceService } from "~/services/business-service/resource.service";
import { Prop, Emit, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { CommonService } from "~/utils/common.service";

@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class ModulePermission extends Vue {
  @Dependencies(RoleService) private roleService: RoleService;
  @Dependencies(ResourceService) private resourceService: ResourceService;
  //获取超级管理员 默认false
  @Getter isSupperAdmin: boolean;
  @Prop({
    type: String,
    required: true
  })
  roleId: String;

  @Watch("roleId", { immediate: true })
  onRoleIdChange(val) {
    if (val) this.queryRoleResource();
  }

  @Emit("refreshList")
  refreshList() {}

  @Emit("close")
  close() {}

  // 表格所有资源
  private tableResource: Array<any> = [];
  // 树所有资源
  private treeResource: Array<any> = [];
  // 当前选中的node的数据
  private nodeData: any = {};
  // 当前页面tree对象
  private tree: any = {};
  private submitLoading: Boolean = false;

  private dataSet: Array<any> = [];

  get selectionList() {
    return this.dataSet.filter(v => v._checked);
  }

  set selectionList(selection: Array<any>) {
    let selectionIds = selection.map(v => v.id);
    // 设置表格中数据的选择属性
    this.dataSet.forEach(v => (v._checked = selectionIds.includes(v.id)));

    // 如果有选，树上的节点也被勾选
    if (selectionIds.length > 0) {
      this.tree.setChecked(this.nodeData.id, true);
    }
  }

  /**
   * 保存点击
   */
  private saveModule() {
    let updateModel = {
      id: this.roleId,
      resources: []
    };

    // 获取选中的树的ID
    let menuIds = this.tree.getCheckedKeys(true);
    // 获取操作按钮选中的Id
    let controlIds = this.tableResource.filter(x => x._checked).map(v => v.id);

    updateModel.resources = menuIds.concat(controlIds);

    this.roleService.updateRole(updateModel).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success("操作成功!");
        this.refreshList();
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
  /**
   * 当前选中节点改变的时候
   */
  private onCurrentNodeChange(node) {
    this.nodeData = node;
    this.dataSet = [];
    this.dataSet = this.tableResource.filter(x => x.parentId === node.id);
  }


  // 处理丢失菜单权限的控件资源
  private onCheck(data,{checkedKeys}){
    // 子菜单点击
    if(data.type === 18){
      let flag = checkedKeys.includes(data.id)
      this.tableResource.filter(x => x.parentId === data.id).forEach(v => v._checked = flag)
      if(this.nodeData.id === data.id) this.onCurrentNodeChange(data)
    } else {
      data.children.forEach(item => this.onCheck(item,{checkedKeys}))
    }
  }

  /**
   * 组件创建之后就开始获取全部资源数据
   */
  created() {
    this.resourceService.getAllResource().subscribe(
      data => {
        if (!this.isSupperAdmin) {
          //非管理员不显示公司管理
          this.separateData(data.filter(v => v.id !== 1112));
        } else {
          this.separateData(data);
        }
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }

  mounted() {
    // 挂载之后获取树组件对象
    this.tree = this.$refs.tree as any;
  }
  
  /**
   * 分离数据 菜单数据 控件资源
   */
  private separateData(data: Array<any>) {
    let rootData: any = {
      label: "贷后催收系统",
      pid: -1,
      id: 0,
      type: 0
    };
    // 提取菜单资源
    let tmpTreeResource = data.filter(x => [17, 18].includes(x.type)).map(v => {
      if (v.type === 17) v.parentId = 0;
      return {
        label: v.name,
        pid: v.parentId,
        id: v.id,
        type: v.type
      };
    });
    tmpTreeResource.unshift(rootData)
    this.treeResource = CommonService.generateTreeData(tmpTreeResource) 
    // 提取操作资源
    this.tableResource = data
      .filter(x => x.type === 19)
      .map(v => Object.assign({ _checked: false }, v));
    this.queryRoleResource();
  }

  /**
   * 查询角色拥有的资源
   */
  private queryRoleResource() {
    this.$nextTick(() => {
      this.tree.setCheckedKeys([]);
      // 根据角色ID 获取角色所拥有的菜单资源 和 控件资源
      this.roleService.getRoleResource(this.roleId).subscribe(
        data => {
          // 设置树 选中的叶子节点
          this.tree.setCheckedKeys(data.resourcesSet);
          // 设置控件资源选中的数据
          this.tableResource.forEach(v => {
            v._checked = data.resourceModelButton.includes(v.id);
          });
          
          // 获取当前选中的节点
          let currentNode = this.tree.getCurrentNode();
          if(currentNode){
            this.onCurrentNodeChange(currentNode);
          }
        },
        err => this.$message.error(err.msg)
      );
    });
  }
}
</script>

<style lang="less" scoped>
.title {
  height: 40px;
  background: #e4e4e4;
  line-height: 40px;
  text-align: center;
  border: 1px solid #dddddd;
  font-size: 0.875rem;
  color: #333;
}
.btn-box {
  margin-top: 20px;
  text-align: center;
}
.module {
  flex-basis: 250px;
  border: 1px solid #e4e4e4;
  height: 500px;
  width: 250px;
}
.module-tree {
  height: 460px;
  overflow: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.module-tree::-webkit-scrollbar {
  width: 0px;
}
</style>
