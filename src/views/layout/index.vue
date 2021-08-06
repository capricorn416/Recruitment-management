<template>
  <div>
    <el-container>
      <el-header height="114px" class="head-bar">
        <img src="~assets/logo.png" width="40px">
        <span class="cascader">
          <el-cascader
          v-model="value"
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
          <el-button v-for="(group, index) in groups" :key="index" class="group-button" :class="colors[index]">
            <h2>{{ group.name }}</h2>
            <p>{{ group.number }}</p>
          </el-button>

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
                  <v-icon v-if="scope.row.sex === '男'" color="#17ABE3">mdi-gender-male</v-icon>
                  <v-icon v-else color="#F27BA4">mdi-gender-female</v-icon>
                </template>
              </el-table-column>
              <el-table-column
                prop="grade"
                label="年级" width="70">
              </el-table-column>
              <el-table-column
                prop="group"
                label="组别" width="80">
              </el-table-column>
              <el-table-column
                prop="procedure"
                label="流程" width="70">
              </el-table-column>
              <el-table-column
                prop="major"
                label="专业"
                width="160">
              </el-table-column>
              <el-table-column
                prop="qq"
                label="QQ"
                width="120">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="电话"
                width="120">
              </el-table-column>
              <el-table-column
                label="报名材料">
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
export default {
  name: 'LayoutIndex',
  components: {},
  data() {
    return {
      groups: [{
        name: '产品组',
        number: 94
      },
      {
        name: '运营组',
        number: 94
      },
      {
        name: '设计组',
        number: 94
      },
      {
        name: '前端组',
        number: 94
      },
      {
        name: '后端组',
        number: 94
      },
      {
        name: '移动组',
        number: 94
      }],
      colors: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'],
      value: ['2020', 'Spring'],
      options: [{
        value: '2020',
        label: '2020',
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
        value: '2020',
        label: '2020',
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
        value: '2020',
        label: '2020',
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
        value: '2020',
        label: '2020',
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
        value: '2020',
        label: '2020',
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
        value: '2020',
        label: '2020',
        children: [{
          value: 'Spring',
          label: 'Spring',
        },
        {
          value: 'Autumn',
          label: 'Autumn'
        }]
      }
      ],
      tableData: [{
            name: '王小虎',
            sex: '男',
            qq: 1074042379,
            major: '生物信息',
            grade: '大二',
            group: '前端组',
            procedure: '笔试',
            phone: 13566381148
          },
          {
            name: '王小虎',
            sex: '女',
            qq: 1074042379,
            major: '生物信息11111111111111111111111',
            grade: '大二',
            group: '前端组',
            procedure: '笔试',
            phone: 13566381148
          }]
    }
  },
  methods: {
    handleChange() {
      console.log(this.value)
    }
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
