<template>
  <div id="group">
    <Headbar @SelectTime="changeTime" :tip="groupTitle" />
    <div class="main">
      <h1>本次招新数据</h1>
      <div class="procedure">
        <div class="procedure-buttons">
          <el-button
            class="group-button"
            :class="stageIndex === -1 ? 'selected' : null"
            @click="backtoGroupHome"
          >
            <h2>全部</h2>
            <p>{{ $store.state.group_sum[groupIndex - 1].count }}</p>
          </el-button>
          <div v-if="themes" style="display: inline;">
            <el-button
              v-for="(theme, index) in themes"
              :key="index"
              v-show="index <= max && index >= min"
              class="group-button"
              :class="[colors[index], index === stageIndex ? 'selected' : null]"
              @click="pickStage(index)"
            >
              <h2>{{ theme.theme }}</h2>
              <p>{{ theme.count }}</p>
            </el-button>
            <el-pagination
              v-if="themes.length > 5"
              layout="prev, next"
              class="procedure-switch"
              @next-click="nextItem"
              @prev-click="preItem"
              :page-count="themes.length - 4"
              :current-page="currentButton"
            >
            </el-pagination>
          </div>
        </div>
        <div class="procedure-edit">
          <el-button
            class="procedure-edit-button"
            @click.native="isShow = !isShow"
            >流程编辑</el-button
          >
          <div class="procedure-edit-frame" v-if="isShow">
            <el-scrollbar>
              <h1 class="edit-header">编辑考核流程</h1>
              <el-button
                type="danger"
                icon="el-icon-close"
                circle
                size="mini"
                class="close-button"
                @click.native="isShow = false"
              ></el-button>
              <ul class="edit-stage">
                <li v-for="(theme, index) in themes" :key="index">
                  {{ theme.theme }}
                  <i
                    class="el-icon-remove-outline remove-button"
                    v-show="index > 1"
                    @click="stageRemove(index)"
                  ></i>
                </li>
                <li>
                  <input type="text" v-model="stageInput" />
                  <i
                    class="el-icon-circle-plus-outline remove-button"
                    @click="stageAdd"
                  ></i>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <el-card class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="sex" label="性别" width="70">
            <template slot-scope="scope">
              <v-icon v-if="scope.row.sex === 2" color="#17ABE3"
                >mdi-gender-male</v-icon
              >
              <v-icon v-else color="#F27BA4">mdi-gender-female</v-icon>
            </template>
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级"
            width="70"
            :formatter="gradeCheck"
          >
          </el-table-column>
          <el-table-column prop="team" label="组别" width="80">
          </el-table-column>
          <el-table-column prop="stage" label="流程" width="70">
          </el-table-column>
          <el-table-column prop="major" label="专业" width="160">
          </el-table-column>
          <el-table-column prop="qq_number" label="QQ" width="120">
          </el-table-column>
          <el-table-column prop="phone_number" label="电话" width="120">
          </el-table-column>
          <el-table-column label="报名材料" prop="work_url">
            <template slot-scope="scope">
              <v-icon
                class="download"
                @click="downloadAll(scope.row.resume_key, scope.row.work_key)"
                >mdi-download</v-icon
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <p>{{ currentPage + "/" + totalPages }}</p>
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

    <div class="left">
      <el-button
        icon="el-icon-circle-plus"
        class="new-button"
        :disabled="!newState"
        @click="popUp = true"
        >更新状态</el-button
      >
      <el-card class="new-card" v-if="popUp">
        <el-radio-group v-model="radio" @change="handleChange">
          <el-radio label="pass">下一阶段</el-radio>
          <el-radio label="disuse">淘汰</el-radio>
          <el-radio label="finalpass">最终通过</el-radio>
        </el-radio-group>
      </el-card>

      <div v-if="textUp">
        <el-card class="new-text">
          <div slot="header">
            请调整短信内容
          </div>
          <div v-if="radio === 'pass'">
            <div v-html="text1" class="text1"></div>
            <input type="text" class="qq-input" v-model="qq_input" />
            <div v-html="text2"></div>
          </div>
          <div v-else>
            <div v-html="text.replace('{qq_number}', '996295524')"></div>
          </div>
        </el-card>
        <el-button class="new-submit" @click="centerDialogVisible = true"
          >发送</el-button
        >
        <el-dialog
          title="短信发送确认"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
        >
          <span>
            <p>
              您确认向以下{{ candidateSelected.length }}位同学：<br />
              {{ candidateSelected_name.join(", ") }}<br />
              发送信息吗？
            </p>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false" class="quit_button"
              >取消</el-button
            >
            <el-button
              @click="submit"
              class="submit_button"
              :loading="loading"
              :disabled="!submitable"
              >确定发送</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Headbar from "./Headbar/index.vue";
