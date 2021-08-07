<template>
  <div>
    <el-container>
      <el-header height="114px" class="head-bar">
        <img src="~assets/logo.png" width="40px">
        <span class="cascader">
          <el-cascader
          v-model="time"
          :options="options"
          separator = '-'
          @change="handleChange"></el-cascader>
        </span>
      </el-header>

      <el-container>
        <el-aside width="350px">
        </el-aside>

        <el-main>
          <h1>本次招新数据</h1>
          <!-- 所有候选人 -->
          <div v-if="check ===  0">
            <el-button v-for="(group, index) in groups" :key="index"
             class="group-button" :class="colors[index]" @click="getStage(index)">
              <h2>{{ group.title }}</h2>
              <p>{{ group.count }}</p>
            </el-button>
          </div>

          <!-- 切换到对应组别下的流程 -->
          <div v-if="check ===  1">
            <el-button v-for="(theme, index) in themes" :key="index"
             class="group-button" :class="colors[index]">
              <h2>{{ theme.theme }}</h2>
              <p>{{ theme.count }}</p>
            </el-button>
          </div>
          <!-- <el-button>流程编辑</el-button> -->

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
      check: 0,
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
      options: [{
        value: '2021',
        label: '2021',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      },
      {
        value: '2022',
        label: '2022',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      },
      {
        value: '2023',
        label: '2023',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      },
      {
        value: '2024',
        label: '2024',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      },
      {
        value: '2025',
        label: '2025',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      },
      {
        value: '2026',
        label: '2026',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      }
      ]
    }
  },
  methods: {
    // 切换时间
    handleChange() {
      this.getGroupInfo();
      this.getCandidateInfo(-1, "")
    },
    // 切换组别
    getStage(index) {
      this.check = 1;
      index ++; 
      this.getStageInfo(index);
      this.getCandidateInfo(index, "")
    },

    // 获取各组别及人数
    getGroupInfo() {
      let time = {
        "year": this.time[0],
        "season": this.time[1] 
      }
      getGroupCount(time
      ).then((res) => {
        // console.log(res.data.msg)
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
        // console.log(res.data.msg)
        this.themes = res.data.msg
      }).catch((err) => {
        console.log(err.response.data)
      });
    },

    // 获得候选人信息
    getCandidateInfo(groupIndex, stageInfo) {
      let params = {
        "year": this.time[0],
        "season": this.time[1],
        "group": groupIndex,
        "page_size": 10,
        "page_num": 0,
        "stage": stageInfo
      }
      getCandidate(params).then((res) => {
        // console.log(res.data.msg);
        this.tableData = res.data.msg
      }).catch((err) => {
        console.log(err.response.data);
      });
    },

    // 渲染年级
    gradeCheck(row, column) {
      return this.grades[row.grade-1]
    }
  },
  created() {
    this.getGroupInfo()
    this.getCandidateInfo(-1, "")
  }
}
</script>

<style lang="less">
.head-bar {
  border-bottom: 1px solid #8D8D8D;
  padding: 0 !important;
  img {
    margin-top: 12px;
    margin-left: 16px;
  }
  .el-input {
    width: 210px;
  }
  .el-cascader {
    left: 10px;
    top: -10px;
  }
  .el-input__inner {
    border: none !important;
    font-family: Racing Sans One;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0.15px;
    color: #5E6366;
  }
  .el-input__icon {
    color: #5E6366;
  }
}

.el-cascader-menu {
  min-width: 58px !important;
  color: #000000 !important;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
}
.el-icon-arrow-right {
  display: none !important;
}

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
  .table {
    margin-top: 69px;    
    .download:hover {
      cursor: pointer;
    }
  }
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
