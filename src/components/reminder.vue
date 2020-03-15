<template>
  <span class="id-help"
        @mouseover="hoverFiced"
        @mouseout="hoverHide"
        :style="{backgroundImage: 'url(' + img + ')'}">
    <span class="id-text"
          @mouseover="textOver"
          @mouseout="textHide"
          :style="styleobj"
          v-if="txtShow">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'reminder',
  data () {
    return {
      img: require('../assets/section_help.png'),
      txtShow: false,
      styleobj: {
        left: 0,
        top: 0
      },
      textTime: null,
      isSetXY: true
    }
  },
  methods: {
    hoverFiced (el) {
      clearTimeout(this.textTime)
      if (this.isSetXY) {
        this.styleobj.left = `${el.x + 3}px`
        this.styleobj.top = `${el.y + 3}px`
      }
      this.txtShow = true
    },
    hoverHide () {
      clearTimeout(this.textTime) // 先清除计时器
      this.isSetXY = false
      this.textTime = setTimeout(() => {
        this.isSetXY = true
        this.txtShow = false
      }, 300)
    },
    textOver () {
      this.txtShow = true
      document.body.style.overflow = 'hidden'
      clearTimeout(this.textTime)
    },
    textHide () {
      this.txtShow = false
      this.isSetXY = true
      document.body.style.overflow = 'scroll'
      clearTimeout(this.textTime)
    }
  }
}
</script>

<style lang="less" scoped>
.id-help {
  position: absolute;
  background-size: 16px 16px;
  background-repeat: no-repeat;
  display: inline-block;
  width: 16px;
  height: 16px;
  right: -20px;
  bottom: 8px;
  cursor: pointer;
  > .id-text {
    width: 184px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.22);
    border-radius: 4px;
    position: fixed;
    z-index: 999;
    top: 16px;
    left: 16px;
    padding: 6px 10px;
    line-height: 20px;
    color: #333;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    text-align: left;
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
