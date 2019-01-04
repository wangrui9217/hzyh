<template>
  <section class="component origanize-tree">
    <div>
      <origanize-node v-for="item of dataTree" :key="item.id" :node.sync="item"></origanize-node>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Mutation, Getter, namespace } from "vuex-class";
import OriganizeNode from "~/components/system-manage/user-manage/origanize-node.vue";
import { Emit, Prop, Watch } from "vue-property-decorator";
const systemManageModule = namespace("system-manage");


@Component({
  components: {
    OriganizeNode
  }
})
export default class OriganizeTree extends Vue {
  private dataTree: any = []; // 数据树
  private selected: any = ""; // 当前选择项
  @Prop() dataList: any; //数据列表
  @Prop() isIcon: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;


  @Watch("dataList")
  dataLists() {
    this.createTree(this.dataList);
  }


  /**
  * 创建数据树
  */
  createTree(data) {
    // 递归构建组织树
    let fun = (id) => {
      // 递归对象子元素
      let list = data.filter(x => x.parentId === id).map(node => {
        // 递归构建子节点
        let children = fun(node.id)
        // 添加icon标识
        node.isIcon = true
        if (!this.isIcon) {
          node.isIcon = false
        }
        // 节点添加children或leaf属性
        if (children && children.length) {
          // 设置子元素
          node.children = children
          // 添加叶子节点标识
          node.isLeaf = false
          // 添加默认展开标识
          node.expand = true
        } else {
          // 添加叶子节点标识
          node.isLeaf = true
        }
        return node
      })

      return list
    }

    let parent = data.find(x => x.id === this.userData.deptId)
    let flag = true
    if (!parent) {
      // this.$message.error('用户数据异常，请重新登录')
      flag = false
    }
    this.dataTree = flag ? fun(parent.parentId) : []
    this.updateDefaultSelected()
  }
  /**
   * 更新默认选中节点
   */
  updateDefaultSelected() {
    if (this.dataTree && this.dataTree.length) {
      this.updateSelected(this.dataTree[0]);
    }
  }
  /**
   * 更新当前选择项
   */
  updateSelected(value) {
    if (this.selected !== value) {
      this.selected = value;
      // 发送change事件
      this.$emit("change", value);
    }
  }
  // TODO:暂时性解决办法
  forceRefresh() {
    let temp: any = this.dataTree;
    this.dataTree = [];
    this.$nextTick(() => {
      this.dataTree = temp;
    });
  }

  mounted() {
    this.createTree(this.dataList);
  }
}
</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>

</style>
