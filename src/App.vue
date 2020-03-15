<template>
  <treeTable
    :titles="titles"
    :initTableData.sync="initTableData"
    :initTreeData.sync="initTreeData"
    :currentData="currentData"
    :updateTreeDataAfterEdit="updateTreeDataAfterEdit"
    :toggle="toggle"
    @onSelect="onSelect"
    @onDataUpdated="onDataUpdated">
    <template slot-scope="{row}" slot="action">
      <Button type="primary" @click="confirm(row)">确认</Button>
      <Button type="primary" @click="update(row)">更新</Button>
    </template>
  </treeTable>
</template>

<script>
import treeTable from './components/treeTable'
import mock from './mock/api'
import {titles} from './constant/data'

export default {
  name: 'App',
  components: {
    treeTable
  },
  data () {
    return {
      initTableData: [],
      initTreeData: [],
      currentData: {},
      updateTreeDataAfterEdit: [],
      titles: titles
    }
  },
  mounted () {
    this.initTree()
    this.initTable()
  },
  methods: {
    initTable () {
      this.initTableData = mock.initTable
    },
    initTree () {
      this.initTreeData = mock.initTree
    },
    onSelect (data) {
      console.log(data, '-----onSelect-----')
    },
    onDataUpdated () {
      console.log('-----onDataUpdated-----')
    },
    confirm (row) {
      console.log(row, '------confirm----')
    },
    toggle (id) {
      console.log(id, '-----id-----')
    },
    update ({id}) {
      console.log(id, '------update----')
    }
  }
}
</script>

