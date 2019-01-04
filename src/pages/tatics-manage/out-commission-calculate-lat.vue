<template>
  <section class="page out-commission-calculate-lat">
    <data-form :model="model" @onSearch="refreshData" hiddenSearch hiddenReset>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方" prop="outsId" v-auth="5515">
          <el-select v-model="model.outsId" placeholder="请选择" @change="refreshData">
            <el-option v-for="{index,id,outsName} in outSourceList" :key="id" :label="outsName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button type="text" @click="addLine" v-auth="5516">新增行</el-button>
      </template>
    </data-form>
    <data-box :data="dataSet">
      <template slot="columns">
        <el-table-column prop="overdueTime" label="逾期时段" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.overdueTime" class="batch" @focus="changeClick(scope)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="佣金计算纬度(户/金额)" :min-width="$helper.getColumnWidth(3)" class="leijishu">
          <el-table-column label="回款" :min-width="$helper.getColumnWidth(3)">
            <el-table-column prop="returnMoney" label="金额比率" align="right" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.returnMoney" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'returnMoney')">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="returnHouseholds" label="户数(元/户)" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.returnHouseholds" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'returnHouseholds')">
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="回退" :min-width="$helper.getColumnWidth(3)">
            <el-table-column prop="rollbackMoney" label="金额比率" align="right" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rollbackMoney" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'rollbackMoney')">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="rollbackHouseholds" label="户数(元/户)" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rollbackHouseholds" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'rollbackHouseholds')">
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="修复" :min-width="$helper.getColumnWidth(3)">
            <el-table-column prop="repairMoney" label="金额比率" align="right" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.repairMoney" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'repairMoney')">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="repairHouseholds" label="户数(元/户)" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.repairHouseholds" class="batch" type="number" :min="0" @blur="numberChange(scope.row, 'repairHouseholds')">
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>

        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteLine(scope)" v-if="!(scope.row.id)" size="small" v-auth="5517" >删除行</el-button>
            <el-button type="text" @click="deleteLineData(scope)" v-if="scope.row.id" size="small" v-auth="5518">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div class="hold">
      <el-button size="small" @click="saveClick" :loading="submitLoading" v-auth="5519">保存</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { OutsourceService } from "~/services/business-service/outsource.service";
import { OutSourceCommssionService } from "~/services/business-service/out-source-commssion.service";

@Auth(845)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class OutCommissionCalculateLat extends Vue {
  @Dependencies(OutsourceService) private outsourceService: OutsourceService;
  @Dependencies(OutSourceCommssionService) private outSourceCommssionService: OutSourceCommssionService;
  @State userData: any;
  @State companyList: any;
  @State outSourceList: any;
  @Getter isSupperAdmin: boolean;
  private model: any = {
    outsId: '',
    companyCode: ''
  };
  private dataSet: any = [];
  private submitLoading: Boolean = false;
  /**
* 考虑到非管理员不显示公司选择控件
* get 操作的时候强制设置非管理员所在公司码
*/
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.model.companyCode = this.userData.companyCode
    }
    return this.model.companyCode
  }

  set companyCode(value) {
    this.model.companyCode = value
  }
  /**
  * 页面激活
  */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  changeClick(scope) {
    if (!(scope.row.id)) {
      scope.row.overdueTime = 'M'
    }
  }
  numberChange(v, i) {
    if (!(v[i] >= 0)) {
      v[i] = 0
    }
  }
  /**
   * 添加行
   */
  addLine(scope) {
    if (this.dataSet.length < 10) {
      let obj = {
        overdueTime: 'M0', // 逾期时段
        returnMoney: 0, // 回款金额
        returnHouseholds: 0, // 回款户数
        rollbackMoney: 0, // 回退金额
        rollbackHouseholds: 0, // 回退户数
        repairMoney: 0, // 修复金额
        repairHouseholds: 0 // 修复户数
      }
      this.dataSet.push(obj)
    } else {
      this.$message('最多只能添加10行数据！')
    }
  }
  /**
   * 删除行
   */
  deleteLine(scope) {
    this.dataSet.splice(scope.$index, 1)
  }
  /**
   * 删除行数据
   */
  deleteLineData(scope) {
    this.outSourceCommssionService.deleteOutsourceCommission([scope.row.id]).subscribe(data => {
      this.$message.success('操作成功!')
      // 刷新table
      this.refreshData()
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  /**
   * 新增保存
   */
  saveClick() {
    if (this.model.outsId === '') {
      this.$message('请选择委托方！')
    }
    if (this.dataSet.length === 0) {
      this.$message('请输入佣金计算纬度相关数据！')
      return
    }
    let outsourceCommissionList: any = this.dataSet.map(v => {
      return {
        ...v,
        ...this.model
      }
    })
    this.submitLoading = true;
    this.outSourceCommssionService.createOutSourceCommssion(outsourceCommissionList).subscribe(data => {
      this.submitLoading = false;
      this.$message.success('操作成功!')
      // 刷新table
      this.refreshData()
    }, ({ msg }) => {
      this.submitLoading = false;
      this.$message.error(msg);
    });
  }
  refreshData() {
    if (this.isSupperAdmin && this.model.companyCode === '') {
      this.$message('请选择公司！')
      return
    }
    if (this.model.outsId === '') {
      this.$message('请选择受托方！')
      return
    }
    this.outSourceCommssionService.getOutSourceCommission(this.model).subscribe(data => {
      this.dataSet = data.content;
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  mounted() { }
}
</script>

<style lang="less">
.model {
  text-align: left;
  margin-bottom: 0px;
  margin-top: 18px;
}

.hold {
  text-align: center;
  margin-top: 30px;
}

.select {
  border: 1px solid #eff2f7;
  margin: 10px 0px 0px 0px;
}

.leijishu {
  font-weight: bold;
}
</style>
<style lang="less">

</style>
