<template>
  <section class="component tatics-item">
    <div v-for="(v,i) in data" :key="i">
      <div v-if="v.leaf" class="buttons" style="position:relative;padding-left:20px;height:26px">
        <div class="close-btn" @click="deleteItem(i)" v-if="i">
          <svg-icon iconName="guanbi"></svg-icon>
        </div>
        <el-select v-model="v.bracket" placeholder="请选择" @visible-change="braketDrop(v,i)" class="value-style">
          <template v-if="i === 0">
            <el-option label="空置" value="null"></el-option>
            <el-option label="(" value="("></el-option>
          </template>
          <template v-else>
            <el-option label="并且" value="并且"></el-option>
            <el-option label="或者" value="或者"></el-option>
           <!-- <el-option label="并且(" value="并且("></el-option>
            <el-option label="或者(" value="或者("></el-option>-->
           <!-- <template v-if="v.canright">
              <el-option label=")并且" value=")并且"></el-option>
              <el-option label=")并且(" value=")并且("></el-option>
              <el-option label=")或者" value=")或者"></el-option>
              <el-option label=")或者(" value=")或者("></el-option>
            </template>-->
          </template>
        </el-select>
        <el-select v-model="v.variable" @change="variableChange(v,i)" placeholder="请选择" class="value-style">
          <el-option label="逾期期数" value="overduePeriods"></el-option>
          <el-option label="逾期天数" value="overdueDays"></el-option>
          <el-option label="产品类型" value="productType"></el-option>
          <el-option label="产品名称" value="productName"></el-option>
          <el-option label="归属省份" value="provinceId"></el-option>
          <el-option label="归属城市" value="cityId"></el-option>
          <el-option label="贷款余额" value="leftCapital"></el-option>
          <el-option label="是否失联" value="isLost"></el-option>
        </el-select>

        <el-select v-model="v.symbol" :disabled="(v.variable==='productType')||(v.variable==='provinceId')||(v.variable==='cityId')||(v.variable==='isLost')" placeholder="请选择" class="value-style">
          <el-option label="大于" value=">"></el-option>
          <el-option label="大于等于" value=">="></el-option>
          <el-option label="等于" value="=="></el-option>
          <el-option label="小于等于" value="<="></el-option>
          <el-option label="小于" value="<"></el-option>
          <el-option label="包含" value="like"></el-option>
          <el-option label="不包含" value="!="></el-option>
        </el-select>

        <el-input v-model="v.value" class="value-style" v-if="v.variable==='overduePeriods'" placeholder="请输入期数"></el-input>
        <el-input v-model="v.value" class="value-style" v-if="v.variable==='overdueDays'" placeholder="请输入天数"></el-input>
        <el-select v-model="v.value" class="value-style" v-if="v.variable==='productType'" placeholder="请选择产品类型" clearable @change="productChange(v.value)">
            <el-option v-for="{ id, typeName } in productSeries" :key="id" :label="typeName" :value="id"></el-option>
        </el-select>
        <el-cascader v-model="v.value" :options="$city.getCityData({ level : 1 })" v-if="v.variable==='provinceId'" clearable></el-cascader>
        <el-cascader v-model="v.value" :options="$city.getCityData({ level : 2 })" v-if="v.variable==='cityId'" clearable></el-cascader>
        <el-input v-model="v.value" class="value-style" v-if="v.variable==='productName'" placeholder="请输入产品名称"></el-input>
        <el-input v-model="v.value" class="value-style" v-if="v.variable==='leftCapital'" placeholder="请输入金额"></el-input>
        <el-input v-model="v.value" class="value-style" v-if="v.variable==='isLost'" placeholder="请输入值"></el-input>
        <el-select v-model="v.value" placeholder="请选择" v-if="v.variable==='principalName'" class="value-style" >
          <el-option v-for="{id,name} in principalList" :key="id" :label="name" :value="name" >
          </el-option>
        </el-select>
        <el-cascader v-model="v.cityArr" class="value-style" v-if="v.variable==='city'" @change="cityChange(v,i)" :options="$city.getCityData()" :props="{value:'value',label:'label'}" :show-all-levels="false"></el-cascader>
        <el-select v-model="v.value" placeholder="请选择" v-if="v.variable==='province'" class="value-style">
          <el-option v-for="{value,label} in $city.getCityData()" :key="value" :label="label" :value="value">
          </el-option>
        </el-select>
         <span v-if="v.variable==='productName' && v.symbol==='!='" style="color:red;">*多个产品名称时，请使用中文逗号隔开</span>
        <el-button v-if="i===(data.length-1)" @click="addItem(v,i)" type="text" style="margin-left:47px;margin-top:-9px" class="value-style add-btn">
          <svg-icon iconName="zengjia"></svg-icon>
        </el-button>
      </div>
      <div v-else class="buttons">
        <tactics-item :data="v.children" :name="v.name"></tactics-item>
      </div>
    </div>
    <template v-for="i in rightNumber">
      <el-button class="kong-btn" :key="'b'+ i" style="margin-left:20px;margin-bottom:10px;margin-top:0px">)</el-button>
      <br :key="'a'+ i">
    </template>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, namespace } from "vuex-class";
