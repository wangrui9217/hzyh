<template>
  <section class="component data-selection">
    <div class="model-name">
      <span class="icon-box icon-color"></span>
      <span class="title-text">{{title}}</span>
    </div>
    <div class="model-select">
      <el-checkbox label="全选" v-model="selectAll" class="select-all" :indeterminate="isIndeterminate"></el-checkbox>
      <el-checkbox-group v-model="selectionData" class="select">
        <el-checkbox class="select-option" v-for="(title,index) of selectonList" :label="title" :key="index"></el-checkbox>
      </el-checkbox-group>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Emit, Model } from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class DataSelection extends Vue {
  @Model("valueChange") value: Array<string>;
  @Emit("valueChange")
  updateValue(value) { }
  /**
   * 要追加的数据
   */
  @Prop({
    // 数组的默认值，必须使用一个函数给返回，不能直接写死
    default: () => { return [] }
  })
  append: Array<string>

  /**
   * 默认绑定的列表项
  */
  @Prop()
  defaultOptions: Array<string>

  /**
   * 多选框区域的标题
  */
  @Prop({ type: String })
  title

  /**
   * 全选计算
   */
  get selectAll() {
    return this.selectionData.length === (this.defaultOptions.length + this.append.length );
  }
  set selectAll(value) {
    this.selectionData = value ? this.defaultOptions.concat(this.append) : [];
  }
  get isIndeterminate() {
    return this.selectionData.length > 0 && this.selectionData.length < this.selectonList.length;
  }
  // 绑定交互数据
  get selectionData() {
    return this.value;
  }

  // 交互数据通过updateValue 暴露给外部使用
  set selectionData(value) {
    this.updateValue(value);
  }

  // 生成绑定到checkboxGroup的数组
  get selectonList(){
    return this.defaultOptions.concat(this.append);
  }
}
</script>

<style lang="less">
.model-select {
  margin-bottom: 20px;
  font-size: 14px;
  .select-all {
    margin: 3px 0px 3px 5px;
    font-weight: bold;
  }
  .select-option {
    min-width: 180px;
    margin: 3px 0px 3px 5px !important;
  }
  .select {
    border: 1px solid #eff2f7;
    margin: 10px 0px 0px 0px;
  }
}
@boxhigh: 16px;
.model-name {
  font-size: 14px;
  margin-bottom: 10px;
  height: @boxhigh;
  .icon-box {
    float: left;
    width: @boxhigh;
    height: @boxhigh;
    margin-right: 10px;
  }
  .title-text {
    line-height: @boxhigh;
    height: @boxhigh;
    font-weight: bold;
  }
}
</style>
