/**
 * 叶子提取
 */
/*  function leafExtract(arr, prop = "childs") {
  let nArr = []
  arr.forEach(ele => {
    if (ele.isLeaf) {
      nArr.push(ele)
    } else {
      nArr = nArr.concat(leafExtract(ele[prop]))
    }
  })
  return nArr
} */
import { leafExtract } from './utils'

export default {
  render() {
    return (
      <table class="vt-header vt-header-table">
        <colgroup>
          {
            this.colLeafs.map(col => (<col style={`width:${col.width || this.colWidth + 'px'}`}></col>))
          }
        </colgroup>
        {
          this.levelsArr.map((cols, i) => (<tr>
            {
              cols.map(col => (<th colspan={col.leafNum}
                rowspan={col.isLeaf && col.rowspan}>{col.label}</th>))
            }
          </tr>))
        }
      </table>
    )
  },
  props: {
    cols: {},
    datas: {},
    colWidth: {},
    levelsArr: {},
  },
  data() {
    return {
    }
  },
  computed: {
    colLeafs() {
      return leafExtract(this.cols)
    }
  },
  watch: {
    /* datas: {
      immediate: true,
      handler() {
      }
    } */
  }
}