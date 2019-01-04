<template>
  <section class="component relate-name-dialog">
    <div class="model">
      <div class="select start-span">
        <el-radio-group v-model="selectRelate">
          <el-radio v-for="(item,index) in relateData" :key="index" :label="item.cellCode" :disabled="!!disStr(item)" style="padding:10px;textAlign:left;marginLeft:0" v-bind:class="{requiredStr:item.flag===0}" class="col-span-3">{{item.cellName}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div style="text-align:center">
      <el-button @click="cancelClick">取消</el-button>
      <el-button @click="saveClick">确定</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
import { AccImportExcelDataService } from "~/services/dataimp-service/acc-import-excel-data.service";
@Component({
  components: {}
})
export default class RelateNameDialog extends Vue {
  @Dependencies(AccImportExcelDataService) private accImportExcelDataService: AccImportExcelDataService;
  private selectRelate: any = {};
  private disabled: any = false;
  @Prop() relateData;
  @Prop() rowName;
  @Prop() disableName;
  @Emit('close')
  close() { }
  refreshData() {
    this.selectRelate = this.rowName.relateName
  }
  disStr(v) {
    return this.disableName.find(val => val === v.cellCode)
  }
  /**
   * 取消
   */
  cancelClick() {
    this.selectRelate = ''
    this.close()
  }
  /**
   * 确定
   */
  saveClick() {
    this.rowName.relateName = this.selectRelate
    this.close()
  }
}

</script>
<style lang="less" scoped>
.model {
  text-align: left;
  margin-bottom: 20px;
  overflow: auto;
}

.select {
  border: 1px solid #eff2f7;
  margin: 10px 0px 0px 0px;
  max-height: 450px;
}

.model-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.select-option {
  font-size: 12px;
  width: 180px;
  margin: 3px 0px 3px 5px;
}

.model-col {
  margin-left: 20px;
}

.iconColor {
  color: #01bccb;
  font-size: 18px;
}

.requiredStr {
  color: red;
}
</style>
