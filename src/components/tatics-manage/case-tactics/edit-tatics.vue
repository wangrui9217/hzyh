<template>
  <section class="component edit-tatics">
    <el-form :model="editModel" ref="form" label-width="90px" :rules="editRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="策略名称:" prop="name">
            <el-input v-model="editModel.name" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分配类型:" prop="allocationPattern">
            <el-select v-model="editModel.allocationPattern" placeholder="请选择">
              <el-option v-for="{value, label} in $dict.getDictData('0102')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>



      <el-row>
        <el-col :span="12">
          <el-form-item label="案件类型:" prop="caseType">
            <el-select v-model="editModel.caseType" placeholder="请选择" >
              <el-option v-for="{value, label} in $dict.getDictData('0103')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级:" prop="priority">
            <el-select v-model="editModel.priority" placeholder="请选择">
              <el-option v-for="n in 10" :key="n" :value="n">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div style="min-height:300px;border:1px solid #ddd;padding:15px " class="text-left add-tactics ">
      <tactics-item :data="tacticsData"></tactics-item>
    </div>
    <el-col class="dialog-footer" align="center">
      <el-button @click="commit(true)">下一步</el-button>
      <el-button @click="commit(false)">预览结果</el-button>
      <el-button @click="close">取消</el-button>
    </el-col>
    <!--委外池分配策略弹出框-->
    <el-dialog title="委外池案件分配策略" :center="true" :visible.sync="dialog.out" append-to-body width="60%" @open="$nextTick(()=>$refs['out-tatics'].refresh(editModel, addOrModify))">
      <out-tatics ref="out-tatics" @close="dialog.out = false" @success="dialog.out = false, refreshList(), close()"></out-tatics>
    </el-dialog>
    <!--内催池分配策略弹出框-->
    <el-dialog :title="'选择【'+editModel.name+'】的分配策略'" :center="true" :visible.sync="dialog.inrush" append-to-body width="80%" @open="$nextTick(()=>$refs['inrush-tatics'].refresh(editModel, allotObj, addOrModify))" @close="$refs['inrush-tatics'].reset()">
      <inrush-tatics ref="inrush-tatics" @close="dialog.inrush = false" @success="dialog.inrush = false, refreshList(), close()"></inrush-tatics>
    </el-dialog>
    <!--预览结果弹出框-->
    <el-dialog title="预览结果" :center="true" :visible.sync="dialog.preview" append-to-body width="80%" @open="$nextTick(()=>$refs['tatics-preview'].refresh(editModel))">
      <tatics-preview ref="tatics-preview" @close="dialog.preview = false"></tatics-preview>
    </el-dialog>
    <!--多选弹出框-->
    <el-dialog title="请选择" :center="true" :visible.sync="dialog.multiSelect" append-to-body width="80%" @open="$nextTick(()=>$refs['multi-select'].refresh(multiArr,multType,multiValue))">
      <multi-select ref="multi-select" @close="dialog.multiSelect = false" @confirm="chooseMulti"></multi-select>
    </el-dialog>
    <!--案件导入池案件分配策略-->
    <el-dialog title="案件导入池案件分配策略" :center="true" :visible.sync="dialog.import" append-to-body width="60%" @open="$nextTick(()=>{ assignType = editModel.assignType || '' })">
      <div>
        <el-row type="flex" justify="center">
          <el-radio class="radio" v-model="assignType" :label="2" :value="2">内催分配</el-radio>
          <el-radio class="radio" v-model="assignType" :label="3" :value="3">委外分配</el-radio>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 20px">
          <el-button @click="dialog.import = false">上一步</el-button>
          <el-button @click="finish">完成</el-button>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { CaseStrategyService } from "~/services/dataimp-service/case-strategy.service";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import TacticsItem from "~/components/tatics-manage/case-tactics/edit-tatics/tatics-item.vue";
import OutTatics from "~/components/tatics-manage/case-tactics/edit-tatics/out-tatics.vue";
import InrushTatics from "~/components/tatics-manage/case-tactics/edit-tatics/inrush-tatics.vue";
import TaticsPreview from "~/components/tatics-manage/case-tactics/edit-tatics/tatics-preview.vue";
import MultiSelect from "~/components/tatics-manage/case-tactics/edit-tatics/multi-select.vue";
import clone from "clone"
const taticManageModule = namespace('tatic-manage')

