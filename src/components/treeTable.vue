<template>
  <div class="treeTable">
    <div class="tree">
      <div class="thead">
        <div class="tname">部门名称</div>
      </div>
      <div class="tree-body">
        <tree :data="fmtTreeData(treeData)"
              @toggle="toggle"
              @onSelect="onSelect" />
      </div>
    </div>
    <div class="main">
      <table width="100%">
        <tr>
          <th class="tname"
              v-for="item in tableTitles"
              :key="item.key">{{item.txt}}</th>
        </tr>
        <tr v-for="idx in tableData.length"
            :key="idx">
          <td class="tcol"
              :class="classPicker(obj.key, tableData[idx - 1])"
              v-for="obj in tableTitles"
              :key="obj.key">
            {{tableData[idx - 1] ? tableData[idx - 1][obj.key] : '-'}}
          </td>
        </tr>
      </table>
    </div>
    <div class="action">
      <div class="thead">
        <div class="tname">操作</div>
      </div>
      <div class="tboday">
        <div class="trow"
             v-for="idx in tableData.length"
             :key="idx">
          <div class="action tcol">
            <slot name="action"
                  :row="through(tableData[idx - 1])"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tree from './tree'
import mock from '../mock/api'

export default {
  name: 'treeTable',
  components: { tree },
  props: {
    titles: {
      type: Array,
      required: true
    },
    initTableData: {
      type: Array,
      required: true
    },
    initTreeData: {
      type: Array,
      required: true
    },
    currentData: {
      type: Object,
      required: true
    },
    updateTreeDataAfterEdit: {
      type: Array,
      required: true
    }
  },
  computed: {
    tableTitles () {
      return this.titles
    },
    tableData () {
      return this.initTableData
    },
    treeData () {
      return this.initTreeData
    }
  },
  methods: {
    toggle (id) {
      const {obj: target} = this.findTreeEl(id)
      const {idx} = this.findTableEl(id)
      const expanded = target.expand
      let children = []
      if (expanded) {
        this.removeTableData(id, () => (target.expand = !target.expand))
      } else {
        this.treeData.filter(el => el.pId === id).forEach(el => children.push(el.fullId))
        this.insertTableData(children, idx, () => {
          target.expand = !target.expand
          // 修复多层级嵌套时的展开状态
          this.$forceUpdate()
          children.forEach(el => {
            const child = this.treeData.find(item => item.fullId === el)
            if (child.expand) {
              child.expand = false
              this.toggle(child.deptId)
            }
          })
        })
      }
    },
    fmtTreeData (data) {
      if (!data.length) return []
      const nest = (items, deptId = 0) =>
        items
          .filter(item => item.pId === deptId)
          .map(item => ({ ...item, children: nest(items, item.deptId) }))

      return nest(this.treeData)
    },
    insertTableData (ids, idx, cb) {
      const before = this.tableData.slice(0, idx + 1)
      const after = this.tableData.slice(idx + 1, Infinity)
      const current = before.concat(mock[ids]).concat(after)
      this.$emit('update:initTableData', current)
      // 多层级，异步插入后执行
      this.$nextTick(cb)
    },
    removeTableData (id, cb) {
      const current = this.tableData.filter(el => !el.fullId.includes(id) || (el.deptId === id))
      this.$emit('update:initTableData', current)
      cb()
    },
    classPicker (attr, data) {
      const inCase = /S|A|B|C|D|result/
      if (!inCase.test(attr)) return
      if (data[attr] === '未通过') return { reject: true }
      const { mark, id } = data
      if (!mark[attr]) return
      const {obj} = this.findTreeEl(id)
      if (!obj) return
      const highlight = obj.highlight
      if (mark[attr] && highlight) return { strong: true }
      if (mark[attr] && !highlight) return { light: true }
    },
    onSelect (id) {
      const {obj} = this.findTableEl(id)
      if (!obj) return
      this.treeData.forEach(el => (el.selected = el.deptId === id))
      this.$emit('onSelect', obj)
    },
    through (data) {
      return Object.assign({}, data, this.findTreeEl(data.deptId).obj)
    },
    updateCurrentDataToTableData (id, data) {
      const {idx} = this.findTableEl(id)
      const before = !idx ? [] : this.tableData.slice(0, idx)
      const after = this.tableData.slice(idx + 1, Infinity)
      const newData = before.concat(data).concat(after)
      this.$emit('update:initTableData', newData)
    },
    updateCurrentDataToDeptData (id, deptObj, type) {
      const params = {
        type: type
      }

      this.$axios.get(
        this.$api.kpiListDeptInfo, { params }
      ).then(({ data: { data } }) => {
        const target = data.find(el => el.deptId === id)
        const {idx} = this.findTreeEl(id)
        const before = !idx ? [] : this.treeData.slice(0, idx)
        const after = idx === this.treeData.length ? [] : this.treeData.slice(idx + 1, Infinity)
        const newData = before.concat([target]).concat(after)
        newData.forEach(el => (el.expand = this.findTreeEl(el.deptId).obj.expand))
        this.$emit('update:initTreeData', newData)
      })
    },
    findEl (arr, id) {
      for (let el of arr.entries()) {
        if (el[1].deptId === id) {
          return { idx: el[0], obj: el[1]}
        }
      }
      return {idx: null, obj: null}
    },
    findTableEl (id) {
      return this.findEl(this.tableData, id)
    },
    findTreeEl (id) {
      return this.findEl(this.treeData, id)
    }
  },
  watch: {
    currentData ({ type, data }) {
      if (!data) return
      this.updateCurrentDataToDeptData(data.deptId, data, type)
      this.updateCurrentDataToTableData(data.deptId, data)
    },
    updateTreeDataAfterEdit (data) {
      if (!data.length) return
      const oldData = this.treeData
      const newData = data.map((el, idx) => ({
        ...el,
        expand: oldData[idx].expand,
        selected: oldData[idx].selected
      }))
      this.$emit('update:initTreeData', newData)
      this.$emit('onDataUpdated')
    }
  }
}
</script>

