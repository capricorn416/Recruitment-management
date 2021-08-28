<template>
  <div id="home">
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
import { getGroupCount, getCandidate, getDownloadLink } from '@/api/getInfo.js'

export default {
  name: 'LayoutIndex',
  components: {},
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
      time: ['2021', 'Autumn'],
      tableData:[]
    }
  },
  methods: {
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
    this.$store.dispatch('getGroup_num')
  }
}
</script>

<style scoped lang="less">
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
    position: absolute;
    z-index: 10000;
    top: 65px;
    left: 145px;
    width: 229px;
    height: 275px;
    background: #ffffff;
    border: 1px solid #757575;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    z-index: 10;
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
    margin-bottom: 80px;    
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
</style>
