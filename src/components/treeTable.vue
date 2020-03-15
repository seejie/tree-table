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
            <span style="position: relative;">{{tableData[idx - 1] ? tableData[idx - 1][obj.key] : '-'}}
              <reminder class="tooltips"
                        v-if="useTooltips(tableData[idx - 1].id, obj.key, tableData[idx - 1].reveal)">{{getSuggestionFromTreeData(tableData[idx - 1].id, obj.key)}}</reminder>
            </span>
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
import reminder from './reminder'
import mock from '../mock/api'

export default {
  name: 'treeTable',
  components: { tree, reminder },
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
      return this.fmtTableData(this.initTableData)
    },
    treeData () {
      console.log(this.initTreeData, '----------')
      return this.initTreeData.map(el => ({
        id: el.deptId,
        children: [],
        expand: el.expand || false,
        deptName: el.deptName,
        fullId: el.fullId,
        pId: el.pId,
        highlight: el.highlight,
        suggestion: el.suggestion,
        selected: el.selected || false
      }))
    }
  },
  methods: {
    toggle (id) {
      // this.$emit('toggle', id)
      const indexOfTree = this.treeData.findIndex(el => el.id === id)
      const indexOfTable = this.tableData.findIndex(el => el.id === id)
      const target = this.treeData[indexOfTree]
      const expanded = target.expand
      let children = []
      if (expanded) {
        this.removeTableData(id, () => (target.expand = !target.expand))
      } else {
        this.treeData.filter(el => el.pId === id).forEach(el => children.push(el.fullId))
        this.insertTableData(children, indexOfTable, () => {
          target.expand = !target.expand
          // 修复多层级嵌套时的展开状态
          this.$forceUpdate()
          children.forEach(el => {
            const child = this.treeData.find(item => item.fullId === el)
            if (child.expand) {
              child.expand = false
              this.toggle(child.id)
            }
          })
        })
      }
    },
    fmtTreeData (data) {
      if (!data.length) return []
      const nest = (items, id = 0) =>
        items
          .filter(item => item.pId === id)
          .map(item => ({ ...item, children: nest(items, item.id) }))

      return nest(this.treeData)
    },
    fmtTableData (data) {
      return data.map(el => ({
        id: el.deptId,
        count: el.count,
        reveal: el.reveal,
        S: el.S,
        A: el.A,
        B: el.B,
        C: el.C,
        D: el.D,
        uncomplete: el.uncomplete,
        result: el.result,
        status: el.formStatus,
        leader: el.leader,
        mark: {
          S: true,
          A: false,
          B: false,
          C: true,
          D: false
        },
        tableData: el
      }))
    },
    insertTableData (ids, idx, cb) {
      const before = this.initTableData.slice(0, idx + 1)
      const after = this.initTableData.slice(idx + 1, Infinity)
      const current = before.concat(mock[ids]).concat(after)
      this.$emit('update:initTableData', current)
      // 多层级，异步插入后执行
      this.$nextTick(cb)
    },
    removeTableData (id, cb) {
      const current = this.initTableData.filter(el => !el.fullId.includes(id) || (el.deptId === id))
      this.$emit('update:initTableData', current)
      cb()
    },
    classPicker (attr, data) {
      const inCase = /S|A|B|C|D|result/
      if (!inCase.test(attr)) return
      if (data[attr] === '未通过') return { reject: true }
      const { mark, id } = data
      if (!mark[attr]) return
      const target = this.treeData.find(el => el.id === id)
      if (!target) return
      const highlight = target.highlight
      if (mark[attr] && highlight) return { strong: true }
      if (mark[attr] && !highlight) return { light: true }
    },
    useTooltips (id, key, type) {
      const inCase = /result|status/
      if (!inCase.test(key)) return false
      if (key === 'status' && type) return true
      const { suggestion } = this.treeData.find(el => el.id === id)
      return suggestion
    },
    getSuggestionFromTreeData (id, key) {
      const { suggestion } = this.treeData.find(el => el.id === id)
      if (key === 'result') return suggestion
      const { status, leader } = this.tableData.find(el => el.id === id)
      return status.replace('自动', leader + '无需').replace('待', '待' + leader).replace('已', leader + '已')
    },
    onSelect (id) {
      const target = this.tableData.find(el => el.id === id)
      this.treeData.forEach(el => (el.selected = el.id === id))

      if (!target) return
      // delete target.mark
      this.$emit('onSelect', target)
    },
    through (data) {
      const current = {
        ...data,
        deptData: this.initTreeData.find(el => el.deptId === data.id)
      }
      delete current.mark
      return current
    },
    updateCurrentDataToTableData (id, data) {
      const idx = this.initTableData.findIndex(el => el.deptId === id)
      const before = !idx ? [] : this.initTableData.slice(0, idx)
      const after = this.initTableData.slice(idx + 1, Infinity)
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
        const idx = this.initTreeData.findIndex(el => el.deptId === id)
        const before = !idx ? [] : this.initTreeData.slice(0, idx)
        const after = idx === this.initTreeData.length ? [] : this.initTreeData.slice(idx + 1, Infinity)
        const newData = before.concat([target]).concat(after)
        newData.forEach(el => (el.expand = this.treeData.find(item => item.id === el.deptId).expand))
        this.$emit('update:initTreeData', newData)
      })
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
        expand: oldData[idx].expand || false,
        selected: oldData[idx].selected || false
      }))
      this.$emit('update:initTreeData', newData)
      this.$emit('afterTreeDataUpdated')
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
