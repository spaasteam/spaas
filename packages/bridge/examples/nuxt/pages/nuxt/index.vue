<template>
  <div class="container">
    <div class="store-container">
      <div>
        <h5>获取到的初始化数据</h5>
        <span>
          {{ token }}
        </span>
      </div>
      <div>
        <h5>监控数据的变化</h5>
        <span>
          {{ JSON.stringify(userInfo) }}
        </span>
      </div>
    </div>
    <div class="event-container">
      <div>
        <h5>触发主应用的方法</h5>
        <el-button @click="emitAlert">麻烦主应用弹一下窗口，说666</el-button>
      </div>
      <div>
        <h5>主应用输入进度了</h5>
        <el-slider v-model="progress"></el-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import Bridge from '../../../../src/index';

export default Vue.extend({
  data() {
    return {
      progress: 50,
      token: '',
      userInfo: null
    }
  },
  components: {
    Logo
  },
  created() {
    const token = Bridge.store.get('token');
    this.token = token;
    Bridge.event.on('setProgress', (val) => {
      this.progress = Number(val);
    })
  },
  mounted() {
    Bridge.store.on('userInfo', (userInfo) => {
      this.userInfo = userInfo
    })
  },
  methods: {
    emitAlert() {
      Bridge.event.emit('alert666', 666)
    }
  }
})
</script>

<style lang="less">
.container {
  margin: 0 auto;
  width:  calc(100vw - 330px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .store-container {
    flex: 1;
    >div {
      height: 40vh;
    }
  }

  .event-container {
    flex: 1;
    >div {
      height: 40vh;
    }
  }
}
</style>