<style lang="less" scoped>
.tooltips {
  bottom: 0;
}
.treeTable {
  position: relative;
  display: flex;
  text-align: center;
}

.tree {
  position: absolute;
  width: 200px;
  height: 100%;
  min-width: 200px;
  padding-right: 10px;
  box-shadow: inset -15px 0px 10px -15px rgba(100, 100, 100, 0.4);
}

.tree-body {
  text-align: left;
  width: 200px;
  overflow-x: scroll;
}

.action {
  width: 150px;
  min-width: 130px;
  button {
    margin-right: 8px;
  }
}

.main {
  flex: 1;
  min-width: 650px;
}

table {
  border-collapse: collapse;
}

th {
  font-weight: 400;
  background-color: #f2f2f2;
}

tr:nth-child(odd),
.trow:nth-child(even) {
  background-color: #f2f2f2;
}

.thead {
  display: flex;
  background-color: #f2f2f2;
  justify-content: space-around;
  border: 1px solid #eee;
  position: relative;
  left: -1px;
}

.trow {
  display: flex;
  justify-content: space-around;
}

.action.tcol {
  height: 22px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  margin-top: -1px;
  margin-left: -2px;
}

.tname,
.tcol {
  padding: 1rem 0;
  height: 100%;
}

th,
td {
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #eee;
}

th:nth-child(1),
td:nth-child(1) {
  text-indent: 220px;
  width: 20%;
}

th:nth-child(n + 2):nth-child(-n + 9),
td:nth-child(n + 2):nth-child(-n + 9) {
  width: 5%;
}

th:nth-child(n + 10),
td:nth-child(n + 10) {
  width: 15%;
}

.tcol {
  &.reject {
    color: #f85514;
  }
  &.strong {
    background: #f85514;
  }
  &.light {
    background: #fcb294;
  }
} 
</style>