@Component({
  components: {
    TaticsPreview,
    InrushTatics,
    OutTatics,
    TacticsItem,
    MultiSelect
  }
})
export default class EditTatics extends Vue {
  @Dependencies(CaseStrategyService) private caseStrategyService: CaseStrategyService;
  @taticManageModule.State('tacticsFlag') tacticsFlag
  @taticManageModule.Mutation('updateTacticsFlag') updateTacticsFlag
  @Emit('close')
  close() { }
  @Emit('refreshList')
  refreshList() { }
  @State storeList: any;
  //获取策略名称
  @Prop() allName: any;
  // @Prop() seriesList: any;
  // @Prop() productList: any;
  @Prop() addOrModifyFlag: any;
  private assignType: any = '';
  private addOrModify: any = {};
  private allotObj: any = {};
  private editModel: any = {
    name: '',
    priority: '',
    stripMark: '',
    allocationType: '',
    caseType: '',
    strategyType: '',
    strategyJson: [],
    // seriesIds: [],
    // seriesIdsStr: '',
    // productIds: [],
    // productIdsStr: '',
    shops: [],
    shopsStr: ''
  };
  private dialog: any = {
    out: false,
    inrush: false,
    import: false,
    preview: false,
    multiSelect: false
  };
  private tacticsData: any = [];
  private multiArr: any = [];
  private multiType: any = '';
  private multiValue: any = '';
  private editRules: any  = {
    name:[
      { required: true, message: '请输入策略名称', trigger: 'blur' },
      { validator: this.validatorName, trigger: 'blur' }
    ],
    priority:[{ required: true, type:'number', message: '请选择优先级', trigger: 'change' }],
    allocationPattern:[{ required: true, type:'number', message: '请选择分配类型', trigger: 'change' }],
    caseType:[{ required: true, type:'number', message: '请选择案件类型', trigger: 'change' }]

  }

  validatorName(rule, value, callback){
    if(this.addOrModifyFlag){
      if(this.allName.includes(value)){
      callback(new Error('策略名称已存在'))
      }
    }
    callback()
  }

