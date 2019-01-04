<template>
  <section class="component number-range">
    <el-input v-model.lazy.number="minValue" :min="0" type="number" :placeholder="minPlaceholder"></el-input>
    <span>-</span>
    <el-input v-model.lazy.number="maxValue" :min="0" type="number" :placeholder="maxPlaceholder"></el-input>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch, Prop, Emit, Model } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NumberRange extends Vue {
  @Model("numberRangeChange") numberRange: { min: number, max: number };

  @Prop() minPlaceholder;
  @Prop() maxPlaceholder;
  @Prop({
    type: Boolean,
    default: false
  }) isInteger;

  @Emit("numberRangeChange")
  updateNumberRange(numberRange) {}

  get minValue() {
    return this.numberRange.min
  }

  get maxValue() {
    return this.numberRange.max
  }

  set minValue(value) {
    this.updateNumberRange({
      min: this.parseInt(value),
      max: this.numberRange.max
    });
  }
  set maxValue(value) {
    this.updateNumberRange({
      min: this.numberRange.min,
      max: this.parseInt(value)
    });
  }

  parseInt(value) {
    if(this.isInteger) {
      return Math.round(Number.parseFloat(value))
    }
    return value
  }
  public validate(rule, value, callback) {
    if (this.numberRange.min > this.numberRange.max) {
      callback(new Error("输入数字范围有误"));
    }
  }
}
</script>

<style lang="less" scoped>

</style>
<style lang="less">
.component.number-range {
  .el-input {
    width: 120px !important;
    .el-input--inner {
      width: 80px !important;
    }
    // input::-webkit-outer-spin-button,
    // input::-webkit-inner-spin-button {
    //   -webkit-appearance: none !important;
    //   margin: 0;
    // }
  }
}
</style>