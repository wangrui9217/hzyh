
<template>
  <!--编辑条件-->
  <section class="page modify-condition">
    <div class="row modifyConditionMyStyle">
      <div class="col col-span-4 center-span middle-span" style="height:48px">{{rule.prop.value}}</div>
      <div class="col col-span-8">
        <el-row class="condition-list">
          <div class="row center-span middle-span" v-if="condition.strategyJson.length<=0">点击新增按钮添加评分条件</div>
          <div v-for="(conditionItem,index) in condition.strategyJson" :key="index">
            <el-col :span="12" class="text-center">
              <el-select v-model="conditionItem.operator" placeholder="请选择运算符">
                <el-option v-for="(operator,index) in operatorList" :key="index" :label="operator.label" :value="operator.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <!--处理数字类型-->
              <div v-if="rule.prop.type===Number">
                <el-input-number v-model="conditionItem.value" :min="0" size="mini"></el-input-number>
              </div>
              <!--处理布尔类型-->
              <div v-if="rule.prop.type===Boolean">
                <el-select v-model="conditionItem.value" placeholder="请选择值">
                  <el-option label="有" :value="1">
                  </el-option>
                  <el-option label="无" :value="0">
                  </el-option>
                </el-select>
              </div>
              <!--处理数组类型-->
              <div v-if="rule.prop.type===Array">
                <el-select v-model="conditionItem.value" placeholder="请选择">
                  <el-option v-for="dataItem in rule.prop.data" :key="dataItem.value" :label="dataItem.label" :value="dataItem.value">
                  </el-option>
                </el-select>
              </div>
              <!--处理字符类型-->
              <div v-if="rule.prop.type===String">
                <el-input v-model="conditionItem.value"></el-input>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
    <div style="margin-top:30px;text-align: center">
      <el-button v-if="rule.prop.type===Number" @click="addCondition">新增</el-button>
      <el-button @click="saveCondition">保存</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { Prop } from "vue-property-decorator";
// @Auth(414)
@Layout('workspace')
@Component({
  components: {

  }
})
export default class ModifyCondition extends Vue {
  @Prop() rule
  @Prop() condition

  private operatorsType: any = new Map()


  get operatorList() {
    let type :any = this.rule.prop.type.name
    return this.operatorsType.find(x => x.type === type).data
  }
  saveCondition() {
    let flag: any = false
    this.condition.strategyJson.map(x => {
      if (x.value === '' || x.operator === '') {
        flag = true
      }
    })
    if (flag) {
      this.$alert('参数不能为空', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    this.$emit('save')
    this.condition.name = this.condition.strategyJson.map(x => {
      let value = ''
      if (this.rule.prop.type === Array) {
        value = this.rule.prop.data.find(b => b.value === x.value).label
      } else if (this.rule.prop.type === Boolean) {
        value = x.value ? '有' : '无'
      } else {
        value = x.value
      }
      return (this.operatorsType.find(o => this.rule.prop.type.name === o.type).data.find(a =>
        a.value === x.operator).label) + value
    }).join('并且')
    this.$emit('close')
  }
  addCondition() {
    this.condition.strategyJson.push({
      operator: '',
      value: ''
    })
  }
  created() {
    this.operatorsType = [
      {
        type: 'Number',
        data: [
          { value: '>', label: '大于' },
          { value: '<', label: '小于' },
          { value: '==', label: '等于' },
          { value: '>=', label: '大于等于' },
          { value: '<=', label: '小于等于' }
        ]
      },
      {
        type: 'Boolean',
        data: [
          { value: '==', label: '等于' }
        ]
      },
      {
        type: 'String',
        data: [
          { value: '==', label: '等于' }
        ]
      },
      {
        type: 'Array',
        data: [
          { value: '==', label: '等于' }
        ]
      }
    ]
  }
}
</script>
<style>
.modifyConditionMyStyle .el-input-number__decrease,
.modifyConditionMyStyle .el-input-number__increase {
  height: 24px;
  line-height: 24px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.condition-list > * {
  padding: 10px;
}
</style>
