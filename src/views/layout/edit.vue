<template>
  <div id="procedure-edit">
    <h1 class="edit-header">编辑考核流程</h1> 
    <el-button type="danger" icon="el-icon-close" circle size="mini" class="close-button"></el-button>
    <ul class="edit-stage">
      <li v-for="(stage, index) in stages" :key="index"> {{ stage }} 
        <el-button icon="el-icon-minus" circle size="mini" class="remove-button" plain></el-button>
      </li>
      <li><input type="text">
        <el-button icon="el-icon-plus" circle size="mini" class="remove-button" plain></el-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      stages: ['简历', '笔试', '群面', '单面', '通过'],
    }  
  },
  methods: {
  },
}
</script>

<style scoped lang="less">
#procedure-edit {
  width: 229px;
  // height: 276px;
  background: #FFFFFF;
  border: 1px solid #757575;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  .edit-header {
    display: inline-block;
    font-family: Open Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 16px;
    color: #3F3D56;
    margin-top: 14px;
    margin-left: 32px;
    
  }
  .close-button {
    float: right;
    margin: 10px 10px 0 0;
  }
  .remove-button {
    float: right;
    margin: -7px 20px 0 0;
  }
  .edit-stage {
    list-style: none;
    padding: 0;
    margin-left: 32px;
    margin-top: 27px;
    li {
      margin-bottom: 22px;
      font-family: Open Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 16px;
      color: #2C2C2C;
    }
    input {
      width: 79px;
      border-bottom: 1px solid #000;
      outline: none;
      padding-bottom: 5px;
    }
  }
}
</style>
