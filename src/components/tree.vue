<template>
  <div>
    <div v-for="item in data"
         :key="item.id"
         class="node">
      <div class="label">
        <span @click="toggole(item.id)"
          :class="[item.expand ? 'minus' : 'plus', !show(item) ? 'hidden': '']" ></span>
        <input type="radio" :id="item.id" name="deptName" @click="onSelect(item.id)" :checked="item.selected">
        <label :for="item.id">{{item.deptName}}</label>
      </div>
      <div class="rest" :class="{'hide' : !item.expand}" v-show="show(item)">
        <tree :data="item.children" @toggle="toggole" @onSelect="onSelect"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree',
  props: {
    data: {
      type: Array,
      required: true
    },
    defaultSelect: {
      type: String,
      default: ''
    }
  },
  methods: {
    toggole (id) {
      this.$emit('toggle', id)
    },
    show (item) {
      return !!item.children.length
    },
    onSelect (id) {
      this.$emit('onSelect', id)
    }
  }
}
</script>

<style lang="less" scoped>
.label {
  padding: 1rem 1rem;
  height: 22px;
  white-space: nowrap;
  cursor: pointer;
  &:after {
    content: '';
    display: inline-block;
    width: 1rem;
  }
}

.rest {
  margin-left: 1rem;
  &.hide {
    display: none;
  }
}

.plus::after {
  content: '+';
  position: relative;
  bottom: 1px;
}

.minus::after {
  content: '-';
}

.hidden {
  visibility: hidden;
}

.plus,
.minus {
  cursor: pointer;
  border: 1px solid;
  display: inline-block;
  margin-right: 4px;
}

.plus::after,
.minus::after {
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

label {
  cursor: pointer;
}
</style>
