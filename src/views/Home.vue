<template>
  <div class="center">
    <div class="headbar"><p>Pivot Studio</p><p class="p1"> 招新系统</p></div>
    <img src="../assets/pic.png" />
    <div 
    class="login" 
    :model="loginForm"
    ref="loginFormRef"
    >
      <div class="input">
        <input 
        type="text" 
        class="tel" 
        placeholder="电话" 
        v-model="loginForm.phone_number"
        prop="phone_number"/>
        <input 
        type="text" 
        class="code" 
        placeholder="验证码"
         v-model="loginForm.verification_code"
        prop="verification_code" />
        
        <button 
        class="btn1" 
        v-if="loginForm.showloginCode"
        @click="sendVerifyCode">发送验证码</button>
        <div  v-else  class="btn2">  再次发送（{{ loginForm.count }}S）</div>
      <div class="tips">
           {{message}}
      </div>
      </div>

      <button class="log" @click="signIn">登 入</button>
    </div>

    

    <div class="block">
      <el-pagination layout="prev, pager, next" :total="500"> </el-pagination>
    </div>
    <img src="../assets/logo2.png" class="logo" />
  </div>
</template>

<script>
import { sendVerifyCode, signIn } from "@/api/login.js";
export default {
  name: "Home",
  
  components: {},
  data() {
    return {
      loginForm:{
      phone_number: "",
      verification_code: "",
       timer: null,
      showloginCode: true, //判断展示‘获取验证码’或‘倒计时’
      count: "", //倒计时时间
      
      },
     
      message:"",
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      console.log(index, indexPath);
    },
    sendVerifyCode() {
      var formData = new FormData();
      formData.append("phone_number", this.loginForm.phone_number);
      // formData.append('verification_code', this.verification_code)
      
      var thai=this;
      sendVerifyCode(formData)
     
        .then((result) => {
          console.log(result);

          const TIME_COUNT = 60;
          if (!this.loginForm.timer) {
            this.loginForm.showloginCode = false;
            this.loginForm.count = TIME_COUNT;
            this.loginForm.timer = setInterval(() => {
              if (
                this.loginForm.count > 0 &&
                this.loginForm.count <= TIME_COUNT
              ) {
                this.loginForm.count -= 1;
              } else {
                this.loginForm.showloginCode = true;
                clearInterval(this.loginForm.timer);
                this.loginForm.timer = null;
              }
            }, 1000);
          }
        

        })
        .catch((err) => {
          console.log(err.response.data);
          console.log(this.loginForm.phone_number);
          if(this.loginForm.phone_number.toString().length!=11){
            this.message="*电话号码必须为11位";
            console.log(this.message);
          }
          else{
            this.message="*对不起，您没有登录权限";
             console.log(this.message);
          }
        });
    },
    signIn() {
      var formData = new FormData();
      formData.append("phone_number", this.loginForm.phone_number);
      formData.append("verification_code", this.loginForm.verification_code);
      signIn(formData)
        .then((res) => {
          window.localStorage.setItem("user", res.data.token);
          this.$router.push({
            name: "layout",
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          this.message='*'+err.response.data.msg;
             console.log(this.loginForm.message);
          
        });
    },
  },
};
</script>
<style scoped>
.center {
  position: relative;
  width: 1440px;
  margin: 0 auto;
  
}
@keyframes heart{
from{transform:translate(0,0)}
to{transform:translate(0,-12px)}
}
.headbar {
  position: absolute;
  width: 1440px;
  height: 107px;
  left: 0px;
  top: 0px;

  background: #2f2e41;
  border-radius: 0px 0px 12px 12px;
  

}
.headbar p {
  position: absolute;
  width: 566px;
  height: 64px;
  left: 422px;
  top: 21px;
font-style: italic;
  font-family: Segoe UI;
  
  font-weight: normal;
  font-size: 60px;
  line-height: 64px;
  /* identical to box height, or 107% */

  color: #ffffff;
}
.headbar .p1{
   font-style: normal;
   left:748px ;
   top:21px;
}
.center img {
  position: absolute;
  width: 777.7px;
  height: 613.29px;
  left: 52px;
  top: 276px;
}
.login {
  position: absolute;
  width: 450px;
  height: 296px;
  left: 866px;
  top: 310px;

  background: #e6e6e6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  animation: heart 1s ease-in-out 2.6s infinite alternate;
  animation-iteration-count :6;
}
.tel {
  position: absolute;
  width: 380px;
  height: 46px;
  left: 39px;
  top: 58px;
  outline: none;
 padding-left: 20px;
  background: #ffffff;
}
.code {
  position: absolute;
  outline: none;
  width: 186px;
  height: 45px;
  left: 39px;
  top: 114px;
padding-left: 20px;
  background: #ffffff;
}
.center .logo {
  position: absolute;
  width: 139px;
  height: 68px;
  left: 1276px;
  top: 935px;
}
.log {
  position: absolute;
  width: 380px;
  height: 45px;
  left: 39px;
  top: 213px;

  background: #3f3d56;
  font-family: Segoe UI;
font-style: normal;
font-weight: bold;
font-size: 28px;

/* or 229% */


color: #FFFFFF;
}
.btn1{
position: absolute;
width: 167px;
height: 45px;
left: 252px;
top: 118px;

background: #63B1FF;
border-radius: 20px;

font-family: Segoe UI;
font-style: normal;
font-weight: normal;
font-size: 18px;
line-height: 12px;
/* or 67% */

letter-spacing: 0.2em;


color: #FFFFFF;
}
.btn2{
  position: absolute;
width: 156.68px;
height: 45px;
left: 252px;
top: 114px;

background: #BDBDBD;
border-radius: 20px;

font-family: Segoe UI;
font-style: normal;
font-weight: normal;
font-size: 18px;
line-height: 42px;
 text-align: right;
/* or 86% */

letter-spacing: 0.095em;
text-transform: uppercase;

color: #FFFFFF;
}
.tips{
position: absolute;
height: 12px;
left: 39px;
top: 166px;

font-family: Segoe UI;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 12px;
/* identical to box height, or 86% */

letter-spacing: 0.2em;
text-transform: uppercase;

color: #F83939;
}
::-webkit-input-placeholder { /* Webkit browsers*/
   font-size: 14px;
 
letter-spacing: 0.2em;


color: #8D8D8D;
}
</style>
