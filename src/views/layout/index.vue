<template>
  <div>
      <div class="head-bar">
        <div class="head-bar_left">
          <img src="~assets/logo.png" width="40px">
          <!-- <span class="cascader">
            <el-cascader
            v-model="time"
            :options="options"
            separator = '-'
            @change="handleChange"></el-cascader>
          </span> -->
          <p class="head-bar_time">{{ time.join('-') }}</p>
          <el-menu mode="horizontal" @select="handleSelect">
            <el-submenu class="sub" index=1>
              <el-submenu :index="item.label" v-for="(item, i) in years" :key="i">
                <template slot="title">{{item.label}}</template>
                <el-menu-item :index="season[0]">Spring</el-menu-item>
                <el-menu-item :index="season[1]">Autumn</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </div>
        <div class="location">
          <el-button class="location-back" circle size="mini" :disabled="check===0" @click="backtoHome">
            <i class="el-icon-caret-left"></i>
          </el-button>
          <p> 首页 </p> <p v-if="check !== 0">{{ "-" + tip }}</p> 
        </div>
      </div>



      <div class="main">
          <h1>本次招新数据</h1>
          <!-- 所有候选人 -->
          <div v-if="check ===  0">
            <el-button v-for="(group, i) in groups" :key="i"
             class="group-button" :class="colors[i]" @click="getStage(i)">
              <h2>{{ group.title }}</h2>
              <p>{{ group.count }}</p>
            </el-button>
          </div>

          <!-- 切换到对应组别下的流程 -->
          <div v-if="check ===  1 && themes" class="procedure">
            <el-button v-for="(theme, index) in themes" :key="index" v-show="index<=max && index>=min"
             class="group-button" :class="colors[index]" @click="pickStage(index)" >
              <h2>{{ theme.theme }}</h2>
              <p>{{ theme.count }}</p>
            </el-button>
            <el-pagination
              layout="prev, next"
              class="procedure-switch"
              @next-click="nextItem"
              @prev-click="preItem"
              :page-count="themes.length-5"
            >
            </el-pagination>

            <div class="procedure-edit">
              <el-button class="procedure-edit-button" @click.native="isShow = !isShow">流程编辑</el-button>
              <div class="procedure-edit-frame" v-if="isShow">
                <el-scrollbar>
                <h1 class="edit-header">编辑考核流程</h1> 
                <el-button type="danger" icon="el-icon-close" circle size="mini" class="close-button" @click.native="isShow = false"></el-button>
                <ul class="edit-stage">
                  <li v-for="(theme, index) in themes" :key="index"> {{ theme.theme }} 
                    <i class="el-icon-remove-outline remove-button" @click="stageRemove(index)"></i>
                  </li>
                  <li><input type="text" v-model="stageInput">
                    <i class="el-icon-circle-plus-outline remove-button" @click="stageAdd"></i>
                  </li>
                </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>
          
          <!-- <div class="edit">
            <button class="edit-button" @click="isShow = !isShow">
              编辑流程
            </button>

            <div class="edit-frame" v-if="isShow">
              <h1></h1>
              <button @click="isShow = false">x</button>
              <ul>
                <li v-for="(stage, index) in stages" :key="index">{{ stage }}
                  <button>-</button>
                </li>
                <li> <input type="text"> <button @click="addStage">+</button> </li>
              </ul>
            </div>
          </div> -->

          <el-card class="table">
            <el-table
              :data="tableData"
              style="width: 100%">
               <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别" width="70">
                <template slot-scope="scope">
                  <v-icon v-if="scope.row.sex === 2" color="#17ABE3">mdi-gender-male</v-icon>
                  <v-icon v-else color="#F27BA4">mdi-gender-female</v-icon>
                </template>
              </el-table-column>
              <el-table-column
                prop="grade"
                label="年级" width="70" :formatter="gradeCheck">
              </el-table-column>
              <el-table-column
                prop="team"
                label="组别" width="80">
              </el-table-column>
              <el-table-column
                prop="stage"
                label="流程" width="70">
              </el-table-column>
              <el-table-column
                prop="major"
                label="专业"
                width="160">
              </el-table-column>
              <el-table-column
                prop="qq_number"
                label="QQ"
                width="120">
              </el-table-column>
              <el-table-column
                prop="phone_number"
                label="电话"
                width="120">
              </el-table-column>
              <el-table-column
                label="报名材料"
                prop="work_url">
                <template slot-scope="scope">
                   <v-icon class="download" @click="download(scope.row.work_url)">mdi-download</v-icon>
                </template>
               
              </el-table-column>
            </el-table>

            <div class="block">
              <p>{{ currentPage+'/'+ Math.ceil(total/10) }}</p>
              <el-pagination
                layout="prev, next"
                :total="total"
                :current-page="currentPage"
                @next-click="nextPage"
                @prev-click="prePage"
                >
              </el-pagination>
            </div>
          </el-card>
      </div>
  </div>
