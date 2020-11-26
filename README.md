# ele-list-page

超级列表页 --- 一个基于element-ui的vue插件

> 样式

[![演示图片](http://sit-hxjf.hongxinshop.com/image/group1/M00/06/37/CvaAll-7T22ATmA7AAFfgfxRLJ0066.png "演示图片")](https://github.com/tiandaoyi/ele-list-page "演示图片")

> 功能

1. 搜索表单：输入框、单选框、日期选择器、下拉框（支持远程搜索和下拉懒加载）。支持配置每行显示个数及“更多”搜索。
2. 按钮组：批量删除、生效、失效、新增、搜索、自定义列（显示、隐藏、排序）等功能。可分为左右布局或上下布局，支持自定义颜色，方法，按钮名称。
3. 列表：支持单元格点击跳转、行选择、操作列（动态html及方法）、树形表格、可编辑表格、支持自定义表头颜色、配置列宽、动态高度（可配置页面一屏显示）、序号列、固定列及表头、合计行等。
4. 分页：可配置多个每页显示最大条数、自动固定到页面底部。

> 适用场景

列表页面直接通过配置js对象及方法就可以使用，不涉及vuex，但是部分功能需要后端支持（如分页）。

> 安装
```
npm i ele-list-page
```

> 使用
```
// 组件引入
import EleListPage from 'ele-list-page'
Vue.use(EleListPage)

// 组件样式引入
import 'ele-list-page/src/lib/index.css'

// 组件是基于element-ui的，所以也需要引入element-ui
import ElementUI from 'element-ui';
Vue.use(ElementUI)
```

> list.vue template部分
```
<EleListPage
  :searchForm="searchForm" <!-- 搜索条件绑定到页面的对象 -->
  :tableCommonOptions="tableCommonOptions" <!-- 表格配置属性 -->
  :listLoading="listLoading" <!-- 列表页loading -->
  :loadTableData="loadTableData" <!-- 点击搜索时接口请求function -->

  :tableList="tableList" <!-- 表格数据 -->
  :onSaveCustom="onSaveCustom" <!-- 自定义列保存function: 非自定义可不传 -->

></EleListPage>
```

> list.vue js部分
```
data() {
  const tableCommonOptions = {
    searchOptions: {
      isAllHidden: false,// 为true时隐藏搜索条件
      // 超过8个 自动隐藏，右侧此时出现更多，单击下拉
      searchData: [
        {
          name: '编号',
          searchField: 'code',
        },
        {
          name: '状态',
          searchField: 'status',
          searchType: 'select',
          selectList: [{text: 1, value: 1}]
        }
      ],
    },
    filterOptions: {
      // 为true时隐藏中间按钮
      isAllHidden: false,
      // left为左侧， right为右侧按钮
      left: [
        {
          filterType: 'add',
          disabled: false,
          type: 'info'
        },
        {
          filterType: 'invalid',
          disabled: false
        },
        {
          filterType: 'valid',
          disabled: false
        },
        {
          filterType: 'export',
          disabled: true
        },
        {
          filterType: 'customColumns'
        }
      ],
      right: [
        {
          filterType: 'search', // 搜索按钮
          fn: () => {
            this.loadTableData();
          }
        },
        {
          filterType: 'clear', // 搜索按钮
          fn: () => {
            this.searchForm = {};
            // 看是否需要调用搜索
            this.loadTableData();
          }
        },
      ]
    },
    tableOptions: {
      underlineHandles: {
        code: ({row}) => {
          const params = {
            code: row.code || null 
          }
          alert('gotoDetail');
        }
      },
      columnsData: {
        showColumns: [],
        hiddenColumns: []
      },
      headerHandleOperation: {
        prop: 'operation',
        label: '操作',
        operationOptions: [{
          name: '修改',
          fn: ({row: {code}}) => {
            const params = {
              code
            }
            alert('gotoDetail');
          },
          disabled: false
        }, {
          name: '删除',
          type: 'danger',
          fn() {
            console.log('删除')
          },
          disabled: true,
        }]
      }
    },
    pagination: {
      total: 0,
      pageNo: 1,
      pageSize: 20
    }
  };
  return {
    tableCommonOptions,
    listLoading: false,
    searchForm: {},
    tableList: [],
  }
},
methods: {
  onSaveCustom(selectedNumber, closeDialog) {
    // 保存自定义列
    const request = {
      userModuleColumnsReqs: (selectedNumber || []).map((item, index) => {
        return {
          columnId: item,
          seq: index + 1
        }
      })
    };
    // 此处需要自己处理@TODO
    this.$store.dispatch('page/saveCustomColumns', request).then(() => {
      this.loadCustomColumnsList();
      // 更新列表数据
      this.loadTableData();
      closeDialog && closeDialog();
    })
    // 保存自定义列
  },
  loadSearchList() {
    // 初始化搜索项
    const searchData = this.tableCommonOptions.searchOptions.searchData;
    const newSearchData = [...searchData];
    // 搜索项下拉框列表填充
  },
  loadTableData() {
    const searchForm = this.searchForm;
    const request = {
      ...searchForm,
      startPage: this.tableCommonOptions.pagination.pageNo,
      pageSize: this.tableCommonOptions.pagination.pageSize
    }

    // 表格数据更新
    //this.listLoading = true
    //getTableList(request).then(({data: {data: tableList, total}}) => {
    //  this.tableList = tableList || [],
    //  this.tableCommonOptions.pagination = {
    //    ...this.tableCommonOptions.pagination,
    //    total
    //  }
    //}).finally(() => {
    //  this.listLoading = false
    //})

  },
  loadCustomColumnsList() {
    // 获取自定义列列表
    //getCustomizedColumnsList().then(({data}) => {
    //  // 接口的数据结构showColumns = [{showName, showField, id, refField}]
    //  // table表头所需
    //  const columnsMatchParams = {
    //    prop: 'showField',
    //    label: 'showName'
    //  };
    //  // 自定义列所需
    //  const customColumnsMatchParams = {
    //    key: 'id',
    //    label: 'showName'
    //  }
    //  const tableCommonOptions = this.tableCommonOptions;

    //  tableCommonOptions.tableOptions = {
    //    ...tableCommonOptions.tableOptions,
    //      columnsData: data,
    //      columnsMatchParams,
    //      customColumnsMatchParams
    //  }
    //})
  },
},
mounted() {
  // // 初始化搜索项
  this.loadSearchList();
  // // 加载自定义列数据
  this.loadCustomColumnsList();
  // 加载表格数据
  this.loadTableData();
}

```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
