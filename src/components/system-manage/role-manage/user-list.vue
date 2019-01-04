<template>
  <section class="component user-list">
    <data-form :model="model" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="model.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName">
          <el-input v-model="model.realName"></el-input>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData" :page="pageService" :max-height="400">
      <template slot="columns">
      <!--数据列区域-->
        <el-table-column label="用户名" prop="userName" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="姓名" prop="realName" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="电话" prop="phone" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="所属机构" prop="department.name" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import DataForm from "~/components/common/data-form.vue";
  import DataBox from "~/components/common/data-box.vue";
  import { Dependencies } from "~/core/decorator";
  import { PageService } from "~/utils/page.service";
  import { UserService } from "~/services/business-service/user.service";

  @Component({
    components: {
      DataForm,
      DataBox
    }
  })
  export default class UserList extends Vue {
    @Dependencies(PageService) private pageService: PageService;
    @Dependencies(UserService) private userService: UserService;
    private model: any = {
      userName: '',
      realName: '',
      id: '',
      isManager:'manager'
    };
    private dataSet = null;
    refresh(id){
      this.model.id = id
      this.refreshData()
    }
    refreshData(){
      this.userService.getUserByRolePage(this.model, this.pageService).subscribe(data => {
        this.dataSet = data
      }, ({ msg }) => {
        this.$message.error(msg);
      })
    }
  }

</script>

<style lang="less" scoped>

</style>
