<template>
  <section class="page case-table-content">
    <data-form :model="contentModel"  hiddenSearch hiddenReset>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="selectProp">
          <el-select v-model="contentModel.selectProp" placeholder="请选择属性">
            <el-option v-for="item in enablePropList" :key="item.key" :label="item.value" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="addGrade" style="margin-left:10px">添加属性</el-button>
        <el-button @click="saveRules" :loading="submitLoading">保存</el-button>
        <el-button @click="searchClick" v-show="isSupperAdmin">搜索</el-button>
      </template>
    </data-form>
    <data-box :data="contentDataSet">
      <template slot="columns">
        <el-table-column :min-width="$helper.getColumnWidth(3)" label="属性">
          <template slot-scope="scope">{{scope.row.prop.value}}</template>
        </el-table-column>
        <el-table-column :min-width="$helper.getColumnWidth(3)" label="权重">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" type="number" @blur="weightChange(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="条件" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col v-for="(item,i) in scope.row.formulas" :key="i" class="condition-item">
              <span v-if="item.name">{{item.name}}</span>
              <span v-else>无</span>
              <el-button type="text" @click="editCondition(scope.row,item)">
                <svg-icon iconName="xitongshezhi"></svg-icon>
              </el-button>
              <el-button type="text" v-if="scope.row.formulas.length>1" @click="removeCondition(scope.row.formulas,item)">
                <svg-icon iconName="guanbi"></svg-icon>
              </el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="分值" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-col v-for="(item,i) in scope.row.formulas" :key="i" class="score-item">
              <el-input v-model="item.score" type="number" class="icon-btn-hidden"></el-input>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" @click="appendCondition(scope)">添加条件</el-button>
            <el-button type="text" @click="removeGrade(scope.row)" v-if="!(scope.row.id)">删除</el-button>
            <el-button type="text" @click="removeGradeData(scope.row)" v-if="(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="编辑条件" :visible.sync="dialog.modifyCondition" @open="modifyConditionOpen" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <ModifyCondition :rule="selectItem" :condition="selectCondition" @save="editSuccess" @close="closeDialog" ref="modifyCondition">
      </ModifyCondition>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { CityService } from "../../../utils/city.service";
import { ScoreStrategyService } from "../../../services/dataimp-service/score-strategy.service";
import clone from 'clone'
import SvgIcon from "~/components/common/svg-icon.vue";
import ModifyCondition from "~/components/tatics-manage/case-tactics/modify-condition.vue"

// @Auth(414)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
    SvgIcon,
    ModifyCondition
  }
})
export default class CaseTableContent extends Vue {

