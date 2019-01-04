<template>
  <section class="component choose-send-obj">
    <el-form ref="form" label-width="100px">
      <div class="choose-title">请选择需要发送的对象:</div>
      <el-form-item   label="本人:">
        <el-checkbox-group   v-model="custCheck" class='personal'>
          <el-checkbox  :label="1">手机号(主)</el-checkbox>
          <el-checkbox :label="0">手机号(次)</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="联系人列表:">
        <div style="display:flex;">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-right:30px">全选</el-checkbox>
          <el-checkbox-group v-model="checkList" @change="handleCheckedItemChange">
            <el-checkbox v-for="{value, label} of $dict.getDictData('0015')" :label="value" :key="value">{{label}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <el-col class="btns" align="center">
      <el-button @click="next">下一步</el-button>
    </el-col>
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
  export default class ChooseSendObj extends Vue {
    private checkList: any = [];
    private custCheck: any = [];
    private checkAll: any = false;
    private isIndeterminate: any = false;
    @Emit('nextStep')
    nextStep(checkList, custCheck){}

    refresh(){
      this.checkList = []
      this.custCheck = []
      this.checkAll = false
      this.isIndeterminate = false
    }
    /**
     * 全选change事件
     */
    handleCheckAllChange(value, event) {
      this.isIndeterminate = false
      if (event.target.checked) {
        this.checkList = this.$dict.getDictData('0015').map(v => v.value)
      } else {
        this.checkList = []
      }
    }
    /**
     * 单条选择change事件
     */
    handleCheckedItemChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.$dict.getDictData('0015').length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.$dict.getDictData('0015').length
    }
    /**
     * 短信群发下一步
     */
    next() {
      if ((this.checkList.length === 0) && (this.custCheck.length === 0)) {
        this.$alert('请选择发送对象', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.nextStep(this.checkList, this.custCheck)
    }
    mounted () {}
  }

</script>

<style lang="less" scoped>
  .choose-title {
    margin: 30px 0 30px;
    color: rgb(31, 45, 61);
    text-align: left;
  }
  .btns {
    margin-bottom: 30px;
    margin-top: 20px;
  }
  .personal{
    margin-left: 40%;
  }
</style>