  /**
   * 多选确定
   */
  chooseMulti(multiValue, multiType, multiArr) {
    this.dialog.multiSelect = false
    switch (multiType) {
      case 'shops':
        this.editModel.shops = multiValue
        this.editModel.shopsStr = String(multiValue.map(v => multiArr.find(val => val.id === v).name))
        break;
      default:
        break;
    }
  }
  /**
   *
   * 保存分配策略
   */
  finish() {
   /* if (!this.assignType) {
      this.$message('请选择类型！')
      return
    }*/
    let obj: any = {
      name: this.editModel.name,
      allocationPattern: this.editModel.allocationPattern,
      caseType: this.editModel.caseType,
      assignType: this.assignType,
      strategyJson: JSON.stringify(this.editModel.strategyJson),
      priority: this.editModel.priority
    }
    if (!this.addOrModify.flag) {
      obj.id = this.addOrModify.id
    }
    this.caseStrategyService.addCaseStrategy(obj).subscribe(data => {
      this.$message.success('操作成功')
      this.dialog.import = false
      this.refreshList()
      this.close()
    })
  }
  /**
   * 策略名称重复校验
   */
  nameValidate() {
    return new Promise(async (resolve, reject) => {
      let obj: any = {
        name: this.editModel.name,
        id: this.addOrModify.flag ? '' : this.addOrModify.id
      }
      this.caseStrategyService.findCaseStrategy(obj).subscribe(data => { resolve() }, ({ msg }) => {
        this.$message.error(msg);
        this.editModel.name = '';
        reject()
      });
    })
  };
  /**
   * 提交操作
   */
  commit(flag) {
    let form: any = this.$refs.form
    form.validate((valid) => {
      if (!valid) { return false; }
      let valueFlag = false
      let fun = (obj) => {
        if (!obj.children) {
          if (obj.value === '' || obj.variable === '' || obj.symbol === '' || obj.bracket === '') {
            valueFlag = true
          }
        } else {
          obj.children.forEach(val => {
            fun(val)
          })
        }
      }
      this.tacticsData.forEach(v => {
        fun(v)
      })
      if (valueFlag) {
        this.$alert('策略参数不能为空', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return false
      }
      if (flag) {
       /* switch (this.editModel.caseType) {
          case 231:
            this.formatData()
            this.dialog.inrush = true
            break;
          case 232:
            this.formatData()
            this.dialog.out = true
            break;
          case 230:
            this.formatData()
            this.dialog.import = true
            break;
        }*/

      } else {
        this.formatData()
        this.dialog.preview = true
      }
    })
  }
  /**
   * 参数填写检查
   */
  checkParams() {
    let flag = true
    let fun = (obj) => {
      if (!obj.children) {
        if (obj.value === '' || obj.variable === '' || obj.symbol === '' || obj.bracket === '') {
          flag = false
        }
      } else {
        obj.children.forEach(val => {
          fun(val)
        })
      }
    }
    this.tacticsData.forEach(v => {
      fun(v)
    })
    if (!flag) {
      this.$alert('策略参数不能为空', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
    }
    return flag
  }
  refresh(tactics, allotObj, addOrModify) {
    this.allotObj = allotObj
    this.addOrModify = addOrModify
    this.updateTacticsFlag(false)
    let form: any = this.$refs.form
    form.resetFields()
    this.editModel.name = tactics.name
    this.editModel.priority = tactics.priority
    this.editModel.stripMark = tactics.stripMark
    this.editModel.assignType = tactics.assignType
    this.editModel.allocationType = tactics.allocationType  // 分案类型
    this.editModel.outsource = tactics.outsource
    // this.editModel.seriesIds = clone(tactics.seriesIds)
    // this.editModel.productIds = clone(tactics.productIds)
    this.editModel.shops = clone(tactics.shops)
    this.editModel.shopsStr = String(this.editModel.shops.map(v => {
      let obj: any = this.storeList.find(val => val.id === v)
      return obj ? obj.name : ''
    }))
    // this.editModel.seriesIdsStr = String(this.editModel.seriesIds.map(v => {
    //   let obj: any = this.seriesList.find(val => val.seriesId === v)
    //   return obj ? obj.seriesName : ''
    // }))
    // this.editModel.productIdsStr = String(this.editModel.productIds.map(v => {
    //   let obj: any = this.productList.find(val => val.prodId === v)
    //   return obj ? obj.prodName : ''
    // }))
    this.tacticsData = tactics.strategyJson
    let self = this
    setTimeout(() => {
      self.updateTacticsFlag(true)
    }, 100)
  }
  /**
   * 格式化策略数据
   */
  formatData() {
    let strategyJson = this.tacticsData.map(v => Object.assign({}, v))

    let itemList: any = []
    let containerList: Array<any> = []

    let getInsertContainer = () => {
      if (containerList.length > 0) {
        return containerList[containerList.length - 1]
      }
      return itemList
    }

    let pushContainer = (list, container) => {
      if (list instanceof Array) {
        list.push(container)
      } else {
        list.children && list.children.push(container)
      }
    }

    for (let item of strategyJson) {
      // 结束上一次数据容器
      if (item.bracket.includes(')')) {
        // 待插入容器
        let container = containerList.pop()
        // 本次完成的容器
        let insertContainer = getInsertContainer()
        // 插入上一级容器
        pushContainer(insertContainer, container)
      }
      // 获取逻辑符
      let sign = item.bracket.includes('或者') ? '||' : item.bracket.includes('并且') ? '&&' : ''
      // 创建新容器
      if (item.bracket.includes('(')) {
        let container: any = {
          children: [],
          relation: sign,
          leaf: false,
          variable: '',
          value: '',
          symbol: '',
          cityArr: item.cityArr,
          bracket: item.bracket
        }

        // 插入初始数据
        container.children.push({
          relation: '',
          leaf: true,
          variable: item.variable,
          value: item.value,
          symbol: item.symbol,
          cityArr: item.cityArr,
          bracket: item.bracket
        })

        // 键入容器列表
        containerList.push(container)
      } else {
        // 获取带插入容器
        let insertContainer = getInsertContainer()
        // 插入数据
        pushContainer(insertContainer, {
          relation: sign,
          leaf: true,
          variable: item.variable,
          value: item.value,
          symbol: item.symbol,
          cityArr: item.cityArr,
          bracket: item.bracket
        })
      }
    }
    while (containerList.length) {
      let container = containerList.pop()
      // 本次完成的容器
      let insertContainer = getInsertContainer()
      // 插入上一级容器
      pushContainer(insertContainer, container)
    }
    this.editModel.strategyJson = itemList
  }
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.dialog-footer {
  padding: 20px;
}
</style>
<style lang="less">
.edit-tatics {
  .more .el-input__inner,
  .more .el-input {
    min-width: 250px;
  }
  .more .el-select__tags {
    max-width: auto !important;
  }
}
</style>