  @Dependencies(CityService) private cityService: CityService;
  @Dependencies(ScoreStrategyService) private scoreStrategyService: ScoreStrategyService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @State companyName
  private contentModel: any = {
    companyCode: '',
    selectProp: ''
  }
  private strategyType: any = ''
  private contentDataSet: any = []
  private tempData: any = ''
  private editState: any = false
  private selectItem: any = '' // 当前选择规则项
  private selectCondition: any = '' // 当前选择条件
  private propList: any = [{
    key: 'age',
    value: '年龄',
    type: Number
  }, {
    key: 'isWork',
    value: '有无工作',
    type: Boolean
  }, {
    key: 'overDueAmount',
    value: '逾期金额',
    type: Number
  }, {
    key: 'overDueDays',
    value: '逾期天数',
    type: Number
  }, {
    key: 'proId',
    value: '省份',
    type: Array,
    data: CityService.getCityData({ level: 1 }).map(x => ({ label: x.label, value: x.value }))
  }]
  private dialog: any = {
    modifyCondition: false
  }
  private submitLoading: Boolean = false;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.contentModel.companyCode = this.userData.companyCode
    }
    return this.contentModel.companyCode
  }

  set companyCode(value) {
    this.contentModel.companyCode = value
  }

  refresh(strategyType) {
    this.strategyType = strategyType
    if (!this.isSupperAdmin) {
      this.searchClick()
    }
  }

  searchClick() {
    this.scoreStrategyService
      .query({ companyCode: this.userData.companyCode, strategyType: this.strategyType })
      .subscribe(data => {
        this.contentDataSet = data.content.map(v => {
          let obj: any = this.propList.find(val => val.key === v.name)
          v.prop = {
            key: v.name,
            value: obj.value,
            type: obj.type,
            data: CityService.getCityData({ level: 1 }).map(x => ({ label: x.label, value: x.value }))
          }
          v.formulas.map(item => {
            item.strategyJson = JSON.parse(item.strategyJson)
          })
          return v
        }, err => {
          this.$message.error(err.msg)
        })
      })
  }
  appendCondition(scope) {
    scope.row.formulas.push({ name: '', strategyJson: [], score: 0 })
  }
  /**
   * 返回可选的属性列表
   */
  get enablePropList() {
    return this.propList.filter(x => {
      return !this.contentDataSet.map(a => a.prop).some(b => b.value === x.value)
    })
  }

  /**
   * 权重输入改变
   */
  weightChange(obj) {
    if (obj.weight < 0 || obj.weight > 1) {
      obj.weight = 0
      this.$alert('权重请输入0~1的小数', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
    }
  }
  /**
   * 编辑条件Open
   */
  modifyConditionOpen() {
    this.$nextTick(() => {
      if (this.selectCondition.strategyJson.length === 0) {
        let modify: any = this.$refs['modifyCondition']
        modify.addCondition()
      }
    })
  }
  /**
   * 添加评分规则
   */
  addGrade() {
    if (this.contentModel.selectProp === '') {
      this.$message('请选择要添加的属性')
      return
    }
    this.contentDataSet.push({
      prop: this.contentModel.selectProp,
      weight: 0,
      formulas: [{
        name: '',
        strategyJson: [],
        score: 0
      }]
    })
    this.contentModel.selectProp = ''
  }
  /**
   * 删除评分规则
   */
  removeGrade(item) {
    this.contentDataSet = this.contentDataSet.filter(x => x.prop !== item.prop)
  }
  removeGradeData(item) {
    this.scoreStrategyService
      .deleteScoreStrategy({ id: item.id })
      .subscribe(data => {
        this.$message.success('操作成功')
        this.searchClick()
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }
  /**
   * 编辑评分条件
   */
  editCondition(item, condition) {
    this.tempData = clone(this.contentDataSet)
    this.editState = false
    this.selectItem = item
    this.selectCondition = condition
    this.dialog.modifyCondition = true
  }
  /**
   * 删除评分条件
   */
  removeCondition(formulas, item) {
    formulas.splice(formulas.indexOf(item), 1)
  }
  /**
   * 保存状态开关
   */
  editSuccess() {
    this.editState = true
  }
  /**
   * 关闭弹出框
   * 判断是否需要还原处理
   */
  closeDialog() {
    if (!this.editState) {
      this.contentDataSet = this.tempData
    }
    this.dialog.modifyCondition = false
  }
  /**
   * 保存评分规则
   */
  saveRules() {
    let scoreRules: any = this.contentDataSet.map(v => {
      return {
        name: v.prop.key,
        weight: v.weight,
        formulas: v.formulas
      }
    })
    let flag: any = false
    scoreRules.forEach(val => {
      val.formulas.forEach(v => {
        if (v.strategyJson.length === 0) {
          flag = true
        }
      })
    })
    if (flag) {
      this.$alert('条件不能为无', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    let num: any = 0
    this.contentDataSet.forEach(v => {
      num = num + Number(v.weight)
    })
    num = num.toFixed(5)
    if (Number(num) !== 1) {
      this.$alert('权重相加不等于一', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    this.submitLoading = true;
    if (this.strategyType) {
      this.scoreStrategyService
        .saveScoreStrategy({ jsonStr: JSON.stringify(scoreRules), strategyType: this.strategyType })
        .subscribe(data => {
          this.submitLoading = false;
          this.$message.success('保存成功')
          this.searchClick()
        }, ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg)
        })
    } else {
      this.$message('请选择策略类型')
    }
  }
}

</script>

<style scoped>
  /* .pane-box[data-v-6ef24620] {
    margin-top: 22px;
  } */
</style>
