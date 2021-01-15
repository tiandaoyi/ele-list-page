<template>
  <div>
    <!--自定义列-->
    <el-row class="ele-list-middle">
      <template v-if="filterOptions.direction === 'col' || filterOptions.direction === undefined">
        <div style="float:left">
          <el-button  v-for="(item, index) of buttonList.leftBtn" :key='index' @click="item.fn(multipleSelection)" :name='item.name'
            size="small"
            v-show="!item.isHidden"
            :type="item.type" :disabled='item.disabled'>
            {{item.name}}
          </el-button>
        </div>
        <div style="float:right" :class="isMoveTop ? 'move-top': ''">
          <el-button v-for="(item, index) of buttonList.rightBtn" :key='index' @click="item.fn(multipleSelection)" :name='item.name' size="small"
          v-show="!item.isHidden"
          :type="item.type" :disabled='item.disabled'>
            {{item.name}}  
          </el-button>
        </div>
      </template>
      <template v-if="filterOptions.direction === 'row'">
        <div  :class="isMoveTop ? 'right-btn move-top': 'right-btn'">
          <el-button v-for="(item, index) of buttonList.rightBtn" :key='index' @click="item.fn(multipleSelection)" :name='item.name' size="small"
          v-show="!item.isHidden"
          :type="item.type" :disabled='item.disabled'>
            {{item.name}}  
          </el-button>
        </div>
        <div style="float:right;">
          <el-button v-for="(item, index) of buttonList.leftBtn" :key='index' @click="item.fn(multipleSelection)" :name='item.name'
            size="small"
            v-show="!item.isHidden"
            :type="item.type" :disabled='item.disabled'>
            {{item.name}}
          </el-button>
        </div>
        
      </template>
           
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    filterOptions: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Function
    },
    multipleSelection: {
      type: Array
    },
    isMoveTop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    getFilterOptions() {
      const filterOptions = this.filterOptions;
      let leftBtn = [];
      let rightBtn = [];
      const setButtonOptions = {
        add: {
          type: '',
          name: '新增',
          fn: () => this.add(), // 新增
        },
        // 失效
        invalid: {
          type: '',
          name: '失效',
          fn: () => this.invalid()
        },
        // 生效
        valid: {
          type: '',
          name: '生效',
          fn: () => this.valid()
        },
        //  导出
        export: {
          type: '',
          name: '导出',
          fn: () => this.export()
        },
        search: {
          type: 'primary',
          name: '搜索',
          fn: () => this.search()
        },
        clear: {
          type: '',
          name: '清空',
          fn: () => this.clear()
        },
        customColumns: {
          type: 'primary',
          name: '自定义列设置',
          fn: () => this.customColumns()
        }
      }

      const transferButtonList = (list) => {
        const newObjectList = [];
        list.forEach((item)=> {
          if (item.filterType) {
            const multipleSelection = this.multipleSelection;
            // 失效和生效按钮需要判断multipleSelection
            const disabled = (item.filterType === 'valid' || item.filterType === 'invalid' || item.isNoCheck) ? (item.disabled || !(multipleSelection && multipleSelection.length)) : item.disabled ;
            newObjectList.push({
              name: item.name || setButtonOptions[item.filterType].name,
              filterType: item.filterType,
              type: setButtonOptions[item.filterType].type || item.type,
              isHidden: item.isHidden || false,
              fn: item.fn || function () {
                setButtonOptions[item.filterType] && setButtonOptions[item.filterType].fn && setButtonOptions[item.filterType].fn()
              },
              disabled
            });
          } else {
            newObjectList.push({
              name: item.name,
              type: item.type,
              isHidden: item.isHidden || false,
              fn: item.fn,
              disabled: item.disabled
            });
          }
        });
        return newObjectList;
      };

      if (filterOptions) {
        if (filterOptions.left && filterOptions.left.length) {
          leftBtn = transferButtonList(filterOptions.left);
        }
        if (filterOptions.right && filterOptions.right.length) {
          rightBtn = transferButtonList(filterOptions.right);
        }
      }
      return {
        leftBtn,
        rightBtn
      }
    },

    //去详情页面新增
    add() {
      console.log('新增')
    },
    // 失效
    invalid() {
      console.log('失效')
    },
    // 失效
    valid() {
      console.log('生效')
    },
    export() {
      console.log('导出')
    },
    customColumns() {
      console.log('自定义列设置')
      this.isVisible(true);
    },
    search() {
      console.log('搜索');
    },
    clear() {
    },

  },
  computed: {
    buttonList() {
      return this.getFilterOptions();
    },
  }

}

</script>
