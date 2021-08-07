<template>
  <div>
    <button @click="sendVerifyCode">获取验证码</button>
    <button @click="signIn">登录</button>
  </div>
</template>

<script>
import { sendVerifyCode, signIn } from '@/api/login.js'
  export default {
    name: 'Home',

    components: {
    },
    data() {
      return {
        phone_number: 18357422510,
        verification_code: '080703'
      }
    },
    methods: {
      sendVerifyCode() {
        var formData = new FormData();
        formData.append('phone_number', this.phone_number);
        // formData.append('verification_code', this.verification_code)
        sendVerifyCode(formData).then((result) => {
          console.log(result)
        }).catch((err) => {
          console.log(err.response.data)
        });
      },
      signIn() {
        var formData = new FormData();
        formData.append('phone_number', this.phone_number);
        formData.append('verification_code', this.verification_code);
        signIn(formData).then((res) => {
          window.localStorage.setItem('user', res.data.token);
          this.$router.push({
            name: 'layout'
          })
        }).catch((err) => {
          console.log(err.response.data)
        });
      }
    }
  }
</script>
