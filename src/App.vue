<template>
  <div id="app" style="height: 300px">
    <viewTable :cols="cols" :rows="datas" :options="tableOptions"></viewTable>
    <button @click="handleClickChangeColsDatas">变更列及数据</button>
    <virtualScrollTableDynamic
      :cols="colsB"
      :rows="datasB"
    ></virtualScrollTableDynamic>
  </div>
</template>

<script>
import viewTable from "./components/virtualScrollTable/viewTable.vue";
import virtualScrollTableDynamic from "./components/virtualScrollTable/virtualScrollTableDynamic.vue";
import HelloWorld from "./components/HelloWorld.vue";
import _ from "lodash";

const colNum = 20;
let cols = _.times(colNum, (time) => ({
  label: `列名${time}`,
  prop: `prop${time}`,
  formatter: (cellValue) => cellValue + "suffix",
  width: "150px",
}));
// 在1号位插入一个多级列
cols.splice(1, 0, {
  label: "多级1",
  childs: [
    {
      label: `c1`,
      prop: `c1`,
    },
    {
      label: `c2`,
      prop: `c2`,
    },
  ],
});
let datas = _.times(10000, (time) => {
  let obj = {};
  _.times(colNum, (time) => (obj["prop" + time] = `属性${time}值`));
  obj.c1 = "c1值";
  obj.c2 = "c2值";
  obj.isExtend = true;
  obj.childs = [{ c1: "c11" }, { c1: "c12" }];
  return obj;
});
const datasB = _.times(10000, (time) => {
  let obj = {
    0: time,
    1: 1,
    // 2: (time % 2) === 0 ? '1' : `1`,
    2: time % 2 === 0 ? "1" : `1\n2`,
  };

  return obj;
});

export default {
  name: "App",
  data() {
    // 高度不统一的数据
    const colsB = [
      {
        label: "列0",
        prop: "0",
      },
      {
        label: "列1",
        prop: "1",
      },
      {
        label: "列2",
        prop: "2",
      },
      {
        label: "3号列 自定义",
        prop: "3",
        cellRender: (row)=> {
          return <button onClick={() => {
            console.log('12')
            console.log(this)
            this.handleSee(row);
          }}>查看</button>;
        },
      },
    ];

    return {
      cols,
      datas,
      tableOptions: {
        leftFixedNum: 1,
      },
      colsB,
      datasB,
    };
  },
  components: {
    viewTable,
    virtualScrollTableDynamic,
  },
  created() {
    // 操作列
    this.cols.push({
      label: "操作",
      cellRender: (row) => {
        return (
          <div>
            <button
              onClick={() => {
                this.handleClick(row);
              }}
            >
              查看jsx
            </button>
            <HelloWorld></HelloWorld>
          </div>
        );
      },
      formatter: () => {
        return `
      <div>
        <button>查看</button>
      </div>
    `;
      },
    });
  },
  methods: {
    // 查看某一条目
    handleSee(row) {
      console.log("查看某一条目", row);
    },
    handleClick(e) {
      console.log("点击事件", e);
    },
    handleClickChangeColsDatas() {
      this.cols = _.times(30, (time) => ({
        label: `列名${time}`,
        prop: `prop${time}`,
      }));
      this.datas = this.genDatas(this.cols);
    },
    /**
     * 功能性函数
     */
    genDatas(cols) {
      const leafArr = this.addActionCols(cols, 1)[1];
      return _.times(10000, (time) => {
        let obj = {};
        _.forEach(leafArr, (col) => (obj[col.prop] = `属性${col.prop}值`));
        return obj;
      });
    },
    addActionCols(cols, level) {
      let colsLeafNum = 0;
      let leafArr = [];
      cols.forEach((col) => {
        col.level = level;
        if (col.childs && col.childs.length) {
          col.isLeaf = false;
          const results = addActionCols(col.childs, level + 1);
          col.leafNum = results[0];
          leafArr = leafArr.concat(results[1]);
          colsLeafNum += col.leafNum;
        } else {
          col.isLeaf = true;
          col.leafNum = 1;
          colsLeafNum++;
          leafArr.push(col);
        }
      });
      return [colsLeafNum, leafArr];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
