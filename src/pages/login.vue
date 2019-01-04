<template>
  <section class="login-page fullScreen" @keydown.enter="submitForm">
    <div class="component work-header row between-span middle-span">
      <div class="row start-span middle-span" style="margin-left:10px">
        <img src="@/assets/images/common/logo.png" />
      </div>
    </div>
    <el-row type="flex" align="middle" class="login-main">
      <el-form ref="login-form" :model="loginModel" :rules="loginRule" class="login-form" style="background:#fff;" type="flex" align="middle">
        <el-row type="flex" justify="center" style="margin-top:20px">
          <h2>{{appConfig.name}}</h2>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-form-item prop="username">
            <el-input  v-model="loginModel.username" auto-complete="off" placeholder="账号">
              <template slot="prefix">
                <svg-icon iconName="yonghuming"></svg-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-form-item prop="password">
            <el-input  type="password" v-model="loginModel.password" placeholder="密码">
              <template slot="prefix">
                <svg-icon iconName="mima"></svg-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-row>

        <!--屏蔽验证码-->

       <!-- <el-row type="flex" justify="center">
          <el-form-item>
            <verify-code ref="verify-code"></verify-code>
          </el-form-item>
        </el-row>-->
        <el-row type="flex" justify="center">
          <el-form-item class="remember">
            <el-checkbox class="remember_cb" v-model="remember">记住用户名和密码</el-checkbox>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top:10px">
          <el-form-item label-width="0px" style="text-align:center">
            <el-button type="" class="btn" @click="$refs['login-form'].resetFields()">重置</el-button>
            <el-button type="primary" class="btn" @click="submitForm">登录</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SvgIcon from "~/components/common/svg-icon.vue"
import VerifyCode from '~/components/common/verify-code.vue'
import AppConfig from "~/config/app.config"
import { Dependencies } from "~/core/decorator";
import { Action } from "vuex-class";
import { StorageService } from '~/utils/storage.service';
import { LoginService } from "~/services/business-service/login.service";
import { FindValueSubscriber } from "rxjs/operators/find";
import { ReminderService } from '~/utils/reminder.service'
@Component({
  components: {
    SvgIcon,
    VerifyCode
  }
})
export default class Login extends Vue {
  @Dependencies(LoginService) private authService: LoginService;
  @Action("updateUserLoginData") updateUserLoginData;

  private loginRule: any = {
    username: { required: true, message: "用户名不能为空", trigger: "blur" },
    password: { required: true, message: "密码不能为空", trigger: "blur" }
  };
  private loginModel: any = {
    username: "",
    password: ""
  };
  private appConfig: any = AppConfig;
  private remember:boolean = false;

  mounted(){
    ReminderService.notifyClean()
    let rember:any = StorageService.getItem('remember')
    this.remember = !!rember
    if(rember){
      this.loginModel = rember
    }
  }

  /**
   * 提交登录表单
   */
  submitForm() {
    let loginForm: any = this.$refs["login-form"];
    loginForm.validate(success => {
      if (!success) {
        return;
      }
/*
 屏蔽验证码
      let verifyForm: any = this.$refs['verify-code']

      // 校验验证码
      if (verifyForm.getVerifyValue().trim() === '') {
        this.$message.error('请输入验证码')
        verifyForm.reset()
        return
      }
      if (!verifyForm.validate()) {
        this.$message.error('验证码错误')
        verifyForm.reset()
        return
      }
*/

      if(this.remember){
        StorageService.setItem('remember',this.loginModel)
      }else{
        StorageService.removeItem('remember')
      }

      this.authService
        .login({
          username: this.loginModel.username,
          password: this.loginModel.password,
          usdeType: 0
        })
        .subscribe(
        ({ token, user }) => {
          this.updateUserLoginData({ token, user });
          // 跳转工作区
          if (user.manager) {
            this.$router.push("/dashboard/admin");
          } else {
            this.$router.push("/dashboard/user");
          }
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
        );
    });
  }
}
</script>

<style lang="less" scoped>
.component.work-header {
  flex-basis: 60px;
  height: 60px;
  min-height: 60px;

  -moz-user-select: none;/*支持Firefox浏览器*/
  -webkit-user-select: none;/*支持Chrome，Opera，Safari等浏览器*/
  -ms-user-select: none;/*支持IE浏览器*/
  user-select: none;

  .logo {
    padding: 10px;
  }
}
.login-page {
  display: flex;
  flex-direction: column;
}

.login-form {
  width: 450px;
  height: 440px;
  box-shadow: 1px 1px 10px 1px #ddd;
  margin-right: 200px;
}

.el-form-item{
  width: 300px;
}

.btn {
  width: 120px;
}
.login-main {
  background-image: url("../assets/styles/images/login_bg.png");
  background-size: auto 70%;
  background-position: 15% center;
  background-repeat: no-repeat;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
}

.nav-header {
  background: #28313e;
  color: white;
  height: 65px;
  line-height: 65px;
  width: 100%;
  // background-image: url("../assets/images/common/logo.png") !important;
  background-position: 30px center;
  background-repeat: no-repeat;
  background-size: auto 50px;
}

.fullScreen {
  background: white;
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  height: 70px;
  background: #28313e;
  position: absolute;
  z-index: 1;
  line-height: 70px;
  font-size: 30px;
  color: #fff;
  padding-left: 100px;
  box-sizing: border-box;
}
.remember {
  text-align: left;
  color: red;
}

.remember_cb {
  color: #333;
}
</style>
