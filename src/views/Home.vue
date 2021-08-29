<template>
  <div id="home">
    <headbar @SelectTime = "changeTime" :tip = "groupTitle"/>
    <div class="main">
          <h1>本次招新数据</h1>
          <!-- 所有候选人 -->
          <div>
            <el-button v-for="(group, i) in $store.state.group_sum" :key="i"
             class="group-button" :class="colors[i]" @click="getStage(i)">
              <h2>{{ group.title }}</h2>
              <p>{{ group.count }}</p>
            </el-button>
          </div>

          <el-card class="table">
            <el-table
              :data="tableData"
              style="width: 100%"
              >
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
                   <v-icon class="download" @click="downloadAll(scope.row.resume_key,scope.row.work_key)">mdi-download</v-icon>
                </template>
               
              </el-table-column>
            </el-table>

            <div class="block">
              <p>{{ currentPage+'/'+ totalPages }}</p>
              <el-pagination
                layout="prev, next"
                :total="total"
                :current-page="currentPage"
                @next-click="nextPage"
                @prev-click="prePage"
                :page-size="10"
                >
              </el-pagination>
            </div>
          </el-card>
    </div>
  </div>
</template>

<script>
import Headbar from './Headbar/index.vue'
import { getGroupCount, getCandidate, getDownloadLink } from '@/api/getInfo.js'

export default {
  name: 'LayoutIndex',
  components: {
    Headbar
  },
  data() {
    return {
      checkList: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
      groupIndex: -1,
      stage: '',
      groups: [],
      grades: ['大一','大二','大三','大四','研一','研二','研三','其他'],
      colors: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'],
      time: this.$store.state.time,
      tableData:[]
    }
  },
  methods: {
    changeTime() {
      this.time = this.$store.state.time
      this.$store.dispatch('getGroup_num', {
        "year": this.time[0],
        "season": this.time[1]
      })
      this.getCandidateInfo(-1, 0, "")
    },
    getStage(i) {
      this.$router.push({path: '/group', query: { groupIndex: i+1 }})
    },
    async downloadAll(key1,key2){
      console.log(key1,key2)
      if (key1) {
        await this.download(key1)
      }
      if (key2) {
        await this.download(key2)
      }
    },
    // 下载文件
    async download(key) {
      const url = await getDownloadLink(key);
      // console.log(url);
      // 不要直接给href赋值，正确做法是开个新tab下载
      window.open(url)
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
        // console.log('我是候选人');
        if(res.data.msg.length != 0) {
          // console.log(res.data.msg);
          this.tableData = res.data.msg.slice(0, res.data.msg.length-1);
          this.total = res.data.msg[res.data.msg.length-1].total;   
        }else {
          this.tableData = [];
          this.total = 0;
        }
          this.totalPages = Math.ceil(this.total/10);
      }).catch((err) => {
        console.log(err);
      });
    },
    // 渲染候选人表单中的年级
    gradeCheck(row, column) {
      return this.grades[row.grade-1]
    }
  },
  created() {
    this.getCandidateInfo(-1, 0, '');
  },
  mounted() {
    this.$store.dispatch('getGroup_num', {
      "year": this.time[0],
      "season": this.time[1]
    })
  },
  computed: {
    groupTitle() {
      return ""
    }
  }
}
</script>

<style scoped lang="less">
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
  .table {
    margin-top: 73px;
    margin-bottom: 80px;    
    .download:hover {
      cursor: pointer;
    }
  }
  .el-table th>.cell {
    padding-left: 14px;
  }
}
</style>