import { Prop } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import { ObtainTaticsService } from "~/services/dataimp-service/obtain-tatics.service";
const taticManageModule = namespace("tatic-manage");

@Component({
  components: {
    SvgIcon
  }
})
export default class TaticsItem extends Vue {
  @Dependencies(ObtainTaticsService)
  private obtainTaticsService: ObtainTaticsService;
  @taticManageModule.State("tacticsFlag") tacticsFlag;
  @State principalList: any;
  @State storeList: any;
  @State userData: any;
  @Prop() data: Array<any>;
  @Prop() addOrModifyFlag: Boolean;
  private seriesList: any = [];
  private productTypeItem: any = "";
  private productSeries: any = []; //产品类型列表

  mounted() {
    this.getSelectProductSeries();
  }
  get rightNumber() {
    let left = 0;
    let right = 0;
    this.data.forEach((value, index) => {
      if (value.bracket.includes("(")) {
        left++;
      }
      if (value.bracket.includes(")")) {
        right++;
      }
    });
    if (left > right) {
      return left - right;
    } else {
      return 0;
    }
  }
  get parent() {
    let parent: any = this.$parent;
    // 向上寻找根节点元素
    while (parent && parent.$options && !parent.editModel) {
      parent = parent.$parent;
    }
    return parent;
  }
  braketDrop(v, i) {
    let left = 0;
    let right = 0;
    this.data.forEach((value, index) => {
      if (index < i) {
        if (value.bracket.includes("(")) {
          left++;
        }
        if (value.bracket.includes(")")) {
          right++;
        }
      }
    });
    v.canright = left > right;
  }
  /**
   * 城市选择改变
   */
  cityChange(v, i) {
    v.value = v.cityArr[v.cityArr.length - 1];
  }
  /**
   * 条件名选择改变
   */
  variableChange(v, i) {
    if (
      v.variable === "overduePeriods" ||
      v.variable === "productType" ||
      v.variable === "productName" ||
      v.variable === "province" ||
      v.variable === "city" ||
      v.variable === "leftCapital" ||
      v.variable === "isLost"
    ) {
      v.symbol = "==";
    }
    if (this.tacticsFlag) {
      v.value = "";
      v.cityArr = [];
    }
  }
  /**
   * 删除
   */
  deleteItem(i) {
    this.data.splice(i, 1);
  }
  /**
   * 增加
   */
  addItem(v, i) {
    let obj = {
      leaf: true,
      variable: "",
      value: "",
      symbol: "",
      cityArr: [],
      relation: "",
      bracket: "",
      canright: false
    };
    this.data.push(obj);
  }
  getJsonData() {
    this.$emit("getJsonData", this.data);
  }
  productChange(value) {
    this.productTypeItem = value;
    this.$emit("productTypeItem",this.productTypeItem)
  }
  /**
   * 获取产品系列
   */
  getSelectProductSeries() {
    this.obtainTaticsService.selectProductSeries().subscribe(
      d => {
        this.productSeries = d;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
}
</script>

<style lang="less" scoped>
.tactics-btn {
  background: #fff !important;
  border: 1px solid #bfcbd9 !important;
  color: #1f2d3d !important;
}

.kong-btn {
  background: #fff !important;
  border: 1px solid #bfcbd9 !important;
  color: #1f2d3d !important;
  cursor: default;
  width: 106px !important;
  text-align: left !important;
  padding-left: 10px !important;
}

.tactics-symbol-btn {
  background: #fff !important;
  color: #1f2d3d !important;
}

.tactics-btn:focus {
  border: 1px solid #0092dc !important;
  color: #0092dc !important;
}

.tactics-btn.is-disabled {
  background: #ddd !important;
  color: #666 !important;
}

.tactics-symbol-btn.is-disabled {
  background: #eef0fc !important;
  color: #999 !important;
}

.close-btn {
  position: absolute;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  font-size: 8px;
  color: #fff;
  background: #ccc;
  top: 9px;
  left: 0px;
  text-align: center;
  line-height: 14px;
  cursor: pointer;
}

.add-btn {
  position: absolute;
}

.buttons {
  margin-bottom: 10px;
  & > * {
    margin-right: 10px;
  }
}
</style>
<style lang="less">
.tatics-item.component {
  .el-input__inner,
  .el-input {
    width: 106px;
  }
  .more .el-input__inner,
  .more .el-input {
    min-width: 250px;
  }
  .more .el-select__tags {
    max-width: auto !important;
  }
  .el-input__inner {
    height: 26px !important;
  }
  .close-btn svg {
    font-size: 12px !important;
  }
}
</style>
