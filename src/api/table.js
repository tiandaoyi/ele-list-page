function getCustomizedColumnsList () {
  return new Promise((resolve, reject) => resolve({
    "code": 200,
    "msg": "success",
    "data": {
      "showColumns": [{
        "id": 1,
        "refField": "code",
        "showField": "code",
        "showName": "编号",
        "width": 0
      }, {
        "id": 8,
        "refField": "categoryName",
        "showField": "categoryName",
        "showName": "名称列",
        "width": 0
      }, {
        "id": 10,
        "refField": "brandName",
        "showField": "brandName",
        "showName": "名称列2",
        "width": 0
      }, {
        "id": 5,
        "refField": "spec",
        "showField": "spec",
        "showName": "型号列3",
        "width": 0
      }, {
        "id": 4,
        "refField": "materials",
        "showField": "materials",
        "showName": "名称列4",
        "width": 0
      }, {
        "id": 3,
        "refField": "modelCode",
        "showField": "modelCode",
        "showName": "名称5",
        "width": 0
      }, {
        "id": 22,
        "refField": "accType",
        "showField": "accTypeDesc",
        "showName": "名称列6",
        "width": 0
      }],
      "hiddenColumns": [{
        "id": 20,
        "refField": "custUomRate",
        "showField": "custUomRate",
        "showName": "隐藏的列1",
        "width": 0
      }, {
        "id": 16,
        "refField": "specUom",
        "showField": "specUomDesc",
        "showName": "隐藏的列2",
        "width": 0
      }, {
        "id": 15,
        "refField": "custUom",
        "showField": "custUomDesc",
        "showName": "隐藏的列3",
        "width": 0
      }, {
        "id": 14,
        "refField": "invUom",
        "showField": "invUomDesc",
        "showName": "隐藏的列4",
        "width": 0
      }]
    },
    "enumVal": {},
    "success": true
  }))

}

function getTableList () {
  return new Promise((resolve, reject) => resolve({
    "code": 200,
    "msg": "success",
    "data": {
      "total": 10086,
      "data": [{
        "code": "1234704",
        "name": "123312",
        "categoryCode": "6007",
        "categoryName": "哈哈22",
        "accTypeDesc": "超长字段显示tooltip-ttttttttt",
        "status": 1,
        "statusDesc": "已使用",
        "erpName": "123123",
      }, {
        "code": "1234803",
        "name": "uu233232",
        "businessUnitNo": "04",
        "categoryCode": "6008",
        "categoryName": "哈哈1",
        "spec": "uu",
        "accTypeDesc": "特殊字段xx",
      }, {
        "code": "1234802",
        "name": "yy1221",
        "businessUnitNo": "04",
        "categoryCode": "6008",
        "categoryName": "哈哈yym2",
        "spec": "yy",
        "accTypeDesc": "特殊字段xx",
      }]
    },
    "enumVal": {},
    "success": true
  }))
}

function getSelectList() {
  return new Promise((resolve, reject) => resolve({
    "code": 200,
    "msg": "success",
    "data": {
      "status": [{
        "code": -1,
        "description": "未启用"
      }, {
        "code": 0,
        "description": "已启用"
      }, {
        "code": 1,
        "description": "已使用"
      }, {
        "code": 2,
        "description": "删除"
      }],
      "assetClasses": []
    },
    "enumVal": {},
    "success": true
  }))
}

export {
  getCustomizedColumnsList,
  getTableList,
  getSelectList
}