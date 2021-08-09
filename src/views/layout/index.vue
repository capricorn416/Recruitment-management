<template>
  <div>
    <el-container>
      <el-header height="114px" class="head-bar">
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
      </el-header>

      <el-container>
        <el-aside width="300px">
        </el-aside>

        <el-main>
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
             class="group-button" :class="colors[index]" >
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
            <el-button class="procedure-edit">流程编辑</el-button>
          </div>
          

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
                <v-icon class="download">mdi-download</v-icon>
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getGroupCount, getStageCount, getCandidate } from '@/api/getInfo.js'

export default {
  name: 'LayoutIndex',
  components: {},
  data() {
    return {
      total: 0,
      currentPage: 1,
      check: 0,
      max: 5,
      min: 0,
      tip: '',
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
      season: ['Spring', 'Autumn']
    }
  },
  methods: {
    // 切换时间
    handleSelect(index, indexPath) {
      this.time[0] = indexPath[1];
      this.time[1] = indexPath[2];
      this.getGroupInfo();
      this.getCandidateInfo(-1, 0, "")
    },
    // 切换到对应组别下的流程
    getStage(i) {
      console.log(i);
      this.getCandidateInfo(i+1, 0, '');
      this.check = 1;
      this.getStageInfo(i+1);
      this.tip = this.groups[i].title; 
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
    // 返回首页导航
    backtoHome() {
      this.check = 0;
      this.getGroupInfo();
      this.getCandidateInfo(-1, 0, "");
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
    
  },
  created() {
    this.getGroupInfo()
    this.getCandidateInfo(-1, 0, "")
  }
}
</script>

<style lang="less">
.head-bar {
  position: relative;
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

.el-main {
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
  button:hover {
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
    bottom: -60px;
    right: 30px;
    border-color: #0F85DA;
    color: #0F85DA;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    /* identical to box height, or 114% */

    letter-spacing: 1.25px;
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

</style>
