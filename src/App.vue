<template>
  <treeTable
    :titles="titles"
    :initTableData.sync="initTableData"
    :initTreeData.sync="initTreeData"
    :currentData="currentData"
    :updateTreeDataAfterEdit="updateTreeDataAfterEdit"
    :toggle="toggle"
    @onSelect="onSelect"
    @afterTreeDataUpdated="afterTreeDataUpdated">
    <template slot-scope="{row}" slot="action">
      <Button type="primary" @click="confirm(row)">确认</Button>
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
    afterTreeDataUpdated () {
      console.log(1111, '-----afterTreeDataUpdated-----')
    },
    confirm (row) {
      console.log(row, '------confirm----')
    },
    toggle (id) {
      console.log(id, '-----id-----')
    }
  }
}
</script>

