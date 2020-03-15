const initTable = [{
  id: 1392,
  deptId: "1000000008",
  fullId: "/1000000001/1000000008",
  deptName: "人力资源中心",
  count: 1,
  S: 1,
  A: 1,
  B: 1,
  C: 1,
  D: 1,
  uncomplete: 1,
  result: "通过",
  mark: {
    S: true,
    A: false,
    B: false,
    C: true,
    D: false
  }
}, {
  id: 1394,
  deptId: "1000000013",
  fullId: "/1000000001/1000000013",
  deptName: "销售中心",
  count: 2,
  S: 2,
  A: 2,
  B: 2,
  C: 2,
  D: 2,
  uncomplete: 2,
  result: "通过",
  mark: {
    S: false,
    A: false,
    B: false,
    C: true,
    D: false
  }
}]

const initTree = [{
  id: 1392,
  deptId: "1000000008",
  deptName: "人力资源中心",
  pId: 0,
  fullId: "/1000000001/1000000008",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}, {
  id: 1394,
  deptId: "1000000013",
  deptName: "销售中心",
  pId: 0,
  fullId: "/1000000001/1000000013",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}, {
  id: 1390,
  deptId: "1000000452",
  deptName: "区域人力资源-成都",
  pId: "1000000643",
  fullId: "/1000000001/1000000008/1000000643/1000000452",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}, {
  id: 1393,
  deptId: "1000000643",
  deptName: "前台业务部",
  pId: "1000000008",
  fullId: "/1000000001/1000000008/1000000643",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}, {
  id: 1395,
  deptId: "1000000741",
  deptName: "销售培训部",
  pId: "1000000013",
  fullId: "/1000000001/1000000013/1000000741",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}, {
  id: 1391,
  deptId: "1000001113",
  deptName: "销售深圳新兵营",
  pId: "1000000741",
  fullId: "/1000000001/1000000013/1000000741/1000001113",
  highlight: null,
  expand: false,
  selected: false,
  children: []
}]

const data1 = [{
  id: 1393,
  deptId: "1000000643",
  fullId: "/1000000001/1000000008/1000000643",
  deptName: "前台业务部",
  count: 3,
  S: 3,
  A: 3,
  B: 3,
  C: 3,
  D: 3,
  uncomplete: 3,
  result: "通过",
  mark: {
    S: true,
    A: false,
    B: false,
    C: false,
    D: false
  }
}]

const data2 = [{
  id: 1390,
  deptId: "1000000452",
  fullId: "/1000000001/1000000008/1000000643/1000000452",
  deptName: "区域人力资源-成都",
  count: 4,
  S: 4,
  A: 4,
  B: 4,
  C: 4,
  D: 4,
  uncomplete: 4,
  result: "通过",
  mark: {
    S: true,
    A: true,
    B: false,
    C: true,
    D: false
  }
}]

const data3 = [{
  id: 1395,
  deptId: "1000000741",
  fullId: "/1000000001/1000000013/1000000741",
  deptName: "销售培训部",
  count: 5,
  S: 5,
  A: 5,
  B: 5,
  C: 5,
  D: 5,
  uncomplete: 5,
  result: "通过",
  mark: {
    S: false,
    A: false,
    B: true,
    C: false,
    D: false
  }
}]

const data4 = [{
  id: 1391,
  deptId: "1000001113",
  fullId: "/1000000001/1000000013/1000000741/1000001113",
  deptName: "销售深圳新兵营",
  count: 0,
  S: 0,
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  uncomplete: 0,
  result: "通过",
  mark: {
    S: true,
    A: false,
    B: false,
    C: true,
    D: false
  }
}]

export default {
  initTable,
  initTree,
  '/1000000001/1000000008/1000000643': data1,
  '/1000000001/1000000008/1000000643/1000000452': data2,
  '/1000000001/1000000013/1000000741': data3,
  '/1000000001/1000000013/1000000741/1000001113': data4
}