<template>
  <div>
      <div class="head-bar">
        <div class="head-bar_left">
          <img src="~assets/logo.png" width="40px">
          <p class="head-bar_time">{{ this.$store.state.time.join('-') }}</p>
          <div class="drop">
          <el-button type="text" icon="el-icon-caret-bottom" class="drop-btn" @mouseover.native="menuSeen = true"></el-button>
            <div class="drop-menu" v-if="menuSeen" @mouseleave="menuSeen = false">
              <ul class="submenu1">
                <li v-for="(year, i) in years" :key="i"
                @mouseover="RollTime(i)"
                :class="i === minY || i === maxY ? 'navi': null">
                  <div v-if="i>=minY && i<=maxY">{{ year }}</div>
                  <ul class="submenu2">
                    <li v-for="(season, index) in seasons" :key="index" @click="ChangeTime(i,index)" >{{ season }}</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="location">
          <el-button class="location-back" circle size="mini" 
          @click="backtoHome"
          :disabled="this.$route.path === '/'">
            <i class="el-icon-caret-left"></i>
          </el-button>
          <p> 首页 {{ tip }}</p>
        </div>
      </div>
      
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  data() {
    return {
      menuSeen: false,
      time: this.$store.state.time,
      tableData:[],
      years: ['-','2021','2022','2023','2024','2025','2026','2027','2028','2029','-'],
      seasons: ['Spring','Autumn'],
      minY: 0,
      maxY: 5
    }
  },
  props: {
    tip: String
  },
  methods: {
    // 下拉菜单的滚动
    RollTime(i) {
      if(i === this.minY ) {
        if(this.minY >= 1) {
          setTimeout(()=> {
            this.minY--;
            this.maxY--;
          },700)
        }
      } else if(i === this.maxY) {
        if(this.maxY <= this.years.length-2) {
          setTimeout(()=> {
            this.minY++;
            this.maxY++;
          },700)
        }
      }
    },
    // 切换时间
    ChangeTime(i, index) {
      this.time[0] = this.years[i];
      this.time[1] = this.seasons[index];
      this.$store.commit('updateTime', this.time)
      this.$emit('SelectTime')
      this.menuSeen = false
    },
    // 返回首页导航
    backtoHome() {
      if(this.$route.path !== '/') {
        this.$router.push({path: '/'});
      }
    },
  }
}
</script>

<style lang="less" scoped>
.head-bar_time, .location {
  cursor: default;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.drop {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.head-bar {
  position: relative;
  height: 114px;
  width: 100%;
  border-bottom: 1px solid rgb(227, 227, 227);
  padding: 0 !important;
  .head-bar_left {
    display: flex;
    align-items: center;
  }

  img {
    margin-top: 8px;
    margin-left: 16px;
  }
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
  .location {
    position: absolute;
    bottom: 3px;
    left: 35px;
    .location-back {
      border: none;
      background: none;
      font-size: 16px;
    }
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
.drop {
  position: relative;
  margin-left: 10px;
  z-index: 1000;
  .drop-btn {
    padding: 0 !important;
    margin-top: 15px !important;
    color: #9a9b9c !important;

  }
  .drop-btn:hover {
    transform: rotate(180deg);
  }
  .drop-menu {
    position: absolute;
    ul {
      list-style: none;
      background: #fff;
      width: 58px;
      padding: 0 !important;
      text-align: center;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
    }
    li {
      cursor: pointer;
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 25px;
      color: #000000;
    }
    li:hover {
      background-color: #ECF0FF;
    }
    .submenu2 {
      display: none;
      z-index: 10000;
      position: absolute;
      margin-left: 55px;
      margin-top: -20px;
      background: #fff;
      width: 102px;
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    }
    .submenu1 li:hover .submenu2 {
      display: block;
    }
    .navi {
      font-size: 12px;
      transform: scale(.9);
      color: #6E7073;
      cursor: default;
      background: #fff !important;
    }
    .navi .submenu2 {
      display: none !important;
    }
  }
}
</style>