import { getStageCount, getCandidate, getDownloadLink } from "@/api/getInfo.js";
import {
  addStage,
  deleteStage,
  getTemplate,
  pass,
  finalPass,
  disuse,
} from "@/api/edit.js";

export default {
  name: "LayoutIndex",
  components: {
    Headbar,
  },
  data() {
    return {
      currentButton: 1,
      radio: "",
      checkList: [],
      inputable: false,
      newState: false,
      centerDialogVisible: false,
      total: 0,
      currentPage: 1,
      totalPages: 0,
      max: 4,
      min: 0,
      tip: "",
      groupIndex: parseInt(this.$route.query.groupIndex),
      stage: "",
      stageIndex: -1,
      stageInput: "",
      themes: [],
      grades: ["大一", "大二", "大三", "大四", "研一", "研二", "研三", "其他"],
      colors: ["color1", "color2", "color3", "color4", "color5", "color6"],
      time: this.$store.state.time,
      tableData: [],
      isShow: false,
      popUp: false,
      textUp: false,
      candidateSelected: [],
      candidateSelected_name: [],
      id: [],
      text: "",
      qq_input: "",
      loading: false,
      submitable: true,
    };
  },
  methods: {
    changeTime() {
      this.time = this.$store.state.time;
      this.$store.dispatch("getGroup_num", {
        year: this.time[0],
        season: this.time[1],
      });
      this.getCandidateInfo(this.groupIndex, 0, "");
      this.getStageInfo(this.groupIndex);
      this.stageIndex = -1;
    },
    async downloadAll(key1, key2) {
      console.log(key1, key2);
      if (key1) {
        await this.download(key1);
      }
      if (key2) {
        await this.download(key2);
      }
    },
    // 下载文件
    async download(key) {
      const url = await getDownloadLink(key);
      // console.log(url);
      // 不要直接给href赋值，正确做法是开个新tab下载
      window.open(url);
    },
    // 切换候选人表单页码
    nextPage() {
      this.currentPage++;
      this.getCandidateInfo(
        this.groupIndex,
        10 * (this.currentPage - 1),
        this.stage
      );
    },
    prePage() {
      this.currentPage--;
      this.getCandidateInfo(
        this.groupIndex,
        10 * (this.currentPage - 1),
        this.stage
      );
    },
    // 获取各阶段及人数
    getStageInfo(index) {
      let group = {
        year: this.time[0],
        season: this.time[1],
        group: index,
      };
      getStageCount(group)
        .then((res) => {
          this.themes = res.data.msg;
          // console.log(this.themes);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    // 获得候选人信息
    getCandidateInfo(groupIndex, pageNum, stageInfo) {
      let params = {
        year: this.time[0],
        season: this.time[1],
        group: groupIndex,
        page_size: 10,
        page_num: pageNum,
        stage: stageInfo,
      };
      getCandidate(params)
        .then((res) => {
          if (res.data.msg.length != 0) {
            this.tableData = res.data.msg.slice(0, res.data.msg.length - 1);
            this.total = res.data.msg[res.data.msg.length - 1].total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
          this.totalPages = Math.ceil(this.total / 10);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 渲染候选人表单中的年级
    gradeCheck(row, column) {
      return this.grades[row.grade - 1];
    },
    // 删除流程
    stageRemove(index) {
      let data = {
        year: this.time[0],
        season: this.time[1],
        group: this.groupIndex,
        stage: this.themes[index].theme,
      };
      deleteStage(data)
        .then((res) => {
          this.getStageInfo(this.groupIndex);
          this.min = 0;
          this.max = 4;
          this.currentButton = 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    stageAdd() {
      let data = {
        year: this.time[0],
        season: this.time[1],
        group: this.groupIndex,
        stage: this.stageInput,
      };
      addStage(data)
        .then((res) => {
          this.getStageInfo(this.groupIndex);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
      this.stageInput = "";
    },
    // 流程按钮的移动
    nextItem() {
      this.max++;
      this.min++;
      this.currentButton++;
    },
    preItem() {
      this.max--;
      this.min--;
      this.currentButton--;
    },
    // 切换到对应流程
    pickStage(index) {
      this.stageIndex = index;
      this.currentPage = 1;
      this.qq_input = "";
      this.stage = this.themes[this.stageIndex].theme;
      this.getCandidateInfo(this.groupIndex, 0, this.stage);
    },
    // 返回全部
    backtoGroupHome() {
      this.stage = "";
      this.currentPage = 1;
      this.stageIndex = -1;
      this.getCandidateInfo(this.groupIndex, 0, "");
    },
    // 选中报名者
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.newState = false;
        this.textUp = false;
        this.popUp = false;
        this.radio = "";
      } else {
        this.newState = true;
        this.candidateSelected = val;
        let id = [];
        let name = [];
        this.candidateSelected.forEach((item) => {
          id.push(item.id);
          name.push(item.name);
        });
        this.candidateSelected_id = id;
        this.candidateSelected_name = name;
      }
    },
    // 获得短信模板
    handleChange() {
      this.textUp = true;
      getTemplate({
        template_id: this.radio,
      })
        .then((res) => {
          this.text = res.data.msg.replace(
            "{team}",
            this.$store.state.group_sum[this.groupIndex - 1].title
          );
          if (this.stageIndex < this.themes.length && this.stageIndex > 1) {
            this.text = this.text.replace(
              "{stage}",
              this.themes[this.stageIndex + 1].theme
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 发送短信
    submit() {
      this.loading = true;
      this.submitable = false;
      switch (this.radio) {
        case "pass":
          pass({
            candidates_id: this.candidateSelected_id,
            qq_number: this.qq_input,
          })
            .then((res) => {
              alert("短信发送成功！");
              this.loading = false;
              this.submitable = true;
              this.centerDialogVisible = false;
              this.currentPage = 1;
              this.getStageInfo(this.groupIndex);
              this.getCandidateInfo(this.groupIndex, 0, this.stage);
            })
            .catch((err) => {
              alert("短信发送失败！" + err.response.data.msg);
              this.loading = false;
              this.submitable = true;
            });
          break;
        case "disuse":
          disuse({
            candidates_id: this.candidateSelected_id,
          })
            .then((res) => {
              alert("短信发送成功！");
              this.loading = false;
              this.submitable = true;
              this.centerDialogVisible = false;
              this.currentPage = 1;
              this.qq_input = "";
              this.getStageInfo(this.groupIndex);
              this.getCandidateInfo(this.groupIndex, 0, this.stage);
            })
            .catch((err) => {
              alert("短信发送失败！" + err.response.data.msg);
              this.loading = false;
              this.submitable = true;
            });
          break;
        case "finalpass":
          finalPass({
            candidates_id: this.candidateSelected_id,
          })
            .then((res) => {
              alert("短信发送成功！");
              this.loading = false;
              this.submitable = true;
              this.centerDialogVisible = false;
              this.currentPage = 1;
              this.getStageInfo(this.groupIndex);
              this.getCandidateInfo(this.groupIndex, 0, this.stage);
            })
            .catch((err) => {
              alert("短信发送失败！" + err.response.data.msg);
              this.loading = false;
              this.submitable = true;
            });
          break;
      }
    },
  },
  created() {
    this.getCandidateInfo(this.groupIndex, 0, "");
    this.getStageInfo(this.groupIndex);
  },
  mounted() {
    this.$store.dispatch("getGroup_num", {
      year: this.time[0],
      season: this.time[1],
    });
  },
  computed: {
    text1() {
      return this.text.split("{qq_number}")[0];
    },
    text2() {
      return this.text.split("{qq_number}")[1];
    },
    groupTitle() {
      return "- " + this.$store.state.group_sum[this.groupIndex - 1].title;
    },
  },
};
</script>

<style lang="less">
.head-bar_time,
.location,
.main h1 {
  cursor: default;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
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
    background: #f7f9fa;
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
    .btn-prev,
    .btn-next {
      width: 30px;
      height: 40px;
      min-width: 10px !important;
      background: none !important;
    }
    .btn-prev:hover {
      background: none;
    }
    .btn-next:hover {
      background: none;
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
    color: #0f85da;
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
      color: #3f3d56;
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
        color: #2c2c2c;
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
  .el-table th > .cell {
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
.btn-prev,
.btn-next,
.el-pager {
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
  border: 2px solid #0f85da;
  border-radius: 5px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1.25px;
  color: #0f85da;
}
.el-submenu__title:hover {
  color: #ecf0ff !important;
}
.el-menu-item:hover {
  color: #ecf0ff !important;
}

.left {
  position: absolute;
  left: 0;
  top: 115px;
  width: 300px;
  .new-button {
    margin-top: 98px;
    margin-left: 90px;
    border-radius: 20px;
    width: 173px;
    height: 45px;
    font-family: Segoe UI;
    font-weight: normal;
    font-size: 20px;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    color: #0f85da;
    border: 0.5px solid #0f85da;
    .el-icon-circle-plus {
      margin-right: 10px;
    }
  }
  button.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
  }
  .new-card {
    margin-left: 29px;
    margin-top: 73px;
    .el-card__body {
      padding: 15px;
      padding-right: 10px;
    }
    .el-radio {
      margin-right: 15px;
    }
    .el-radio__inner {
      border-radius: 0;
    }
    .el-radio__label {
      padding-left: 5px;
    }
  }
  .new-text {
    position: relative;
    margin-top: 41px;
    margin-left: 22px;
    .el-card__header {
      padding: 0;
      text-align: center;
      height: 38px;
      background: #63b1ff;
      line-height: 38px;
      font-family: Segoe UI;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 0.2em;
      color: #ffffff;
    }
  }
  .new-submit {
    margin-left: 175px;
    margin-top: 37px;
    width: 125px;
    height: 45px;
    background: #63b1ff;
    border: 0.5px solid #0f85da;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    font-family: Segoe UI;
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 0.265em;
    color: #ffffff;
    padding: 0;
  }
  .el-dialog__header {
    background: #2f9bea;
    padding: 0;
    height: 51px;
    .el-dialog__title {
      line-height: 51px;
      font-family: Segoe UI;
      font-style: normal;
      font-weight: bold;
      font-size: 26px;
      letter-spacing: 0.2em;
      color: #ffffff;
    }
    .el-dialog__headerbtn {
      top: 15px;
      .el-dialog__close {
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
  .qq-input {
    outline: none;
    border-bottom: 1px solid #888;
    // padding: 2px;
    // margin-bottom: 5px;
    width: 95px;
    position: absolute;
    right: 25px;
    bottom: 69px;
    font-size: 15px;
  }
  .quit_button,
  .submit_button {
    width: 102px;
    margin: 0px 12px;
    font-size: 16px;
    padding: 10px 0;
    font-family: Segoe UI;
  }
  .submit_button {
    color: #0f85da;
    border: 1px solid #0f85da;
  }
}
.selected {
  background: rgba(0, 153, 250, 0.152344) !important;
}
</style>