</template>

<script>
import { getGroupCount, getStageCount, getCandidate } from '@/api/getInfo.js'
import { addStage, deleteStage } from '@/api/edit.js'

export default {
  name: 'LayoutIndex',
  components: {},
  data() {
    return {
      inputable: false,
      total: 0,
      currentPage: 1,
      check: 0,
      max: 5,
      min: 0,
      tip: '',
      groupIndex: -1,
      stage: '',
      stageIndex: 0,
      stageInput: '',
      groups: [{
        title: '产品组',
        count: 0
      },
      {
        title: '运营组',
        count: 0
      },
      {
        title: '设计组',
        count: 0
      },
      {
        title: '前端组',
        count: 0
      },
      {
        title: '后端组',
        count: 0
      },
      {
        title: '移动组',
        count: 0
      }],
      themes: [],
      grades: ['大一','大二','大三','大四','研一','研二','研五'],
      colors: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'],
      time: ['2021', 'Autumn'],
      tableData:[],
      years: [{
        label: '2021'
      },
      {
        label: '2022'
      },
      {
        label: '2023'
      },
      {
        label: '2024'
      },
      {
        label: '2025'
      },
      {
        label: '2026'
      },
      {
        label: '2027'
      }],
      season: ['Spring', 'Autumn'],
      stages: ['简历', '笔试', '群面', '单面', '通过'],
      isShow: false
    }
  },
  methods: {
    // 切换时间
    handleSelect(index, indexPath) {
      this.currentPage = 1;
      this.check = 0;
      this.tip = '';
      this.groupIndex = -1;
      this.stage = '';
      this.stageIndex = 0;
      this.max = 5;
      this.min = 0;
      this.time[0] = indexPath[1];
      this.time[1] = indexPath[2];
      this.getGroupInfo();
      this.getCandidateInfo(this.groupIndex, 0, this.stage)
    },
    // 切换到对应组别下的流程
    getStage(i) {
      this.isShow = false;
      this.check = 1;
            this.max = 5;
      this.min = 0;
      // console.log(i);
      this.groupIndex = i+1;
      this.currentPage = 1;
      this.getCandidateInfo(this.groupIndex, 0, this.stage);
      
      this.getStageInfo(this.groupIndex);
      this.tip = this.groups[i].title; 
    },
    // 切换到对应流程
    pickStage(index) {
      console.log(index);
      this.currentPage = 1;
            this.max = 5;
      this.min = 0;
      this.stageIndex = index;
      this.stage = this.themes[this.stageIndex].theme;
      this.getCandidateInfo(this.groupIndex, 0, this.stage);
    },
    // 下载文件
    download(url) {
      // console.log(url);
      window.location.href = url;
    },
    openFrame() {
      document.querySelector('.procedure-edit-frame').style.display = "block"
    },
    closeFrame() {
      document.querySelector('.procedure-edit-frame').style.display = "none"
    },
    // 流程按钮的移动
    nextItem() {
      this.max++;
      this.min++;
    },
    preItem() {
      this.max--;
      this.min--;
    },
    // 切换候选人表单页码
    nextPage() {
      this.currentPage++;
      this.getCandidateInfo(this.groupIndex, 10*(this.currentPage-1), this.stage);
    },
    prePage() {
      this.currentPage--;
      this.getCandidateInfo(this.groupIndex, 10*(this.currentPage-1), this.stage);
    },
    // 返回首页导航
    backtoHome() {
            this.max = 5;
      this.min = 0;
      this.currentPage = 1;
      this.check = 0;
      this.tip = '';
      this.groupIndex = -1;
      this.stage = '';
      this.stageIndex = 0;
      this.getGroupInfo();
      this.getCandidateInfo(this.groupIndex, 0, this.stage);
    },
    // 获得候选人信息
    getCandidateInfo(groupIndex, pageNum, stageInfo) {
      let params = {
        "year": this.time[0],
        "season": this.time[1],
        "group": groupIndex,
        "page_size": 10,
        "page_num": pageNum,
        "stage": stageInfo
      }
      getCandidate(params).then((res) => {
        console.log('我是候选人');
        console.log(res.data.msg);
        this.tableData = res.data.msg.slice(0, res.data.msg.length-1);
        this.total = res.data.msg[res.data.msg.length-1].total;
      }).catch((err) => {
        console.log(err);
      });
    },
    // 渲染候选人表单中的年级
    gradeCheck(row, column) {
      return this.grades[row.grade-1]
    },
    // 获取各组别及人数
    getGroupInfo() {
      let time = {
        "year": this.time[0],
        "season": this.time[1] 
      }
      getGroupCount(time
      ).then((res) => {
        console.log('我是组别人数');
        console.log(res.data.msg)
        this.groups = res.data.msg
      }).catch((err) => {
        console.log(err.response.data)
      });
    },

    // 获取各阶段及人数
    getStageInfo(index) {
      let group = {
        "year": this.time[0],
        "season": this.time[1],
        "group": index
      }
      getStageCount(group).then((res) => {
        console.log('我是阶段人数');
        console.log(res.data.msg)
        this.themes = res.data.msg
      }).catch((err) => {
        console.log(err.response.data)
      });
    },
    stageRemove(index) {
      let data = {
        "year": this.time[0],
        "season": this.time[1],
        "group": this.groupIndex,
        "stage": this.themes[index].theme
      }
      console.log(data);
      deleteStage(data).then((res) => {
        console.log(res);
        this.getStageInfo(this.groupIndex);
        this.min = 0;
        this.max = 5;
      }).catch((err) => {
        console.log(err);
      });

    },
    stageAdd() {
      // console.log(this.stageInput)
      // console.log(this.groupIndex, this.stage);
      let data = {
        "year": this.time[0],
        "season": this.time[1],
        "group": this.groupIndex,
        "stage": this.stageInput
      }
      addStage(data).then((res) => {
        this.getStageInfo(this.groupIndex);
      }).catch((err) => {
        console.log(err);
      });
      this.stageInput = '';
    }
 
    
  },
  created() {
    this.getGroupInfo()
    this.getCandidateInfo(-1, 0, '')
  }
}
</script>

