<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <!--
          <div class="brand-info">
            <h2 class="brand-info__text"></h2>
            <p class="brand-info__intro"></p>
          </div>
          -->
        <div class="hello">Hello，welcome back!</div>
        <div class="logo"><span></span> PMS管理系统</div>
        <div class="login-main">
          <!--<div class="login-title" style="font-size:30px;padding:10px 0 10px 0;">N9智能仓储系统</div>-->

          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon style="width:85%;margin: auto;position: absolute; padding: 25px 0;left: 0;right: 0;">
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="请输入用户名">
                <icon-svg slot="prefix"  name="geren" style="padding-top: 7px; width: 22px; height: 22px;"></icon-svg>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="请输入密码">
                <icon-svg slot="prefix"  name="jiesuo" style="padding-top: 7px; width: 22px; height: 22px;"></icon-svg>
              </el-input>
            </el-form-item>
           <!-- <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>-->

            <el-form-item>
              <el-button class="login-btn-submit" type="primary" style="background-color:#5f8ec5" @click="dataFormSubmit()" >登录</el-button>
            </el-form-item>

            <el-form-item style="margin-top:60px">
              <!--<el-li class="el-li&#45;&#45;title"> © 苏州科瑞恩自动化科技有限公司</el-li>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">科瑞恩	&bull; 数字化工厂</div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
           captcha: [
           { required: true, message: '验证码不能为空', trigger: 'blur' }
           ]

        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /** background-color: rgba(38, 50, 56, .6); **/
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login.png);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 10%;
      padding-top: 170px;
      .hello {
        text-align: center;
        font-size: 55px;
        color: #fff;
        font-family: "PingFang SC";
      }
      .logo {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #fff;
        margin: 30px 0;
        span {
          display: inline-block;
          width: 214px;
          height: 56px;
          background-image: url(~@/assets/img/logo.png);
          background-size: cover;
          margin-right: 20px;
        }
      }
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      text-align: center; /*让div内部文字居中*/
      // background-color: rgba(255,255,255,0.2);
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      /*padding: 80px 300px 100px 300px;*/
      width: 460px;
      height: 260px;
      margin: auto;
      position: absolute;
      //top: 0;
      left: 0;
      right: 0;
      //bottom: 0;
      //opacity: 0.2;
    }
    .login-title {
      font-weight:bold;
      /** color: #a40000; **/
      color: #fff;
      font-size: 36px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
    }

    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #fff;
    }

    .el-form-item.is-success .el-input__validateIcon {
      color: #2c2c47;
    }
    .footer{
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      line-height: 60px;
      width: 100%;
      color: #151950;
    }
  }
</style>
