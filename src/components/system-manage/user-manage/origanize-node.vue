<template>
  <section class="component origanize-node">
    <div draggable="true" @dragstart.stop="handleDragStart($event)" @dragenter="handleDragEnter" @dragleave="handleDragLeave" @dragover.prevent="handleDragOver" @drop.stop="handleDrop($event)" @dragend.prevent="handleDragEnd" id="tree-node" :style="getSubTreeStyle()">
      <div>
        <a @click="expanedItemHandle" v-show="!node.isLeaf" >
          <svg-icon :iconName="expanded?'xiangxia':'xiangyou'" :iconSize='defaultIconSize'></svg-icon>
        </a>
        <a @click="selectItemHandle"  style="text-decoration:none" :style="getSubTextStyle()">{{node.name}}</a>
        <small v-show="selected" class="icon-box" v-if="node.isIcon">
          <a  @click="editItemHandle">
            <svg-icon iconName="xiugai" :iconSize='defaultIconSize'></svg-icon>
          </a>
          <a  @click="addItemHandle">
            <svg-icon iconName="zengjia" :iconSize='defaultIconSize'></svg-icon>
          </a>
          <a  @click="removeItemHandle">
            <svg-icon iconName="shanchu" :iconSize='defaultIconSize'></svg-icon>
          </a>
        </small>
      </div>
      <div v-show="expanded" class="sub-node">
        <origanize-node v-for="item in node.children" :key="item.id" :node.sync="item"></origanize-node>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Mutation, Getter } from "vuex-class";
import { Emit, Prop, Watch } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";

@Component({
  components: {
    SvgIcon
  }
})
export default class OriganizeNode extends Vue {
  private root: any = {}; // 根节点对象
  private isDraged: boolean = false; // 节点展开状态
  private showOprators: boolean = false;
  private expanded: boolean = true; // 默认展开
  private defaultIconSize: number = 14;
  @Prop() node: any;

  @Watch('node')
  watchNode() {
  }

  /**
   * 当前节点是否被选中
   */
  get selected() {
    return this.root.selected === this.node;
  }

  getSubTextStyle() {
    return {
      // 使用/2 是因为上级菜单用了em级别，-1 是因为svg本来有个1px的边框
      marginLeft: (this.node.isLeaf === true ? this.defaultIconSize / 2 - 1 : 0) + "px"
    };
  }

  getSubTreeStyle() {
    return {
      marginLeft: this.node.isLeaf === true ? "2em" : "1em",
      marginTop: "3px"
    };
  }
  /**
   * 节点展开处理
   */
  expanedItemHandle() {
    this.expanded = !this.expanded
  }
  /**
   * 节点选择处理
   */
  selectItemHandle() {
    this.root.updateSelected(this.node); // 更新选择元素
  }
  /**
   * 获取当前父元素
   */
  parent(flag = false) {
    let parent: any = this.$parent;
    // 向上寻找根节点元素
    while (
      parent &&
      parent.$options &&
      parent.$options.name !== "OriganizeTree"
    ) {
      parent = parent.$parent;
    }
    return parent;
  }
  /**
   * 修改节点处理
   */
  editItemHandle() {
    this.root.$emit("edit", this.node);
  }
  /**
   * 添加节点处理
   */
  addItemHandle() {
    this.root.$emit("add", this.node);
  }
  /**
   * 删除节点处理
   */
  removeItemHandle() {
    this.root.$emit("remove", this.node);
  }
  /**
   * 拖动逻辑处理
   */
  handleDrop(e) {
    // 获取原始节点
    const vm = window['dropNode'];

    this.$el.style.backgroundColor = "";
    vm.$el.style.backgroundColor = "";

    let __parent__: any = this;
    while (__parent__ !== undefined) {
      if (__parent__ === vm) {
        return;
      }
      __parent__ = __parent__.$parent;
    }

    const currentNode = vm.node;

    // 目标节点与原节点相同直接退出
    // if (vm.$parent.node.depId === this.node.depId) {
    //   return
    // }
    // 从原节点子元素中删除对象
    vm.$parent.node.children = vm.$parent.node.children.filter(
      node => node !== currentNode
    );
    // 添加到目标对象子元素中
    if (!this.node.children) {
      this.node.children = [];
    }
    this.node.children.push(currentNode);
    this.node.isLeaf = false;
    this.node.expand = true;
    // 更新新的父ID
    currentNode.pid = this.node.id;
    // 父节点强制刷新
    this.parent().forceRefresh();
    this.parent().$emit("drag", currentNode, vm.$parent.node, this.node);
  }
  handleDragEnd() {
    this.$el.style.backgroundColor = "";
  }
  handleDragStart(e) {
    this['show'] = false;
    this.isDraged = true;
    window['dropNode'] = this;
    this.$el.style.backgroundColor = "grey";
  }
  handleDragEnter() {
    if (!this.isDraged) {
      this.$el.style.backgroundColor = "";
    }
  }
  handleDragLeave() {
    if (!this.isDraged) {
      this.$el.style.backgroundColor = "";
    }
  }
  handleDragOver() { }
  showOprator() {
    this.showOprators = true;
  }
  hideOprators() {
    this.showOprators = false;
  }
  /**
   * 挂载处理逻辑
   */
  mounted() {
    // 获取根节点
    this.root = this.parent();
  }
}
</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style lang="less" scoped>
.component .origanize-node {
  font-size: 12px;
}
</style>
