<template>
  <section class="component area-selection">
    <el-checkbox :disabled="disabled" style="width:100px;" :indeterminate="indeterminateCountry" v-model="countryChecked">全国</el-checkbox>
    <el-row v-for="item of cityData" :key="item.id" style="margin-top:12px;">
      <el-col :span="4">
        <el-checkbox :disabled="disabled" style="width:100px;" v-model="item.selectedAll" :indeterminate="item.selectedProvince.length > 0 && item.selectedProvince.length < item.children.length" @change="onAreaCheckAllChange(item,$event)">{{item.label}}{{item.selectedProvince.length>0?`(${item.selectedProvince.length})`:''}}</el-checkbox>
      </el-col>
      <el-col :span="20">
        <el-checkbox-group style="display:inline-flex;font-size:14px" v-model="item.selectedProvince">
          <el-popover width="400" trigger="click" v-for="province of item.children" :key="province.value">
            <el-checkbox-group v-model="province.selectedCity">
              <el-row>
                <el-col v-for="{label,value} of province.citys" :span="12" :key="value" style="margin-top:8px;">
                  <el-checkbox :disabled="disabled" :label="value" @change="onCitySelectChange(item.selectedProvince,province)">{{label}}</el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
            <div class="area-selection-checkbox" slot="reference">
              <el-checkbox :disabled="disabled" :label="province.value" :indeterminate="province.selectedCity.length > 0 && province.selectedCity.length < province.citys.length" @change="onProvinceSelectChange(item,province,$event)">{{province.label}}{{province.selectedCity.length>0?`(${province.selectedCity.length})`:''}}</el-checkbox>
              <a>
                <i class="el-icon-caret-bottom"></i>
              </a>
            </div>
          </el-popover>
        </el-checkbox-group>
      </el-col>
    </el-row>
  </section>
</template>


<script lang="ts">
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import { CityService } from "~/utils/city.service";

const AreaData = [
  { label: "华东", id: 1, children: [2440, 2134, 3146, 2245, 1501] },
  { label: "华北", id: 2, children: [3873, 1755, 2663, 2, 552, 3394] },
  { label: "华中", id: 3, children: [1156, 966, 734] },
  { label: "华南", id: 4, children: [3624, 3021, 157, 1293] },
  { label: "东北", id: 5, children: [3509, 2458, 1613] },
  { label: "西北", id: 6, children: [1871, 1989, 2528, 2635, 3821] },
  { label: "西南", id: 7, children: [2816, 1773, 3248, 2358, 926] },
  { label: "港澳台", id: 8, children: [2794, 2122, 252] }
];

// 省列表数据
const provinceDataList = CityService.getCityData({ level: 1 });

@Component({})
export default class AreaSelection extends Vue {
  private cityData: Array<any> = [];
  private _countryChecked: Boolean = false;

  @Prop() selectedCitys: Array<Number>;
  @Prop({
    default:false,
    type:Boolean
  }) disabled:any
  @Watch("selectedCitys", { immediate: true })
  onSelectedCitysChange() {
    this.formatData();
  }

  onAreaCheckAllChange(area, state) {
    if (state) {
      area.selectedProvince = area.children.map(v => {
        v.selectedCity = v.citys.map(v => v.value);
        return v.value;
      });
    } else {
      area.selectedProvince = [];
      area.children.forEach(v => {
        v.selectedCity = [];
      });
    }
  }

  onProvinceSelectChange(area, province, state) {
    province.selectedCity = state ? province.citys.map(x => x.value) : [];
    area.selectedAll = area.selectedProvince.length === area.children.length;
  }

  onCitySelectChange(selectedProvince, province) {
    if (
      province.selectedCity.length === province.citys.length &&
      selectedProvince.indexOf(province.value) === -1
    ) {
      selectedProvince.push(province.value);
    } else if (selectedProvince.indexOf(province.value) > -1) {
      selectedProvince.splice(selectedProvince.indexOf(province.value), 1);
    }
  }
 
  // 计算全国选择 半选状态
  get indeterminateCountry(){
    return this.cityData.some(area => area.children.some(p => p.selectedCity.length > 0)) && !this.countryChecked
  }

  get countryChecked() {
    return !this.cityData.some(area =>  area.selectedProvince.length !== area.children.length);
  }

  set countryChecked(value) {
    this.cityData.forEach(area => {
      this.onAreaCheckAllChange(area, value);
      area.selectedAll = value
    });
  }

  created() {   
    this.initData();
  }

  public getCheckedCitys() {
    let currentSelectCitys: Array<any> = [];
    this.cityData.forEach(group => {
      group.children.forEach(province => {
        currentSelectCitys.push(...province.selectedCity);
      });
    });
    return currentSelectCitys;
  }

  /**
   * 获取省份列表
   */
  private getProvinceList(provinceList) {
    return provinceList.map(provinceId => {
      let currentPovince = this.$city
        .getCityData({ level: 1 })
        .find(p => p.value === provinceId);
      return {
        value: currentPovince.value,
        label: currentPovince.label,
        citys: this.$city.getCityData({ level: 1, id: provinceId }), // 城市列表
        selectedCity: [] // 当前选择的城市
      };
    });
  }

  /**
   * 初始区域信息
   */
  private initData() {
    this.cityData = AreaData.map((group: any) => ({
      id: group.id,
      label: group.label,
      children: this.getProvinceList(group.children), // 当前区域省份列表
      selectedProvince: [], // 当前选择省份
      selectedAll: false
    }));
  }

  /**
   * 获取选择城市/省份数据
   */
  private formatData() {
    this.$nextTick(() => {
      this.cityData.forEach(group => {
        // 获取选择城市
        group.children.forEach(province => {
          let citys = province.citys.map(x => x.value);
          province.selectedCity = this.selectedCitys.filter(x =>
            citys.includes(x)
          );
        });

        // 获取选择的省份
        group.selectedProvince = group.children
          .map(province => {
            return province.selectedCity.length === province.citys.length
              ? province.value
              : "";
          })
          .filter(x => x);

        // 判断是否选择全部省份
        group.selectedAll =
          group.children.length == group.selectedProvince.length;
      });
    });
  }
}
</script>

<style lang="less">
.component.area-selection {
  .el-checkbox {
    margin: 0;
  }
}
</style>

<style lang="less" scoped>
.component.area-selection {
  .area-selection-checkbox {
    margin-right: 5px;
    display: inline-flex;
    min-width: 100px;
  }
  .el-checkbox{
    font-weight: normal;
  }
}
</style>