<style lang="less">
.head-bar {
  position: relative;
  height: 114px;
  width: 100%;
  border-bottom: 1px solid #8D8D8D;
  padding: 0 !important;
  .head-bar_left {
    display: flex;
    align-items: center;
  }

  img {
    margin-top: 8px;
    margin-left: 16px;
  }
  // .el-input {
  //   width: 210px;
  // }
  // .el-cascader {
  //   left: 10px;
  //   top: -10px;
  // }
  .head-bar_time {
    display: inline;
    border: none !important;
    font-family: Racing Sans One;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0.15px;
    color: #5E6366;
    margin-left: 16px;
    position: relative;
    top: 12px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
    padding: 0;
    position: relative;
    top: 6px;
  }
  .el-submenu__title {
    padding: 0 10px;
    height: 30px !important;
    line-height: 30px !important;
  }
  // .el-input__icon {
  //   color: #5E6366;
  // }
  .location {
    position: absolute;
    bottom: 3px;
    left: 35px;
    .location-back {
      border: none;
      background: none;
      font-size: 16px;
    }
    // .location-back:hover {
    //   color: rgba(0, 122, 255, 0.5);
    // }
    p {
      font-family: Segoe UI;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: #757575;
      display: inline;
      letter-spacing: 0.02em;
      margin-left: -5px;
    }
  }

}
.el-menu--popup {
  min-width: 58px !important;
  // height: 151px !important;
  .el-icon-arrow-right {
    display: none !important;
  }
}

