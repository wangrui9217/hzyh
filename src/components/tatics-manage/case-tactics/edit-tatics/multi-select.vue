<template>
  <section class="component multi-select">
    <div class="model-col">
      <div class="select-all">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="checkAllChange">全选</el-checkbox>
      </div>
      <div class="select">
        <!--默认必选项-->
        <!--可选项-->
        <el-checkbox-group v-model="multiValue" @change="itemChange">
          <el-checkbox class="select-option" v-for="item in multiArr" :label="item[multiId]" :key="item[multiId]">{{item[multiName]}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div style="margin-top:20px;text-align:center">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm(multiValue, multiType, multiArr)">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Dependencies } from "~/core/decorator";
  import { Emit } from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class MultiSelect extends Vue {
    @Emit('close')
    close(){}
    @Emit('confirm')
    confirm(multiValue, multiType, multiArr){}
    private multiArr: any = [];
    private multiValue: any = [];
    private multiType: any = '';
    private isIndeterminate: any = false;

    private multiId: any = '';
    private multiName: any = '';
    
    get checkAll() {
      return this.multiValue.length === this.multiArr.length
    }
    set checkAll(v) {}
    /**
     * 全选
     */
    checkAllChange(event) {
      this.multiValue = event ? this.multiArr.map(v=>v[this.multiId]) : []
      this.isIndeterminate = false
    }
    /**
     * 单个改变
     */
    itemChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.multiArr.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.multiArr.length;
    }
    /**
     * 刷新
     */
    refresh(multiArr, multType, multiValue) {
      this.multiArr = multiArr
      this.multiType = multType
      this.multiValue = multiValue
      switch (multType) {
        case 'shops':
          this.multiId = 'id'
          this.multiName = 'name'
          break;
        case 'seriesIds':
          this.multiId = 'seriesId'
          this.multiName = 'seriesName'
          break;
        case 'productIds':
          this.multiId = 'prodId'
          this.multiName = 'prodName'
          break;
        default:
          break;
      }
    }
  }
</script>

<style lang="less" scoped>
  .multi-select{
    .dialog-footer {
      padding: 20px;
    }
    .model {
      text-align: left;
      margin-bottom: 20px;
    }

    .select {
      border: 1px solid #EFF2F7;
      margin: 10px 0px 0px 0px;
    }

    .select-option {
      font-size: 12px;
      width: 180px;
      margin: 3px 0px 3px 5px!important;
    }

    .model-col {
      margin-left: 20px;
    }
  }
</style>