.el-submenu .el-menu-item {
  min-width: 100px !important;
}
// .el-submenu__title:hover {
//   color: rgba(0, 122, 255, 0.12) !important;
// }
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  border-bottom: none !important;
}
.el-submenu.is-active .el-submenu__title {
  border-bottom: none !important;
}
// .el-cascader-menu {
//   min-width: 58px !important;
//   color: #000000 !important;
//   font-family: Roboto;
//   font-style: normal;
//   font-weight: normal;
//   font-size: 12px;
//   line-height: 14px;
// }

.main {
  position: relative;
  left: 350px;
  width: 990px;
  h1 {
    margin-top: 23px;
    font-family: Quicksand;
    font-style: normal;
    font-weight: 500;
    font-size: 34px;
    line-height: 42px;
    color: rgba(0, 0, 0, 0.87);
  }

  .group-button {
    width: 138px;
    height: 115px;
    background: #F7F9FA;
    border: none;
    border-radius: 16px;
    margin: 18px 21px 0 0 !important;
    padding: 0;
    h2 {
      font-family: Segoe UI;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 12px;
      letter-spacing: 0.2em;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 24px;
    }
    p {
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 48px;
      line-height: 56px;
      margin-top: 8px;
    }
  }
  .group-button:hover {
    background-color: rgba(0, 122, 255, 0.12);
  }
  .procedure {
    position: relative;
  }
  .procedure-switch {
    position: absolute;
    display: inline;
    right: -10px;
    top: 60px;
    .el-icon {
      font-size: 38px !important;
    }
    .btn-prev, .btn-next {
      width: 30px;
      height: 40px;
      min-width: 10px !important;
      background: none !important;
    }
    .btn-prev:hover {
      background: none
    }
    .btn-next:hover {
      background: none
    }
  }
  .procedure-edit {
    position: absolute;
    right: 0;
    width: 400px;
    
  }
  .procedure-edit-button {
    float: right;
    margin-top: 20px;
    margin-right: 40px;
    border: 2px solid #7fb6dd;
    color:  #0F85DA;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    // line-height: 16px;
    padding: 8px 18px;
    /* identical to box height, or 114% */
    letter-spacing: 1.25px;
  }
  .el-scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-y: scroll;
    overflow-x: hidden;
    width: 110%;
    height: 100%;
  }
  .procedure-edit-frame {
    // display: none;
    position: absolute;
    z-index: 10000;
    top: 65px;
    left: 145px;
    // top: 100px;
    width: 229px;
    height: 275px;
    background: #ffffff;
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
      margin: 10px 25px 0 0;
      font-size: 10px;
    }
    .remove-button {
      float: right;
      margin: -7px 30px 0 0;
      // border: 2px solid #757575;
      // font-size: 10px;
      color: #b1aeae;
      font-size: 30px;
      font-weight: 400;
    }
    .remove-button:hover {
      font-weight: 700;
      color: #757575;
      cursor: pointer;
    }
    .edit-stage {
      list-style: none;
      padding: 0;
      margin-left: 32px;
      margin-top: 27px;
      li {
        margin-bottom: 20px;
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
        padding-bottom: 3px;
      }
    }
  }
  .table {
    margin-top: 73px;    
    .download:hover {
      cursor: pointer;
    }
  }
  .el-table th>.cell {
    padding-left: 14px;
  }
  .block {
    float: right;
    margin: 20px 0;
    position: relative;
    p {
      position: absolute;
      right: 100px;
      top: 5px;
      font-family: Open Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
.btn-prev, .btn-next, .el-pager {
  padding: 0 !important;
}
.color1 p {
  color: red;
}
.color2 p {
  color: orange;
}
.color3 p {
  color: yellow;
}
.color4 p {
  color: green;
}
.color5 p {
  color: blue;
}
.color6 p {
  color: purple;
}
.edit-button {
  padding: 5px 18px;
  outline: none;
  border: 2px solid #0F85DA;
  border-radius: 5px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1.25px;
  color: #0F85DA;
}
</style>
